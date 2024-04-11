from flask import Blueprint, jsonify, request, current_app
import itertools
from typing import List, Tuple
import json
import ast
import os
from collections import defaultdict, OrderedDict
from app.es import count_documents_containing_phrases, get_indices, es_init
from psycopg_pool import ConnectionPool
import os.path
from concurrent.futures import ThreadPoolExecutor, wait
from functools import lru_cache


# Takes a list of strings and filters out any empty strings
def clean_str_list(input: List[str]) -> List[str]:
    # get rid of empty spaces ' ' => ''
    stripped = [s.strip() for s in input]
    # filter out empty elements eg. ''
    return list(filter(None, stripped))


def read_jsonl(in_f):
    with open(in_f, 'r') as f:
        data = f.readlines()
    data = [json.loads(x) for x in data]
    return data


def read_json(in_f):
    with open(in_f, 'r') as f:
        data = json.load(f)
    return data

def read_txt(in_f):
    with open(in_f, 'r') as f:
        data = f.readlines()
        data = [x.strip() for x in data]
    return data

def read_topk(in_f):
    data = read_jsonl(in_f)

    data = {x['string']: x['count'] for x in data}
    return data


def read_top_domains(in_f):
    data = read_jsonl(in_f)

    data = {x['url']: x['count'] for x in data}

    # order data by count
    data = {k: v for k, v in sorted(data.items(), key=lambda item: item[1], reverse=True)}

    # add rank, and percentage
    domains_dic = {}
    total_tokens = sum(data.values())
    for rank, (k, v) in enumerate(data.items()):
        domains_dic[k] = {
            'domain': k,
            'tokens': v,
            'percentage': v / total_tokens,
            # + 1 to start indexing at 1
            'rank': rank + 1,
        }

    return domains_dic


def create_api() -> Blueprint:
    """
    Creates an instance of your API. If you'd like to toggle behavior based on
    command line flags or other inputs, add them as arguments to this function.
    """
    api = Blueprint('api', __name__)

    dataset_names = ['OpenWebText', 'C4', 'mC4-en', 'OSCAR', 'The Pile', 'RedPajama', 'S2ORC', 'peS2o', 'LAION-2B-en', 'The Stack',
                     'Dolma'
                     ]

    dataset_meta = {'OpenWebText': {'meta': ['basic', 'indexed', 'overlap'], 'order': 1},
                    'C4': {'meta': ['basic', 'indexed', 'url', 'overlap'], 'order': 2},
                    'mC4-en': {'meta': ['basic', 'url', 'overlap'], 'order': 3},
                    'OSCAR': {'meta': ['basic', 'indexed', 'url', 'overlap'], 'order': 4},
                    'The Pile': {'meta': ['basic', 'indexed', 'overlap'], 'order': 5},
                    'RedPajama': {'meta': ['basic', 'url', 'overlap'], 'order': 6},
                    'S2ORC': {'meta': ['basic', 'overlap'], 'order': 7},
                    'peS2o': {'meta': ['basic', 'overlap'], 'order': 8},
                    'LAION-2B-en': {'meta': ['basic', 'indexed', 'url', 'overlap'], 'order': 9},
                    'The Stack': {'meta': ['basic', 'overlap'], 'order': 10},
                    'Dolma': {'meta': ['basic', 'indexed', 'url', 'overlap'], 'order': 11},
                    }

    dataset_es_map = {
            'OSCAR': 're_oscar',
            'LAION-2B-en': 're_laion2b-en-*',
            'OpenWebText': 'openwebtext',
            'The Pile': 're_pile',
            'C4': 'c4',
            'Dolma': 'docs_v1.5_2023-11-02',
    }
    dataset_files_map = {

        'OpenWebText': 'openwebtext',
        'C4': 'c4_en',
        'mC4-en': 'mc4',
        'OSCAR': 'oscar',
        'The Pile': 'pile_train',
        'RedPajama': 'redpajama',
        'S2ORC': 's2orc_v0',
        'peS2o': 's2orc_v3',
        'LAION-2B-en': 'laion2B-en',
        'The Stack': 'stack',
        'Dolma': 'dolma-v1_5',
    }

    db_map = {
        'OSCAR': 'oscar',
        'LAION-2B-en': 'laion',
        'C4': 'c4',
        'RedPajama': 'redpajama',
        'mC4-en': 'mc4',
        'Dolma': 'dolma',
    }


    ks = [1, 2, 3, 4, 5, 10, 100]
    data_k_file_dict = defaultdict(dict)
    for d in dataset_names:
        for k in ks:
            if d in dataset_files_map:
                data_k_file_dict[d][k] = read_topk(f'/skiff_files/apps/wimdb/topk/top-{k}_{dataset_files_map[d]}.jsonl')
    print('top-k loaded')

    # Connecting to the DB containing domain information.
    uri = os.getenv("POSTGRES_URL")
    pool = ConnectionPool(uri, min_size=4, max_size=8)


    length_dist = defaultdict(dict)
    for corpus in dataset_files_map.keys():
        lengths = read_json(f'/skiff_files/apps/wimdb/lengths_char_summary/chars_{dataset_files_map[corpus]}.json')
        for size, dist in lengths.items():
            length_dist[corpus][int(size)] = float(dist)

    print(f'lengths loaded')

    stratified_len_dist = {}
    for corpus in dataset_files_map.keys():
        l = list(OrderedDict(sorted(length_dist[corpus].items())).values())

        # These values seems random, but they were selected to minimize the number of points in the plot,
        # while also showing interesting trends, e.g. the spike around 9K characted in The Pile corpus.
        jump_size = 3
        init_all = 100
        len_dist = l[:init_all] + l[init_all:8005:25] + l[8005:10000:jump_size] + l[10000::25]
        x_range = list(range(1, len(l) + 1))
        x_range = x_range[:init_all] + x_range[init_all:8005:25] + x_range[8005:10000:jump_size] + x_range[10000::25]

        # Removing values lower than 1e-8 to reduce number of points to show.
        large_dist, large_x = [], []
        for x, y in zip(x_range, len_dist):
            if y > 1e-7:
                large_dist.append(y)
                large_x.append(x)

        stratified_len_dist[corpus] = list(zip(large_x, large_dist))

    print(f'stratified lengths loaded')
    del length_dist
    del lengths

    overlaps = read_txt('/skiff_files/apps/wimdb/overlaps.txt')
    overlaps = [ast.literal_eval(x) for x in overlaps]
    overlaps = [(sorted(x), y) for (x, y) in overlaps]
    overlaps = {tuple(dict.fromkeys(x)): y for (x, y) in overlaps}

    print('loading ES indices')

    es_default = es_init("/secret/es_config.yml")
    es_dolma = es_init("/secret/es_dolma_config.yml")

    print(f'done loading resources')


    def error(message: str, status: int = 400) -> Tuple[str, int]:
        return jsonify({ 'error': message}), status

    # This route simply tells anything that depends on the API that it's
    # working. If you'd like to redefine this behavior that's ok, just
    # make sure a 200 is returned.
    @api.route('/')
    def index() -> Tuple[str, int]:
        return '', 204

    # Return an array of datasets the user can pick from
    # curl -H "Content-Type: application/json"
    # -X GET http://localhost:8080/api/datasets
    # Returns:
    # [
    #   'OpenWebText': ['basic', 'indexed'],
    #   'C4': ['basic', 'indexed', 'url'],
    #   'mC4-en': ['basic', 'url'],
    #   'OSCAR': ['basic', 'indexed', 'url'],
    #   'The Pile': ['basic', 'indexed'],
    #   'RedPajama': ['basic', 'url'],
    #   'S2ORC': ['basic'],
    #   'peS2o': ['basic'],
    #   'LAION-2B-en': ['basic', 'indexed', 'url'],
    #   'The Stack': ['basic']
    # }
    @api.route('/api/datasets', methods=['GET'])
    def get_datasets():
        return jsonify(dataset_meta)

    # Return an array of datasets the user can pick from
    # curl -d '{"corpora":["C4", "LAION-2B-en"]}' -H "Content-Type: application/json"
    # # -X POST http://localhost:8080/api/get_overlaps
    # Returns:
    # [
    #   {
    #     "count": 364868892,
    #     "subset": [ "C4" ]
    #   },
    #   {
    #     "count": 1407171770,
    #     "subset": [ "LAION-2B-en" ]
    #   },
    #   {
    #     "count": 30602,
    #     "subset": [ "C4", "LAION-2B-en" ]
    #   }
    # ]
    @api.route('/api/get_overlaps', methods=['POST'])
    def get_overlaps():
        data = request.json
        if data is None:
            return error("No request body")

        used_datasets = data.get("corpora")
        if any([x not in dataset_files_map for x in used_datasets]):
            return error('Please enter a valid dataset name.')

        corpora_subets = []
        for i in range(1, len(used_datasets) + 1):
            corpora_subets.extend(list(itertools.combinations(used_datasets, i)))
            print(corpora_subets[-1])
            current_app.logger.info('overlap are:' + ','.join(corpora_subets[-1]))



        subset_counts = []
        for subset in corpora_subets:
            corpora_tuple = tuple(dict.fromkeys(sorted(subset)))
            corpora_tuple_converted = tuple([dataset_files_map[x] for x in corpora_tuple])
            count_overlap = overlaps[tuple(sorted(corpora_tuple_converted))]
            subset_counts.append({'subset': tuple(subset), 'count': count_overlap})
        return jsonify(subset_counts)


    # Return an array of ngram length the user can pick from
    # curl -H "Content-Type: application/json"
    # -X GET http://localhost:8080/api/ks
    # Returns:
    # [
    #   1,
    #   2,
    #   3,
    #   4,
    #   5,
    #   10,
    #   20,
    #   100
    # ]
    @api.route('/api/ks', methods=['GET'])
    def get_ks():
        return jsonify(ks)

    # Return a dictionary of datasets to arrays of top ngrams in that dataset
    # curl -d '{"k":4, "datasets":["c4_en"], "count":3}' -H "Content-Type: application/json"
    # -X POST http://localhost:8080/api/topk
    # Returns:
    # {
    #   "c4_en": [
    #     ". . . .",
    #     ", as well as",
    #     ". If you are"
    #   ]
    # }
    @api.route('/api/topk', methods=['POST'])
    def get_topk():
        data = request.json
        if data is None:
            return error("No request body")

        k = data.get("k")
        if k is None or type(k) != int or k not in ks:
            return error(f'Please enter a valid k value: {ks}.')

        count = data.get("count", 20)

        used_datasets = data.get("datasets")
        # used_datasets = ['OpenWebText', 'C4', 'OSCAR', 'The Pile', 'LAION-2B-en']

        if any([d not in dataset_names for d in used_datasets]):
            return error('Please enter a valid dataset name.')

        datasets = []
        for d in used_datasets:
            datasets.append(data_k_file_dict[d][k])

        topk_per_data = {}

        for dn, d in zip(used_datasets, datasets):
            top = list({k: v for k, v in sorted(d.items(), key=lambda item: item[1], reverse=True)}.keys())[:count]
            topk_per_data[dn] = top

        # current_app.logger.info(topk_per_data)

        return jsonify(topk_per_data)

     # Return a dictionary of datasets to arrays of top ngrams in that dataset
    # curl -d '{"k":4, "datasets":["c4_en"], "count":3}' -H "Content-Type: application/json"
    # -X POST http://localhost:8080/api/topk
    # Returns:
    # {
    #   "c4_en": [
    #     {"ng": ". . . .", "c": 123}},
    #     {"ng": ", as well as", "c": 100},
    #     {"ng": ". If you are", "c": 50},
    #   ]
    # }
    @api.route('/api/topk_with_counts', methods=['POST'])
    def get_topk_with_counts():
        data = request.json
        if data is None:
            return error("No request body")

        k = data.get("k")
        if k is None or type(k) != int or k not in ks:
            return error(f'Please enter a valid k value: {ks}.')

        count = data.get("count", 20)

        used_datasets = data.get("datasets")

        if any([d not in dataset_names for d in used_datasets]):
            return error('Please enter a valid dataset name.')

        datasets = []
        for d in used_datasets:
            datasets.append(data_k_file_dict[d][k])

        topk_per_data = {}

        for dn, d in zip(used_datasets, datasets):
            top = []
            for ind, (k, v) in enumerate(sorted(d.items(), key=lambda item: item[1], reverse=True)):
                top.append({'ng': k, 'c': v})
                if ind >= count: break
            # current_app.logger.info(top)
            topk_per_data[dn] = top

        # current_app.logger.info(topk_per_data)

        return jsonify(topk_per_data)
    
    @lru_cache
    def call_es(text, dataset, es_index):
        return count_documents_containing_phrases(dataset_es_map[dataset], text, es=es_index)

    # Returns how many times a term exists in each dataset
    # curl -d '{"text":"well", "datasets":["c4"]}' -H "Content-Type: application/json"
    # -X POST http://localhost:8080/api/text_count
    # Returns:
    # {
    #   "c4": 212660501
    # }
    @api.route('/api/text_count', methods=['POST'])
    def text_count():

        data = request.json
        if data is None:
            return error("No request body")

        text = data.get("text")
        if text is None or text.strip() == '':
            return error(f'Please enter a valid string')

        used_datasets = data.get("datasets")

        print('used datasets: ', used_datasets)

        # indices = get_indices().keys()
        # current_app.logger.info('used_datasets:' + ','.join(used_datasets))
        # if any([dataset_es_map[d].replace('*', '1') not in indices for d in used_datasets]):
        #     return error(f'Please enter a valid dataset name, out of: {indices}')

        counts = {}
        for d in used_datasets:
            # c = count_documents_containing_phrases(dataset_es_map[d], text)
            if d == 'Dolma':
                c = call_es(text, d, es_dolma)
            else:
                c = call_es(text, d, es_default)
            # c = call_es(text, d)
            counts[d] = c

        # current_app.logger.info(counts)
        entry = {"message": "user-ngram", "event": "n-gram counts", "ngram": text}
        current_app.logger.info(entry)

        return jsonify(counts)


    @lru_cache
    def get_domain_prefix(corpus, prefix) -> List[dict]:
        domain_counts = []
        with pool.connection() as conn:
            with conn.cursor() as cur:
                limit = 1000
                db_corpus = db_map[corpus]
                q = f"SELECT * FROM {db_corpus} WHERE domain LIKE '{prefix}%' ORDER BY count DESC LIMIT {limit};"
                rows = cur.execute(q).fetchall()
                for row in rows:
                    domain_counts.append({
                        'domain': row[1],
                        'tokens': row[2],
                        'percentage': row[3],
                        'rank': row[4],
                    })
        return domain_counts


    # Returns the number of terms in a domain for each corpora
    # curl -d '{"domain_text":"images.slideplayer.com", "corpora":["laion2b-en"]}' -H "Content-Type: application/json"
    # -X POST http://localhost:8080/api/domains_count
    # Returns:
    # {
    #   "laion2b-en":
    #   [
    #     {
    #         "domain": "www.google.com",
    #         "percentage": 1.7389923769138605e-06,
    #         "rank": 27887,
    #         "tokens": 453
    #     }
    #   ]
    # }
    @api.route('/api/domains_count', methods=['POST'])
    def domains_count():

        data = request.json
        if data is None:
            return error("No request body")

        text = data.get("domain_text")
        if text is None or text.strip() == '':
            return error(f'Please enter a valid string')

        used_datasets = data.get("corpora")
        
        entry = {"message": "user-domain-prefix", "event": "domain-prefix", "prefix": text}
        current_app.logger.info(entry)

        counts = {}
        counts_l = []
        with ThreadPoolExecutor(max_workers=len(used_datasets)) as executor:
            for d in used_datasets:
                counts_l.append(executor.submit(get_domain_prefix, d, text))
                get_domain_prefix(d, text)
        wait(counts_l, timeout=200)
        for d, c in zip(used_datasets, counts_l):
            counts[d] = c.result()

        return jsonify(counts)


    def get_top_domains(corpus, count) -> List[dict]:
        current_app.logger.info("in top domains")
        domain_counts = []
        with pool.connection() as conn:
            with conn.cursor() as cur:
                db_corpus = db_map[corpus]
                q = f"SELECT * FROM {db_corpus} WHERE index < {count};"

                rows = cur.execute(q).fetchall()
                for row in rows:
                    # current_app.logger.info("top domain row:" + ','.join(map(str, row)))
                    domain_counts.append({
                        'domain': row[1],
                        'tokens': row[2],
                        'percentage': row[3],
                        'rank': row[4],
                    })
        return domain_counts

    # Returns top domains of each corpora
    # curl -d '{"corpora":["laion2b-en"], "count":10}' -H "Content-Type: application/json"
    # -X POST http://localhost:8080/api/top_domains
    # Returns:
    # {
    #   "laion2b-en": [
    #     {
    #       "domain": "i.pinimg.com",
    #       "percentage": 0.06476409921563421,
    #       "rank": 1,
    #       "tokens": 16870768
    #     },
    #    {
    #       "domain": "cdn.shopify.com",
    #       "percentage": 0.0460435353324997,
    #       "rank": 2,
    #       "tokens": 11994142
    #    },
    #    {
    #       "domain": "images.slideplayer.com",
    #       "percentage": 0.019256741682843807,
    #       "rank": 3,
    #       "tokens": 5016298
    #     },...
    #   ]
    # }
    @api.route('/api/top_domains', methods=['POST'])
    def top_domains():

        data = request.json
        if data is None:
            return error("No request body")

        count = data.get("count", 1000)

        used_datasets = data.get("corpora")

        domain_counts = {}
        for corpus in used_datasets:
            domain_counts[corpus] = get_top_domains(corpus, count)

        current_app.logger.info("domain counts")
        # current_app.logger.info(counts)

        return jsonify(domain_counts)

    # Returns document length distribution of each corpora
    # curl -i -X POST -H 'Content-Type: application/json' -d '{"corpora": ["laion2b-en"]}' localhost:8080/api/len_dist
    # Returns:
    # {
    #   "laion2b-en": [
    #     [ 1, 3.81e-06 ],
    #     [ 2, 3.81e-06 ],
    #     [ 3, 7.14e-06 ],
    #     ...
    #   ]
    # }
    @api.route('/api/len_dist', methods=['POST'])
    def len_dist():

        data = request.json
        if data is None:
            return error("No request body")

        used_datasets = data.get("corpora")

        len_dist_out = {}
        for d in used_datasets:
            len_dist_out[d] = stratified_len_dist[d]

        return jsonify(len_dist_out)

    return api

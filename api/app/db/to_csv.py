import os
import json
import csv
from glob import glob
from tqdm import tqdm

# Set the input and output directory paths
input_dir = 'skiff_files/domains_per_token/'
output_dir = 'skiff_files/domains_per_token_csv/'

# Create the output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print('created dir')

# Loop through each file in the input directory
for filename in tqdm(glob(input_dir + '*')):
    if os.path.isdir(filename):
        continue
    if 'dolma' not in filename:
        continue
    print(filename)
    # Open the file and load the JSON data
    with open(filename, 'r') as json_file:
        data = [json.loads(x) for x in json_file.readlines()]
        data = {x['url']: x['count'] for x in data}
    
    # order data by count, for having the rank ordered by count
    data = {k: v for k, v in sorted(data.items(), key=lambda item: item[1], reverse=True)}

    # add rank, and percentage
    domains_dic = {}
    total_tokens = sum(data.values())
    for rank, (k, v) in enumerate(data.items()):
        domains_dic[k] = {
            'domain': k,
            'count': v,
            'percentage': v / total_tokens,
            # + 1 to start indexing at 1
            'rank': rank + 1,
        }
    
    print('done processing data')
    
    # Create a new CSV file in the output directory with the same name as the JSON file
    csv_filename = os.path.splitext(filename.rsplit('/')[-1])[0] + '.csv'
    csv_path = os.path.join(output_dir, csv_filename)
    with open(csv_path, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        
        # Write the header row to the CSV file
        writer.writerow(['domain', 'count', 'percentage', 'rank'])
        
        # Loop through each item in the JSON data
        for _, item in domains_dic.items():
            # Write a new row to the CSV file with the url and count values
            writer.writerow([item['domain'], item['count'], item['percentage'], item['rank']])
    print('done writing csv')

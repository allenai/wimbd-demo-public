import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { DatasetTable } from '../components/DatasetTable';

import {
    CenteredTextBlock,
    Hero,
    HeroTitle,
    FullWidth,
    FullWidthLight,
    Section,
    SectionTitle,
} from '../components/Containers';

export const Corpora = () => {
    return (
        <div>
            <Hero>
                <HeroTitle>WIMBD: Corpora</HeroTitle>
            </Hero>
            <CenteredTextBlock>
                <Typography component="p" sx={{ mt: 4, mb: 4 }}>
                    We cover ten different corpora, including text-only corpora (e.g., <i>C4</i>),
                    captions from image-captioning (<i>LAION-2B-en</i>), and code (<i>The Stack</i>
                    ). A high level description of these datasets using WIMBD is presented in the
                    summary <Link to="/corpora#table">table</Link> and we provide here some
                    information about those corpora.
                    <br />
                    <br />
                    <b>ElasticSearch Access</b>
                    <br />
                    We have indexed several of the corpora used in this work using ElasticSearch.
                    Due to the nature of ES, we are not able to release its keys publicly, 
                    but we can provide individual access keys upon request.
                    Please fill in the following {' '}<Link to="https://forms.gle/Mk9uwJibR9H4hh9Y9">form</Link>.
                    <br/>
                    For accessing the Dolma dataset, please fill in the following {' '}<Link to="https://forms.gle/ndKx7JnF9WTy6CFs5">form</Link>.
                </Typography>
            </CenteredTextBlock>

            <FullWidth id="table">
                <Section>
                    <DatasetTable
                        data={[
                            {
                                id: 0,
                                name: 'OpenWebText',
                                model: 'GPT-2*',
                                size: 41.2,
                                documentCount: 8005939,
                                tokenCount: 7767705349,
                                maxTokens: 95139,
                                minTokens: 128,
                                link: '/corpora#openwebtext',
                            },
                            {
                                id: 1,
                                name: 'C4',
                                model: 'T5',
                                size: 838.7,
                                documentCount: 364868892,
                                tokenCount: 153607833664,
                                maxTokens: 101898,
                                minTokens: 5,
                                link: '/corpora#c4',
                            },
                            {
                                id: 2,
                                name: 'mC4-en',
                                model: 'umT5',
                                size: 14694.0,
                                documentCount: 3928733374,
                                tokenCount: 2703077876916,
                                maxTokens: 181949,
                                minTokens: 1,
                                link: '/corpora#mc4',
                            },
                            {
                                id: 3,
                                name: 'OSCAR',
                                model: 'BLOOM*',
                                size: 3327.3,
                                documentCount: 431584362,
                                tokenCount: 475992028559,
                                maxTokens: 1048409,
                                minTokens: 1,
                                link: '/corpora#oscar',
                            },
                            {
                                id: 4,
                                name: 'The Pile',
                                model: 'GPT-J/Neo & pythia',
                                size: 1369.0,
                                documentCount: 210607728,
                                tokenCount: 285794281816,
                                maxTokens: 28121329,
                                minTokens: 0,
                                link: '/corpora#pile',
                            },
                            {
                                id: 5,
                                name: 'RedPajama',
                                model: 'LLaMA*',
                                size: 5602.0,
                                documentCount: 930453833,
                                tokenCount: 1023865191958,
                                maxTokens: 28121329,
                                minTokens: 0,
                                link: '/corpora#redpajama',
                            },
                            {
                                id: 6,
                                name: 'S2Orc',
                                model: 'SciBERT*',
                                size: 692.7,
                                documentCount: 11241499,
                                tokenCount: 59863121791,
                                maxTokens: 376681,
                                minTokens: 1,
                                link: '/corpora#s2orc',
                            },
                            {
                                id: 7,
                                name: 'peS2o',
                                model: '-',
                                size: 504.3,
                                documentCount: 8242162,
                                tokenCount: 44024690229,
                                maxTokens: 97043,
                                minTokens: 154,
                                link: '/corpora#pes2o',
                            },
                            {
                                id: 8,
                                name: 'LAION-2B-en',
                                model: 'Stable Diffusion*',
                                size: 570.2,
                                documentCount: 2319907827,
                                tokenCount: 29643340153,
                                maxTokens: 131077,
                                minTokens: 0,
                                link: '/corpora#laion',
                            },
                            {
                                id: 9,
                                name: 'The Stack',
                                model: 'StarCoder*',
                                size: 7830.8,
                                documentCount: 544750672,
                                tokenCount: 1525618728620,
                                maxTokens: 26298134,
                                minTokens: 0,
                                link: '/corpora#stack',
                            },
                        ]}
                    />
                </Section>
            </FullWidth>

            <FullWidthLight id="openwebtext">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>OpenWebText</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            OpenWebText is an{' '}
                            <Link to="skylion007.github.io/OpenWebTextCorpus">
                                open-source reproduction{' '}
                            </Link>{' '}
                            of the data used to train{' '}
                            <Link to="https://github.com/openai/gpt-2">GPT-2</Link>. Due to the
                            limited information provided by the GPT-2 paper, and never releasing the
                            data, it is unclear how similar OpenWebText is to the original data
                            (WebText), but similar steps to the paper's reports were conducted (such
                            as deduplication, non-English filtering, min-length filtering, etc.).
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidthLight>

            <FullWidth id="c4">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>C4</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            C4 is the dataset used by{' '}
                            <Link to="https://arxiv.org/abs/1910.10683">Raffel et al., 2020</Link>{' '}
                            for training
                            <Link to="https://github.com/google-research/text-to-text-transfer-transformer">
                                T5
                            </Link>
                            . The dataset: The Colossal Clean Crawled Corpus (C4 in short) is based
                            on Common Crawl as a source of text that was scraped from the web. As
                            such, a lot of the data is noisy, and a set of heuristics were employed
                            to clean it up, such as filtering documents by length, obscene/bad
                            words, duplicate texts, non-english, etc. C4 was not released by Raffel
                            et al., and instead, it was scraped, cleaned, filtered, and released by{' '}
                            <Link to="https://aclanthology.org/2021.emnlp-main.98/">
                                Dodge et al., 2021
                            </Link>
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidth>

            <FullWidthLight id="mc4">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>mC4-en</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            mC4-en is a multilingual version of C4 that was used to train mT5 (
                            <Link to="https://arxiv.org/abs/2010.11934">Xue et al., 2021</Link>) and
                            later umT5 (
                            <Link to="https://arxiv.org/abs/2304.09151">Chung et al., 2023</Link>).
                            We use the latest version (v.3.1.0) which was used to train umT5,
                            containing documents collected from Common Crawl through August 2022,
                            and in practice the portion of the data that is classified as English.
                            The main difference of mC4-en over C4 is a higher confidence by a
                            language classifier (from 0.7 to 0.96), while also allowing a 0.1%
                            random set of documents that contain ``bad words'' to pass through, and
                            adaptation of the ``bad words'' list that resulted in filtering more
                            than 10% of the documents in a language.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidthLight>

            <FullWidth id="oscar">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>OSCAR</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://oscar-project.github.io/documentation/">OSCAR</Link>{' '}
                            is a multilingual corpus based on Common Crawl. It contains a length
                            filter for improving data quality that filters out documents with short
                            sentences. They also annotate the data with different labels, such as
                            the language of the document, adult content, and language
                            identification, which they use for different analyses. It is an ongoing
                            effort, and the corpus is maintained and updated regularly.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidth>

            <FullWidthLight id="pile">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>The Pile</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://pile.eleuther.ai/">The Pile</Link> is a corpus
                            consisting of 22 different domains . Unlike C4, the data was not
                            scrapped from the web and then filtered, but pre-selected, with the
                            motivation that this way the data will be of higher quality. The
                            included domains in The Pile are diverse: they include data such as
                            Wikipedia, Github, Arxiv, EuroParl, and more. By design, most datasets
                            are upsampled in the hope to increase data quality, from 1.5x with
                            domains such as OpenSubtitles, up to 3x with Wikipedia. Models such as{' '}
                            <Link to="https://huggingface.co/docs/transformers/model_doc/gptj">
                                GPT-J
                            </Link>
                            , <Link to="https://github.com/EleutherAI/gpt-neo">GPT-neo</Link>
                            and <Link to="https://github.com/EleutherAI/pythia">Pythia</Link> were
                            trained on this dataset.
                            <br />
                            <br />
                            As of October 2023 (perhaps even earlier), The Pile is no longer
                            available for{' '}
                            <Link to="https://the-eye.eu/public/AI/pile/">download</Link>.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidthLight>

            <FullWidth id="redpajama">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>RedPajama</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://github.com/togethercomputer/RedPajama-Data">
                                RedPajama
                            </Link>{' '}
                            is an open-source version reproduction of the data used to train{' '}
                            <Link to="https://arxiv.org/abs/2302.13971">LLaMA</Link>, and was used
                            to train{' '}
                            <Link to="https://together.ai/blog/redpajama-models-v1">
                                RedPajama-INCITE
                            </Link>
                            .
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidth>

            <FullWidthLight id="s2orc">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>S2ORC</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://aclanthology.org/2020.acl-main.447/">S2ORC</Link> is a
                            large corpus of English academic papers, which consists the abstracts,
                            full text, including figures, tables, and references. The texts are
                            automatically extracted from pdfs and LaTeX sources.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidthLight>

            <FullWidth id="pes2o">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>peS2o</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://github.com/allenai/peS2o">peS2o</Link> is a derivative
                            of S2ORC, cleaned and filtered to obtain a more usable version of the
                            data intended to train language models. We use peS2o V2.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidth>

            <FullWidthLight id="laion">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>LAION-2B-en</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://laion.ai/blog/laion-5b/">LAION</Link> is a large
                            dataset of images and captions scraped from Common Crawl. The main
                            dataset (LAION-5B) contains 5.8 billion examples, of which 2.32 billion
                            of the captions are in English (LAION-2B-en), which we use in this work.
                            We focus on the text captions but demonstrate qualitative examples using
                            the associated URLs and images when appropriate.
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidthLight>

            <FullWidth id="stack">
                <Section>
                    <CenteredTextBlock>
                        <SectionTitle>The Stack</SectionTitle>
                        <Typography component="p" sx={{ mb: 3 }}>
                            <Link to="https://huggingface.co/datasets/bigcode/the-stack">
                                The Stack
                            </Link>{' '}
                            is a source-code dataset that was collected for training language
                            models, and parts of it were used to train{' '}
                            <Link to="https://huggingface.co/bigcode/santacoder">SantaCoder</Link>
                            and <Link to="https://www.mosaicml.com/blog/mpt-7b">MPT</Link>. It was
                            compiled from <Link to="https://gharchive.org/">GHArchive</Link> with
                            some filters: files that cannot contribute to training code such as
                            binary files, files larger than 1MB, and some extensions. In addition,
                            only repositories with permissive licenses were included (18 license
                            types in the version v1.0, and 193 in version v1.1), and we use the
                            v1.2. While the main purpose of code is to provide machine instructions
                            to perform different functionalities, it also contain natural language
                            in the form of comments: ``Roughly 40 natural languages are present in
                            docstrings and comments with English being the most prevalent. In python
                            files, it makes up ~96% of the dataset.''
                        </Typography>
                    </CenteredTextBlock>
                </Section>
            </FullWidth>
        </div>
    );
};

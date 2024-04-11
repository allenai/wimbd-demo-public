import React, { useEffect, useState } from 'react';
import useFetch, { CachePolicies } from 'use-http';
import { Alert, LinearProgress, Typography } from '@mui/material';
import { darkCategoricalColor, lightCategoricalColor } from '@allenai/varnish2/theme';

import { Explorer } from '../components/Explorer';
import { Domains } from '../components/Domains';
import { NgramLookup } from '../components/NgramLookup';
import { Overlap } from '../components/Overlap';
import { Distributions } from '../components/Distributions';

import Fig1Src from '../images/wimbd-fig1.png';

import {
    CenteredTextBlock,
    FullWidth,
    FullWidthLight,
    Hero,
    HeroTitle,
    CenteredSectionContent,
    PaddedImg,
    Section,
    SectionFlex,
    SectionTitle,
} from '../components/Containers';

export enum DatasetAttribute {
    Basic = 'basic',
    Indexed = 'indexed',
    Url = 'url',
    Overlap = 'overlap',
}

interface DatasetMetaData {
    color: string;
    datasetAttrs: DatasetAttribute[];
    order: number;
}

interface DatasetJson {
    meta: DatasetAttribute[];
    order: number;
}

export type DatasetMetadataMap = { [index: string]: DatasetMetaData };

export const Home = () => {
    const {
        loading: loadingKs,
        error: errorKs,
        data: ks = [],
    } = useFetch<number[]>('/api/ks', { cachePolicy: CachePolicies.NO_CACHE }, []);

    const {
        loading: loadingDatasets,
        error: errorDatasets,
        data: datasets = {},
    } = useFetch<{ [index: string]: DatasetJson }>(
        '/api/datasets',
        {
            cachePolicy: CachePolicies.NO_CACHE,
        },
        []
    );

    const [datasetMap, setDatasetMap] = useState<DatasetMetadataMap>({});
    useEffect(() => {
        if (errorDatasets || !datasets || !Object.keys(datasets).length) {
            return;
        }
        const ret: DatasetMetadataMap = {};
        const colors = [
            darkCategoricalColor.Red.hex,
            darkCategoricalColor.Aqua.hex,
            darkCategoricalColor.Fuchsia.hex,
            darkCategoricalColor.Green.hex,
            darkCategoricalColor.Teal.hex,
            darkCategoricalColor.Orange.hex,
            darkCategoricalColor.Purple.hex,
            lightCategoricalColor.Red.hex,
            lightCategoricalColor.Orange.hex,
            lightCategoricalColor.Fuchsia.hex,
            lightCategoricalColor.Blue.hex,
        ];
        Object.entries(datasets).forEach(([k, v], i) => {
            ret[k] = {
                color: colors[i % colors.length],
                datasetAttrs: v.meta,
                order: v.order,
            };
        });
        setDatasetMap(ret);
    }, [datasets, errorDatasets]);

    return (
        <div>
            <Hero>
                <HeroTitle>
                    W<small>hat's</small> I<small>n</small> M<small>y</small> B<small>ig</small> D
                    <small>ata</small>?
                </HeroTitle>
            </Hero>

            {loadingKs || loadingDatasets ? <LinearProgress /> : null}

            {errorKs ? (
                <Alert severity="error">{errorKs.message || 'Sorry, something went wrong.'}</Alert>
            ) : null}
            {errorDatasets ? (
                <Alert severity="error">
                    {errorDatasets.message || 'Sorry, something went wrong.'}
                </Alert>
            ) : null}

            {loadingKs ||
            loadingDatasets ||
            errorKs ||
            errorDatasets ||
            !Object.keys(datasets).length ||
            !ks?.length ? null : (
                <>
                    <FullWidth>
                        <Section>
                            <CenteredTextBlock>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    Large text corpora are the backbone of language models. However,
                                    we have a limited understanding of the content of these corpora,
                                    including general statistics, quality, social factors, and
                                    inclusion of evaluation data (contamination). What's In My Big
                                    Data? (WIMBD), is a platform and a set of 16 high-level analyses
                                    that allow us to reveal and compare the contents of large text
                                    corpora. WIMBD builds on two basic capabilities---count and
                                    search---at scale, which allows us to analyze more than 35
                                    terabytes on a standard compute node.
                                    <br />
                                    <br />
                                    We apply WIMBD to 10 different corpora used to train popular
                                    language models, including C4, The Pile, and RedPajama. Our
                                    analysis uncovers several surprising and previously undocumented
                                    findings about these corpora, including the high prevalence of
                                    duplicate, synthetic, and low-quality content, personally
                                    identifiable information, toxic language, and benchmark
                                    contamination. We open-source WIMBD's code and artifacts to
                                    provide a standard set of evaluations for new text-based corpora
                                    and to encourage more analyses and transparency around them.
                                </Typography>
                            </CenteredTextBlock>
                            <SectionFlex>
                                <CenteredSectionContent>
                                    <PaddedImg src={Fig1Src} alt="WIMBD components" />
                                </CenteredSectionContent>
                            </SectionFlex>
                        </Section>
                    </FullWidth>

                    <FullWidthLight>
                        <Section>
                            <CenteredTextBlock>
                                <SectionTitle>
                                    <i>n</i>-gram Explorer
                                </SectionTitle>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    We explore the most common <i>n</i>-grams of each of the 10
                                    corpora we consider. We compute the 10K most common <i>n</i>
                                    -grams for all corpora, with different <i>n</i>-grams. The
                                    interface uses distinct colors to highlight identical <i>n</i>
                                    -grams across different corpora, enabling easy comparisons.
                                    <br />* For better readability with larger <i>n</i>-grams reduce
                                    the number of selected corpora.
                                </Typography>
                            </CenteredTextBlock>
                            <SectionFlex>
                                <CenteredSectionContent>
                                    <Explorer ks={ks} datasets={datasetMap} />
                                </CenteredSectionContent>
                            </SectionFlex>
                        </Section>
                    </FullWidthLight>

                    <FullWidth>
                        <Section>
                            <CenteredTextBlock>
                                <SectionTitle>
                                    <i>n</i>-gram Loookup
                                </SectionTitle>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    Explore the frequency of <i>n</i>-grams. Enter an <i>n</i>-gram,
                                    and see how often it appears across various AI datasets.
                                    <br />
                                    The demo calls our ElasticSearch API, hence depending on the
                                    query and number of corpora selected it may take a few seconds.
                                </Typography>
                            </CenteredTextBlock>
                            <SectionFlex>
                                <CenteredSectionContent>
                                    <NgramLookup datasets={datasetMap} />
                                </CenteredSectionContent>
                            </SectionFlex>
                        </Section>
                    </FullWidth>

                    <FullWidthLight>
                        <Section>
                            <CenteredTextBlock>
                                <SectionTitle>Internet Domain Explorer</SectionTitle>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    Models are trained on billions of tokens from the internet. But
                                    where do these tokens come from? Here, we present the most
                                    commonly used domains in the different corpora we consider (that
                                    contain url information in their metadata). In addition, we also
                                    support the search over the entire domains list.
                                    <br />
                                    <br />
                                    The table provides information on the number of tokens
                                    originating from specific domains, offering a clear breakdown of
                                    the dataset's content.
                                    <br />
                                    The percentages of all tokens refer to the number of tokens out
                                    of documents with available URL information. In some cases (such
                                    as RedPajama), many documents do not contain URL information,
                                    and thus the percentages are not representative of the tokens
                                    from entire dataset.
                                    <br />
                                    <br />
                                    The lookup perform a <b>prefix search</b> over the domains list
                                    (e.g., <i>'allenai.'</i>
                                    will match all domains that start with <i>'allenai.'</i> such as{' '}
                                    <i>'allenai.org'</i>).
                                </Typography>
                            </CenteredTextBlock>
                            <SectionFlex>
                                <CenteredSectionContent>
                                    <Domains datasets={datasetMap} />
                                </CenteredSectionContent>
                            </SectionFlex>
                        </Section>
                    </FullWidthLight>

                    <FullWidth>
                        <Section>
                            <CenteredTextBlock>
                                <SectionTitle>Overlap Explorer</SectionTitle>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    Visualization of dataset text overlaps across the various
                                    corpora we consider. Overlap refers to documents whose textual
                                    content is identical across corpora.
                                </Typography>
                            </CenteredTextBlock>
                            <CenteredSectionContent>
                                <Overlap datasets={datasetMap} />
                            </CenteredSectionContent>
                        </Section>
                    </FullWidth>

                    <FullWidthLight>
                        <Section>
                            <CenteredTextBlock>
                                <SectionTitle>Length Distributions Explorer</SectionTitle>
                                <Typography component="p" sx={{ mb: 3 }}>
                                    The character distribution of documents in various corpora.
                                </Typography>
                            </CenteredTextBlock>
                            <CenteredSectionContent>
                                <Distributions datasets={datasetMap} />
                            </CenteredSectionContent>
                        </Section>
                    </FullWidthLight>
                </>
            )}
        </div>
    );
};

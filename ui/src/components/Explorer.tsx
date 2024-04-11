import React, { useState, useEffect } from 'react';
import useFetch, { CachePolicies } from 'use-http';
import {
    Alert,
    Divider,
    FormControl,
    FormLabel,
    LinearProgress,
    Slider,
    Stack,
} from '@mui/material';

import { ExplorerTable } from '../components/ExplorerTable';
import { DatasetPicker, DatasetsSelectedState } from '../components/DatasetPicker';
import { Options } from './Containers';
import { DatasetAttribute, DatasetMetadataMap } from '../pages/Home';

export interface CountedNgram {
    ng: string;
    c: number;
}
export interface TopKDatum {
    [index: string]: CountedNgram[];
}

interface Props {
    datasets: DatasetMetadataMap;
    ks: number[];
}

export const Explorer = ({ datasets, ks }: Props) => {
    if (!datasets || !Object.keys(datasets).length || !ks || !ks.length) {
        return null;
    }
    const [topK, setTopK] = useState<TopKDatum>({});
    const [selectedK, setSelectedK] = useState<number>(ks[Math.round(ks.length / 2)]);
    const filterDs = (a: DatasetAttribute[]) => a.includes(DatasetAttribute.Basic);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(
        Object.entries(datasets)
            .filter(([_k, v]) => filterDs(v.datasetAttrs))
            .map(([k, _v]) => k)
            .reduce((arr, v) => ({ ...arr, [v]: true }), {})
    );

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const { loading, error, post, response } = useFetch<TopKDatum>('/api/topk_with_counts', {
        cachePolicy: CachePolicies.NO_CACHE,
    });

    async function getTopk() {
        const top = await post('', {
            k: selectedK,
            datasets: getSelectedDatasets(),
            count: 1000,
        });
        if (response.ok) {
            setTopK(top);
        }
    }

    useEffect(() => {
        getTopk();
    }, [selectedDatasets, selectedK]);

    return (
        <Stack spacing={2}>
            <Options>
                <DatasetPicker
                    datasets={Object.entries(datasets)
                        .filter(([_k, v]) => filterDs(v.datasetAttrs))
                        .sort(([_ka, av], [_kb, bv]) => av.order - bv.order)
                        .map(([k, _v]) => k)}
                    onChange={setSelectedDatasets}
                    initialState={selectedDatasets}
                />
                <div>
                    <FormControl
                        component="fieldset"
                        variant="standard"
                        fullWidth
                        sx={{ gridArea: 'ngram' }}>
                        <FormLabel component="legend">Ngram Length</FormLabel>
                        {selectedK ? (
                            <Slider
                                track={false}
                                value={ks.indexOf(selectedK)}
                                onChange={(_, v) =>
                                    setSelectedK(Array.isArray(v) ? ks[v[0]] : ks[v])
                                }
                                valueLabelDisplay="off"
                                valueLabelFormat={(v) => ks[v]}
                                min={0}
                                max={ks.length - 1 || 1}
                                step={1}
                                marks={ks.map((v, i) => {
                                    return { value: i, label: v };
                                })}
                            />
                        ) : null}
                    </FormControl>
                </div>
            </Options>

            {loading ? <LinearProgress /> : null}

            {error ? (
                <Alert severity="error">{error.message || 'Sorry, something went wrong.'}</Alert>
            ) : null}

            <Divider />
            <ExplorerTable topK={topK} />
        </Stack>
    );
};

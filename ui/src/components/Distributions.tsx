import React, { useState, useEffect } from 'react';
import { Alert, Divider, LinearProgress, Stack } from '@mui/material';
import useFetch, { CachePolicies } from 'use-http';

import { DatasetPicker, DatasetsSelectedState } from './DatasetPicker';
import { DistributionsChart } from './DistributionsChart';
import { Options } from './Containers';
import { DatasetAttribute, DatasetMetadataMap } from '../pages/Home';

export interface DistributionData {
    [index: string]: [number, number][];
}

interface Props {
    datasets: DatasetMetadataMap;
}

export const Distributions = ({ datasets }: Props) => {
    if (!datasets || !Object.keys(datasets).length) {
        return null;
    }

    const filterDs = (a: DatasetAttribute[]) => a.includes(DatasetAttribute.Basic);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(
        Object.entries(datasets)
            .filter(([_k, v]) => filterDs(v.datasetAttrs))
            .map(([k, _v]) => k)
            .reduce((arr, v) => ({ ...arr, [v]: true }), {})
    );
    const [distributions, setDistributions] = useState<DistributionData>({});

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const { loading, error, post, response } = useFetch<DistributionData>('/api/len_dist', {
        cachePolicy: CachePolicies.NO_CACHE,
    });

    async function getDist() {
        const dist = await post('', {
            corpora: getSelectedDatasets(),
        });
        if (response.ok) {
            setDistributions(dist);
        }
    }

    useEffect(() => {
        getDist();
    }, [selectedDatasets]);

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
            </Options>

            {loading ? <LinearProgress /> : null}

            {error ? (
                <Alert severity="error">{error.message || 'Sorry, something went wrong.'}</Alert>
            ) : null}

            <Divider />
            <DistributionsChart data={distributions} datasetMap={datasets} />
        </Stack>
    );
};

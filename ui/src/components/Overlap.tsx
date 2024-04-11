import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Alert, Divider, LinearProgress, Stack } from '@mui/material';
import useFetch, { CachePolicies } from 'use-http';

import { DatasetPicker, DatasetsSelectedState } from './DatasetPicker';
import { OverlapVenn } from './OverlapVenn';
import { OverlapTable } from './OverlapTable';
import { Options } from './Containers';
import { DatasetAttribute, DatasetMetadataMap } from '../pages/Home';

export interface Sets {
    subset: string[];
    count: number;
}

interface Props {
    datasets: DatasetMetadataMap;
}

export const Overlap = ({ datasets }: Props) => {
    if (!datasets || !Object.keys(datasets).length) {
        return null;
    }
    const filterDs = (a: DatasetAttribute[]) => a.includes(DatasetAttribute.Overlap);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(
        Object.entries(datasets)
            .filter(([_k, v]) => filterDs(v.datasetAttrs))
            .sort(([_ka, av], [_kb, bv]) => av.order - bv.order)
            .map(([k, _v]) => k)
            .reduce((arr, v, i) => ({ ...arr, [v]: i < 4 }), {})
    );
    const [sets, setSets] = useState<Sets[]>([]);

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const { loading, error, post, response } = useFetch<Sets[]>('/api/get_overlaps', {
        cachePolicy: CachePolicies.NO_CACHE,
    });

    async function getOverlap() {
        const overlap = await post('', {
            corpora: getSelectedDatasets(),
        });
        if (response.ok) {
            setSets(overlap);
        }
    }

    useEffect(() => {
        getOverlap();
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
            <Results>
                <OverlapTable sets={sets} />
                <OverlapVenn sets={sets} datasetMap={datasets} />
            </Results>
        </Stack>
    );
};

const Results = styled.div`
    display: grid;
    grid-template-columns: 1fr;

    ${({ theme }) => theme.breakpoints.up('md')} {
        grid-template-columns: auto 1fr;
    }
`;

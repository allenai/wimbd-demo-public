import React, { useState, useEffect } from 'react';
import useFetch, { CachePolicies } from 'use-http';
import {
    Alert,
    Divider,
    FormControl,
    FormLabel,
    LinearProgress,
    Stack,
    TextField,
} from '@mui/material';

import { DomainDatum, DomainsTable } from '../components/DomainsTable';
import { DatasetPicker, DatasetsSelectedState } from '../components/DatasetPicker';
import { SearchButton } from './SearchButton';
import { Options } from './Containers';
import { DatasetAttribute, DatasetMetadataMap } from '../pages/Home';

interface Props {
    datasets: DatasetMetadataMap;
}

export const Domains = ({ datasets }: Props) => {
    if (!datasets || !Object.keys(datasets).length) {
        return null;
    }
    const [topDomains, setTopDomains] = useState<DomainDatum>({});
    const filterDs = (a: DatasetAttribute[]) => a.includes(DatasetAttribute.Url);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(
        Object.entries(datasets)
            .filter(([_k, v]) => filterDs(v.datasetAttrs))
            .map(([k, _v]) => k)
            .reduce((arr, v) => ({ ...arr, [v]: true }), {})
    );
    const [selectedText, setSelectedText] = useState<string>();

    useEffect(() => {
        // on load, kick off initial search
        getTopDomains();
    }, []);

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const { loading, error, post, response } = useFetch<DomainDatum>('/api', {
        cachePolicy: CachePolicies.NO_CACHE,
    });

    async function getTopDomains() {
        const top = await post('/top_domains', {
            corpora: getSelectedDatasets(),
        });
        if (response.ok) {
            setTopDomains(top);
        }
    }

    async function getDomainsCount() {
        const top = await post('/domains_count', {
            corpora: getSelectedDatasets(),
            domain_text: selectedText,
        });
        if (response.ok) {
            setTopDomains(top);
        }
    }

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
                        fullWidth
                        component="fieldset"
                        variant="standard"
                        sx={{ gridArea: 'text' }}>
                        <FormLabel component="legend">Domain to Lookup</FormLabel>
                        <TextField
                            size="small"
                            value={selectedText}
                            onChange={(e) => setSelectedText(e.target.value)}
                            variant="outlined"
                        />
                    </FormControl>
                </div>
            </Options>
            <SearchButton
                onClick={selectedText && selectedText.length ? getDomainsCount : getTopDomains}
            />

            {loading ? <LinearProgress /> : null}

            {error ? (
                <Alert severity="error">{error.message || 'Sorry, something went wrong.'}</Alert>
            ) : null}

            <Divider />
            <DomainsTable topDomains={topDomains} />
        </Stack>
    );
};

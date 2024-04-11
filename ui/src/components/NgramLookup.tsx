import React, { useState } from 'react';
import useFetch, { CachePolicies } from 'use-http';
import {
    Alert,
    FormControl,
    FormHelperText,
    FormLabel,
    LinearProgress,
    Stack,
    TextField,
} from '@mui/material';

import { NgramLookupDatum, NgramLookupTable } from './NgramLookupTable';
import { DatasetPicker, DatasetsSelectedState } from './DatasetPicker';
import { SearchButton } from './SearchButton';
import { Options } from './Containers';
import { DatasetAttribute, DatasetMetadataMap } from '../pages/Home';

interface Props {
    datasets: DatasetMetadataMap;
}

export const NgramLookup = ({ datasets }: Props) => {
    if (!datasets || !Object.keys(datasets).length) {
        return null;
    }
    const [textCount, setTextCount] = useState<NgramLookupDatum>({});
    const filterDs = (a: DatasetAttribute[]) => a.includes(DatasetAttribute.Indexed);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(
        Object.entries(datasets)
            .filter(([_k, v]) => v.datasetAttrs.includes(DatasetAttribute.Indexed))
            .map(([k, _v]) => k)
            .filter((v) => v === 'C4' || v === 'OpenWebText')
            .reduce((arr, v) => ({ ...arr, [v]: true }), {})
    );
    const [selectedText, setSelectedText] = useState<string>('Artificial Intelligence');
    const [curText, setCurText] = useState<string>();

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const { loading, error, post, response } = useFetch<NgramLookupDatum>('/api/text_count', {
        cachePolicy: CachePolicies.NO_CACHE,
    });

    async function getTextCount() {
        const top = await post('', {
            datasets: getSelectedDatasets(),
            text: selectedText,
        });
        if (response.ok) {
            setTextCount(top);
            setCurText(selectedText);
        }
    }

    const selectedTextError = !selectedText || !selectedText.length;

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
                        sx={{ gridArea: 'text' }}
                        error={selectedTextError}>
                        <FormLabel component="legend">Text to Lookup</FormLabel>
                        <TextField
                            size="small"
                            value={selectedText}
                            onChange={(e) => setSelectedText(e.target.value)}
                            variant="outlined"
                        />
                        {selectedTextError ? (
                            <FormHelperText>Please enter text to search for</FormHelperText>
                        ) : null}
                    </FormControl>
                </div>
            </Options>
            <SearchButton onClick={getTextCount} disabled={selectedTextError} />

            {loading ? <LinearProgress /> : null}

            {error ? (
                <Alert severity="error">{error.message || 'Sorry, something went wrong.'}</Alert>
            ) : null}

            <NgramLookupTable ngram={curText} ngramCounts={textCount} />
        </Stack>
    );
};

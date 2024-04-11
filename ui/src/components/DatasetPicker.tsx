import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import {
    FormHelperText,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

import { MaxWidthText } from '@allenai/varnish2/components';

export interface DatasetsSelectedState {
    [index: string]: boolean;
}

interface Props {
    datasets: string[];
    onChange: (datasetsSelectedState: DatasetsSelectedState) => void;
    initialState: DatasetsSelectedState;
}

export const DatasetPicker = ({ datasets, initialState, onChange }: Props) => {
    if (!datasets || !datasets.length) {
        return null;
    }

    const [selectedDatasets, setSelectedDatasets] = useState<DatasetsSelectedState>(initialState);

    const getSelectedDatasets = () =>
        Object.keys(selectedDatasets).filter((k) => selectedDatasets[k]);

    const handleChangeDatasets = (event: ChangeEvent<HTMLInputElement>, _: boolean): void => {
        const newState = {
            ...selectedDatasets,
            [event.target.name]: event.target.checked,
        };
        setSelectedDatasets(newState);
        onChange(newState);
    };

    const selectedDatasetCountError = getSelectedDatasets().length < 1;

    return (
        <FormControl
            sx={{ gridArea: 'datasetPicker' }}
            component="fieldset"
            variant="standard"
            error={selectedDatasetCountError}>
            <FormLabel component="legend">Corpora</FormLabel>
            <FormGroup>
                <BoxArea>
                    {datasets.map((d) => {
                        return (
                            <FormControlLabel
                                key={d}
                                control={
                                    <Checkbox
                                        checked={selectedDatasets[d] === true}
                                        onChange={handleChangeDatasets}
                                        name={d}
                                    />
                                }
                                label={d}
                            />
                        );
                    })}
                </BoxArea>
            </FormGroup>
            {selectedDatasetCountError ? (
                <FormHelperText>Please select one or more corpora</FormHelperText>
            ) : null}
        </FormControl>
    );
};

const BoxArea = styled(MaxWidthText)`
    display: flex;
    flex-wrap: wrap;
`;

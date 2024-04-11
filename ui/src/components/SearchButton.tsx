import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Search } from '@mui/icons-material';

export const SearchButton = (props: ButtonProps) => {
    return (
        <Button
            variant="contained"
            sx={{ gridArea: 'button', width: 'min-content' }}
            startIcon={<Search />}
            {...props}>
            Search
        </Button>
    );
};

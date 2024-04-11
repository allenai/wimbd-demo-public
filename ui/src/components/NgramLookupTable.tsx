import React from 'react';
import {
    Typography,
    TableContainer,
    TableHead,
    Table,
    TableCell,
    TableRow,
    TableBody,
    Divider,
} from '@mui/material';

import { BarCell } from './BarCell';

export interface NgramLookupDatum {
    [domain: string]: number;
}

interface Props {
    ngramCounts: NgramLookupDatum;
    ngram?: string;
}
export const NgramLookupTable = ({ ngramCounts, ngram }: Props) => {
    if (!ngramCounts || !Object.keys(ngramCounts).length) {
        return null;
    }

    const rows = Object.entries(ngramCounts)
        .map(([k, v]) => {
            return { dataset: k, count: v };
        })
        .sort((a, b) => {
            if (b.count === a.count) {
                return b.dataset.localeCompare(a.dataset);
            }
            return b.count - a.count;
        });
    const maxCount = rows.length ? rows[0].count : 1;

    return (
        <TableContainer>
            <Divider />
            <Typography variant="h4" sx={{ ml: 2 }}>
                {ngram}
            </Typography>
            <Table size="small" sx={{ ml: 2, width: 'auto' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="overline">Dataset</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: '200px' }}>
                            <Typography variant="overline">Count</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={4}>
                                No records found
                            </TableCell>{' '}
                        </TableRow>
                    ) : (
                        rows.map((v, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Typography>{v.dataset}</Typography>
                                </TableCell>
                                <BarCell
                                    format={(n) => n.toLocaleString()}
                                    align="center"
                                    num={v.count}
                                    maxNum={maxCount}
                                />
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

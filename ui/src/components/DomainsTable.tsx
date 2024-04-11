import React from 'react';
import {
    Typography,
    TableContainer,
    TableHead,
    Table,
    TableCell,
    TableRow,
    TableBody,
    TablePagination,
} from '@mui/material';

import { BarCell } from './BarCell';

interface DomainData {
    domain: string;
    percentage: number;
    rank: number;
    tokens: number;
}

export interface DomainDatum {
    [domain: string]: DomainData[];
}

interface Props {
    topDomains: DomainDatum;
}
export const DomainsTable = ({ topDomains }: Props) => {
    if (!topDomains || !Object.keys(topDomains).length) {
        return null;
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = Object.entries(topDomains)
        .flatMap(([k, _]) =>
            topDomains[k].map((v) => {
                return { ...v, dataset: k };
            })
        )
        .sort((a, b) => {
            if (b.percentage === a.percentage) {
                return b.rank - a.rank;
            }
            return b.percentage - a.percentage;
        });
    const maxPercent = rows.length ? rows[0].percentage : 1;

    return (
        <div>
            <TableContainer>
                <Table size="small" sx={{ width: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="overline">Domain</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="overline">Corpus</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '83px' }}>
                                <Typography variant="overline">Rank</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="overline">Tokens</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '166px' }}>
                                <Typography variant="overline">% of All Tokens</Typography>
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
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Typography>{v.domain}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{v.dataset}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography>{v.rank}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography>{v.tokens.toLocaleString()}</Typography>
                                        </TableCell>
                                        <BarCell
                                            align="center"
                                            num={v.percentage}
                                            maxNum={maxPercent}
                                        />
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {rows.length > 5 ? (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            ) : null}
        </div>
    );
};

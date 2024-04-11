import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';

import { Sets } from './Overlap';
import { BarCell } from './BarCell';

interface Props {
    sets: Sets[];
}

export const OverlapTable = ({ sets }: Props) => {
    if (!sets || !sets.length) {
        return null;
    }

    const rows = sets
        .filter((s) => s.subset.length > 1 && s.count > 0)
        .map((s) => {
            return { datasets: s.subset.join(', '), count: s.count };
        })
        .sort((a, b) => {
            if (b.count === a.count) {
                return b.datasets.localeCompare(a.datasets);
            }
            return b.count - a.count;
        });
    const maxCount = rows.length ? rows[0].count : 1;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box>
            <TableContainer>
                <Table size="small" sx={{ width: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="overline" sx={{ paddingRight: '50px' }}>
                                    Corpora
                                </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '200px' }}>
                                <Typography variant="overline">Overlap Count</Typography>
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
                                            <Typography>{v.datasets}</Typography>
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
        </Box>
    );
};

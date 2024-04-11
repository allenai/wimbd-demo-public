import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';

interface DatasetData {
    id: number;
    name: string;
    model: string;
    size: number;
    documentCount: number;
    tokenCount: number;
    maxTokens: number;
    minTokens: number;
    link: string;
}

interface Props {
    data: DatasetData[];
}

export const DatasetTable = ({ data }: Props) => {
    if (!data.length) {
        return null;
    }

    type Order = 'asc' | 'desc';
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof DatasetData>('id');

    const handleRequestSort = (property: keyof DatasetData) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: keyof DatasetData) => (_: React.MouseEvent<unknown>) => {
        handleRequestSort(property);
    };

    interface HeadCell {
        disablePadding: boolean;
        id: keyof DatasetData;
        label: string;
        numeric: boolean;
        align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    }

    const headCells: readonly HeadCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Corpus',
        },
        {
            id: 'model',
            numeric: false,
            disablePadding: false,
            label: 'Model',
        },
        {
            id: 'size',
            numeric: true,
            disablePadding: false,
            label: 'Size (GB)',
            align: 'right',
        },
        {
            id: 'documentCount',
            numeric: true,
            disablePadding: false,
            label: '# Documents',
            align: 'right',
        },
        {
            id: 'tokenCount',
            numeric: true,
            disablePadding: false,
            label: '# Tokens',
            align: 'right',
        },
        {
            id: 'maxTokens',
            numeric: true,
            disablePadding: false,
            label: 'max(# Tokens)',
            align: 'right',
        },
        {
            id: 'minTokens',
            numeric: true,
            disablePadding: false,
            label: 'min(# Tokens)',
            align: 'right',
        },
    ];

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key
    ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const visibleRows = React.useMemo(
        () => data.sort(getComparator(order, orderBy)),
        [order, orderBy]
    );

    return (
        <TableContainer>
            <Table size="small" sx={{ width: 'auto' }}>
                <caption>
                    Summary statistics of corpora, along with models trained on such dataset. The
                    number of tokens are calculated using unicode segmentation tokenizer. Models
                    noted with * signifies the model was not trained exactly on the version we
                    consider, either due to some filtering, using additional data, or the original
                    data being private.
                </caption>
                <TableHead>
                    <TableRow>
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                                align={headCell.align}>
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}>
                                    <Typography variant="overline">{headCell.label}</Typography>
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc'
                                                ? 'sorted descending'
                                                : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((v, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Typography>
                                    <Link to={v.link}>{v.name}</Link>
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{v.model}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>
                                    {v.size.toLocaleString(undefined, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    })}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{v.documentCount.toLocaleString()}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{v.tokenCount.toLocaleString()}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{v.maxTokens.toLocaleString()}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{v.minTokens.toLocaleString()}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

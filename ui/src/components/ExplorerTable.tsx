import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
    Typography,
    TableContainer,
    TableHead,
    Table,
    TableCell,
    TableRow,
    TableBody,
    Box,
    TablePagination,
    Tooltip,
} from '@mui/material';
import { darkCategoricalColor } from '@allenai/varnish2/theme';

import { CountedNgram, TopKDatum } from './Explorer';

interface Props {
    topK: TopKDatum;
}
export const ExplorerTable = ({ topK }: Props) => {
    if (!topK || !Object.keys(topK).length) {
        return null;
    }

    const { colorMap, nGramToCountPerDs } = useMemo(() => {
        const allWordCounts: { [word: string]: { dsCount: number; rankTotal: number } } = {};
        const nGramToCountPerDsTemp: {
            [word: string]: { [dsid: string]: number };
        } = {};
        Object.keys(topK).forEach((ds: string) => {
            topK[ds].forEach((t: CountedNgram, i: number) => {
                if (!allWordCounts[t.ng]) {
                    allWordCounts[t.ng] = { dsCount: 0, rankTotal: 0 };
                }
                allWordCounts[t.ng].dsCount++;
                // hold on to how common this term is to this datset for sorting later
                allWordCounts[t.ng].rankTotal += i;
                // now build a reverse look up form word to ds and count
                if (!nGramToCountPerDsTemp[t.ng]) {
                    nGramToCountPerDsTemp[t.ng] = {};
                }
                nGramToCountPerDsTemp[t.ng][ds] = t.c;
            });
        });
        interface WordCount {
            word: string;
            dsCount: number;
            rankTotal: number;
        }
        // Create items array
        const wordCounts: WordCount[] = Object.entries(allWordCounts).map(([word, value]) => {
            return { word, dsCount: value.dsCount, rankTotal: value.rankTotal };
        });
        // Sort the array based on commonality
        wordCounts.sort((first, second) => {
            // we want tothe items that are in the most datasets, tie break is the items with the lowest rank
            if (second.dsCount === first.dsCount) {
                return first.rankTotal - second.rankTotal;
            }
            return second.dsCount - first.dsCount;
        });
        const colorPicker = (count: number, index: number) => {
            const pal = [
                darkCategoricalColor.Red.hex,
                darkCategoricalColor.Orange.hex,
                darkCategoricalColor.Aqua.hex,
                darkCategoricalColor.Teal.hex,
                darkCategoricalColor.Blue.hex,
                darkCategoricalColor.Fuchsia.hex,
                darkCategoricalColor.Purple.hex,
                darkCategoricalColor.Green.hex,
            ];
            if (count < 2 || index >= pal.length) {
                return 'transparent';
            }
            return pal[index];
        };
        const colors: { [word: string]: string } = {};
        wordCounts.forEach((w, i) => {
            colors[w.word] = colorPicker(w.dsCount, i);
        });
        return { colorMap: colors, nGramToCountPerDs: nGramToCountPerDsTemp };
    }, [topK]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rowCount = topK[Object.keys(topK)[0]].length;

    const columnWidth = (1152 - 83) / Object.keys(topK).length - 8;

    if (!nGramToCountPerDs) {
        // still loading
        return null;
    }
    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 0.5, pr: 0.5 }}>
                                <Typography variant="overline">Rank</Typography>
                            </TableCell>
                            {Object.keys(topK).map((ds) => (
                                <TableCell sx={{ pl: 0.5, pr: 0.5 }} key={ds}>
                                    <Typography
                                        sx={{
                                            wordBreak: 'break-word',
                                            display: 'block',
                                            width: `${columnWidth}px`,
                                        }}
                                        variant="overline">
                                        {ds}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: rowsPerPage }, (v, k) => page * rowsPerPage + k).map(
                            (i) => (
                                <TableRow key={i}>
                                    <Cell sx={{ width: '83px' }}>
                                        <CellTypography key={`rank_${i}`}>{i + 1}</CellTypography>
                                    </Cell>
                                    {Object.keys(topK).map((ds) => (
                                        <Cell key={ds}>
                                            <Tooltip
                                                followCursor={false}
                                                placement="top"
                                                title={
                                                    <table>
                                                        <tr>
                                                            <td colSpan={2}>
                                                                <Box
                                                                    sx={{
                                                                        fontSize: '18px',
                                                                        borderBottom:
                                                                            '1px solid white',
                                                                    }}>
                                                                    {topK[ds][i].ng}
                                                                </Box>
                                                            </td>
                                                        </tr>
                                                        {Object.keys(topK).map((dsi) => {
                                                            return (
                                                                <tr
                                                                    key={ds + dsi}
                                                                    style={{
                                                                        outline:
                                                                            dsi === ds
                                                                                ? 'thin solid'
                                                                                : 'none',
                                                                    }}>
                                                                    <td>
                                                                        <Box sx={{ ml: 1 }}>
                                                                            {dsi}:
                                                                        </Box>
                                                                    </td>
                                                                    <td>
                                                                        <Box sx={{ mr: 1 }}>
                                                                            {(
                                                                                nGramToCountPerDs[
                                                                                    topK[ds][i].ng
                                                                                ][dsi] || 0
                                                                            ).toLocaleString()}
                                                                        </Box>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </table>
                                                }>
                                                <Box
                                                    sx={{
                                                        background: colorMap[topK[ds][i].ng],
                                                    }}>
                                                    <CellTypography
                                                        noWrap
                                                        sx={{ width: `${columnWidth}px` }}
                                                        key={`${ds}_${i}`}>
                                                        {topK[ds][i].ng}
                                                    </CellTypography>
                                                </Box>
                                            </Tooltip>
                                        </Cell>
                                    ))}
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {rowCount > 10 ? (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            ) : null}
        </div>
    );
};

const Cell = styled(TableCell)`
    &&& {
        padding: ${({ theme }) => `0 ${theme.spacing(0.5)}`};
    }
`;

const CellTypography = styled(Typography)`
    &&& {
        padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
    }
`;

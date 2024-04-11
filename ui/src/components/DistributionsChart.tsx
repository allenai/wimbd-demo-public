import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ResponsiveLine, SliceTooltipProps, Point } from '@nivo/line';
import { color2 } from '@allenai/varnish2/theme';
import { useTheme } from '@nivo/core';
import { Chip, TableTooltip } from '@nivo/tooltip';

import { DistributionData } from './Distributions';
import { DatasetMetadataMap } from '../pages/Home';

interface SeriesData {
    id: string;
    color: string;
    data: Daum[];
    order: number;
}

interface Daum {
    x: number;
    y: number;
}

interface Props {
    data: DistributionData;
    datasetMap: DatasetMetadataMap;
}

export const DistributionsChart = ({ data, datasetMap }: Props) => {
    if (!data || !Object.keys(data).length) {
        return null;
    }

    const theme = useMuiTheme();
    const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));

    const [cleanData, setCleanData] = useState<SeriesData[]>([]);
    useEffect(() => {
        const cleaned: SeriesData[] = Object.entries(data).map(([k, v]) => {
            return {
                id: k,
                order: datasetMap[k].order,
                color: datasetMap[k].color,
                data: v.map((na) => {
                    return { x: na[0], y: na[1] };
                }),
            };
        });
        cleaned.sort((a, b) => b.order - a.order);

        setCleanData(cleaned);
    }, [data, datasetMap]);

    const text = {
        fontSize: 16,
        fill: color2.N5.hex,
    };

    const legendItemHeight = 20;

    return (
        <ChartContainer
            $legendHeight={cleanData.length * legendItemHeight}
            $legendOnRight={greaterThanSm}>
            <ResponsiveLine
                theme={{
                    axis: {
                        legend: {
                            text: { ...text, fontWeight: 'bold' },
                        },
                        ticks: {
                            text,
                        },
                    },
                    legends: {
                        title: {
                            text,
                        },
                        text,
                        ticks: {
                            text,
                        },
                    },
                }}
                data={cleanData}
                margin={{
                    top: 20,
                    right: greaterThanSm ? 140 : 20,
                    bottom: greaterThanSm ? 60 : 80 + legendItemHeight * cleanData.length,
                    left: 90,
                }}
                xScale={{ type: 'log', min: 'auto', max: 330000 }}
                yScale={{
                    type: 'linear',
                }}
                yFormat={(v) =>
                    Number(v).toLocaleString(undefined, {
                        style: 'percent',
                        maximumSignificantDigits: 2,
                    })
                }
                sliceTooltip={SliceTooltip}
                axisBottom={{
                    format: (v) => Number(v).toLocaleString(),
                    tickValues: greaterThanSm
                        ? [0, 10, 100, 1000, 10000, 100000]
                        : [0, 10, 1000, 100000],
                    tickSize: 5,
                    tickPadding: 5,
                    legend: 'Characters per Document',
                    legendOffset: 45,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    format: (v) =>
                        Number(v).toLocaleString(undefined, {
                            style: 'percent',
                            maximumFractionDigits: 2,
                        }),
                    tickSize: 5,
                    tickPadding: 5,
                    legend: '% of Documents',
                    legendOffset: -70,
                    legendPosition: 'middle',
                }}
                colors={(d) => d.color}
                enablePoints={false}
                enableGridX={false}
                enableSlices="x"
                legends={[
                    {
                        anchor: greaterThanSm ? 'bottom-right' : 'bottom-left',
                        direction: 'column',
                        justify: false,
                        translateX: greaterThanSm ? 140 : 0,
                        translateY: greaterThanSm ? 0 : 75 + legendItemHeight * cleanData.length,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 130,
                        itemHeight: legendItemHeight,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'square',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    },
                ]}
            />
        </ChartContainer>
    );
};

const ChartContainer = styled.div<{ $legendHeight: number; $legendOnRight: boolean }>`
    height: ${({ $legendHeight, $legendOnRight }) =>
        $legendOnRight ? '400px' : `${400 + $legendHeight}px`};
`;

// edited default slice ui to remove duplicates
const SliceTooltip = ({ slice, axis }: SliceTooltipProps) => {
    const theme = useTheme();
    const otherAxis = axis === 'x' ? 'y' : 'x';
    // remove dupes (show max)
    const filteredPoints: { [index: string]: Point } = {};
    slice.points.forEach((p: Point) => {
        const val = filteredPoints[p.serieId] ? Number(filteredPoints[p.serieId].data.y) : 0;
        if (Number(p.data.y) > val) {
            filteredPoints[p.serieId] = p;
        }
    });
    return (
        <TableTooltip
            title={
                <div>{Object.values(filteredPoints)[0].data.xFormatted} Tokens per Document</div>
            }
            rows={Object.values(filteredPoints).map((point: Point) => [
                <Chip key="chip" color={point.serieColor} style={theme.tooltip.chip} />,
                point.serieId,
                <span key="value" style={theme.tooltip.tableCellValue}>
                    {point.data[`${otherAxis}Formatted`]}
                </span>,
            ])}
        />
    );
};

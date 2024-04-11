import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as venn from '@upsetjs/venn.js';
import { Box } from '@mui/material';
import { color2 } from '@allenai/varnish2/theme';

import { Sets } from './Overlap';
import { DatasetMetadataMap } from '../pages/Home';

interface Props {
    sets: Sets[];
    datasetMap: DatasetMetadataMap;
}

export const OverlapVenn = ({ sets, datasetMap }: Props) => {
    if (!sets || !sets.length) {
        return null;
    }
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const chart = venn.VennDiagram();
        chart.width(675);
        chart.height(300);
        chart.fontSize('20px');

        if (ref && ref.current && sets.length) {
            d3.select(ref.current)
                .datum(
                    sets.map((s) => {
                        return { sets: s.subset, size: s.count };
                    })
                )
                .call(chart as any);

            d3.select(ref.current)
                .selectAll('.venn-circle path')
                .style('fill-opacity', 0.1)
                .style('stroke-width', 1)
                .style('stroke', (d: any) => {
                    return datasetMap[d.sets[0]].color;
                })
                .style('fill', (d: any) => {
                    return datasetMap[d.sets[0]].color;
                });

            d3.select(ref.current)
                .selectAll('text')
                .style('fill', color2.N5.hex)
                .style('stroke', (d: any) => {
                    return datasetMap[d.sets[0]].color;
                })
                .style('font-weight', '100');

            d3.select(ref.current)
                .selectAll('.venn-circle')
                .on('mouseenter', function () {
                    const node = d3.select(this).transition();
                    node.select('path').style('fill-opacity', 0.2);
                    node.select('text').style('font-weight', '200').style('font-size', '24px');
                })
                .on('mouseleave', function () {
                    const node = d3.select(this).transition();
                    node.select('path').style('fill-opacity', 0.1);
                    node.select('text').style('font-weight', '100').style('font-size', '20px');
                });

            const vennSvg = ref.current.children[0];
            vennSvg.removeAttribute('height');
            vennSvg.removeAttribute('width');
            vennSvg.setAttribute('viewBox', `0 0 ${chart.width()} ${chart.height()}`);
            vennSvg.setAttribute('preserveAspectRatio', 'xMaxYMin meet');
            vennSvg.setAttribute('class', 'svg-content-responsive');
        }
    }, [ref, sets]);
    return <Box ref={ref}></Box>;
};

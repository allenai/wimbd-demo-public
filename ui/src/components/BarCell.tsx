import React from 'react';
import styled from 'styled-components';
import { Typography, TableCell, Box, TableCellProps } from '@mui/material';
import { color2 } from '@allenai/varnish2/theme';

export const getPercentString = (num: number) => {
    return `${(num * 100).toPrecision(2)}%`;
};

interface Props extends TableCellProps {
    num: number;
    maxNum?: number;
    format?: (num: number) => string;
    className?: string;
}
export const BarCell = ({
    num,
    format = getPercentString,
    maxNum = 1,
    className,
    ...rest
}: Props) => {
    return (
        <Container className={className} {...rest}>
            <Box
                sx={{
                    height: '67%',
                    margin: 'auto 0',
                    background: `linear-gradient(to right, ${color2.B4} ${getPercentString(
                        num / maxNum
                    )}, ${color2.B1} ${getPercentString(num / maxNum)})`,
                }}></Box>
            <Typography>{format(num)}</Typography>
        </Container>
    );
};

const Container = styled(TableCell)`
    &&& {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${({ theme }) => theme.spacing(0.5)};
    }
`;

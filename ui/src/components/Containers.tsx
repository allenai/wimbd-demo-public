import styled from 'styled-components';
import { Box } from '@mui/material';
import { Content, MaxWidthText } from '@allenai/varnish2/components';

export const FullWidth = styled.div`
    background: white;
    padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(4)};
`;

export const FullWidthLight = styled(FullWidth)`
    background: ${({ theme }) => theme.color2.N1};
`;

export const FullWidthMedium = styled(FullWidth)`
    background: ${({ theme }) => theme.color2.N2};
`;

export const Hero = styled(FullWidth)`
    background: ${({ theme }) => theme.color2.B4};
    text-align: center;
`;

export const HeroTitle = styled.h1`
    margin: 0;
    padding: 0;
    color: white;

    small {
        font-weight: 100;
    }
`;

export const Section = styled(Content)`
    padding: ${({ theme }) => theme.spacing(5)} 0;
`;

export const SectionTitle = styled.h3`
    margin: auto 0;
    text-align: center;
    padding: 0;
`;

export const SectionFlex = styled.div`
    display: flex;
    justify-content: center;
`;

export const CenteredSectionContent = styled(Box)`
    // background: white;
    padding: ${({ theme }) => theme.spacing(3)};
    max-width: 100%;
`;

export const PaddedImg = styled.img`
    width: 100%;
    margin: auto 0;
    max-height: 200px;

    ${({ theme }) => theme.breakpoints.up('md')} {
        max-height: 300px;
    }
`;

export const CenteredImageContent = styled(Box)`
    // background: white;
    padding: ${({ theme }) => theme.spacing(1)};
    max-width: 20%;
    // margin: -50px;
`;

export const AuthorImg = styled.img`
    width: 100%;
    margin: 0px;
    max-height: 30px;

    ${({ theme }) => theme.breakpoints.up('md')} {
        max-height: 165px;
    }
`;

export const CenteredTextBlock = styled(MaxWidthText)`
    && {
        margin: 0 auto;
    }
`;

export const Options = styled(MaxWidthText)`
    max-width: 100%;
    margin: 0 auto;
`;

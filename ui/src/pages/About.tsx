import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import {
    CenteredTextBlock,
    Hero,
    HeroTitle,
    CenteredImageContent,
    AuthorImg,
    SectionFlex,
    SectionTitle,
} from '../components/Containers';

import yanai from '../images/yanai.png';
import akshita from '../images/akshita.png';
import ian from '../images/ian.png';
import abhilasha from '../images/abhilasha.png';
import dustin from '../images/dustin.png';
import alane from '../images/alane.png';
import pete from '../images/pete.png';
import dirk from '../images/dirk.png';
import luca from '../images/luca.png';
import sameer from '../images/sameer.png';
import hanna from '../images/hanna.png';
import noah from '../images/noah.png';
import jesse from '../images/jesse.png';

/// ///////////////

interface Props {
    name: string;
    imgSrc: string;
    link: string;
}

const AuthorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Author = ({ name, imgSrc, link }: Props) => {
    return (
        <AuthorContainer>
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <Typography variant="body2" gutterBottom>
                    {name}
                </Typography>
            </a>
            <AuthorImg src={imgSrc} alt={name} />
        </AuthorContainer>
    );
};

export const About = () => {
    return (
        <div>
            <Hero>
                <HeroTitle>About WIMBD</HeroTitle>
            </Hero>
            <CenteredTextBlock>
                <Typography component="p" sx={{ m: 4 }}>
                    This is the project page website for the "What's In My Big Data?" (WIMBD)
                    project. You can learn more about it in our{' '}
                    <Link to="http://arxiv.org/abs/2310.20707">paper</Link>.
                </Typography>{' '}
                <Typography component="p" sx={{ m: 4 }}>
                    Large text corpora are the backbone of language models. However, we have a
                    limited understanding of the content of these corpora, including general
                    statistics, quality, social factors, and inclusion of evaluation data
                    (contamination). What's In My Big Data? (WIMBD), is a platform and a set of 16
                    high-level analyses that allow us to reveal and compare the contents of large
                    text corpora. WIMBD builds on two basic capabilities---count and search---at
                    scale, which allows us to analyze more than 35 terabytes on a standard compute
                    node.
                </Typography>
                <Typography component="p" sx={{ m: 4 }}>
                    We apply WIMBD to 10 different corpora used to train popular language models,
                    including C4, The Pile, and RedPajama. Our analysis uncovers several surprising
                    and previously undocumented findings about these corpora, including the high
                    prevalence of duplicate, synthetic, and low-quality content, personally
                    identifiable information, toxic language, and benchmark contamination. We
                    open-source WIMBD code and artifacts to provide a standard set of evaluations
                    for new text-based corpora and to encourage more analyses and transparency
                    around them.
                    <br />
                    Our goal is to build better scientific practices around data and use WIMBD to
                    inform data decisions to clean and filter large-scale datasets, as well as to
                    document existing ones.
                </Typography>{' '}
                <Typography component="p" sx={{ m: 4 }}>
                    WIMBD was developed by researchers from the Allen Institute for AI, Universiry
                    of Washington, University of California, Berkeley, and University of California,
                    Irvine.
                </Typography>{' '}
            </CenteredTextBlock>
            <SectionFlex>
                <CenteredImageContent>
                    {/* Author from the Fig1Src image and a text saying "Yanai" */}
                    <Author name="Yanai Elazar" imgSrc={yanai} link="https://yanaiela.github.io/" />
                    {/* <Author name="Yanai" imgSrc={Fig1Src} /> */}
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Akshita Bhagia"
                        imgSrc={akshita}
                        link="https://akshitab.github.io/"
                    />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Ian Magnusson"
                        imgSrc={ian}
                        link="https://ianmagnusson.github.io/"
                    />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Abhilasha Ravichander"
                        imgSrc={abhilasha}
                        link="https://www.cs.cmu.edu/~aravicha/"
                    />
                </CenteredImageContent>
            </SectionFlex>
            <SectionFlex>
                <CenteredImageContent>
                    <Author
                        name="Dustin Schwenk"
                        imgSrc={dustin}
                        link="https://scholar.google.com/citations?user=4yiNcJyuYb4C&hl=en"
                    />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author name="Alane Suhr" imgSrc={alane} link="https://www.alanesuhr.com/" />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author name="Pete Walsh" imgSrc={pete} link="https://medium.com/@epwalsh10" />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Dirk Groeneveld"
                        imgSrc={dirk}
                        link="https://scholar.google.com/citations?user=KEhvGNMAAAAJ&hl=en"
                    />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author name="Luca Soldaini" imgSrc={luca} link="https://soldaini.net/" />
                </CenteredImageContent>
            </SectionFlex>
            <SectionFlex>
                <CenteredImageContent>
                    <Author name="Sameer Singh" imgSrc={sameer} link="https://sameersingh.org/" />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Hannaneh Hajishirzi"
                        imgSrc={hanna}
                        link="https://homes.cs.washington.edu/~hannaneh/"
                    />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author name="Noah A. Smith" imgSrc={noah} link="https://nasmith.github.io/" />
                </CenteredImageContent>
                <CenteredImageContent>
                    <Author
                        name="Jesse Dodge"
                        imgSrc={jesse}
                        link="https://jessedodge.github.io/"
                    />
                </CenteredImageContent>
            </SectionFlex>
            {/* <Hero><HeroTitle>Cite us</HeroTitle></Hero> */}
            <SectionFlex>
                <CenteredTextBlock>
                    <br/><br/>
                    <SectionTitle>Cite Us</SectionTitle>
                    <CodeBlock>{`@inproceedings{elazar2023s,
    title={What's In My Big Data?},
    author={Elazar, Yanai and Bhagia, Akshita and Magnusson, Ian Helgi and Ravichander, Abhilasha and Schwenk, Dustin and Suhr, Alane and Walsh, Evan Pete and Groeneveld, Dirk and Soldaini, Luca and Singh, Sameer and Hajishirzi, Hanna and Smith, Noah A. and Dodge, Jesse},
    booktitle={The Twelfth International Conference on Learning Representations},
    year={2023}
}`}
               </CodeBlock>
               </CenteredTextBlock>
            </SectionFlex>
        </div>
        
);

};


const CodeBlock = styled.pre`
    max-height: 500px;
    max-width: 100%;
    white-space: pre-wrap;
    overflow: auto;
    font-family: monospace;
    padding: 24px;
    background-color: rgb(34, 51, 103);
    color: rgb(255, 255, 255);
`;

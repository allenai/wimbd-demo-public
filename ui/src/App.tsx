import React, { useState } from 'react';
import styled from 'styled-components';
import { Route, Link, Routes, useLocation } from 'react-router-dom';
import { Header, Content, Footer } from '@allenai/varnish2/components';
import {
    Toolbar,
    List,
    IconButton,
    Drawer,
    ListItem,
    ListItemButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { About } from './pages/About';
import { Corpora } from './pages/Corpora';
import { Home } from './pages/Home';
import { AppRoute, RouteLink } from './AppRoute';
import logoSrc from './images/logo.svg';

const ROUTES: AppRoute[] = [
    {
        path: '/',
        label: 'Home',
        Component: Home,
    },
    {
        path: '/about',
        label: 'About',
        Component: About,
    },
    {
        path: '/corpora',
        label: 'Corpora',
        Component: Corpora,
    },
];

// these are examples... you can ad more links here, and delete the example links
const AdditionalLinks: RouteLink[] = [
    {
        path: 'http://arxiv.org/abs/2310.20707',
        label: 'Paper',
    },
    {
        path: 'https://console.cloud.google.com/storage/browser/wimbd',
        label: 'Artifacts',
    },
    {
        path: 'https://github.com/allenai/wimbd',
        label: 'Code',
    },
];

export const App = () => {
    // Used to query the current page the user is on
    const location = useLocation();

    // Used to open and close the menu
    const [menuOpen, setMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const theme = useTheme();
    const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div>
            <Header>
                <Header.Columns columns="auto 1fr auto">
                    <Header.Logo label={<Header.AppName>WIMBD</Header.AppName>}>
                        <Logo src={logoSrc} />
                    </Header.Logo>
                    <span />
                    <Toolbar variant="dense">
                        {greaterThanMd ? (
                            <>
                                {[...ROUTES, ...AdditionalLinks].map(({ path, label }) => (
                                    <Link key={path + label} to={path}>
                                        <ListItemButton selected={location.pathname === path}>
                                            {label}
                                        </ListItemButton>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <>
                                {[...ROUTES, ...AdditionalLinks].length > 1 ? (
                                    <>
                                        <IconButton edge="end" onClick={handleMenuToggle}>
                                            <MenuIcon />
                                        </IconButton>
                                        <Drawer
                                            variant="temporary"
                                            anchor="right"
                                            open={menuOpen}
                                            onClose={handleMenuToggle}
                                            ModalProps={{
                                                keepMounted: true, // Better open performance on mobile
                                            }}>
                                            <Menu>
                                                {[...ROUTES, ...AdditionalLinks].map(
                                                    ({ path, label }) => (
                                                        <ListItem key={path + label} disablePadding>
                                                            <Link
                                                                to={path}
                                                                onClick={handleMenuToggle}>
                                                                <DrawerMenuButton
                                                                    selected={
                                                                        location.pathname === path
                                                                    }>
                                                                    {label}
                                                                </DrawerMenuButton>
                                                            </Link>
                                                        </ListItem>
                                                    )
                                                )}
                                            </Menu>
                                        </Drawer>
                                    </>
                                ) : null}
                            </>
                        )}
                    </Toolbar>
                </Header.Columns>
            </Header>
            <WideContent main>
                <Routes>
                    {ROUTES.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                </Routes>
            </WideContent>
            <Footer />
        </div>
    );
};

const WideContent = styled(Content)`
    max-width: unset;
    padding: 0;
`;

const Menu = styled(List)`
    && {
        margin-top: ${({ theme }) => theme.spacing(3)};
    }
`;

const DrawerMenuButton = styled(ListItemButton)`
    && {
        min-width: 180px;
        max-width: 240px;
    }
`;

const Logo = styled.img`
    width: 53px;
    height: 53px;
`;

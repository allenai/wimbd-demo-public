/**
 * This is the main entry point for the UI. You should not need to make any
 * changes here unless you want to update the theme.
 *
 * @see https://github.com/allenai/varnish-mui
 */

import React from 'react';
import { VarnishApp } from '@allenai/varnish2/components';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { ScrollToTopOnPageChange } from './components/ScrollToTopOnPageChange';
import { ScrollToAnchor } from './components/ScrollToAnchor';

const VarnishedApp = () => (
    <BrowserRouter>
        <ScrollToTopOnPageChange />
        <ScrollToAnchor />
        <VarnishApp>
            <App />
        </VarnishApp>
    </BrowserRouter>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<VarnishedApp />);

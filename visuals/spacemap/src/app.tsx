import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceMap } from './components/SpaceMap';
import { parseConfigFromUrl } from './config';

const config = parseConfigFromUrl(window.location.search);

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<SpaceMap config={config} />);

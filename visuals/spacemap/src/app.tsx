import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceMap } from './components/SpaceMap';
import { parseConfigFromUrl } from './config';
import { THINGS_BY_ID } from './orbital/catalog';
import { Thing } from './orbital/thing';

// For poking at orbit data from the browser console, eg
// THINGS_BY_ID.get('sedna').position(new Date()).
declare global {
    interface Window {
        THINGS_BY_ID: typeof THINGS_BY_ID;
        Thing: typeof Thing;
    }
}
window.THINGS_BY_ID = THINGS_BY_ID;
window.Thing = Thing;

const config = parseConfigFromUrl(window.location.search);

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<SpaceMap config={config} />);

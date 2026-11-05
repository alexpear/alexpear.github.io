# BlockScout

A mobile web game showing the player's GPS position on a Leaflet/OSM map. Objectives are placed at every 0.01° grid intersection. Open `blockscout.html` in a browser to play.

-   TypeScript compiled with `tsc` to `dist/`, then bundled with Browserify to `dist/bundle.js`
-   Leaflet is loaded via CDN and accessed as a global (`declare const L: any`), not imported
-   Uses ES2020, non-strict TypeScript (`tsconfig.json`)

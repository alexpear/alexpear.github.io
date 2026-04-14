// Visual test for overviewColor(). Run via `npm run colorTest`.
// Outputs color-test.html — open it in a browser to inspect the gradient.

import * as fs from 'fs';
import * as path from 'path';
import { overviewColor } from '../dist/blockscout';

const STEP = 10;
const inputs: number[] = [];
for (let p = 0; p <= 1000; p += STEP) {
    inputs.push(p);
}

const stripCells = inputs
    .map((p) => {
        const c = overviewColor(p);
        return `<div title="${p} pts: ${c}" style="flex:1;height:60px;background:${c}"></div>`;
    })
    .join('');

const labeledRows = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    .map((p) => {
        const c = overviewColor(p);
        return `<tr>
        <td>${p}</td>
        <td><div style="width:120px;height:28px;background:${c};border:1px solid #444"></div></td>
        <td style="font-family:monospace">${c}</td>
    </tr>`;
    })
    .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>overviewColor() visual test</title>
<style>
    body { background:#222; color:#ddd; font-family:sans-serif; padding:24px; }
    h2 { color:white; margin-bottom:6px; }
    p { color:#888; font-size:13px; margin-top:0; }
    .strip { display:flex; width:100%; max-width:900px; border:1px solid #555; margin-bottom:32px; }
    table { border-collapse:collapse; }
    th { text-align:left; padding:6px 16px 6px 0; color:#aaa; font-size:13px; }
    td { padding:5px 16px 5px 0; font-size:13px; }
</style>
</head>
<body>
<h2>overviewColor() — full gradient (0–1000, step ${STEP})</h2>
<p>Hover a cell to see its points value and rgb string.</p>
<div class="strip">${stripCells}</div>

<h2>Labeled swatches</h2>
<table>
    <thead><tr><th>points</th><th>color</th><th>rgb</th></tr></thead>
    <tbody>${labeledRows}</tbody>
</table>
</body>
</html>`;

const outPath = path.join(__dirname, 'color-test.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Written: ${outPath}`);

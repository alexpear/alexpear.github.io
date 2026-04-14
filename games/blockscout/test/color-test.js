"use strict";
// Visual test for overviewColor(). Run via `npm run colorTest`.
// Outputs color-test.html — open it in a browser to inspect the gradient.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const blockscout_1 = require("../dist/blockscout");
const STEP = 10;
const inputs = [];
for (let p = 0; p <= 1000; p += STEP) {
    inputs.push(p);
}
const stripCells = inputs
    .map((p) => {
    const c = (0, blockscout_1.overviewColor)(p);
    return `<div title="${p} pts: ${c}" style="flex:1;height:60px;background:${c}"></div>`;
})
    .join('');
const labeledRows = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    .map((p) => {
    const c = (0, blockscout_1.overviewColor)(p);
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

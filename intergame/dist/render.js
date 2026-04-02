"use strict";
// Renders an MtGConcept as an HTML string for a card.html page.
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCard = exports.parseManaSymbols = void 0;
// Converts {W}, {2}, {T} etc. to mana-font <i> tags.
// inCost=true adds ms-cost (colored circle) for the name bar display.
function parseManaSymbols(text, inCost = false) {
    const extra = inCost ? ' ms-cost ms-shadow' : '';
    return text.replace(/\{([^}]+)\}/g, (_, sym) => {
        const cls = sym.toLowerCase().replace('/', '');
        return `<i class="ms ms-${cls}${extra}"></i>`;
    });
}
exports.parseManaSymbols = parseManaSymbols;
function frameClass(colors) {
    if (!colors)
        return 'frame-c';
    if (colors.length > 1)
        return 'frame-m';
    return `frame-${colors[0].toLowerCase()}`;
}
function oracleToHtml(text) {
    if (!text)
        return '';
    return text
        .split('\n')
        .map((para) => `<p>${parseManaSymbols(para)}</p>`)
        .join('');
}
function renderCard(card) {
    const frame = frameClass(card.colors);
    const cost = parseManaSymbols(card.costString, true);
    const oracle = oracleToHtml(card.oracleText);
    const hasPT = card.power !== undefined && card.toughness !== undefined;
    return `<div class="mtg-card ${frame}">
  <div class="card-inner">
    <div class="card-header">
      <div class="card-name">${card.name}</div>
      <div class="card-cost">${cost}</div>
    </div>
    <div class="card-art"></div>
    <div class="card-typeline">
      <div class="card-type">${card.typeLine}</div>
    </div>
    <div class="card-textbox">
      <div class="oracle-text">${oracle}</div>
    </div>
    <div class="card-footer">
      <div class="card-info">&#x2605; Wizards of the Coast</div>
      ${hasPT ? `<div class="card-pt">${card.power}/${card.toughness}</div>` : ''}
    </div>
  </div>
</div>`;
}
exports.renderCard = renderCard;

// Browser entry point: renders sample MTG cards into #card-container.

import MtGConcept from './mtgconcept';
import { renderCard } from './render';

function makeCard(
    name: string,
    costString: string,
    typeLine: string,
    oracleText: string,
    colors: string,
    power?: number,
    toughness?: number,
): MtGConcept {
    const card = new MtGConcept();
    card.name = name;
    card.costString = costString;
    card.typeLine = typeLine;
    card.oracleText = oracleText;
    card.colors = colors;
    card.power = power;
    card.toughness = toughness;
    return card;
}

const SAMPLE_CARDS: MtGConcept[] = [
    makeCard(
        'Baneslayer Angel',
        '{3}{W}{W}',
        'Creature — Angel',
        'Flying, first strike, lifelink, protection from Demons and from Dragons',
        'w',
        5,
        5,
    ),
    makeCard('Counterspell', '{U}{U}', 'Instant', 'Counter target spell.', 'u'),
    makeCard(
        'Nyx Weaver',
        '{1}{B}{G}',
        'Enchantment Creature — Spider',
        'Reach, deathtouch\n{1}{B}{G}, Exile Nyx Weaver: Return target card from your graveyard to your hand.',
        'bg',
        2,
        3,
    ),
    makeCard(
        'Lightning Bolt',
        '{R}',
        'Instant',
        'Lightning Bolt deals 3 damage to any target.',
        'r',
    ),
    makeCard(
        'Llanowar Elves',
        '{G}',
        'Creature — Elf Druid',
        '{T}: Add {G}.',
        'g',
        1,
        1,
    ),
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('card-container');
    if (!container) return;
    container.innerHTML = SAMPLE_CARDS.map(renderCard).join('\n');
});

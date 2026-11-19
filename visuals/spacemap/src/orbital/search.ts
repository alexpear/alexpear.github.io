// Name search over the catalog, for the map's searchbar. Tolerates typos
// (eg 'uranis' for 'uranus') and matches each Thing's aliases too.

import { Thing } from './thing';
import { Resident } from './types';

export interface SearchResult {
    // The Thing to select for this result: the match itself, or for a
    // resident, the Thing it's at (eg Mars, for Perseverance).
    thing: Thing;
    // Set when what matched is one of `thing`'s residents.
    resident?: Resident;
    // Set when an alias (eg '2003 AZ84') matched better than the Thing's
    // own name, so the results list can say why this Thing is in it.
    matchedAlias?: string;
}

// Match quality tiers, best first. A fuzzy match's score is FUZZY plus its
// edit distance, so fewer typos rank higher.
const EXACT = 0;
const PREFIX = 1;
const WORD_PREFIX = 2; // eg 'tuttle' or 'earth l1'
const SUBSTRING = 3;
const FUZZY = 4;

// Lowercase, accents stripped, dashes to spaces, all other punctuation
// dropped - so 'swift-tuttle' finds 'Swift–Tuttle', 'halleys' finds
// "Halley's Comet", and 'gkunhomdima' finds "G!kún||'hòmdímà".
function normalize(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[-–—]/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// How many typos a query of this length is allowed. None for very short
// queries, where almost anything is within 1 edit of almost anything.
function maxTypos(queryLength: number): number {
    if (queryLength < 4) {
        return 0;
    }
    return queryLength < 7 ? 1 : 2;
}

// The fewest edits (insert, delete, substitute, or swap 2 adjacent
// characters) that turn `query` into some prefix of `target` - a prefix,
// not the whole thing, so a query still matches while it's only partly
// typed (eg 'uranis' vs 'uranus', but also 'urnau' vs 'uranus').
function prefixEditDistance(
    query: string,
    target: string,
    maxDistance: number,
): number {
    // No prefix longer than this could be within maxDistance anyway.
    target = target.slice(0, query.length + maxDistance);
    // rows[i][j]: edits to turn query's first i chars into target's first j.
    const rows: number[][] = [];
    for (let i = 0; i <= query.length; i++) {
        rows.push([i]);
        for (let j = 1; j <= target.length; j++) {
            if (i === 0) {
                rows[i].push(j);
                continue;
            }
            const substitutionCost = query[i - 1] === target[j - 1] ? 0 : 1;
            let best = Math.min(
                rows[i - 1][j] + 1,
                rows[i][j - 1] + 1,
                rows[i - 1][j - 1] + substitutionCost,
            );
            if (
                i > 1 &&
                j > 1 &&
                query[i - 1] === target[j - 2] &&
                query[i - 2] === target[j - 1]
            ) {
                best = Math.min(best, rows[i - 2][j - 2] + 1);
            }
            rows[i].push(best);
        }
    }
    return Math.min(...rows[query.length]);
}

// How well `query` matches `key` (both normalized): lower is better,
// undefined is no match at all.
function matchScore(query: string, key: string): number | undefined {
    if (key === query) {
        return EXACT;
    }
    if (key.startsWith(query)) {
        return PREFIX;
    }
    if (key.includes(` ${query}`)) {
        return WORD_PREFIX;
    }
    if (key.includes(query)) {
        return SUBSTRING;
    }
    const allowed = maxTypos(query.length);
    if (allowed === 0) {
        return undefined;
    }
    // Checked against the key from each of its words onward, so a typo'd
    // 'tutle' still finds 'swift tuttle'.
    let fewestTypos = Infinity;
    let wordStart = 0;
    while (wordStart >= 0 && wordStart < key.length) {
        fewestTypos = Math.min(
            fewestTypos,
            prefixEditDistance(query, key.slice(wordStart), allowed),
        );
        const nextSpace = key.indexOf(' ', wordStart);
        wordStart = nextSpace < 0 ? -1 : nextSpace + 1;
    }
    return fewestTypos <= allowed ? FUZZY + fewestTypos : undefined;
}

// How well `query` matches `name` or any of its `aliases`, and which alias
// if one of those matched best - or undefined if none match.
function bestMatch(
    query: string,
    name: string,
    aliases: string[],
): { score: number; matchedAlias?: string } | undefined {
    let score = matchScore(query, normalize(name));
    let matchedAlias: string | undefined;
    for (const alias of aliases) {
        const aliasScore = matchScore(query, normalize(alias));
        if (
            aliasScore !== undefined &&
            (score === undefined || aliasScore < score)
        ) {
            score = aliasScore;
            matchedAlias = alias;
        }
    }
    return score === undefined ? undefined : { score, matchedAlias };
}

// Every catalog Thing (and resident - see Thing.residents) matching
// `rawQuery` and on the map at `date`, best match first. Leaving out what
// isn't on the map means eg a spacecraft is only found while it's flying.
// Ties go to the physically bigger Thing, as a stand-in for the
// better-known one: 'ganyme' lists Jupiter's Ganymede above the asteroid
// Ganymed, while 'ganymed' (an exact match) lists the asteroid first.
export function searchThings(rawQuery: string, date: Date): SearchResult[] {
    const query = normalize(rawQuery);
    if (query === '') {
        return [];
    }
    const scored: { result: SearchResult; score: number; size: number }[] = [];
    for (const thing of Thing.MAIN_THINGS) {
        if (!thing.isPresentAt(date)) {
            continue;
        }
        const match = bestMatch(query, thing.name, thing.aliases);
        if (match) {
            scored.push({
                result: { thing, matchedAlias: match.matchedAlias },
                score: match.score,
                size: thing.diameterKm ?? 0,
            });
        }
        for (const resident of thing.residentsAt(date)) {
            const residentMatch = bestMatch(
                query,
                resident.name,
                resident.aliases ?? [],
            );
            if (residentMatch) {
                scored.push({
                    result: {
                        thing,
                        resident,
                        matchedAlias: residentMatch.matchedAlias,
                    },
                    score: residentMatch.score,
                    size: 0,
                });
            }
        }
    }
    return scored
        .sort((a, b) => a.score - b.score || b.size - a.size)
        .map((entry) => entry.result);
}

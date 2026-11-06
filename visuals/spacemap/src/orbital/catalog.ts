// import { lagrange } from './lagrangePoints';
import { MAIN_THINGS, SOL } from './things';
import { Thing } from './thing';

// Computed here rather than cataloged, since a Lagrange point is
// just a derived position, not a Thing with its own data to list.
// const LAGRANGE_POINTS: Thing[] = [
//     lagrange(SOL, EARTH, 1),
//     lagrange(SOL, EARTH, 2),
//     lagrange(SOL, EARTH, 4),
//     lagrange(SOL, EARTH, 5),
//     // lagrange(SOL, JUPITER, 4),
//     // lagrange(SOL, JUPITER, 5),
// ];

// Sol and the planets are the map's always-visible base layer (for
// orientation), drawn whether or not they're focused. Everything else only
// appears when focused.
export const BASE_LAYER: Thing[] = [SOL, ...MAIN_THINGS];

// export const FOCUSABLE_EXTRAS: Thing[] = [/*...JUPITER_MOONS,*/ ...LAGRANGE_POINTS];

export const ALL_THINGS: Thing[] = [...BASE_LAYER /*, ...FOCUSABLE_EXTRAS*/];

export const THINGS_BY_ID: ReadonlyMap<string, Thing> = new Map(
    ALL_THINGS.map((thing) => [thing.id, thing]),
);

export const DEFAULT_FOCUS_IDS: string[] = [
    SOL.id,
    ...MAIN_THINGS.map((planet) => planet.id),
];

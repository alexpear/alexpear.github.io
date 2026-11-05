import {
    Body,
    // JupiterMoons,
    // JupiterMoonsInfo,
    // StateVector,
} from 'astronomy-engine';
// import {
//     // eclipticPositionAu,
//     toEclipticPoint,
//     // tracedOrbitPathAu,
// } from './positions';
// import { Point2D } from './types';
import {Thing} from './thing';

// Sol itself: fixed at the ecliptic origin, so no orbit to trace.
export const SOL = new Thing('Sol', Body.Sun, 'star', '#ffd27f', 0);

// {
//     id: 'sol',
//     name: 'Sol',
//     colorHex: '#ffd27f',
//     kind: 'star',
//     body: Body.Sun,
//     positionAu: () => ({ x: 0, y: 0 }),
// };

// NOTE - old, we already have interface Thing
// interface ThingListing {
//     id: string;
//     body: Body;
//     name: string;
//     color: string;
//     orbitalPeriodDays: number;
// }

// TODO put all Things here, such as the Galilean moons, not just planets. Rename.
export const MAIN_THINGS: Thing[] = [
// const PLANET_DEFS: PlanetDef[] = [
    new Thing ('Mercury', Body.Mercury, 'planet', '#9e9e9e', 87.969),
    new Thing('Venus', Body.Venus, 'planet', '#e0c074', 224.701),
    new Thing('Earth', Body.EMB, 'planet', '#4f82c6', 365.256),
    new Thing('Mars', Body.Mars, 'planet', '#c1562d', 686.98),
    new Thing('Jupiter', Body.Jupiter, 'planet', '#c99a6b', 4332.59),
    new Thing('Saturn', Body.Saturn, 'planet', '#d4c58a', 10759.22),
    new Thing('Uranus', Body.Uranus, 'planet', '#9fd4d8', 30688.5),
    new Thing('Neptune', Body.Neptune, 'planet', '#5a74e0', 60182),
    new Thing('Pluto', Body.Pluto, 'planet', '#b8a08c', 90560),
    // new Thing('Io', null, 'moon', '#e8d99a', 1.769), 
    // new Thing('Europa', null, 'moon', '#d8dde0', 3.551),
    // new Thing('Ganymede', null, 'moon', '#a9977f', 7.155),
    // new Thing('Callisto', null, 'moon', '#7d7265', 16.689),
    // {
    //     id: 'venus',
    //     body: Body.Venus,
    //     name: 'Venus',
    //     colorHex: '#e0c074',
    //     orbitalPeriodDays: 224.701,
    // },
    // {
    //     // Body.EMB (the Earth-Moon barycenter) rather than Body.Earth: the
    //     // offset from Earth's center is a few thousand km, invisible at this
    //     // map's AU scale, and using EMB makes lagrange() exact when this
    //     // Thing is used as the minor body of a Sun-Earth Lagrange point.
    //     id: 'earth',
    //     body: Body.EMB,
    //     name: 'Earth',
    //     colorHex: '#4f82c6',
    //     orbitalPeriodDays: 365.256,
    // },
    // {
    //     id: 'mars',
    //     body: Body.Mars,
    //     name: 'Mars',
    //     colorHex: '#c1562d',
    //     orbitalPeriodDays: 686.98,
    // },
    // {
    //     id: 'jupiter',
    //     body: Body.Jupiter,
    //     name: 'Jupiter',
    //     colorHex: '#c99a6b',
    //     orbitalPeriodDays: 4332.59,
    // },
    // {
    //     id: 'saturn',
    //     body: Body.Saturn,
    //     name: 'Saturn',
    //     colorHex: '#d4c58a',
    //     orbitalPeriodDays: 10759.22,
    // },
    // {
    //     id: 'uranus',
    //     body: Body.Uranus,
    //     name: 'Uranus',
    //     colorHex: '#9fd4d8',
    //     orbitalPeriodDays: 30688.5,
    // },
    // {
    //     id: 'neptune',
    //     body: Body.Neptune,
    //     name: 'Neptune',
    //     colorHex: '#5a74e0',
    //     orbitalPeriodDays: 60182,
    // },
    // {
    //     id: 'pluto',
    //     body: Body.Pluto,
    //     name: 'Pluto',
    //     colorHex: '#b8a08c',
    //     orbitalPeriodDays: 90560,
    // },
    // {
    //     id: 'io',
    //     name: 'Io',
    //     color: '#e8d99a',
    //     orbitalPeriodDays: 1.769,
    //     stateVector: (m) => m.io,
    // },
    // {
    //     id: 'europa',
    //     name: 'Europa',
    //     color: '#d8dde0',
    //     orbitalPeriodDays: 3.551,
    //     stateVector: (m) => m.europa,
    // },
    // {
    //     id: 'ganymede',
    //     name: 'Ganymede',
    //     color: '#a9977f',
    //     orbitalPeriodDays: 7.155,
    //     stateVector: (m) => m.ganymede,
    // },
    // {
    //     id: 'callisto',
    //     name: 'Callisto',
    //     color: '#7d7265',
    //     orbitalPeriodDays: 16.689,
    //     stateVector: (m) => m.callisto,
    // },
];

// export const PLANETS: Thing[] = MAIN_THINGS.map(
//     (def): Thing => ({
//         id: def.id,
//         name: def.name,
//         colorHex: def.colorHex,
//         kind: 'planet',
//         body: def.body,
//         orbitalPeriodDays: def.orbitalPeriodDays,
//         positionAu: (date: Date) => eclipticPositionAu(def.body, date),
//         orbitPathAu: (date: Date) =>
//             tracedOrbitPathAu(
//                 (sampleDate) => eclipticPositionAu(def.body, sampleDate),
//                 def.orbitalPeriodDays,
//                 date,
//             ),
//     }),
// );

// Named references into PLANETS, for callers (eg the Lagrange points in
// catalog.ts) that need a specific planet Thing rather than the whole list.
export const EARTH: Thing = MAIN_THINGS.find((planet) => planet.id === 'earth')!;
export const JUPITER: Thing = MAIN_THINGS.find(
    (planet) => planet.id === 'jupiter',
)!;

// interface GalileanMoonDef {
//     id: string;
//     name: string;
//     color: string;
//     orbitalPeriodDays: number;
//     stateVector: (moons: JupiterMoonsInfo) => StateVector; // TODO this func seems useless
// }

// const GALILEAN_MOON_DEFS: GalileanMoonDef[] = [
    
// ];

// Jovicentric (relative to Jupiter's center); add Jupiter's own heliocentric
// position to place the moon in the same frame as everything else on the map.
// function moonPositionAu(def: GalileanMoonDef, date: Date): Point2D {
//     const jupiterHelio = eclipticPositionAu(Body.Jupiter, date);
//     const jovicentric = def.stateVector(JupiterMoons(date));
//     const jovicentricEcliptic = toEclipticPoint(
//         jovicentric.x,
//         jovicentric.y,
//         jovicentric.z,
//         jovicentric.t,
//     );
//     return {
//         x: jupiterHelio.x + jovicentricEcliptic.x,
//         y: jupiterHelio.y + jovicentricEcliptic.y,
//     };
// }

// export const JUPITER_MOONS: Thing[] = GALILEAN_MOON_DEFS.map(
//     (def): Thing => ({
//         id: def.id,
//         name: def.name,
//         colorHex: def.color,
//         kind: 'moon',
//         orbitalPeriodDays: def.orbitalPeriodDays,
//         positionAu: (date: Date) => moonPositionAu(def, date),
//         orbitPathAu: (date: Date) =>
//             tracedOrbitPathAu(
//                 (sampleDate) => moonPositionAu(def, sampleDate),
//                 def.orbitalPeriodDays,
//                 date,
//             ),
//     }),
// );

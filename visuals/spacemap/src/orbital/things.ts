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

export const MAIN_THINGS: Thing[] = [
// const PLANET_DEFS: PlanetDef[] = [
    new Thing ('Mercury', Body.Mercury, 'heliocentric', '#9e9e9e', 87.969),
    new Thing('Venus', Body.Venus, 'heliocentric', '#e0c074', 224.701),
    new Thing('Earth', Body.EMB, 'heliocentric', '#4f82c6', 365.256),
    new Thing('Mars', Body.Mars, 'heliocentric', '#c1562d', 686.98),
    new Thing('Jupiter', Body.Jupiter, 'heliocentric', '#c99a6b', 4332.59),
    new Thing('Saturn', Body.Saturn, 'heliocentric', '#d4c58a', 10759.22),
    new Thing('Uranus', Body.Uranus, 'heliocentric', '#9fd4d8', 30688.5),
    new Thing('Neptune', Body.Neptune, 'heliocentric', '#5a74e0', 60182),
    new Thing('Pluto', Body.Pluto, 'heliocentric', '#b8a08c', 90560),
    // new Thing('Io', null, 'moon', '#e8d99a', 1.769), 
    // new Thing('Europa', null, 'moon', '#d8dde0', 3.551),
    // new Thing('Ganymede', null, 'moon', '#a9977f', 7.155),
    // new Thing('Callisto', null, 'moon', '#7d7265', 16.689),
];

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

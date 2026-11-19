// import { Body } from 'astronomy-engine';

export const MILLISECONDS_PER_DAY = 86400000;

export interface Point2D {
    x: number;
    y: number;
}

export interface Point3D extends Point2D {
    z: number;
}

// One stretch of a spacecraft's trajectory, simplified to a shape the map
// can compute instantly - see scripts/fetchSpacecraft.mjs, which generates
// these from JPL Horizons. Dates are ISO days (eg '2026-09-29'); a phase
// covers [start, end).
interface SpacecraftPhaseBase {
    start: string;
    end: string;
    parentID: string; // the Thing this phase's coordinates are relative to
}

// A fixed Kepler ellipse around parentID, in the same flattened model (and
// with the same field meanings) as a Thing's own simplified orbit, except
// that epochAngleDeg is the mean longitude at `epoch`, not at
// SIMPLE_ORBIT_EPOCH.
export interface EllipsePhase extends SpacecraftPhaseBase {
    type: 'ellipse';
    epoch: string;
    semiMajorAxisAu: number;
    eccentricity: number;
    periapsisLongitudeDeg: number;
    epochAngleDeg: number;
    orbitalPeriodDays: number;
    retrograde?: boolean;
}

// Heliocentric positions sampled every stepDays from `start`, as flat
// [x, y, z, x, y, z, ...] in AU (fixed J2000 ecliptic frame), interpolated
// linearly between - for a near-straight escape path like Voyager 2's.
export interface TrackPhase extends SpacecraftPhaseBase {
    type: 'track';
    stepDays: number;
    points: number[];
}

export type SpacecraftPhase = EllipsePhase | TrackPhase;

// Something named that sits at a Thing without being drawn as one: a lander
// on a planet's surface, or a spacecraft in a crowded halo orbit around a
// Lagrange point. Listed in that Thing's info menu, and searchable.
export interface Resident {
    name: string;
    aliases?: string[];
    note: string; // eg 'Rover, landed 2021'
    since: string; // ISO day; not listed before this
}

// Lagrange points render as a "+", since they aren't physical objects;
// everything else renders as a solid circle.
export type ThingKind =
    | 'star'
    | 'heliocentric'
    | 'moon'
    | 'asteroid'
    | 'comet'
    | 'spacecraft'
    | 'lagrangePoint';

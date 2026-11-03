import { Body } from 'astronomy-engine';

export interface Point2D {
    x: number;
    y: number;
}

// Lagrange points render as a hollow marker, since they aren't physical
// objects; everything else renders as a solid marker.
export type ThingKind =
    | 'star'
    | 'planet'
    | 'moon'
    | 'asteroid'
    | 'spacecraft'
    | 'lagrangePoint';

export interface Thing {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // display label
    color: string;
    kind: ThingKind;
    // astronomy-engine's identifier for this Thing, when it has one. Lets
    // lagrange() treat this Thing as one end of a two-body system. Not set
    // for Things astronomy-engine doesn't model directly (moons, Lagrange
    // points, and any future asteroid/spacecraft with their own trajectory).
    body?: Body;
    // Sidereal orbital period: a fixed astronomical constant, not live data.
    // Only set for Things that actually orbit something (not Sol). Used to
    // trace orbitPathAu, and by lagrange() to trace its own orbit path.
    orbitalPeriodDays?: number;
    positionAu: (date: Date) => Point2D;
    // Only set for objects whose traced orbit is worth drawing.
    orbitPathAu?: (date: Date) => Point2D[];
}

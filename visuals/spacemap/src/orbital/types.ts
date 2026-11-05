// import { Body } from 'astronomy-engine';

export const MILLISECONDS_PER_DAY = 86400000;

export interface Point2D {
    x: number;
    y: number;
}

// Lagrange points render as a hollow marker, since they aren't physical
// objects; everything else renders as a solid marker.
export type ThingKind =
    | 'star'
    | 'heliocentric'
    | 'moon'
    | 'asteroid'
    | 'spacecraft'
    | 'lagrangePoint';

// import { Body } from 'astronomy-engine';

export const MILLISECONDS_PER_DAY = 86400000;

export interface Point2D {
    x: number;
    y: number;
}

// Lagrange points render as a "+", since they aren't physical objects;
// everything else renders as a solid circle.
export type ThingKind =
    | 'star'
    | 'heliocentric'
    | 'moon'
    | 'asteroid'
    | 'spacecraft'
    | 'lagrangePoint';

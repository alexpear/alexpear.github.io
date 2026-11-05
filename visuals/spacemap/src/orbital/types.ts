// import { Body } from 'astronomy-engine';

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

// export class Thing {
//     id: string; // lowercase key used in the ?focus= query param
//     name: string; // display label
//     colorHex: string;
//     kind: ThingKind;
//     // astronomy-engine's identifier for this Thing, when it has one. Lets
//     // lagrange() treat this Thing as one end of a two-body system. Not set
//     // for Things astronomy-engine doesn't model directly (moons, Lagrange
//     // points, and any future asteroid/spacecraft with their own trajectory).
//     body?: Body;
//     // Sidereal orbital period: a fixed astronomical constant, not live data.
//     // Only set for Things that actually orbit something (not Sol). Used to
//     // trace orbitPathAu, and by lagrange() to trace its own orbit path.
//     orbitalPeriodDays?: number;
//     positionAu: (date: Date) => Point2D;
//     // Only set for objects whose traced orbit is worth drawing.
//     orbitPathAu?: (date: Date) => Point2D[];

//     constructor(name: string, body: Body, kind: ThingKind, colorHex: string, orbitalPeriodDays: number) {
//         this.id = name.toLowerCase();
//         this.name = name;
//         this.colorHex = colorHex;
//         this.kind = kind;
//         this.body = body;
//         this.orbitalPeriodDays = orbitalPeriodDays;
//         // this.positionAu = (date: Date) => eclipticPositionAu(body, date);
//         // this.orbitPathAu = (date: Date) =>
//         //     tracedOrbitPathAu(this.positionAu, orbitalPeriodDays, date);
//     }
// }

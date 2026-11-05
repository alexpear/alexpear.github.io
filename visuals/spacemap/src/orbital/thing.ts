// Every entity that we might display at a location on the map is a Thing, including stars, planets, moons, asteroids, spacecraft, debris, & Lagrange points. 

import { Point2D, ThingKind } from "./types";
import {
    // AstroTime,
    Body,
    Ecliptic,
    HelioVector,
    // Vector,
} from 'astronomy-engine';

const MILLISECONDS_PER_DAY = 86400000;

export class Thing {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // display label
    colorHex: string;
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

    constructor(name: string, body: Body, kind: ThingKind, colorHex: string, orbitalPeriodDays: number) {
        this.name = name;
        this.id = name.toLowerCase();
        this.colorHex = colorHex;
        this.kind = kind;
        this.body = body;
        this.orbitalPeriodDays = orbitalPeriodDays;
        // this.positionAu = (date: Date) => this.eclipticPositionAu(body, date);
        // this.orbitPathAu = (date: Date) =>
        //     tracedOrbitPathAu(this.positionAu, orbitalPeriodDays, date);
    }

    // Flattened onto the ecliptic plane: this map is 2D and does not express
    // orbital tilt (eg Pluto's), so we discard the z-component.
    // TODO probably unify with positionAu()
     eclipticPositionAu(date: Date): Point2D {
        const helioVector = HelioVector(this.body, date);
        const ecliptic = Ecliptic(helioVector);
        return { x: ecliptic.vec.x, y: ecliptic.vec.y };
    }

    // Traces an object's orbit by sampling its position across one period.
    // Works for any periodic object (planet, moon, Lagrange point), not just planets.
    // TODO probably unify with orbitPathAu()
      tracedOrbitPathAu(
        date: Date,
        samples: number = 180,
    ): Point2D[] {
        const points: Point2D[] = [];
        for (let i = 0; i <= samples; i++) {
            const dayOffset = (this.orbitalPeriodDays * i) / samples;
            const sampleDate = new Date(
                date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
            );
            points.push(this.eclipticPositionAu(sampleDate));
        }
        return points;
    }
}

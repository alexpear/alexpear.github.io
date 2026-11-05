// Every entity that we might display at a location on the map is a Thing, including stars, planets, moons, asteroids, spacecraft, debris, & Lagrange points. 

// LATER single quotes
import { Point2D, MILLISECONDS_PER_DAY, ThingKind } from "./types";
import {
    // AstroTime,
    Body,
    Ecliptic,
    HelioVector,
    // Vector,
} from 'astronomy-engine';

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

    smallLagrangeParent?: Thing; // for Lagrange points, the minor body of the two-body system

    constructor(name: string, body: Body, kind: ThingKind, colorHex: string, orbitalPeriodDays: number, smallLagrangeParent?: Thing) {
        this.name = name;
        this.id = name.toLowerCase(); // TODO slugify instead
        this.colorHex = colorHex;
        this.kind = kind;
        this.body = body;
        this.orbitalPeriodDays = orbitalPeriodDays;
        this.smallLagrangeParent = smallLagrangeParent;
        // this.positionAu = (date: Date) => this.eclipticPositionAu(body, date);
        // this.orbitPathAu = (date: Date) =>
        //     tracedOrbitPathAu(this.positionAu, orbitalPeriodDays, date);
    }

    // Flattened onto the ecliptic plane: this map is 2D and does not express
    // orbital tilt (eg Pluto's), so we discard the z-component.
    // TODO probably unify with positionAu()
     positionAu(date: Date): Point2D {
        // TODO case where there's no Body (eg spacecraft)
        const helioVector = HelioVector(this.body, date);
        const ecliptic = Ecliptic(helioVector);
        return { x: ecliptic.vec.x, y: ecliptic.vec.y };
    }

    // Traces an object's orbit by sampling its position across one period.
    // Works for any periodic object (planet, moon, Lagrange point), not just planets.
    // TODO probably unify with orbitPathAu()
    orbitPathAu(
        date: Date,
        samples: number = 180,
    ): Point2D[] {
        const points: Point2D[] = [];
        for (let i = 0; i <= samples; i++) {
            const dayOffset = (this.orbitalPeriodDays * i) / samples;
            const sampleDate = new Date(
                date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
            );
            points.push(this.positionAu(sampleDate));
        }
        return points;
    }

    // A Lagrange point is a position defined by
    // a pair of bodies, so we compute it on demand instead of listing each one
    // as a static def. `this` is the major body (eg Sol) and `thing2` is the
    // minor body (eg Earth) of the two-body system, matching astronomy-engine's
    // own major/minor convention; `lagrangeNumber` selects which of the 5 points
    // (1, 2, 4, and 5 are the stable/commonly-used ones; 3, on the far side of
    // the major body, is less useful).
    // Usage: sol.lagrange(earth, 1) returns the Sol-Earth L1 point.
    lagrange(
        smallParent: Thing,
        lagrangeNumber: number,
    ): Thing {
        if (!this.body || !smallParent.body) {
            throw new Error(
                `lagrange() requires both Things to have a Body: ${this.id}, ${smallParent.id}`,
            );
        }

        // TODO case where earth.lagrange(sol, 2) is called. Swap em.
        const bigBody = this.body;
        const smallBody = smallParent.body;
    
        // LagrangePoint() returns a vector relative to the major body's center,
        // so no extra offset is needed to place it in the map's frame.
        function positionAu(date: Date): Point2D {
            const stateVector = LagrangePoint(
                lagrangeNumber,
                date,
                bigBody,
                smallBody,
            );
            return toEclipticPoint(
                stateVector.x,
                stateVector.y,
                stateVector.z,
                stateVector.t,
            );
        }
    
        return new Thing(
            `${this.name}–${smallParent.name} L${lagrangeNumber}`,
            bigBody, // TODO swap, this.body should be the small one, & Thing should have a field for bigParent
            'lagrangePoint',
            '#aaffaa',
            smallParent.orbitalPeriodDays || 0,
            smallParent,
        );
        
        // TODO this should be one of the cases of Thing's orbit path func. 
        // orbitPathAu: thing2.orbitalPeriodDays
        //     ? (date: Date): Point2D[] =>
        //             tracedOrbitPathAu(positionAu, thing2.orbitalPeriodDays!, date)
        //     : undefined,
    }
}

// Every entity that we might display at a location on the map is a Thing, including stars, planets, moons, asteroids, spacecraft, debris, & Lagrange points. 

// LATER single quotes
import { Point2D, MILLISECONDS_PER_DAY, ThingKind } from "./types";
import {
    Body,
    HelioVector,
    LagrangePoint,
    RotateVector,
    Rotation_EQJ_ECL,
    Vector,
} from 'astronomy-engine';

// A fixed (J2000-epoch) equatorial-to-ecliptic rotation. Deliberately not
// astronomy-engine's Ecliptic() helper, which rotates into the TRUE ecliptic
// OF DATE - a frame that itself precesses (~1.4 degrees/century) with the
// date of the vector being converted. Using that per-sample means every
// position on the map is expressed in a slightly different, date-dependent
// frame; comparing positions sampled across a long span - eg one full lap of
// Neptune's 165-year or Pluto's 248-year orbit - shows a spurious twist,
// big enough to look like a "Z"-shaped kink where the drawn orbit path
// closes back on itself. A fixed frame keeps every position comparable
// regardless of its date.
const EQJ_TO_ECL = Rotation_EQJ_ECL();

function toFixedEclipticPoint(vector: Vector): Point2D {
    const ecliptic = RotateVector(EQJ_TO_ECL, vector);
    return { x: ecliptic.x, y: ecliptic.y };
}

export class Thing {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // display label
    colorHex: string;
    kind: ThingKind;

    // astronomy-engine's identifier for this Thing, when it has one. If this Thing is a Lagrange point, body refers to the smaller of the 2 parent masses.
    body?: Body;

    // Sidereal orbital period: a fixed astronomical constant, not live data.
    // Only set for Things that actually orbit something (not Sol). Used to
    // trace orbitPathAu, and by lagrange() to trace its own orbit path.
    orbitalPeriodDays?: number;

    lagrangeNumber?: number; // for Lagrange points, 1-5.
    bigLagrangeParent?: Body; // for Lagrange points, the bigger of the 2 masses.

    constructor(name: string, body: Body, kind: ThingKind, colorHex: string, orbitalPeriodDays: number, lagrangeNumber?: number, bigLagrangeParent?: Body) {
        this.name = name;
        this.id = name.toLowerCase(); // TODO slugify instead
        this.colorHex = colorHex;
        this.kind = kind;
        this.body = body;
        // if (!body) { throw new Error(`Thing ${name} must have a Body`); }
        this.orbitalPeriodDays = orbitalPeriodDays;
        this.lagrangeNumber = lagrangeNumber;
        this.bigLagrangeParent = bigLagrangeParent;
    }

    // Flattened onto the ecliptic plane: this map is 2D and does not express
    // orbital tilt (eg Pluto's), so we discard the z-component.
    // Expressed in astronomical units (AU).
     position(date: Date): Point2D {
        if (this.lagrangeNumber) {
            const stateVector = LagrangePoint(
                this.lagrangeNumber,
                date,
                this.bigLagrangeParent,
                this.body,
            );
            return toFixedEclipticPoint(
                new Vector(
                    stateVector.x,
                    stateVector.y,
                    stateVector.z,
                    stateVector.t,
                ),
            );
        }

        // TODO case where there's no Body (eg spacecraft or even moons)
        return toFixedEclipticPoint(HelioVector(this.body, date));
    }

    // Traces an object's orbit by sampling its position across one period.
    // Works for any periodic object (planet, moon, Lagrange point), not just planets.
    //
    // Deliberately stops short of a full period (i < samples, not i <=
    // samples): the caller closes the drawn path back to the first point
    // itself (SVG 'Z'), so sampling a last point meant to coincide with the
    // first would be redundant - and it never exactly does, since
    // orbitalPeriodDays is a rounded constant and real orbits precess
    // slightly anyway.
    //
    // 2000 samples, not 180: each sample point is a vertex where the drawn
    // path bends slightly to follow the curve, which is invisible at low
    // zoom but shows up as a "jag" right at the body's current position once
    // you're zoomed in close enough to see individual segments - worst for
    // Neptune and Pluto, whose huge orbits give each segment the most actual
    // distance to span. More samples means each one covers less distance.
    // Cheap to raise: this only reruns when `date` changes (useMemo in
    // OrbitPath), not on every zoom/pan.
    orbitPath(
        date: Date,
        samples: number = 2000,
    ): Point2D[] {
        const points: Point2D[] = [];

        for (let i = 0; i < samples; i++) {
            const dayOffset = (this.orbitalPeriodDays * i) / samples;
            const sampleDate = new Date(
                date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
            );
            points.push(this.position(sampleDate));
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
    
        return new Thing(
            `${this.name}–${smallParent.name} L${lagrangeNumber}`,
            smallBody,
            'lagrangePoint',
            '#aaffaa',
            smallParent.orbitalPeriodDays,
            lagrangeNumber,
            bigBody,
        );
    }
}

// Every entity that we might display at a location on the map is a Thing, including stars, planets, moons, asteroids, spacecraft, debris, & Lagrange points. 

import { Point2D, MILLISECONDS_PER_DAY, ThingKind } from './types';
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

// Reference epoch for Thing.epochAngleDeg. Deliberately NOT J2000.0 (the
// instant astronomy-engine and most published orbital elements use):
// epochAngleDeg is propagated forward by a constant-rate angle (360 degrees
// per orbitalPeriodDays), and orbitalPeriodDays is only known to a handful
// of significant figures, so that propagation's error grows with the number
// of orbits between the epoch and the date being rendered. J2000.0 is ~27
// years ago - for a fast-orbiting moon like Europa (~3.55 days) that's
// ~2,760 orbits, enough for the error to accumulate into an essentially
// random phase. Anchoring to a recent date instead keeps that orbit count
// (and so the error) small for as long as "recent" still holds; it just
// needs updating again once it doesn't. The slower the orbit (eg Ceres,
// 4.6 years), the longer this stays good.
const SIMPLE_ORBIT_EPOCH = new Date('2026-11-05T00:00:00Z');

// TODO put inside class Thing.
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
    // TODO rename to bodyAE etc to clarify what this is.
    body?: Body;

    parentID: string; // this orbits parent. SOL.parentID === 'sol', ie itself.

    // Sidereal orbital period: a fixed astronomical constant, not live data.
    // Only set for Things that actually orbit something (not Sol). Used to
    // trace orbitPathAu, and by lagrange() to trace its own orbit path.
    orbitalPeriodDays?: number;

    lagrangeNumber?: number; // for Lagrange points, 1-5.
    bigLagrangeParent?: Body; // for Lagrange points, the bigger of the 2 masses.

    // Simplified circular-orbit model, used for every Thing with no
    // astronomy-engine body: every moon (astronomy-engine has no ephemeris
    // for any of them, including Jupiter's), plus any Sol-orbiting body
    // (eg an asteroid) astronomy-engine doesn't track either. Flattened like
    // everything else here: no inclination, no eccentricity, just a
    // constant-rate circle of radius semiMajorAxisAu around the parent
    // (Sol, for an asteroid), starting at epochAngleDeg at SIMPLE_ORBIT_EPOCH.
    // Fine for a near-circular orbit (eg Titan, Ceres); visibly wrong for an
    // eccentric one (eg Neptune's Nereid).
    semiMajorAxisAu?: number;
    epochAngleDeg?: number; // this Thing's angle around its parent at SIMPLE_ORBIT_EPOCH

    constructor(
        name: string,
        body: Body,
        kind: ThingKind,
        colorHex: string,
        orbitalPeriodDays: number,
        parentID: string = 'sol',
        semiMajorAxisAu?: number,
        epochAngleDeg?: number,
    ) {
        this.name = name;
        this.id = name.toLowerCase(); // TODO slugify instead
        this.colorHex = colorHex;
        this.kind = kind;
        this.body = body; // TODO make build process stricter, catch null passed here at compile time.
        this.orbitalPeriodDays = orbitalPeriodDays;
        this.parentID = parentID;
        this.semiMajorAxisAu = semiMajorAxisAu;
        this.epochAngleDeg = epochAngleDeg;
    }

    static MAIN_THINGS: Thing[] = [
        // TODO reorder all of these by AU
        new Thing('Sol', Body.Sun, 'star', '#ffd27f', 0),
        new Thing('Mercury', Body.Mercury, 'heliocentric', '#9e9e9e', 87.969),
        new Thing('Venus', Body.Venus, 'heliocentric', '#e0c074', 224.701),
        new Thing('Earth', Body.EMB, 'heliocentric', '#4f82c6', 365.256),
        new Thing('Mars', Body.Mars, 'heliocentric', '#c1562d', 686.98),
        new Thing('Jupiter', Body.Jupiter, 'heliocentric', '#c99a6b', 4332.59),
        new Thing('Saturn', Body.Saturn, 'heliocentric', '#d4c58a', 10759.22),
        new Thing('Uranus', Body.Uranus, 'heliocentric', '#9fd4d8', 30688.5),
        new Thing('Neptune', Body.Neptune, 'heliocentric', '#5a74e0', 60182),
        new Thing('Pluto', Body.Pluto, 'heliocentric', '#b8a08c', 90560),
        // Every moon's (and asteroid's) period, semi-major axis, and mean
        // longitude (OM + W + MA) at SIMPLE_ORBIT_EPOCH below are osculating
        // elements from JPL Horizons (ssd.jpl.nasa.gov/api/horizons.api),
        // queried relative to each one's own parent (Sol, for an asteroid)
        // in the ecliptic-of-J2000 frame, at SIMPLE_ORBIT_EPOCH's date
        // (JDTDB 2461349.5). Re-fetch and update everything below - don't
        // just touch one entry - if SIMPLE_ORBIT_EPOCH ever moves forward,
        // so they all stay anchored to the same instant; a known ~69-second
        // TDB-vs-UTC imprecision, negligible for everything here except
        // Phobos (period under 8 hours, where it's worth ~0.25 degrees of
        // phase).
        //
        // Moons: every one at least as large as Saturn's Epimetheus (mean
        // radius ~58 km, per JPL's Planetary Satellite Physical Parameters
        // table at ssd.jpl.nasa.gov/sats/phys_par/), plus Phobos and Deimos
        // (both smaller, included anyway since they're Mars' only moons).
        new Thing('Io', null, 'moon', '#e8d99a', 1.771433, 'jupiter', 0.002821179, 5.6688),
        new Thing('Europa', null, 'moon', '#d8dde0', 3.552391, 'jupiter', 0.004486332, 181.1794),
        new Thing('Ganymede', null, 'moon', '#a9977f', 7.157812, 'jupiter', 0.007157128, 358.9916),
        new Thing('Callisto', null, 'moon', '#7d7265', 16.692561, 'jupiter', 0.012586283, 252.7720),
        new Thing('Himalia', null, 'moon', '#8f8064', 250.285587, 'jupiter', 0.076529912, 149.3419),
        new Thing('Amalthea', null, 'moon', '#b08a6a', 0.501639, 'jupiter', 0.001216563, 294.5177),
        new Thing('Titan', null, 'moon', '#d9b36c', 15.947349, 'saturn', 0.008168130, 93.0371),
        new Thing('Phobos', null, 'moon', '#8a7d6b', 0.3191196, 'mars', 0.00006268688, 176.5605),
        new Thing('Deimos', null, 'moon', '#a89a86', 1.262587, 'mars', 0.0001568129, 50.2769),
        new Thing('Mimas', null, 'moon', '#c9c9c9', 0.947399, 'saturn', 0.001243515, 72.9939),
        new Thing('Enceladus', null, 'moon', '#eef0f2', 1.374539, 'saturn', 0.001593679, 106.3438),
        new Thing('Tethys', null, 'moon', '#d8d8d8', 1.891653, 'saturn', 0.001971774, 177.9322),
        new Thing('Dione', null, 'moon', '#cfcfcf', 2.740340, 'saturn', 0.002524445, 60.7380),
        new Thing('Rhea', null, 'moon', '#bdbdbd', 4.520396, 'saturn', 0.003524366, 302.8426),
        new Thing('Hyperion', null, 'moon', '#a89880', 21.382504, 'saturn', 0.009931201, 345.7900),
        new Thing('Iapetus', null, 'moon', '#8f8370', 79.471398, 'saturn', 0.023828887, 69.7235),
        new Thing('Phoebe', null, 'moon', '#6f6a63', 548.154922, 'saturn', 0.086343888, 266.5226),
        new Thing('Janus', null, 'moon', '#b9b4a8', 0.700196, 'saturn', 0.001016504, 271.3066),
        new Thing('Epimetheus', null, 'moon', '#b0ab9f', 0.699856, 'saturn', 0.001016175, 341.6707),
        new Thing('Miranda', null, 'moon', '#9fa8ad', 1.413995, 'uranus', 0.000868135, 281.0398),
        new Thing('Ariel', null, 'moon', '#b9c4c9', 2.520790, 'uranus', 0.001276386, 37.8302),
        new Thing('Umbriel', null, 'moon', '#7d7d80', 4.145019, 'uranus', 0.001778178, 359.8002),
        new Thing('Titania', null, 'moon', '#9aa6ad', 8.704609, 'uranus', 0.002916043, 154.1154),
        new Thing('Oberon', null, 'moon', '#8f8a84', 13.466214, 'uranus', 0.003900537, 242.4414),
        new Thing('Triton', null, 'moon', '#c9d8e0', 5.877119, 'neptune', 0.002371476, 59.9426),
        new Thing('Nereid', null, 'moon', '#9fa0a3', 360.655661, 'neptune', 0.036892716, 194.1457),
        new Thing('Despina', null, 'moon', '#8f909a', 0.335448, 'neptune', 0.000351530, 252.0855),
        new Thing('Galatea', null, 'moon', '#8a8b94', 0.429472, 'neptune', 0.000414479, 88.0302),
        new Thing('Larissa', null, 'moon', '#7f8089', 0.555318, 'neptune', 0.000491934, 317.6936),
        new Thing('Proteus', null, 'moon', '#6f7079', 1.122823, 'neptune', 0.000786598, 285.4243),
        new Thing('Charon', null, 'moon', '#a89a8c', 6.387221, 'pluto', 0.000130990, 195.0751),
        new Thing('Moon', null, 'moon', '#d8d8d8', 27.115683, 'earth', 0.002558939, 167.1504),
        // Asteroids: just the two biggest main-belt bodies for now (Ceres is
        // also classified as a dwarf planet). Smaller Belt objects, Trojans,
        // etc. aren't included - flag if you want specific ones added.
        new Thing('Ceres', null, 'asteroid', '#b5a898', 1680.497869, 'sol', 2.766260186, 99.8940),
        new Thing('Vesta', null, 'asteroid', '#cbb89a', 1325.220467, 'sol', 2.361165733, 16.8330),
    ];

    static byID(id: string): Thing | undefined {
        return Thing.MAIN_THINGS.find((thing) => thing.id === id);
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

        // TODO case where there's no Body and no known parent API (eg spacecraft)

        // Anything astronomy-engine doesn't track directly: every moon, or a
        // Sol-orbiting body like an asteroid.
        if (!this.body) {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            // TODO standardize variable name suffices like position, vector, point, pt.
            const parentPosition = parent.position(date);

            // Simplified circular-orbit model (see the
            // semiMajorAxisAu/epochAngleDeg field comments).
            if (
                this.semiMajorAxisAu === undefined ||
                this.epochAngleDeg === undefined
            ) {
                throw new Error(
                    `${this.id} needs semiMajorAxisAu and epochAngleDeg: astronomy-engine doesn't track it directly, and it has no parent "${this.parentID}" lookup either`,
                );
            }
            const daysSinceEpoch =
                (date.getTime() - SIMPLE_ORBIT_EPOCH.getTime()) /
                MILLISECONDS_PER_DAY;
            const angleDeg =
                this.epochAngleDeg +
                (360 * daysSinceEpoch) / this.orbitalPeriodDays;
            const angleRad = (angleDeg * Math.PI) / 180;
            return {
                x: parentPosition.x + this.semiMajorAxisAu * Math.cos(angleRad),
                y: parentPosition.y + this.semiMajorAxisAu * Math.sin(angleRad),
            };
        }

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
    
        const lp = new Thing(
            `${this.name}–${smallParent.name} L${lagrangeNumber}`,
            smallBody,
            'lagrangePoint',
            '#aaffaa',
            smallParent.orbitalPeriodDays,
        );

        lp.lagrangeNumber = lagrangeNumber;
        lp.bigLagrangeParent = bigBody;

        return lp;
    }
}

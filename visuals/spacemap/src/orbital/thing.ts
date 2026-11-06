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

// Turns a display name into a Thing.id: lowercase, alphanumeric runs joined
// by single hyphens, no leading/trailing hyphen. Handles names toLowerCase()
// alone can't, eg lagrange()'s "Sol–Earth L1" (en dash + space) -> "sol-earth-l1".
function slugify(name: string): string {
    if (name.startsWith('G!kun'))
        return 'gkunhomdima';

    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Solves Kepler's equation M = E - e*sin(E) for the eccentric anomaly E
// (radians) given the mean anomaly M (radians) and eccentricity e, by
// Newton's method. Starting the guess at M itself converges in well under
// 20 iterations for every eccentricity in this file (up to Sedna's 0.85) -
// this orbit model has no use for anything approaching e=1, where that
// guess would stop being good enough.
function solveEccentricAnomaly(meanAnomalyRad: number, eccentricity: number): number {
    let eccentricAnomalyRad = meanAnomalyRad;
    for (let i = 0; i < 30; i++) {
        const delta =
            (eccentricAnomalyRad -
                eccentricity * Math.sin(eccentricAnomalyRad) -
                meanAnomalyRad) /
            (1 - eccentricity * Math.cos(eccentricAnomalyRad));
        eccentricAnomalyRad -= delta;
        if (Math.abs(delta) < 1e-12) {
            break;
        }
    }
    return eccentricAnomalyRad;
}

export class Thing {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // full display label; also what `id` is slugified from
    // Overrides `name` for display only, eg a Lagrange point's short "L4" -
    // `name` has to stay long enough (eg "Sol–Earth L4") to keep `id`
    // unique from "Earth–Luna L4"'s.
    label?: string;
    colorHex: string;
    kind: ThingKind;

    // astronomy-engine's identifier for this Thing, when it has one. If this Thing is a Lagrange point, body refers to the smaller of the 2 parent masses.
    // TODO rename to bodyAE etc to clarify what this is.
    bodyAE?: Body;

    parentID: string; // this orbits parent. SOL.parentID === 'sol', ie itself.

    // Sidereal orbital period: a fixed astronomical constant, not live data.
    // Only set for Things that actually orbit something (not Sol). Used to
    // trace orbitPathAu, and by lagrange() to trace its own orbit path.
    orbitalPeriodDays?: number;

    lagrangeNumber?: number; // for Lagrange points, 1-5.
    bigLagrangeParent?: Body; // for Lagrange points, the bigger of the 2 masses.

    // Simplified Kepler-orbit model, used for every Thing with no
    // astronomy-engine body: every moon (astronomy-engine has no ephemeris
    // for any of them, including Jupiter's), plus any Sol-orbiting body
    // (eg an asteroid) astronomy-engine doesn't track either. Flattened like
    // everything else here: no inclination, just a fixed ellipse of
    // semi-major axis semiMajorAxisAu and eccentricity around the parent
    // (Sol, for an asteroid), with epochAngleDeg giving its mean longitude
    // (OM + W + MA) at SIMPLE_ORBIT_EPOCH and periapsisLongitudeDeg (OM + W)
    // fixing where that ellipse's long axis points. eccentricity defaults to
    // 0 (a circle, periapsisLongitudeDeg meaningless/unused) for every body
    // this hasn't been bothered for - fine for a near-circular orbit (eg
    // Titan, Ceres); see offsetFromParent() for why it stops being fine
    // (and periapsisLongitudeDeg becomes required) once eccentricity is
    // actually set (eg Neptune's Nereid, Sedna).
    semiMajorAxisAu?: number;
    epochAngleDeg?: number; // this Thing's mean longitude (OM+W+MA) at SIMPLE_ORBIT_EPOCH
    eccentricity: number;
    periapsisLongitudeDeg?: number; // OM+W; required once eccentricity != 0

    constructor(
        name: string,
        body: Body,
        kind: ThingKind,
        colorHex: string,
        orbitalPeriodDays: number,
        parentID: string = 'sol',
        semiMajorAxisAu?: number,
        epochAngleDeg?: number,
        eccentricity: number = 0,
        periapsisLongitudeDeg?: number,
    ) {
        this.name = name;
        this.id = slugify(name);
        this.colorHex = colorHex;
        this.kind = kind;
        this.bodyAE = body; // TODO make build process stricter, catch null passed here at compile time.
        this.orbitalPeriodDays = orbitalPeriodDays;
        this.parentID = parentID;
        this.semiMajorAxisAu = semiMajorAxisAu;
        this.epochAngleDeg = epochAngleDeg;
        this.eccentricity = eccentricity;
        this.periapsisLongitudeDeg = periapsisLongitudeDeg;
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
        // new Thing('Epimetheus', null, 'moon', '#b0ab9f', 0.699856, 'saturn', 0.001016175, 341.6707),
        new Thing('Miranda', null, 'moon', '#9fa8ad', 1.413995, 'uranus', 0.000868135, 281.0398),
        new Thing('Ariel', null, 'moon', '#b9c4c9', 2.520790, 'uranus', 0.001276386, 37.8302),
        new Thing('Umbriel', null, 'moon', '#7d7d80', 4.145019, 'uranus', 0.001778178, 359.8002),
        new Thing('Titania', null, 'moon', '#9aa6ad', 8.704609, 'uranus', 0.002916043, 154.1154),
        new Thing('Oberon', null, 'moon', '#8f8a84', 13.466214, 'uranus', 0.003900537, 242.4414),
        new Thing('Triton', null, 'moon', '#c9d8e0', 5.877119, 'neptune', 0.002371476, 59.9426),
        // Nereid's orbit is eccentric enough (e=0.746) that the plain
        // circular model above would put it visibly in the wrong place -
        // same EC/OM/W/MA source and epoch as everything else here, just
        // also given eccentricity + periapsisLongitudeDeg (OM+W) so
        // offsetFromParent() solves the real ellipse instead.
        new Thing('Nereid', null, 'moon', '#9fa0a3', 360.655661, 'neptune', 0.036892716, 194.1457, 0.746100, 256.0251),
        new Thing('Despina', null, 'moon', '#8f909a', 0.335448, 'neptune', 0.000351530, 252.0855),
        new Thing('Galatea', null, 'moon', '#8a8b94', 0.429472, 'neptune', 0.000414479, 88.0302),
        new Thing('Larissa', null, 'moon', '#7f8089', 0.555318, 'neptune', 0.000491934, 317.6936),
        new Thing('Proteus', null, 'moon', '#6f7079', 1.122823, 'neptune', 0.000786598, 285.4243),
        new Thing('Charon', null, 'moon', '#a89a8c', 6.387221, 'pluto', 0.000130990, 195.0751),
        new Thing('Luna', null, 'moon', '#d8d8d8', 27.115683, 'earth', 0.002558939, 167.1504),
        // Asteroids: just the two biggest main-belt bodies for now (Ceres is
        // also classified as a dwarf planet). Smaller Belt objects, Trojans,
        // etc. aren't included - flag if you want specific ones added.
        new Thing('Ceres', null, 'asteroid', '#b5a898', 1680.497869, 'sol', 2.766260186, 99.8940),
        new Thing('Vesta', null, 'asteroid', '#cbb89a', 1325.220467, 'sol', 2.361165733, 16.8330),
        // Trans-Neptunian objects (TNOs): every one with a best current
        // measured diameter at least as large as Varuna's own (668 km, per
        // Herschel thermal measurements - Lellouch et al. 2013). Diameters
        // from Johnston's Archive (johnstonsarchive.net/astro/tnodiam.html),
        // cross-checked against Wikipedia. Orbital elements fetched the same
        // way as everything else above: JPL Horizons osculating elements at
        // SIMPLE_ORBIT_EPOCH, queried against each body's own numbered
        // primary body (not a system barycenter or satellite).
        //
        // A few of these were only given proper names in 2025 and may still
        // be unfamiliar even as TNOs go - their old provisional designation
        // is noted in a trailing comment.
        //
        // Several of these orbits are eccentric enough (Sedna e=0.85,
        // Gonggong e=0.50, 2007 UK126 e=0.49, Eris e=0.44, Chiminigagua
        // e=0.39, Ixion e=0.24, Haumea e=0.195) that the plain circular
        // model above would put them visibly in the wrong place - Sedna
        // most of all, since its semi-major axis (506 AU) is nothing like
        // its real current ~83 AU (it's near perihelion, reached ~2076).
        // Those 7 are given eccentricity + periapsisLongitudeDeg (OM+W)
        // below so offsetFromParent() solves their real ellipse instead;
        // the rest are left on the circular approximation, same as every
        // main-belt asteroid/moon above - fine, since their eccentricities
        // are all comparable to or lower than Ceres'/Vesta's own (~0.08).
        new Thing('Orcus', null, 'asteroid', '#9fb0b8', 89858.842999, 'sol', 39.279780416, 171.9480),
        new Thing('Achlys', null, 'asteroid', '#8f7a6a', 90511.211881, 'sol', 39.469663417, 150.7006), // 2003 AZ84
        new Thing('Ixion', null, 'asteroid', '#7a5248', 90604.038287, 'sol', 39.496644981, 307.2560, 0.244049, 10.8943),
        new Thing('Ritona', null, 'asteroid', '#827a70', 97629.551428, 'sol', 41.512864217, 354.7265), // 2005 RN43
        new Thing('Mani', null, 'asteroid', '#7a5f55', 98422.675932, 'sol', 41.737389478, 302.4300), // 2002 MS4
        new Thing('Goibniu', null, 'asteroid', '#8a7a68', 99157.788905, 'sol', 41.944954311, 232.9718), // 2004 GV9
        new Thing('Salacia', null, 'asteroid', '#6b6b6f', 99445.037399, 'sol', 42.025921662, 4.1625),
        new Thing('Uni', null, 'asteroid', '#7d7d7d', 101730.412251, 'sol', 42.667353498, 71.1968), // 2002 UX25
        new Thing('Varuna', null, 'asteroid', '#9a6a52', 102737.646564, 'sol', 42.948524187, 126.8887),
        new Thing('Haumea', null, 'asteroid', '#eef2f5', 103290.237023, 'sol', 43.102390018, 226.4926, 0.195026, 1.8938),
        new Thing('Quaoar', null, 'asteroid', '#8a6a5a', 104127.208876, 'sol', 43.334918876, 285.5082),
        new Thing('Makemake', null, 'asteroid', '#b5704a', 112022.364296, 'sol', 45.498630639, 187.1252),
        new Thing('Varda', null, 'asteroid', '#857064', 112934.211987, 'sol', 45.745198902, 286.7399),
        new Thing('Aya', null, 'asteroid', '#9a5a46', 118349.368157, 'sol', 47.196065893, 176.5155), // 2002 AW197
        new Thing('Chiminigagua', null, 'asteroid', '#7d7873', 164520.090082, 'sol', 58.786074691, 185.7727, 0.394895, 326.2602), // 2013 FY27
        new Thing('Gonggong', null, 'asteroid', '#a84a3a', 200476.359847, 'sol', 67.066238396, 295.0887, 0.503411, 183.8297),
        new Thing('Eris', null, 'asteroid', '#e8e4da', 203938.828094, 'sol', 67.836241717, 38.3488, 0.438418, 187.1967),
        new Thing("G!kún||'hòmdímà", null, 'asteroid', '#8c4536', 229715.696183, 'sol', 73.438243982, 106.4853, 0.488740, 117.6101), // 2007 UK126, aka Gkunhomdima
        new Thing('Sedna', null, 'asteroid', '#8b2e22', 4160095.140159, 'sol', 506.443123106, 94.1288, 0.849556, 95.6863),
    ];

    static byID(id: string): Thing | undefined {
        return Thing.MAIN_THINGS.find((thing) => thing.id === id);
    }

    // Flattened onto the ecliptic plane: this map is 2D and does not express
    // orbital tilt (eg Pluto's), so we discard the z-component.
    // Expressed in astronomical units (AU).
     position(date: Date): Point2D {
        if (this.lagrangeNumber) {
            // LagrangePoint() returns the point's position relative to the
            // MAJOR body's own center, not an absolute heliocentric
            // position - the two happen to be the same thing when the
            // major body is Sol itself (Sol's own heliocentric position is
            // always the origin), which is why this worked before without
            // adding anything, but it's wrong for eg an Earth-Luna Lagrange
            // point, whose major body (Earth) is itself well off-origin.
            const majorBodyVector = HelioVector(this.bigLagrangeParent, date);
            const stateVector = LagrangePoint(
                this.lagrangeNumber,
                date,
                this.bigLagrangeParent,
                this.bodyAE,
            );

            return toFixedEclipticPoint(
                new Vector(
                    stateVector.x + majorBodyVector.x,
                    stateVector.y + majorBodyVector.y,
                    stateVector.z + majorBodyVector.z,
                    stateVector.t,
                ),
            );
        }

        // TODO case where there's no Body and no known parent API (eg spacecraft)

        // Anything astronomy-engine doesn't track directly: every moon, or a
        // Sol-orbiting body like an asteroid.
        if (!this.bodyAE) {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            // TODO standardize variable name suffices like position, vector, point, pt.
            const parentPosition = parent.position(date);
            const offset = this.offsetFromParent(date);
            return {
                x: parentPosition.x + offset.x,
                y: parentPosition.y + offset.y,
            };
        }

        return toFixedEclipticPoint(HelioVector(this.bodyAE, date));
    }

    // The simplified Kepler-orbit model (see the semiMajorAxisAu/
    // epochAngleDeg/eccentricity/periapsisLongitudeDeg field comments):
    // this Thing's offset from its immediate parent, with no parent
    // position added in. Split out from position() so orbitPath() can hold
    // the parent fixed across a whole sweep instead of re-fetching it per
    // sample - see orbitPath()'s comment for why that matters.
    offsetFromParent(date: Date): Point2D {
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
        // Mean longitude: this is exact (constant-rate) regardless of
        // eccentricity - it's the *position* angle that isn't, once
        // eccentricity != 0, which is why a circular orbit can read it
        // directly as the position angle but an eccentric one can't.
        const meanLongitudeDeg =
            this.epochAngleDeg +
            (360 * daysSinceEpoch) / this.orbitalPeriodDays;

        if (!this.eccentricity) {
            const angleRad = (meanLongitudeDeg * Math.PI) / 180;
            return {
                x: this.semiMajorAxisAu * Math.cos(angleRad),
                y: this.semiMajorAxisAu * Math.sin(angleRad),
            };
        }
        if (this.periapsisLongitudeDeg === undefined) {
            throw new Error(
                `${this.id} has eccentricity set but no periapsisLongitudeDeg`,
            );
        }

        const meanAnomalyRad =
            ((meanLongitudeDeg - this.periapsisLongitudeDeg) * Math.PI) / 180;
        const eccentricAnomalyRad = solveEccentricAnomaly(
            meanAnomalyRad,
            this.eccentricity,
        );
        const trueAnomalyRad =
            2 *
            Math.atan2(
                Math.sqrt(1 + this.eccentricity) *
                    Math.sin(eccentricAnomalyRad / 2),
                Math.sqrt(1 - this.eccentricity) *
                    Math.cos(eccentricAnomalyRad / 2),
            );
        const radiusAu =
            this.semiMajorAxisAu *
            (1 - this.eccentricity * Math.cos(eccentricAnomalyRad));
        const angleRad =
            (this.periapsisLongitudeDeg * Math.PI) / 180 + trueAnomalyRad;
        return {
            x: radiusAu * Math.cos(angleRad),
            y: radiusAu * Math.sin(angleRad),
        };
    }

    // Traces an object's orbit by sampling its position across one period.
    // Works for any periodic object (planet, moon, Lagrange point), not just planets.
    //
    // Deliberately stops short of a full period (i < samples, not i <=
    // samples): the caller closes the drawn path back to the first point
    // itself (SVG 'Z'), so sampling a last point meant to coincide with the
    // first would be redundant - and it never exactly does, since
    // orbitalPeriodDays is a rounded constant and real orbits precess
    // slightly anyway. For a body with real ephemeris (the bottom loop
    // below), that mismatch shows up as a visible kink right where the
    // sweep wraps back to its own start - see that loop's comment for why
    // it deliberately starts the sweep away from `date`.
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
        // A moon's orbit is drawn around its parent's position AT `date`,
        // held fixed for the whole sweep - not the parent's position at each
        // sample's own (later) date, which is what position() would give if
        // called per sample. The difference matters because a moon is swept
        // across its own full period while its parent keeps moving along a
        // much bigger, slower orbit of its own: eg Jupiter moves ~21 degrees
        // (~1.9 AU of arc) during Himalia's 250-day period, dwarfing
        // Himalia's own ~0.077 AU orbit around Jupiter. Using position()
        // directly would trace mostly Jupiter's own heliocentric drift, not
        // a circle/ellipse around Jupiter - this is why moon orbits used to
        // render "Sol-relative" instead of centered on their parent.
        if (this.parentID !== 'sol') {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            const parentPosition = parent.position(date);
            const points: Point2D[] = [];
            for (let i = 0; i < samples; i++) {
                const dayOffset = (this.orbitalPeriodDays * i) / samples;
                const sampleDate = new Date(
                    date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
                );
                const offset = this.offsetFromParent(sampleDate);
                points.push({
                    x: parentPosition.x + offset.x,
                    y: parentPosition.y + offset.y,
                });
            }
            return points;
        }

        // This body has real ephemeris (astronomy-engine), which doesn't
        // repeat exactly every orbitalPeriodDays the way the simplified
        // moon/asteroid model above does by construction - so the seam
        // where the sweep wraps back to its own start (see the comment
        // above on stopping short of a full period) is a real, visible
        // kink, not just a theoretical one. Starting the sweep half an
        // orbit before `date` instead of at `date` itself puts that seam
        // on the far side of the orbit from the body's current (and
        // visually prominent) position, rather than right on top of it -
        // most noticeable for Jupiter, Saturn, and Uranus, where
        // orbitalPeriodDays is furthest from matching a true 360-degree
        // sweep of the body's real current position.
        const startDate = new Date(
            date.getTime() -
                (this.orbitalPeriodDays / 2) * MILLISECONDS_PER_DAY,
        );
        const points: Point2D[] = [];
        for (let i = 0; i < samples; i++) {
            const dayOffset = (this.orbitalPeriodDays * i) / samples;
            const sampleDate = new Date(
                startDate.getTime() + dayOffset * MILLISECONDS_PER_DAY,
            );
            points.push(this.position(sampleDate));
        }
        return points;
    }

    // A Lagrange point is a position defined by a pair of bodies, so we
    // compute it on demand instead of listing each one as a static def.
    // `this` is the major body (eg Sol) and `smallParent` is the minor body
    // (eg Earth) of the two-body system; `lagrangeNumber` selects which of
    // the 5 points.
    //
    // `bigBody`/`smallBody` are passed explicitly rather than read off
    // this.bodyAE/smallParent.bodyAE, because astronomy-engine's own
    // documented convention for LagrangePoint()'s major_body/minor_body
    // doesn't always match the Body a Thing uses for its own position: eg
    // Earth's own Thing uses Body.EMB (appropriate for its own heliocentric
    // position), but astronomy-engine's Earth-Moon Lagrange point
    // convention specifically wants major_body=Body.Earth, not Body.EMB.
    // Callers must pass whatever astronomy-engine's own docs say for that
    // particular pair - see LagrangePoint()'s doc comment in astronomy.d.ts.
    // Usage: sol.lagrange(earth, 1, Body.Sun, Body.EMB) returns the
    // Sol-Earth L1 point.
    lagrange(
        smallParent: Thing,
        lagrangeNumber: number,
        bigBody: Body,
        smallBody: Body,
    ): Thing {
        const lp = new Thing(
            `${this.name}–${smallParent.name} L${lagrangeNumber}`,
            smallBody,
            'lagrangePoint',
            '#aaffaa',
            smallParent.orbitalPeriodDays,
            this.id, // parentID: the major body, eg 'sol' or 'earth'
        );

        lp.lagrangeNumber = lagrangeNumber;
        lp.bigLagrangeParent = bigBody;
        lp.label = `L${lagrangeNumber}`;

        return lp;
    }
}

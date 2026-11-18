// Every entity that we might display at a location on the map is a Thing, including stars, planets, moons, asteroids, spacecraft, debris, & Lagrange points.

import { Point2D, Point3D, MILLISECONDS_PER_DAY, ThingKind } from './types';
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

// Both exact by definition (IAU 2012 for the AU; SI for c), so their
// ratio - ~499.005 s, light's travel time across 1 AU - is too.
const KM_PER_AU = 149_597_870.7;
const LIGHTSPEED_KM_PER_S = 299_792.458;
const LIGHT_SECONDS_PER_AU = KM_PER_AU / LIGHTSPEED_KM_PER_S;

// TODO put inside class Thing.
function toFixedEcliptic(vector: Vector): Point3D {
    const ecliptic = RotateVector(EQJ_TO_ECL, vector);
    return { x: ecliptic.x, y: ecliptic.y, z: ecliptic.z };
}

// Turns a display name into a Thing.id: lowercase, alphanumeric runs joined
// by single hyphens, no leading/trailing hyphen. Handles names toLowerCase()
// alone can't, eg lagrange()'s "Sol–Earth L1" (en dash + space) -> "sol-earth-l1".
// Apostrophes are dropped rather than hyphenated, so "Halley's Comet" ->
// "halleys-comet", not "halley-s-comet".
function slugify(name: string): string {
    if (name.startsWith('G!kun')) return 'gkunhomdima';

    return name
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Solves Kepler's equation M = E - e*sin(E) for the eccentric anomaly E
// (radians) given the mean anomaly M (radians) and eccentricity e, by
// Newton's method. M is first wrapped into [0, 2pi). The starting guess is
// M itself for e < 0.8, but pi above that: for a near-parabolic orbit (eg
// Halley's e=0.968) a guess of M can overshoot wildly near perihelion,
// where pi is the standard guess that reliably converges for any e < 1.
function solveEccentricAnomaly(
    meanAnomalyRad: number,
    eccentricity: number,
): number {
    meanAnomalyRad =
        ((meanAnomalyRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let eccentricAnomalyRad = eccentricity < 0.8 ? meanAnomalyRad : Math.PI;
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

// Constructor input for Thing: the same fields Thing itself has (see their
// comments there), minus the derived `id`. Optional fields are left
// undefined when omitted, except parentID (defaults to 'sol') and
// eccentricity (defaults to 0, a circular orbit).
export interface ThingOptions {
    name: string;
    aliases?: string[];
    label?: string;
    colorHex: string;
    kind: ThingKind;
    bodyAE?: Body;
    parentID?: string;
    orbitalPeriodDays?: number;
    lagrangeNumber?: number;
    bigLagrangeParent?: Body;
    lagrangeSmallParentID?: string;
    semiMajorAxisAu?: number;
    epochAngleDeg?: number;
    eccentricity?: number;
    periapsisLongitudeDeg?: number;
    retrograde?: boolean;
    diameterKm?: number;
    massKg?: number;
}

export class Thing {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // full display label; also what `id` is slugified from
    // Overrides `name` for display only, eg a Lagrange point's short "L4" -
    // `name` has to stay long enough (eg "Sol–Earth L4") to keep `id`
    // unique from "Earth–Luna L4"'s.
    label?: string;
    // Other names the searchbar should find this Thing by, eg 'Moon' for
    // Luna, or a provisional designation like '2003 AZ84'. Never displayed
    // except to explain a search match. Defaults to none.
    aliases: string[];
    colorHex: string;
    kind: ThingKind;

    // astronomy-engine's identifier for this Thing, when it has one. If this Thing is a Lagrange point, body refers to the smaller of the 2 parent masses.
    bodyAE?: Body;

    parentID: string; // this orbits parent. SOL.parentID === 'sol', ie itself.

    // Used to trace orbitPathAu, and by lagrange() to trace its own orbit path.
    orbitalPeriodDays?: number;

    lagrangeNumber?: number; // for Lagrange points, 1-5.
    // For Lagrange points located via astronomy-engine, the bigger of the 2
    // masses; undefined for one located by analyticLagrangePosition3D().
    bigLagrangeParent?: Body;
    // For Lagrange points, the id of the smaller of the 2 Things (the
    // bigger one is parentID).
    lagrangeSmallParentID?: string;

    // Simplified Kepler-orbit model, used for every Thing with no
    // astronomy-engine body: every moon except Luna (astronomy-engine has
    // no ephemeris for any other, including Jupiter's), plus any Sol-orbiting body
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
    // True for an orbit inclined more than 90 degrees (eg Halley's Comet,
    // 162), ie one that runs clockwise around its parent seen from ecliptic
    // north. This model's flattening has no inclination to express that
    // with, so the direction is a flag instead: it reverses which way the
    // mean longitude advances and which way the true anomaly is measured
    // from periapsis. For such an orbit, the "longitudes" above are the
    // flattened-retrograde equivalents: periapsisLongitudeDeg = OM-W and
    // epochAngleDeg = OM-W-MA, not OM+W and OM+W+MA. Defaults to false.
    retrograde: boolean;

    // Physical properties, for the info menu (ThingMenu) only - the map
    // itself draws fixed-size markers regardless (see RADIUS_PX).
    // Undefined when not meaningfully known, eg a Lagrange point, or a TNO
    // with no moon to measure its mass by. See MAIN_THINGS for sources.
    diameterKm?: number; // mean, or equatorial for planets - see MAIN_THINGS
    massKg?: number;

    // `id` is derived from `name`, never passed in.
    constructor(options: ThingOptions) {
        this.name = options.name;
        this.id = slugify(options.name);
        this.label = options.label;
        this.aliases = options.aliases ?? [];
        this.colorHex = options.colorHex;
        this.kind = options.kind;
        this.bodyAE = options.bodyAE;
        this.parentID = options.parentID ?? 'sol';
        this.orbitalPeriodDays = options.orbitalPeriodDays;
        this.lagrangeNumber = options.lagrangeNumber;
        this.bigLagrangeParent = options.bigLagrangeParent;
        this.lagrangeSmallParentID = options.lagrangeSmallParentID;
        this.semiMajorAxisAu = options.semiMajorAxisAu;
        this.epochAngleDeg = options.epochAngleDeg;
        this.eccentricity = options.eccentricity ?? 0;
        this.periapsisLongitudeDeg = options.periapsisLongitudeDeg;
        this.retrograde = options.retrograde ?? false;
        this.diameterKm = options.diameterKm;
        this.massKg = options.massKg;
    }

    // Could move this to catalog.js if it makes it easier to maintain.
    // diameterKm/massKg sources, fetched 2026-11-09:
    // - Sol, planets, Pluto: NASA Planetary Fact Sheet
    //   (nssdc.gsfc.nasa.gov/planetary/factsheet/). Its planet diameters are
    //   equatorial; Sol's is twice its volumetric mean radius. Luna's mass is
    //   the Moon fact sheet's more precise 7.346e22, not the table's 0.073e24.
    // - Moons: JPL Planetary Satellite Physical Parameters
    //   (ssd.jpl.nasa.gov/sats/phys_par/) - diameter is 2x mean radius, mass
    //   is GM / G (G = 6.6743e-20 km^3 kg^-1 s^-2). Mass is left out where
    //   JPL's GM is unusable: Nereid (listed as 0), and Despina, Galatea,
    //   Larissa, Proteus (GM uncertainty around or above the value itself).
    //   Himalia's mass is kept but rough (GM +/-38%).
    // - Ceres, Vesta: Dawn spacecraft values, via Wikipedia.
    // - TNOs: Wikipedia and Johnston's Archive
    //   (johnstonsarchive.net/astro/tnodiam.html). Mass only where it's been
    //   measured, from a moon's orbit; for Salacia, Uni, Varda, and
    //   G!kun||'homdima only the whole system's mass (primary + moon) is
    //   published, used here as-is since each moon is a small fraction of it.
    static MAIN_THINGS: Thing[] = ((): Thing[] => {
        const things: Thing[] = [
            new Thing({
                name: 'Sol',
                aliases: ['Sun', 'The Sun'],
                diameterKm: 1391400,
                massKg: 1.9884e30,
                bodyAE: Body.Sun,
                kind: 'star',
                colorHex: '#ffd27f',
                orbitalPeriodDays: 0,
            }),
            new Thing({
                name: 'Mercury',
                diameterKm: 4879,
                massKg: 3.3e23,
                bodyAE: Body.Mercury,
                kind: 'heliocentric',
                colorHex: '#9e9e9e',
                orbitalPeriodDays: 87.969,
            }),
            new Thing({
                name: 'Venus',
                diameterKm: 12104,
                massKg: 4.87e24,
                bodyAE: Body.Venus,
                kind: 'heliocentric',
                colorHex: '#e0c074',
                orbitalPeriodDays: 224.701,
            }),
            new Thing({
                name: 'Earth',
                aliases: ['Terra'],
                diameterKm: 12756,
                massKg: 5.97e24,
                // Earth's own center, not Body.EMB (the Earth-Luna
                // barycenter, ~4,700 km away): Luna is placed by
                // astronomy-engine too, relative to the real Earth, so
                // drawing Earth at the barycenter would visibly offset the
                // two when zoomed in. The cost is that Earth's position
                // (and orbit line) wobbles by that ~4,700 km each month -
                // which is real.
                bodyAE: Body.Earth,
                kind: 'heliocentric',
                colorHex: '#4f82c6',
                orbitalPeriodDays: 365.256,
            }),
            new Thing({
                name: 'Luna',
                aliases: ['Moon', 'The Moon'],
                diameterKm: 3475,
                massKg: 7.346e22,
                kind: 'moon',
                colorHex: '#d8d8d8',
                // The only moon astronomy-engine has an ephemeris for, and
                // the one that most needs it: the Sun perturbs Luna's orbit
                // far more than any other moon's, so a single snapshot of
                // its elements (the simplified Kepler model every other
                // moon uses) drifts ~0.1 degrees/day out of phase, and
                // can't follow its periapsis precessing ~40 degrees/year.
                // Its orbit line is a plain circle instead - see orbitPath().
                bodyAE: Body.Moon,
                // Sidereal month. Only used for hide priority and by
                // Earth-Luna Lagrange points; position comes from bodyAE.
                orbitalPeriodDays: 27.321661,
                parentID: 'earth',
            }),
            new Thing({
                name: 'Mars',
                diameterKm: 6792,
                massKg: 6.42e23,
                bodyAE: Body.Mars,
                kind: 'heliocentric',
                colorHex: '#c1562d',
                orbitalPeriodDays: 686.98,
            }),
            new Thing({
                name: 'Phobos',
                diameterKm: 22.2,
                massKg: 1.06e16,
                kind: 'moon',
                colorHex: '#8a7d6b',
                orbitalPeriodDays: 0.3191196,
                parentID: 'mars',
                semiMajorAxisAu: 0.00006268688,
                epochAngleDeg: 176.5605,
            }),
            new Thing({
                name: 'Deimos',
                diameterKm: 12.4,
                massKg: 1.44e15,
                kind: 'moon',
                colorHex: '#a89a86',
                orbitalPeriodDays: 1.262587,
                parentID: 'mars',
                semiMajorAxisAu: 0.0001568129,
                epochAngleDeg: 50.2769,
            }),

            // Asteroids: just the two biggest main-belt bodies for now (Ceres is
            // also classified as a dwarf planet). Smaller Belt objects, Trojans,
            // etc. aren't included.
            new Thing({
                name: 'Ceres',
                diameterKm: 939.4,
                massKg: 9.384e20,
                kind: 'asteroid',
                colorHex: '#b5a898',
                orbitalPeriodDays: 1680.497869,
                parentID: 'sol',
                semiMajorAxisAu: 2.766260186,
                epochAngleDeg: 99.894,
            }),
            new Thing({
                name: 'Vesta',
                diameterKm: 525.4,
                massKg: 2.59e20,
                kind: 'asteroid',
                colorHex: '#cbb89a',
                orbitalPeriodDays: 1325.220467,
                parentID: 'sol',
                semiMajorAxisAu: 2.361165733,
                epochAngleDeg: 16.833,
            }),
            // Smaller asteroids, each with an eccentric enough orbit to be
            // given its real ellipse: elements from JPL Horizons (same epoch
            // and frame as everything here), diameters from JPL's Small-Body
            // Database (ssd-api.jpl.nasa.gov/sbdb.api). Only Eros has a
            // measured mass (NEAR Shoemaker: GM 4.463e-4 km^3/s^2).
            new Thing({
                name: 'Aethra', // 132
                aliases: ['132'],
                diameterKm: 42.9,
                kind: 'asteroid',
                colorHex: '#a8a29a',
                orbitalPeriodDays: 1541.816383,
                parentID: 'sol',
                semiMajorAxisAu: 2.611897639,
                epochAngleDeg: 348.19,
                eccentricity: 0.387174,
                periapsisLongitudeDeg: 153.6828,
            }),
            new Thing({
                name: 'Brucia', // 323
                aliases: ['323'],
                diameterKm: 27.7,
                kind: 'asteroid',
                colorHex: '#c2b49c',
                orbitalPeriodDays: 1343.1419,
                parentID: 'sol',
                semiMajorAxisAu: 2.382405302,
                epochAngleDeg: 312.8011,
                eccentricity: 0.299291,
                periapsisLongitudeDeg: 28.7907,
            }),
            new Thing({
                name: 'Ganymed', // 1036; not Jupiter's moon Ganymede
                aliases: ['1036'],
                diameterKm: 37.7,
                kind: 'asteroid',
                colorHex: '#b9a888',
                orbitalPeriodDays: 1587.746619,
                parentID: 'sol',
                semiMajorAxisAu: 2.663515202,
                epochAngleDeg: 164.66,
                eccentricity: 0.533774,
                periapsisLongitudeDeg: 347.8867,
            }),
            new Thing({
                name: 'Taurinensis', // 512
                aliases: ['512'],
                diameterKm: 23.1,
                kind: 'asteroid',
                colorHex: '#b8ab95',
                orbitalPeriodDays: 1183.277177,
                parentID: 'sol',
                semiMajorAxisAu: 2.189401312,
                epochAngleDeg: 326.199,
                eccentricity: 0.254259,
                periapsisLongitudeDeg: 356.202,
            }),
            new Thing({
                name: 'Ingeborg', // 391
                aliases: ['391'],
                diameterKm: 15.8,
                kind: 'asteroid',
                colorHex: '#c4b8a2',
                orbitalPeriodDays: 1291.191526,
                parentID: 'sol',
                semiMajorAxisAu: 2.32057082,
                epochAngleDeg: 145.9526,
                eccentricity: 0.305665,
                periapsisLongitudeDeg: 359.9386,
            }),
            new Thing({
                name: 'Eros', // 433
                aliases: ['433'],
                diameterKm: 16.84, // volume-equivalent; ~34 x 11 x 11 km
                massKg: 6.687e15,
                kind: 'asteroid',
                colorHex: '#c8a27a',
                orbitalPeriodDays: 643.217433,
                parentID: 'sol',
                semiMajorAxisAu: 1.458275524,
                epochAngleDeg: 269.0942,
                eccentricity: 0.222847,
                periapsisLongitudeDeg: 123.1931,
            }),
            new Thing({
                name: 'Don Quixote', // 3552
                aliases: ['3552'],
                diameterKm: 19,
                kind: 'asteroid',
                colorHex: '#6e6560',
                orbitalPeriodDays: 3223.982811,
                parentID: 'sol',
                semiMajorAxisAu: 4.270999565,
                epochAngleDeg: 293.7238,
                eccentricity: 0.707447,
                periapsisLongitudeDeg: 306.4618,
            }),

            new Thing({
                name: 'Jupiter',
                diameterKm: 142984,
                massKg: 1.898e27,
                bodyAE: Body.Jupiter,
                kind: 'heliocentric',
                colorHex: '#c99a6b',
                orbitalPeriodDays: 4332.59,
            }),
            // Every moon's (and asteroid's) - except Luna's, which comes from
            // astronomy-engine - period, semi-major axis, and mean
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
            new Thing({
                name: 'Io',
                diameterKm: 3643,
                massKg: 8.93e22,
                kind: 'moon',
                colorHex: '#e8d99a',
                orbitalPeriodDays: 1.771433,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.002821179,
                epochAngleDeg: 5.6688,
            }),
            new Thing({
                name: 'Europa',
                diameterKm: 3121.6,
                massKg: 4.8e22,
                kind: 'moon',
                colorHex: '#d8dde0',
                orbitalPeriodDays: 3.552391,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.004486332,
                epochAngleDeg: 181.1794,
            }),
            new Thing({
                name: 'Ganymede',
                diameterKm: 5262.4,
                massKg: 1.48e23,
                kind: 'moon',
                colorHex: '#a9977f',
                orbitalPeriodDays: 7.157812,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.007157128,
                epochAngleDeg: 358.9916,
            }),
            new Thing({
                name: 'Callisto',
                diameterKm: 4820.6,
                massKg: 1.08e23,
                kind: 'moon',
                colorHex: '#7d7265',
                orbitalPeriodDays: 16.692561,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.012586283,
                epochAngleDeg: 252.772,
            }),
            new Thing({
                name: 'Himalia',
                diameterKm: 170,
                massKg: 2.27e18,
                kind: 'moon',
                colorHex: '#8f8064',
                orbitalPeriodDays: 250.285587,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.076529912,
                epochAngleDeg: 149.3419,
            }),
            new Thing({
                name: 'Amalthea',
                diameterKm: 167,
                massKg: 2.47e18,
                kind: 'moon',
                colorHex: '#b08a6a',
                orbitalPeriodDays: 0.501639,
                parentID: 'jupiter',
                semiMajorAxisAu: 0.001216563,
                epochAngleDeg: 294.5177,
            }),

            new Thing({
                name: 'Saturn',
                diameterKm: 120536,
                massKg: 5.68e26,
                bodyAE: Body.Saturn,
                kind: 'heliocentric',
                colorHex: '#d4c58a',
                orbitalPeriodDays: 10759.22,
            }),
            new Thing({
                name: 'Titan',
                diameterKm: 5149.5,
                massKg: 1.35e23,
                kind: 'moon',
                colorHex: '#d9b36c',
                orbitalPeriodDays: 15.947349,
                parentID: 'saturn',
                semiMajorAxisAu: 0.00816813,
                epochAngleDeg: 93.0371,
            }),
            new Thing({
                name: 'Mimas',
                diameterKm: 396.4,
                massKg: 3.75e19,
                kind: 'moon',
                colorHex: '#c9c9c9',
                orbitalPeriodDays: 0.947399,
                parentID: 'saturn',
                semiMajorAxisAu: 0.001243515,
                epochAngleDeg: 72.9939,
            }),
            new Thing({
                name: 'Enceladus',
                diameterKm: 504.2,
                massKg: 1.08e20,
                kind: 'moon',
                colorHex: '#eef0f2',
                orbitalPeriodDays: 1.374539,
                parentID: 'saturn',
                semiMajorAxisAu: 0.001593679,
                epochAngleDeg: 106.3438,
            }),
            new Thing({
                name: 'Tethys',
                diameterKm: 1062.2,
                massKg: 6.17e20,
                kind: 'moon',
                colorHex: '#d8d8d8',
                orbitalPeriodDays: 1.891653,
                parentID: 'saturn',
                semiMajorAxisAu: 0.001971774,
                epochAngleDeg: 177.9322,
            }),
            new Thing({
                name: 'Dione',
                diameterKm: 1122.8,
                massKg: 1.1e21,
                kind: 'moon',
                colorHex: '#cfcfcf',
                orbitalPeriodDays: 2.74034,
                parentID: 'saturn',
                semiMajorAxisAu: 0.002524445,
                epochAngleDeg: 60.738,
            }),
            new Thing({
                name: 'Rhea',
                diameterKm: 1527,
                massKg: 2.31e21,
                kind: 'moon',
                colorHex: '#bdbdbd',
                orbitalPeriodDays: 4.520396,
                parentID: 'saturn',
                semiMajorAxisAu: 0.003524366,
                epochAngleDeg: 302.8426,
            }),
            new Thing({
                name: 'Hyperion',
                diameterKm: 270,
                massKg: 5.55e18,
                kind: 'moon',
                colorHex: '#a89880',
                orbitalPeriodDays: 21.382504,
                parentID: 'saturn',
                semiMajorAxisAu: 0.009931201,
                epochAngleDeg: 345.79,
            }),
            new Thing({
                name: 'Iapetus',
                diameterKm: 1468.6,
                massKg: 1.81e21,
                kind: 'moon',
                colorHex: '#8f8370',
                orbitalPeriodDays: 79.471398,
                parentID: 'saturn',
                semiMajorAxisAu: 0.023828887,
                epochAngleDeg: 69.7235,
            }),
            new Thing({
                name: 'Phoebe',
                diameterKm: 213,
                massKg: 8.31e18,
                kind: 'moon',
                colorHex: '#6f6a63',
                orbitalPeriodDays: 548.154922,
                parentID: 'saturn',
                semiMajorAxisAu: 0.086343888,
                epochAngleDeg: 266.5226,
            }),
            new Thing({
                name: 'Janus',
                diameterKm: 178.4,
                massKg: 1.9e18,
                kind: 'moon',
                colorHex: '#b9b4a8',
                orbitalPeriodDays: 0.700196,
                parentID: 'saturn',
                semiMajorAxisAu: 0.001016504,
                epochAngleDeg: 271.3066,
            }),
            // new Thing({ name: 'Epimetheus', kind: 'moon', colorHex: '#b0ab9f', orbitalPeriodDays: 0.699856, parentID: 'saturn', semiMajorAxisAu: 0.001016175, epochAngleDeg: 341.6707 }),

            new Thing({
                name: 'Uranus',
                diameterKm: 51118,
                massKg: 8.68e25,
                bodyAE: Body.Uranus,
                kind: 'heliocentric',
                colorHex: '#9fd4d8',
                orbitalPeriodDays: 30688.5,
            }),
            new Thing({
                name: 'Miranda',
                diameterKm: 471.6,
                massKg: 6.44e19,
                kind: 'moon',
                colorHex: '#9fa8ad',
                orbitalPeriodDays: 1.413995,
                parentID: 'uranus',
                semiMajorAxisAu: 0.000868135,
                epochAngleDeg: 281.0398,
            }),
            new Thing({
                name: 'Ariel',
                diameterKm: 1157.8,
                massKg: 1.25e21,
                kind: 'moon',
                colorHex: '#b9c4c9',
                orbitalPeriodDays: 2.52079,
                parentID: 'uranus',
                semiMajorAxisAu: 0.001276386,
                epochAngleDeg: 37.8302,
            }),
            new Thing({
                name: 'Umbriel',
                diameterKm: 1169.4,
                massKg: 1.28e21,
                kind: 'moon',
                colorHex: '#7d7d80',
                orbitalPeriodDays: 4.145019,
                parentID: 'uranus',
                semiMajorAxisAu: 0.001778178,
                epochAngleDeg: 359.8002,
            }),
            new Thing({
                name: 'Titania',
                diameterKm: 1577.8,
                massKg: 3.4e21,
                kind: 'moon',
                colorHex: '#9aa6ad',
                orbitalPeriodDays: 8.704609,
                parentID: 'uranus',
                semiMajorAxisAu: 0.002916043,
                epochAngleDeg: 154.1154,
            }),
            new Thing({
                name: 'Oberon',
                diameterKm: 1522.8,
                massKg: 3.08e21,
                kind: 'moon',
                colorHex: '#8f8a84',
                orbitalPeriodDays: 13.466214,
                parentID: 'uranus',
                semiMajorAxisAu: 0.003900537,
                epochAngleDeg: 242.4414,
            }),

            new Thing({
                name: 'Neptune',
                diameterKm: 49528,
                massKg: 1.02e26,
                bodyAE: Body.Neptune,
                kind: 'heliocentric',
                colorHex: '#5a74e0',
                orbitalPeriodDays: 60182,
            }),
            new Thing({
                name: 'Triton',
                diameterKm: 2705.2,
                massKg: 2.14e22,
                kind: 'moon',
                colorHex: '#c9d8e0',
                orbitalPeriodDays: 5.877119,
                parentID: 'neptune',
                semiMajorAxisAu: 0.002371476,
                epochAngleDeg: 59.9426,
            }),
            // Nereid's orbit is eccentric enough (e=0.746) that the plain
            // circular model above would put it visibly in the wrong place -
            // same EC/OM/W/MA source and epoch as everything else here, just
            // also given eccentricity + periapsisLongitudeDeg (OM+W) so
            // offsetFromParent() solves the real ellipse instead.
            new Thing({
                name: 'Nereid',
                diameterKm: 340,
                kind: 'moon',
                colorHex: '#9fa0a3',
                orbitalPeriodDays: 360.655661,
                parentID: 'neptune',
                semiMajorAxisAu: 0.036892716,
                epochAngleDeg: 194.1457,
                eccentricity: 0.7461,
                periapsisLongitudeDeg: 256.0251,
            }),
            new Thing({
                name: 'Despina',
                diameterKm: 148,
                kind: 'moon',
                colorHex: '#8f909a',
                orbitalPeriodDays: 0.335448,
                parentID: 'neptune',
                semiMajorAxisAu: 0.00035153,
                epochAngleDeg: 252.0855,
            }),
            new Thing({
                name: 'Galatea',
                diameterKm: 158,
                kind: 'moon',
                colorHex: '#8a8b94',
                orbitalPeriodDays: 0.429472,
                parentID: 'neptune',
                semiMajorAxisAu: 0.000414479,
                epochAngleDeg: 88.0302,
            }),
            new Thing({
                name: 'Larissa',
                diameterKm: 192,
                kind: 'moon',
                colorHex: '#7f8089',
                orbitalPeriodDays: 0.555318,
                parentID: 'neptune',
                semiMajorAxisAu: 0.000491934,
                epochAngleDeg: 317.6936,
            }),
            new Thing({
                name: 'Proteus',
                diameterKm: 416,
                kind: 'moon',
                colorHex: '#6f7079',
                orbitalPeriodDays: 1.122823,
                parentID: 'neptune',
                semiMajorAxisAu: 0.000786598,
                epochAngleDeg: 285.4243,
            }),

            new Thing({
                name: 'Pluto',
                diameterKm: 2376,
                massKg: 1.303e22,
                bodyAE: Body.Pluto,
                kind: 'heliocentric',
                colorHex: '#b8a08c',
                orbitalPeriodDays: 90560,
            }),
            new Thing({
                name: 'Charon',
                diameterKm: 1212,
                massKg: 1.59e21,
                kind: 'moon',
                colorHex: '#a89a8c',
                orbitalPeriodDays: 6.387221,
                parentID: 'pluto',
                semiMajorAxisAu: 0.00013099,
                epochAngleDeg: 195.0751,
            }),
            // Other Trans-Neptunian objects (TNOs): every one with a best current
            // measured diameter of at least 668 km. Diameters
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
            new Thing({
                name: 'Orcus',
                diameterKm: 910,
                massKg: 5.478e20,
                kind: 'asteroid',
                colorHex: '#9fb0b8',
                orbitalPeriodDays: 89858.842999,
                parentID: 'sol',
                semiMajorAxisAu: 39.279780416,
                epochAngleDeg: 171.948,
            }),
            new Thing({
                name: 'Achlys', // 2003 AZ84
                aliases: ['2003 AZ84'],
                diameterKm: 772, // occultation; Johnston's older thermal value is 686
                kind: 'asteroid',
                colorHex: '#8f7a6a',
                orbitalPeriodDays: 90511.211881,
                parentID: 'sol',
                semiMajorAxisAu: 39.469663417,
                epochAngleDeg: 150.7006,
            }),
            new Thing({
                name: 'Ixion',
                diameterKm: 697,
                kind: 'asteroid',
                colorHex: '#7a5248',
                orbitalPeriodDays: 90604.038287,
                parentID: 'sol',
                semiMajorAxisAu: 39.496644981,
                epochAngleDeg: 307.256,
                eccentricity: 0.244049,
                periapsisLongitudeDeg: 10.8943,
            }),
            new Thing({
                name: 'Ritona', // 2005 RN43
                aliases: ['2005 RN43'],
                diameterKm: 679,
                kind: 'asteroid',
                colorHex: '#827a70',
                orbitalPeriodDays: 97629.551428,
                parentID: 'sol',
                semiMajorAxisAu: 41.512864217,
                epochAngleDeg: 354.7265,
            }),
            new Thing({
                name: 'Mani', // 2002 MS4
                aliases: ['2002 MS4'],
                diameterKm: 796,
                kind: 'asteroid',
                colorHex: '#7a5f55',
                orbitalPeriodDays: 98422.675932,
                parentID: 'sol',
                semiMajorAxisAu: 41.737389478,
                epochAngleDeg: 302.43,
            }),
            new Thing({
                name: 'Goibniu', // 2004 GV9
                aliases: ['2004 GV9'],
                diameterKm: 680,
                kind: 'asteroid',
                colorHex: '#8a7a68',
                orbitalPeriodDays: 99157.788905,
                parentID: 'sol',
                semiMajorAxisAu: 41.944954311,
                epochAngleDeg: 232.9718,
            }),
            new Thing({
                name: 'Salacia',
                diameterKm: 838,
                massKg: 4.861e20, // system, incl. Actaea
                kind: 'asteroid',
                colorHex: '#6b6b6f',
                orbitalPeriodDays: 99445.037399,
                parentID: 'sol',
                semiMajorAxisAu: 42.025921662,
                epochAngleDeg: 4.1625,
            }),
            new Thing({
                name: 'Uni', // 2002 UX25
                aliases: ['2002 UX25'],
                diameterKm: 659, // ALMA 2017; 2026 occultations suggest ~570-610
                massKg: 1.25e20, // system, incl. Tinia
                kind: 'asteroid',
                colorHex: '#7d7d7d',
                orbitalPeriodDays: 101730.412251,
                parentID: 'sol',
                semiMajorAxisAu: 42.667353498,
                epochAngleDeg: 71.1968,
            }),
            new Thing({
                name: 'Varuna',
                diameterKm: 654,
                kind: 'asteroid',
                colorHex: '#9a6a52',
                orbitalPeriodDays: 102737.646564,
                parentID: 'sol',
                semiMajorAxisAu: 42.948524187,
                epochAngleDeg: 126.8887,
            }),
            new Thing({
                name: 'Haumea',
                diameterKm: 1544, // volume-equivalent mean; Haumea is very elongated
                massKg: 3.952e21,
                kind: 'asteroid',
                colorHex: '#eef2f5',
                orbitalPeriodDays: 103290.237023,
                parentID: 'sol',
                semiMajorAxisAu: 43.102390018,
                epochAngleDeg: 226.4926,
                eccentricity: 0.195026,
                periapsisLongitudeDeg: 1.8938,
            }),
            new Thing({
                name: 'Quaoar',
                diameterKm: 1116,
                massKg: 1.212e21,
                kind: 'asteroid',
                colorHex: '#8a6a5a',
                orbitalPeriodDays: 104127.208876,
                parentID: 'sol',
                semiMajorAxisAu: 43.334918876,
                epochAngleDeg: 285.5082,
            }),
            new Thing({
                name: 'Makemake',
                diameterKm: 1430,
                massKg: 2.69e21,
                kind: 'asteroid',
                colorHex: '#b5704a',
                orbitalPeriodDays: 112022.364296,
                parentID: 'sol',
                semiMajorAxisAu: 45.498630639,
                epochAngleDeg: 187.1252,
            }),
            new Thing({
                name: 'Varda',
                diameterKm: 648, // 2026 volume-equivalent; 2020's area-equivalent was 740
                massKg: 2.675e20, // system, incl. Ilmare
                kind: 'asteroid',
                colorHex: '#857064',
                orbitalPeriodDays: 112934.211987,
                parentID: 'sol',
                semiMajorAxisAu: 45.745198902,
                epochAngleDeg: 286.7399,
            }),
            new Thing({
                name: 'Aya', // 2002 AW197
                aliases: ['2002 AW197'],
                diameterKm: 802,
                kind: 'asteroid',
                colorHex: '#9a5a46',
                orbitalPeriodDays: 118349.368157,
                parentID: 'sol',
                semiMajorAxisAu: 47.196065893,
                epochAngleDeg: 176.5155,
            }),
            new Thing({
                name: 'Chiminigagua', // 2013 FY27
                aliases: ['2013 FY27'],
                diameterKm: 742,
                kind: 'asteroid',
                colorHex: '#7d7873',
                orbitalPeriodDays: 164520.090082,
                parentID: 'sol',
                semiMajorAxisAu: 58.786074691,
                epochAngleDeg: 185.7727,
                eccentricity: 0.394895,
                periapsisLongitudeDeg: 326.2602,
            }),
            new Thing({
                name: 'Gonggong',
                diameterKm: 1230,
                massKg: 1.75e21,
                kind: 'asteroid',
                colorHex: '#a84a3a',
                orbitalPeriodDays: 200476.359847,
                parentID: 'sol',
                semiMajorAxisAu: 67.066238396,
                epochAngleDeg: 295.0887,
                eccentricity: 0.503411,
                periapsisLongitudeDeg: 183.8297,
            }),
            new Thing({
                name: 'Eris',
                diameterKm: 2326,
                massKg: 1.638e22,
                kind: 'asteroid',
                colorHex: '#e8e4da',
                orbitalPeriodDays: 203938.828094,
                parentID: 'sol',
                semiMajorAxisAu: 67.836241717,
                epochAngleDeg: 38.3488,
                eccentricity: 0.438418,
                periapsisLongitudeDeg: 187.1967,
            }),
            new Thing({
                name: "G!kún||'hòmdímà", // 2007 UK126, aka Gkunhomdima
                aliases: ['2007 UK126'],
                diameterKm: 634,
                massKg: 1.361e20, // system, incl. G!o'e !Hu
                kind: 'asteroid',
                colorHex: '#8c4536',
                orbitalPeriodDays: 229715.696183,
                parentID: 'sol',
                semiMajorAxisAu: 73.438243982,
                epochAngleDeg: 106.4853,
                eccentricity: 0.48874,
                periapsisLongitudeDeg: 117.6101,
            }),
            new Thing({
                name: 'Sedna',
                diameterKm: 906,
                kind: 'asteroid',
                colorHex: '#8b2e22',
                orbitalPeriodDays: 4160095.140159,
                parentID: 'sol',
                semiMajorAxisAu: 506.443123106,
                epochAngleDeg: 94.1288,
                eccentricity: 0.849556,
                periapsisLongitudeDeg: 95.6863,
            }),

            // Comets: elements from JPL Horizons, same epoch and frame as
            // everything above (each comet's current-apparition solution).
            // Diameters are nucleus diameters from JPL's Small-Body Database
            // (ssd-api.jpl.nasa.gov/sbdb.api); none has a measured mass, and
            // Pons-Brooks has no diameter there either. Swift-Tuttle and
            // Halley are retrograde (inclined 113 and 162 degrees) - see the
            // `retrograde` field. Swift-Tuttle is closest to perpendicular to
            // the ecliptic of anything here, so its flattened ellipse is the
            // least like its real projected path.
            new Thing({
                name: 'Swift–Tuttle', // 109P
                aliases: ['109P'],
                diameterKm: 26,
                kind: 'comet',
                colorHex: '#bfe3ff',
                orbitalPeriodDays: 48908.527297,
                parentID: 'sol',
                semiMajorAxisAu: 26.173237093,
                epochAngleDeg: 255.5713,
                eccentricity: 0.96337,
                periapsisLongitudeDeg: 346.6655,
                retrograde: true,
            }),
            new Thing({
                name: 'Neujmin 1', // 28P
                aliases: ['28P'],
                diameterKm: 21.4,
                kind: 'comet',
                colorHex: '#a9cbe0',
                orbitalPeriodDays: 6728.669237,
                parentID: 'sol',
                semiMajorAxisAu: 6.975154561,
                epochAngleDeg: 84.4638,
                eccentricity: 0.772262,
                periapsisLongitudeDeg: 333.8201,
            }),
            new Thing({
                name: 'Pons–Brooks', // 12P
                aliases: ['12P'],
                kind: 'comet',
                colorHex: '#b5ffe9',
                orbitalPeriodDays: 26277.809923,
                parentID: 'sol',
                semiMajorAxisAu: 17.297917708,
                epochAngleDeg: 107.6186,
                eccentricity: 0.954792,
                periapsisLongitudeDeg: 94.9081,
            }),
            new Thing({
                name: "Halley's Comet", // 1P
                aliases: ['1P', 'Comet Halley'],
                diameterKm: 11, // mean; the nucleus is ~15 x 8 km
                kind: 'comet',
                colorHex: '#d6ecff',
                orbitalPeriodDays: 27567.995133,
                parentID: 'sol',
                semiMajorAxisAu: 17.859577104,
                epochAngleDeg: 112.8075,
                eccentricity: 0.968037,
                periapsisLongitudeDeg: 307.0992,
                retrograde: true,
            }),
        ];

        const sol = things.find((thing) => thing.id === 'sol')!;
        const earth = things.find((thing) => thing.id === 'earth')!;
        const luna = things.find((thing) => thing.id === 'luna')!;
        // Lagrange points that are always on the map: Sol-Earth L1 & L2
        // (where real spacecraft are parked) and all 5 Earth-Luna points.
        // Every other Lagrange point, Sol-Earth L3-L5 included, only
        // appears while its small body is selected - see
        // lagrangePointsWithParent().
        for (const lagrangeNumber of [1, 2, 3, 4, 5]) {
            if (lagrangeNumber <= 2) {
                things.push(
                    sol.lagrange(earth, lagrangeNumber, Body.Sun, Body.EMB),
                );
            }
            // From astronomy-engine, the same as Earth (Body.Earth) and Luna
            // (Body.Moon) themselves. All three have to come from the same
            // model: mixing in a different one for any of them (eg the
            // simplified Kepler model for Luna, or Body.EMB for Earth)
            // knocks L1, Luna and L2 visibly out of line. Flattening onto
            // the ecliptic keeps a straight 3D line straight, so they stay
            // collinear on the map too.
            things.push(
                earth.lagrange(luna, lagrangeNumber, Body.Earth, Body.Moon),
            );
        }
        return things;
    })();

    static byID(id: string): Thing | undefined {
        return Thing.MAIN_THINGS.find((thing) => thing.id === id);
    }

    // Flattened onto the ecliptic plane: this map is 2D and does not express
    // orbital tilt (eg Pluto's), so we discard the z-component.
    // Expressed in astronomical units (AU).
    position(date: Date): Point2D {
        const { x, y } = this.position3D(date);
        return { x, y };
    }

    // True distance from Sol's center, in AU, at `date`. Uses position3D()
    // rather than the flattened position(), since dropping z understates
    // the distance of anything well off the ecliptic plane (eg Pluto, ~17
    // degrees). For a Thing on the simplified Kepler model (z is always 0
    // there), the in-plane ellipse radius is already the true orbital
    // radius - that model ignores inclination rather than projecting it -
    // so this is still right.
    distanceFromSolAu(date: Date): number {
        const { x, y, z } = this.position3D(date);
        return Math.hypot(x, y, z);
    }

    // How long light takes to travel between this Thing and `other` at
    // `date`, in seconds - eg ~500 for Sol-Earth, ~1.3 for
    // Earth-Luna. Straight-line distance between their position3D()s, so
    // it has the same limit as that model: two bodies on the simplified
    // Kepler model (z = 0, no inclination) are treated as sharing the
    // ecliptic plane, so eg Eris (inclined ~44 degrees) vs Neptune comes
    // out somewhat off. Anything involving Earth is barely affected, since
    // Earth sits at ~1 AU and nearly on the ecliptic anyway.
    // No default date: defaulting to now is how the info menu came to show
    // today's lag whatever date the map was showing.
    lightSeconds(other: Thing, date: Date): number {
        const a = this.position3D(date);
        const b = other.position3D(date);
        const distanceAu = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        return distanceAu * LIGHT_SECONDS_PER_AU;
    }

    // Heliocentric position in the fixed J2000 ecliptic frame (see
    // EQJ_TO_ECL), in AU, before position() flattens it. z is the height
    // above/below the ecliptic plane: real for astronomy-engine bodies and
    // Lagrange points; for the simplified Kepler model, just the parent's
    // own z (the model has no inclination of its own).
    position3D(date: Date): Point3D {
        if (this.lagrangeNumber && this.bigLagrangeParent === undefined) {
            return this.analyticLagrangePosition3D(date);
        }
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

            return toFixedEcliptic(
                new Vector(
                    stateVector.x + majorBodyVector.x,
                    stateVector.y + majorBodyVector.y,
                    stateVector.z + majorBodyVector.z,
                    stateVector.t,
                ),
            );
        }

        // TODO case where there's no Body and no known parent (eg spacecraft)

        // Anything astronomy-engine doesn't track directly: every moon but
        // Luna, or a Sol-orbiting body like an asteroid.
        if (!this.bodyAE) {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            // TODO standardize variable name suffices like position, vector, point, pt.
            const parentPosition = parent.position3D(date);
            const offset = this.offsetFromParent(date);
            return {
                x: parentPosition.x + offset.x,
                y: parentPosition.y + offset.y,
                z: parentPosition.z,
            };
        }

        return toFixedEcliptic(HelioVector(this.bodyAE, date));
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
        const direction = this.retrograde ? -1 : 1;
        // Mean longitude: this is exact (constant-rate) regardless of
        // eccentricity - it's the *position* angle that isn't, once
        // eccentricity != 0, which is why it goes through Kepler's
        // equation below. (For a circular orbit, mean anomaly = eccentric
        // anomaly = true anomaly, so that reduces to reading the mean
        // longitude directly as the position angle.)
        const meanLongitudeDeg =
            this.epochAngleDeg +
            (direction * 360 * daysSinceEpoch) / this.orbitalPeriodDays;
        const meanAnomalyRad =
            (direction *
                (meanLongitudeDeg - this.simplePeriapsisLongitudeDeg()) *
                Math.PI) /
            180;
        return this.offsetAtEccentricAnomaly(
            solveEccentricAnomaly(meanAnomalyRad, this.eccentricity),
        );
    }

    // The simplified Kepler-orbit model's offset from the parent at a given
    // eccentric anomaly - ie a point on the orbit's fixed ellipse, with no
    // time involved. Used by offsetFromParent() (at the date's anomaly) and
    // by orbitPath() (sampling the whole ellipse evenly).
    private offsetAtEccentricAnomaly(eccentricAnomalyRad: number): Point2D {
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
        const direction = this.retrograde ? -1 : 1;
        const angleRad =
            (this.simplePeriapsisLongitudeDeg() * Math.PI) / 180 +
            direction * trueAnomalyRad;
        return {
            x: radiusAu * Math.cos(angleRad),
            y: radiusAu * Math.sin(angleRad),
        };
    }

    // periapsisLongitudeDeg, which a circular orbit doesn't need (any
    // direction works as its "periapsis"; 0 is used), but an eccentric one
    // does.
    private simplePeriapsisLongitudeDeg(): number {
        if (!this.eccentricity) {
            return 0;
        }
        if (this.periapsisLongitudeDeg === undefined) {
            throw new Error(
                `${this.id} has eccentricity set but no periapsisLongitudeDeg`,
            );
        }
        return this.periapsisLongitudeDeg;
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
    orbitPath(date: Date, samples: number = 2000): Point2D[] {
        // The simplified Kepler model (every moon, plus asteroids, TNOs, and
        // comets): its orbit is a fixed ellipse, so it's traced directly,
        // sampled evenly by eccentric anomaly rather than by time. Even time
        // steps would bunch samples up at aphelion, where the body is
        // slowest, and spread them thinnest at perihelion, where the curve
        // is tightest - eg one 14-day step of Halley's Comet near perihelion
        // covers ~0.4 AU, a visibly jagged corner. Even eccentric-anomaly
        // steps are densest near perihelion instead. It also closes exactly,
        // with no seam where a time sweep wraps back to its start.
        //
        // A moon's orbit is drawn around its parent's position AT `date`,
        // held fixed for the whole ellipse - not the parent's position at
        // each sample's own date. The difference matters because a moon is
        // swept across its own full period while its parent keeps moving
        // along a much bigger, slower orbit of its own: eg Jupiter moves ~21
        // degrees (~1.9 AU of arc) during Himalia's 250-day period, dwarfing
        // Himalia's own ~0.077 AU orbit around Jupiter. Tracing positions
        // across that period would trace mostly Jupiter's own heliocentric
        // drift, not an ellipse around Jupiter - this is why moon orbits
        // used to render "Sol-relative" instead of centered on their parent.
        // A moon astronomy-engine tracks (ie Luna): a plain circle around
        // its parent's position at `date`, at its current distance, so it
        // passes right through the moon's marker. Its real path never
        // closes on itself (its orbit shifts noticeably every month), and
        // a circle reads cleanly where an exact trace would leave a gap.
        if (
            this.bodyAE !== undefined &&
            !this.lagrangeNumber &&
            this.parentID !== 'sol' &&
            this.parentID !== this.id
        ) {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            const center = parent.position(date);
            const current = this.position(date);
            const radius = Math.hypot(
                current.x - center.x,
                current.y - center.y,
            );
            const points: Point2D[] = [];
            for (let i = 0; i < samples; i++) {
                const angle = (2 * Math.PI * i) / samples;
                points.push({
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                });
            }
            return points;
        }

        if (!this.bodyAE && !this.lagrangeNumber) {
            const parent = Thing.byID(this.parentID);
            if (!parent) {
                throw new Error(
                    `${this.id}'s parentID "${this.parentID}" doesn't match any Thing`,
                );
            }
            const parentPosition = parent.position(date);
            const points: Point2D[] = [];
            for (let i = 0; i < samples; i++) {
                const offset = this.offsetAtEccentricAnomaly(
                    (2 * Math.PI * i) / samples,
                );
                points.push({
                    x: parentPosition.x + offset.x,
                    y: parentPosition.y + offset.y,
                });
            }
            return points;
        }

        // This body has real ephemeris (astronomy-engine), which doesn't
        // repeat exactly every orbitalPeriodDays the way the simplified
        // model's ellipse above does by construction - so the seam
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
    // With `bigBody`/`smallBody`, the point's position comes from
    // astronomy-engine's LagrangePoint(). They're passed explicitly rather
    // than read off this.bodyAE/smallParent.bodyAE, because
    // astronomy-engine's own documented convention for LagrangePoint()'s
    // major_body/minor_body doesn't always match the Body a Thing uses for
    // its own position: eg Earth's own Thing uses Body.Earth, but
    // astronomy-engine's Sol-Earth Lagrange point convention specifically
    // wants minor_body=Body.EMB, not Body.Earth. Callers must pass whatever astronomy-engine's own docs
    // say for that particular pair - see LagrangePoint()'s doc comment in
    // astronomy.d.ts. Usage: sol.lagrange(earth, 1, Body.Sun, Body.EMB)
    // returns the Sol-Earth L1 point.
    //
    // Without them, it's approximated from the two Things' own positions
    // and masses instead - see analyticLagrangePosition3D(). Both Things
    // then need massKg.
    lagrange(
        smallParent: Thing,
        lagrangeNumber: number,
        bigBody?: Body,
        smallBody?: Body,
    ): Thing {
        const useAstronomyEngine =
            bigBody !== undefined && smallBody !== undefined;
        return new Thing({
            name: `${this.name}–${smallParent.name} L${lagrangeNumber}`,
            label: `L${lagrangeNumber}`,
            bodyAE: useAstronomyEngine ? smallBody : undefined,
            kind: 'lagrangePoint',
            colorHex: '#aaffaa',
            orbitalPeriodDays: smallParent.orbitalPeriodDays,
            parentID: this.id, // major body, eg 'sol' or 'earth'
            lagrangeNumber,
            bigLagrangeParent: useAstronomyEngine ? bigBody : undefined,
            lagrangeSmallParentID: smallParent.id,
        });
    }

    // The 5 Lagrange points of this Thing and the Thing it orbits (eg
    // Sol-Mars, Jupiter-Europa), as new Things - or [] if they can't be
    // computed: Sol (orbits nothing), a Lagrange point itself, or a pair
    // where either body's mass is unknown (eg Sedna, Nereid). A planet
    // orbiting Sol uses astronomy-engine's precise LagrangePoint(); every
    // other pair, the mass-based approximation (see lagrange()).
    lagrangePointsWithParent(): Thing[] {
        if (this.kind === 'lagrangePoint' || this.parentID === this.id) {
            return [];
        }
        const parent = Thing.byID(this.parentID);
        if (!parent) {
            return [];
        }
        const lagrangeNumbers = [1, 2, 3, 4, 5];
        if (parent.kind === 'star' && this.bodyAE !== undefined) {
            // See lagrange(): Sol-Earth points want Body.EMB.
            const smallBody =
                this.bodyAE === Body.Earth ? Body.EMB : this.bodyAE;
            return lagrangeNumbers.map((n) =>
                parent.lagrange(this, n, Body.Sun, smallBody),
            );
        }
        if (parent.massKg === undefined || this.massKg === undefined) {
            return [];
        }
        return lagrangeNumbers.map((n) => parent.lagrange(this, n));
    }

    // Approximate Lagrange point position for a lagrange() Thing made
    // without astronomy-engine bodies, from the restricted three-body
    // problem's standard small-mass-ratio results. With r the vector from
    // the big body to the small one and mu = m_small / (m_big + m_small):
    // - L1, L2: on the line through both, at r * (1 -/+ (mu/3)^(1/3)) from
    //   the big body - the Hill-sphere approximation, good for mu << 1
    //   (nearly every pair here; the exception is Pluto-Charon, mu ~0.11,
    //   where it's only rough).
    // - L3: opposite the small body, at -r * (1 + 5mu/12).
    // - L4, L5: r rotated 60 degrees ahead of / behind the small body in
    //   its orbit (counterclockwise in the ecliptic, unless retrograde),
    //   so each forms an equilateral triangle with the two bodies.
    // As with the rest of the simplified Kepler model, rotation is within
    // the ecliptic plane only.
    private analyticLagrangePosition3D(date: Date): Point3D {
        const big = Thing.byID(this.parentID);
        const small = Thing.byID(this.lagrangeSmallParentID ?? '');
        if (
            !big ||
            !small ||
            big.massKg === undefined ||
            small.massKg === undefined
        ) {
            throw new Error(
                `${this.id} needs both parents, with massKg, to locate it`,
            );
        }
        const bigPosition = big.position3D(date);
        const smallPosition = small.position3D(date);
        const r = {
            x: smallPosition.x - bigPosition.x,
            y: smallPosition.y - bigPosition.y,
            z: smallPosition.z - bigPosition.z,
        };
        const mu = small.massKg / (big.massKg + small.massKg);
        const hill = Math.cbrt(mu / 3);
        const offsetAlongR = (scale: number): Point3D => ({
            x: bigPosition.x + r.x * scale,
            y: bigPosition.y + r.y * scale,
            z: bigPosition.z + r.z * scale,
        });
        switch (this.lagrangeNumber) {
            case 1:
                return offsetAlongR(1 - hill);
            case 2:
                return offsetAlongR(1 + hill);
            case 3:
                return offsetAlongR(-(1 + (5 * mu) / 12));
            case 4:
            case 5: {
                // "Ahead" is clockwise for a retrograde small body.
                const aheadDeg = small.retrograde ? -60 : 60;
                const angleRad =
                    ((this.lagrangeNumber === 4 ? aheadDeg : -aheadDeg) *
                        Math.PI) /
                    180;
                const cos = Math.cos(angleRad);
                const sin = Math.sin(angleRad);
                return {
                    x: bigPosition.x + r.x * cos - r.y * sin,
                    y: bigPosition.y + r.x * sin + r.y * cos,
                    z: bigPosition.z + r.z,
                };
            }
            default:
                throw new Error(
                    `${this.id} has invalid lagrangeNumber ${this.lagrangeNumber}`,
                );
        }
    }
}

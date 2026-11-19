// Fetches spacecraft trajectories from JPL Horizons and writes them, much
// simplified, to src/orbital/spacecraftData.ts - checked in, so the map
// never waits on (or depends on) Horizons at runtime. Rerun it every few
// months: Horizons' predictions run out (eg the ISS's only ~1 month ahead),
// and missions change course.
//
//     npm run fetchspacecraft
//
// Each spacecraft's trajectory becomes a list of phases, each one simple
// shape the map can compute instantly:
// - 'ellipse': a fixed Kepler orbit around one body (Sol, or eg Mars). Found
//   automatically by scanning Horizons' osculating elements every
//   SCAN_STEP_DAYS and starting a new phase wherever they jump (a flyby or
//   engine burn) or drift too far (eg approaching Jupiter). Phases shorter
//   than MIN_PHASE_DAYS - the noisy days of a flyby itself - are dropped, so
//   the craft just isn't drawn then. With `holdUntil`, the last phase is
//   stretched that far past Horizons' coverage - for an orbiter whose
//   final orbit is a fine guess at where it'll stay.
// - 'snapshot': one fixed Kepler orbit around a planet or moon, from
//   Horizons' elements at about the time this script runs - for orbiters
//   (eg MRO, the ISS), whose low orbits drift too fast for 'ellipse' scans
//   to settle, and whose position along that orbit is only illustrative
//   anyway at the map's scale. Drawn from `start` to `holdUntil`.
// - 'track': sampled 3D positions, for anything on a near-straight escape
//   path out of the solar system (Voyagers, New Horizons), interpolated.
//
// Any gap left between two phases - a flyby, or a stretch of fast-changing
// orbit, eg BepiColombo's capture by Mercury - is then filled with a short
// 'track' too, sampled finely. If the craft is passing close to a planet
// then, its positions are relative to that planet, so it's drawn by the
// planet at about the right distance from it even between samples.
//
// Windows outside of Horizons' coverage are trimmed to fit it.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const OUTPUT = join(
    dirname(fileURLToPath(import.meta.url)),
    '../src/orbital/spacecraftData.ts',
);

const SCAN_STEP_DAYS = 2;
// Enough to drop a flyby's own few days of erratic elements (each sample
// unlike the last), but keep the short phases of a craft under continuous
// ion-engine thrust (eg Psyche), whose elements drift steadily.
const MIN_PHASE_DAYS = 6;
// A new phase starts once the semi-major axis differs from the phase's
// first sample by more than this fraction...
const MAX_SEMI_MAJOR_AXIS_DRIFT = 0.01;
// ...or the eccentricity vector (pointing at periapsis, length e) by more
// than this - which tracks both the orbit's shape and its orientation, and
// doesn't mind a near-circular orbit's periapsis wandering.
const MAX_ECCENTRICITY_VECTOR_DRIFT = 0.01;
// Escape trajectories, and elements this close to it, are no use as an
// ellipse.
const MAX_ECCENTRICITY = 0.98;

// Default window for 'ellipse' scans: the map cares most about the present.
const DEFAULT_START = '2024-01-01';
const DEFAULT_STOP = '2031-01-01';

// Map Thing ids (see thing.ts) for Horizons body centers.
const CENTERS = {
    sol: '500@10',
    mercury: '500@199',
    venus: '500@299',
    earth: '500@399',
    luna: '500@301',
    mars: '500@499',
    jupiter: '500@599',
};

// `id` must match the Thing id the map gives the spacecraft (its name,
// slugified - see SPACECRAFT in spacecraft.ts). Each segment is fetched
// separately, as an 'ellipse' scan unless its `type` says otherwise.
const SPACECRAFT = [
    // Escaping the solar system.
    {
        id: 'voyager-1',
        horizonsId: -31,
        segments: [{ type: 'track', start: '1981-01-01', stop: '2040-01-01' }],
    }, // after Saturn
    {
        id: 'voyager-2',
        horizonsId: -32,
        segments: [{ type: 'track', start: '1989-09-01', stop: '2040-01-01' }],
    }, // after Neptune
    {
        id: 'new-horizons',
        horizonsId: -98,
        segments: [{ type: 'track', start: '2015-08-01', stop: '2040-01-01' }],
    }, // after Pluto

    // Orbiting Sol.
    {
        id: 'parker-solar-probe',
        horizonsId: -96,
        segments: [{ center: 'sol' }],
    },
    { id: 'solar-orbiter', horizonsId: -144, segments: [{ center: 'sol' }] },
    { id: 'stereo-a', horizonsId: -234, segments: [{ center: 'sol' }] },
    { id: 'juice', horizonsId: -28, segments: [{ center: 'sol' }] },
    { id: 'europa-clipper', horizonsId: -159, segments: [{ center: 'sol' }] },
    { id: 'lucy', horizonsId: -49, segments: [{ center: 'sol' }] },
    { id: 'psyche', horizonsId: -255, segments: [{ center: 'sol' }] },
    { id: 'hera', horizonsId: -91, segments: [{ center: 'sol' }] },
    { id: 'hayabusa2', horizonsId: -37, segments: [{ center: 'sol' }] },
    { id: 'osiris-apex', horizonsId: -64, segments: [{ center: 'sol' }] },
    { id: 'escapade', horizonsId: -9, segments: [{ center: 'sol' }] },
    { id: 'mmx', horizonsId: -239, segments: [{ center: 'sol' }] },
    {
        id: 'bepicolombo',
        horizonsId: -121,
        segments: [
            { center: 'sol', stop: '2026-10-05' },
            // Captured by Mercury in Oct 2026, then lowering its orbit
            // into 2027 - at first too fast for any one ellipse to last
            // MIN_PHASE_DAYS, so short phases are kept: this close to
            // Mercury, any of them is close enough at the map's scale.
            {
                center: 'mercury',
                minPhaseDays: SCAN_STEP_DAYS,
                start: '2026-10-10',
                holdUntil: '2029-01-01',
            },
        ],
    },

    // Orbiting planets and moons.
    {
        id: 'juno',
        horizonsId: -61,
        segments: [
            {
                type: 'snapshot',
                center: 'jupiter',
                start: '2026-01-01',
                holdUntil: '2028-01-01',
            },
        ],
    },
    {
        id: 'mro',
        horizonsId: -74,
        segments: [
            { type: 'snapshot', center: 'mars', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'mars-odyssey',
        horizonsId: -53,
        segments: [
            { type: 'snapshot', center: 'mars', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'mars-express',
        horizonsId: -41,
        segments: [
            { type: 'snapshot', center: 'mars', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'tgo',
        horizonsId: -143,
        segments: [
            { type: 'snapshot', center: 'mars', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'hope',
        horizonsId: -62,
        segments: [
            { type: 'snapshot', center: 'mars', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'lro',
        horizonsId: -85,
        segments: [
            { type: 'snapshot', center: 'luna', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'danuri',
        horizonsId: -155,
        segments: [
            { type: 'snapshot', center: 'luna', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'chandrayaan-2',
        horizonsId: -152,
        segments: [
            { type: 'snapshot', center: 'luna', holdUntil: '2031-01-01' },
        ],
    },
    {
        id: 'iss',
        horizonsId: -125544,
        segments: [
            {
                type: 'snapshot',
                center: 'earth',
                start: '2026-01-01',
                holdUntil: '2031-01-01',
            },
        ],
    },
    {
        id: 'tiangong',
        horizonsId: -148274,
        segments: [
            {
                type: 'snapshot',
                center: 'earth',
                start: '2026-01-01',
                holdUntil: '2031-01-01',
            },
        ],
    },
    {
        id: 'hubble',
        horizonsId: -48,
        segments: [
            {
                type: 'snapshot',
                center: 'earth',
                start: '2026-01-01',
                holdUntil: '2031-01-01',
            },
        ],
    },
];

const MS_PER_DAY = 86_400_000;
const MONTHS = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
};

function isoDay(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
    return isoDay(
        new Date(
            new Date(`${isoDate}T00:00:00Z`).getTime() + days * MS_PER_DAY,
        ),
    );
}

// Horizons' 'A.D. 2027-APR-11 00:01:09.1855' (or a CSV row's
// 'A.D. 2027-Apr-11 00:00:00.0000') as an ISO date.
function parseHorizonsDate(text) {
    const match = text.match(/(\d{4})-([A-Za-z]{3})-(\d{2})/);
    const month = MONTHS[match[2].toUpperCase()];
    return isoDay(new Date(Date.UTC(+match[1], month, +match[3])));
}

async function horizons(params) {
    const query = new URLSearchParams({
        format: 'json',
        OBJ_DATA: 'NO',
        MAKE_EPHEM: 'YES',
        REF_PLANE: 'ECLIPTIC',
        REF_SYSTEM: 'J2000',
        OUT_UNITS: 'AU-D',
        CSV_FORMAT: 'YES',
        ...params,
    });
    for (let attempt = 0; ; attempt++) {
        try {
            const response = await fetch(`${API}?${query}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return (await response.json()).result;
        } catch (error) {
            if (attempt >= 3) {
                throw error;
            }
            await new Promise((resolve) =>
                setTimeout(resolve, 2000 * (attempt + 1)),
            );
        }
    }
}

// The CSV rows of a Horizons ephemeris over [start, stop], trimming that
// window to Horizons' coverage of the craft if needed. Returns undefined
// if the window and the coverage don't overlap at all.
async function ephemerisRows(params, start, stop) {
    for (let attempt = 0; attempt < 4; attempt++) {
        if (start >= stop) {
            return undefined;
        }
        const text = await horizons({
            ...params,
            START_TIME: `'${start}'`,
            STOP_TIME: `'${stop}'`,
        });
        const body = text.match(/\$\$SOE([\s\S]*)\$\$EOE/);
        if (body) {
            return body[1]
                .trim()
                .split('\n')
                .map((line) => line.split(',').map((cell) => cell.trim()));
        }
        const before = text.match(/prior to (A\.D\. \S+)/);
        const after = text.match(/after (A\.D\. \S+)/);
        if (before) {
            start = addDays(parseHorizonsDate(before[1]), 1);
        } else if (after) {
            stop = addDays(parseHorizonsDate(after[1]), -1);
        } else {
            throw new Error(`Horizons error:\n${text.slice(-1000)}`);
        }
    }
    throw new Error('Could not fit the window to Horizons coverage');
}

function round(value, significantDigits) {
    return Number(value.toPrecision(significantDigits));
}

function eccentricityVector(sample) {
    const angle = (sample.periapsisLongitudeDeg * Math.PI) / 180;
    return { x: sample.e * Math.cos(angle), y: sample.e * Math.sin(angle) };
}

// Whether `sample` is still close enough to `first` to share its phase.
function sameShape(first, sample) {
    const a = eccentricityVector(first);
    const b = eccentricityVector(sample);
    return (
        Math.abs(sample.a - first.a) / first.a <= MAX_SEMI_MAJOR_AXIS_DRIFT &&
        Math.hypot(a.x - b.x, a.y - b.y) <= MAX_ECCENTRICITY_VECTOR_DRIFT
    );
}

function elementRows(spacecraft, segment, start, stop, step) {
    return ephemerisRows(
        {
            COMMAND: `'${spacecraft.horizonsId}'`,
            EPHEM_TYPE: 'ELEMENTS',
            CENTER: `'${CENTERS[segment.center]}'`,
            STEP_SIZE: `'${step}'`,
        },
        start,
        stop,
    );
}

// One row of an ELEMENTS ephemeris. CSV columns: JDTDB, date, EC, QR, IN,
// OM, W, Tp, N, MA, TA, A, AD, PR.
function parseElements(cells) {
    const inclinationDeg = +cells[4];
    // Past 90 degrees, the orbit runs clockwise seen from ecliptic north -
    // see Thing.retrograde for these longitudes' convention.
    const retrograde = inclinationDeg > 90;
    const sign = retrograde ? -1 : 1;
    const node = +cells[5];
    const argument = +cells[6];
    const meanAnomaly = +cells[9];
    return {
        date: parseHorizonsDate(cells[1]),
        e: +cells[2],
        a: +cells[11],
        periodDays: +cells[13],
        retrograde,
        periapsisLongitudeDeg: (((node + sign * argument) % 360) + 360) % 360,
        meanLongitudeDeg:
            (((node + sign * (argument + meanAnomaly)) % 360) + 360) % 360,
    };
}

// A phase on `sample`'s elements, from `start` to `end`.
function ellipsePhase(sample, start, end, parentID) {
    return {
        type: 'ellipse',
        start,
        end,
        parentID,
        epoch: sample.date,
        semiMajorAxisAu: round(sample.a, 8),
        eccentricity: round(sample.e, 6),
        periapsisLongitudeDeg: round(sample.periapsisLongitudeDeg, 6),
        epochAngleDeg: round(sample.meanLongitudeDeg, 6),
        orbitalPeriodDays: round(sample.periodDays, 8),
        ...(sample.retrograde ? { retrograde: true } : {}),
    };
}

async function ellipsePhases(spacecraft, segment) {
    const rows = await elementRows(
        spacecraft,
        segment,
        segment.start ?? DEFAULT_START,
        segment.stop ?? DEFAULT_STOP,
        `${SCAN_STEP_DAYS}d`,
    );
    if (!rows) {
        return [];
    }
    const samples = rows.map(parseElements);

    const runs = [];
    let run = [];
    for (const sample of samples) {
        const usable = sample.e < MAX_ECCENTRICITY && sample.a > 0;
        if (usable && run.length > 0 && sameShape(run[0], sample)) {
            run.push(sample);
            continue;
        }
        if (run.length > 0) {
            runs.push(run);
        }
        run = usable ? [sample] : [];
    }
    if (run.length > 0) {
        runs.push(run);
    }

    const phases = runs
        .filter(
            (samples) =>
                samples.length * SCAN_STEP_DAYS >=
                (segment.minPhaseDays ?? MIN_PHASE_DAYS),
        )
        // The middle sample's elements stand for the whole phase, which
        // runs halfway to the neighboring samples, so back-to-back
        // phases meet with no gap between them.
        .map((samples) =>
            ellipsePhase(
                samples[Math.floor(samples.length / 2)],
                addDays(samples[0].date, -SCAN_STEP_DAYS / 2),
                addDays(samples[samples.length - 1].date, SCAN_STEP_DAYS / 2),
                segment.center,
            ),
        );
    const last = phases[phases.length - 1];
    if (segment.holdUntil && last && last.end < segment.holdUntil) {
        last.end = segment.holdUntil;
    }
    return phases;
}

// 'snapshot' segments: the elements as of today, or as of the end of
// Horizons' coverage if that's sooner.
const SNAPSHOT_LOOKBACK_DAYS = 90;

async function snapshotPhases(spacecraft, segment) {
    const today = isoDay(new Date());
    const rows = await elementRows(
        spacecraft,
        segment,
        addDays(today, -SNAPSHOT_LOOKBACK_DAYS),
        addDays(today, 1),
        '1d',
    );
    if (!rows) {
        return [];
    }
    const sample = parseElements(rows[rows.length - 1]);
    return [
        ellipsePhase(
            sample,
            segment.start ?? DEFAULT_START,
            segment.holdUntil,
            segment.center,
        ),
    ];
}

const TRACK_STEP_DAYS = 120;

async function trackPhases(spacecraft, segment) {
    const rows = await ephemerisRows(
        {
            COMMAND: `'${spacecraft.horizonsId}'`,
            EPHEM_TYPE: 'VECTORS',
            CENTER: `'${CENTERS.sol}'`,
            VEC_TABLE: '1',
            STEP_SIZE: `'${TRACK_STEP_DAYS}d'`,
        },
        segment.start,
        segment.stop,
    );
    if (!rows) {
        return [];
    }
    // CSV columns: JDTDB, date, X, Y, Z.
    const points = rows.flatMap((cells) =>
        [+cells[2], +cells[3], +cells[4]].map((value) => round(value, 7)),
    );
    const start = parseHorizonsDate(rows[0][1]);
    return [
        {
            type: 'track',
            start,
            end: parseHorizonsDate(rows[rows.length - 1][1]),
            parentID: 'sol',
            stepDays: TRACK_STEP_DAYS,
            points,
        },
    ];
}

// Gap tracks get about this many samples, but at most one every
// MIN_GAP_STEP_HOURS (so a flyby is followed closely) and at least one
// every MAX_GAP_STEP_HOURS.
const GAP_SAMPLES = 60;
const MIN_GAP_STEP_HOURS = 3;
const MAX_GAP_STEP_HOURS = 48;

// Roughly each planet's Hill sphere radius, in AU: about how far out its
// gravity, rather than Sol's, steers a passing craft.
const HILL_RADIUS_AU = {
    mercury: 0.0012,
    venus: 0.0067,
    earth: 0.01,
    mars: 0.0072,
    jupiter: 0.35,
};
// A gap's track is relative to the planet whose Hill sphere the craft gets
// deepest inside during the gap (in Hill radii), if any is within this
// many; otherwise relative to Sol.
const MAX_FLYBY_HILL_RADII = 5;
// A flyby's gap only covers the few days its elements were changing
// fastest; the phases either side are trimmed back by this much more, so
// the planet-relative track covers the whole pass through the planet's
// Hill sphere, where Sol-relative ellipses go most wrong.
const FLYBY_MARGIN_DAYS = 4;

// How deep inside each planet's Hill sphere `spacecraft` is (distance /
// HILL_RADIUS_AU), every SCAN_STEP_DAYS across [start, end): for each
// planet, a list of [timestamp, Hill radii].
async function hillDepths(spacecraft, start, end) {
    const depths = {};
    for (const [planet, hillRadiusAu] of Object.entries(HILL_RADIUS_AU)) {
        const rows = await ephemerisRows(
            {
                COMMAND: `'${spacecraft.horizonsId}'`,
                EPHEM_TYPE: 'VECTORS',
                CENTER: `'${CENTERS[planet]}'`,
                VEC_TABLE: '1',
                STEP_SIZE: `'${SCAN_STEP_DAYS}d'`,
            },
            start,
            end,
        );
        depths[planet] = (rows ?? []).map((cells) => [
            Date.parse(`${parseHorizonsDate(cells[1])}T00:00:00Z`),
            Math.hypot(+cells[2], +cells[3], +cells[4]) / hillRadiusAu,
        ]);
    }
    return depths;
}

// The planet `spacecraft` passes closest to (in Hill radii) during [start,
// end], if it gets within MAX_FLYBY_HILL_RADII of any - or 'sol' if not.
function flybyPlanet(depths, start, end) {
    const from = Date.parse(`${start}T00:00:00Z`);
    const to = Date.parse(`${end}T00:00:00Z`);
    let best = 'sol';
    let bestRadii = MAX_FLYBY_HILL_RADII;
    for (const [planet, series] of Object.entries(depths)) {
        for (const [time, radii] of series) {
            if (time >= from && time <= to && radii < bestRadii) {
                best = planet;
                bestRadii = radii;
            }
        }
    }
    return best;
}

// A 'track' phase filling [start, end), relative to `center`.
async function gapTrack(spacecraft, start, end, center) {
    const gapHours =
        (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
        3_600_000;
    const stepHours = Math.max(
        MIN_GAP_STEP_HOURS,
        Math.min(MAX_GAP_STEP_HOURS, Math.round(gapHours / GAP_SAMPLES)),
    );
    // One step past `end`, so the last stretch has a sample on both sides.
    const stopIso = new Date(
        Date.parse(`${end}T00:00:00Z`) + stepHours * 3_600_000,
    )
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');
    const rows = await ephemerisRows(
        {
            COMMAND: `'${spacecraft.horizonsId}'`,
            EPHEM_TYPE: 'VECTORS',
            CENTER: `'${CENTERS[center]}'`,
            VEC_TABLE: '1',
            STEP_SIZE: `'${stepHours}h'`,
        },
        start,
        stopIso,
    );
    if (!rows || rows.length < 2 || parseHorizonsDate(rows[0][1]) !== start) {
        return undefined;
    }
    return {
        type: 'track',
        start,
        end,
        parentID: center,
        stepDays: stepHours / 24,
        // 6 significant digits: relative to a planet, that's still to
        // within a few km.
        points: rows.flatMap((cells) =>
            [+cells[2], +cells[3], +cells[4]].map((value) => round(value, 6)),
        ),
    };
}

// `phases` with a track (see gapTrack) between any two that don't meet,
// and around any flyby: wherever two phases meet (or don't) while the
// craft passes close to a planet, the phases either side are trimmed back
// by FLYBY_MARGIN_DAYS and the track covers the pass. A flyby can leave no
// gap at all, when it's quick enough to fall between two scan samples (eg
// JUICE past Earth in Sep 2026).
async function fillGaps(spacecraft, phases) {
    if (phases.length < 2) {
        return phases;
    }
    const depths = await hillDepths(
        spacecraft,
        phases[0].start,
        phases[phases.length - 1].end,
    );
    const filled = [];
    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        filled.push(phase);
        const next = phases[i + 1];
        if (!next) {
            continue;
        }
        const center = flybyPlanet(
            depths,
            addDays(phase.end, -FLYBY_MARGIN_DAYS),
            addDays(next.start, FLYBY_MARGIN_DAYS),
        );
        if (center !== 'sol') {
            // Only trimming an ellipse that'll still last a while.
            const margin = 2 * FLYBY_MARGIN_DAYS;
            if (
                phase.type === 'ellipse' &&
                addDays(phase.start, margin) < phase.end
            ) {
                phase.end = addDays(phase.end, -FLYBY_MARGIN_DAYS);
            }
            if (
                next.type === 'ellipse' &&
                addDays(next.start, margin) < next.end
            ) {
                next.start = addDays(next.start, FLYBY_MARGIN_DAYS);
            }
        }
        if (phase.end >= next.start) {
            continue;
        }
        const track = await gapTrack(spacecraft, phase.end, next.start, center);
        if (track) {
            filled.push(track);
        } else {
            console.warn(
                `${spacecraft.id}: couldn't fill ${phase.end}..${next.start}`,
            );
        }
    }
    return filled;
}

const trajectories = {};
for (const spacecraft of SPACECRAFT) {
    const phases = [];
    for (const segment of spacecraft.segments) {
        const fetchPhases =
            { track: trackPhases, snapshot: snapshotPhases }[segment.type] ??
            ellipsePhases;
        phases.push(...(await fetchPhases(spacecraft, segment)));
    }
    const filled = await fillGaps(spacecraft, phases);
    trajectories[spacecraft.id] = filled;
    console.log(
        `${spacecraft.id}: ${filled.map((phase) => `${phase.start}..${phase.end} ${phase.parentID}${phase.type === 'track' ? ' (track)' : ''}`).join(', ') || 'NO DATA'}`,
    );
}

const header = `// GENERATED by scripts/fetchSpacecraft.mjs (npm run fetchspacecraft) from
// JPL Horizons on ${isoDay(new Date())} - don't edit by hand. See that script
// for what the phases mean.

import { SpacecraftPhase } from './types';

export const SPACECRAFT_PHASES: Record<string, SpacecraftPhase[]> = `;
// One phase per line, to keep the file (and its diffs) compact.
const body = Object.entries(trajectories)
    .map(
        ([id, phases]) =>
            `    '${id}': [\n${phases.map((phase) => `        ${JSON.stringify(phase)},\n`).join('')}    ],\n`,
    )
    .join('');
writeFileSync(OUTPUT, `${header}{\n${body}};\n`);
console.log(`Wrote ${OUTPUT}`);

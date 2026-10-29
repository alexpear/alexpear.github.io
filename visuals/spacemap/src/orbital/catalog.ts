import { JUPITER_MOONS } from './jupiterMoons';
import { LAGRANGE_POINTS } from './lagrangePoints';
import { PLANETS } from './planets';
import { CelestialObject } from './types';

// Planets are the map's always-visible base layer (for orientation), drawn
// whether or not they're focused. Everything else only appears when focused.
export { PLANETS };

export const FOCUSABLE_EXTRAS: CelestialObject[] = [
    ...JUPITER_MOONS,
    ...LAGRANGE_POINTS,
];

export const ALL_OBJECTS: CelestialObject[] = [...PLANETS, ...FOCUSABLE_EXTRAS];

export const OBJECTS_BY_ID: ReadonlyMap<string, CelestialObject> = new Map(
    ALL_OBJECTS.map((celestialObject) => [celestialObject.id, celestialObject]),
);

export const DEFAULT_FOCUS_IDS: string[] = PLANETS.map((planet) => planet.id);

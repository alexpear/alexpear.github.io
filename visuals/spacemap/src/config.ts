import { DEFAULT_FOCUS_IDS, OBJECTS_BY_ID } from './orbital/catalog';
import { CelestialObject } from './orbital/types';

export interface SpaceMapConfig {
    focusObjects: CelestialObject[];
    date: Date;
}

// Embed config lives in the query string, eg:
// spacemap.html?focus=jupiter,io,europa,ganymede,callisto&t=2026-10-28T00:00:00Z
export function parseConfigFromUrl(search: string): SpaceMapConfig {
    const params = new URLSearchParams(search);

    const focusParam = params.get('focus');
    const requestedIds = focusParam
        ? focusParam.split(',').map((id) => id.trim().toLowerCase())
        : DEFAULT_FOCUS_IDS;
    const focusObjects = requestedIds
        .map((id) => OBJECTS_BY_ID.get(id))
        .filter((object): object is CelestialObject => object !== undefined);

    const timeParam = params.get('t');
    const parsedDate = timeParam ? new Date(timeParam) : new Date();

    return {
        focusObjects:
            focusObjects.length > 0
                ? focusObjects
                : DEFAULT_FOCUS_IDS.map((id) => OBJECTS_BY_ID.get(id)!),
        date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    };
}

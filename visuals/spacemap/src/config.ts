import { DEFAULT_FOCUS_IDS, THINGS_BY_ID } from './orbital/catalog';
import { Thing } from './orbital/thing';

export interface SpaceMapConfig {
    focusedThings: Thing[];
    date: Date;
    // False when the URL gives no usable ?focus= list, ie focusedThings is
    // just the DEFAULT_FOCUS_IDS fallback. The map then opens on a fixed
    // default view (see SpaceMap's DEFAULT_VIEW_RADIUS_AU) rather than
    // auto-framing all of those.
    focusFromUrl: boolean;
}

// Embed config lives in the query string, eg:
// spacemap.html?focus=jupiter,io,europa,ganymede,callisto&t=2026-10-28T00:00:00Z
export function parseConfigFromUrl(search: string): SpaceMapConfig {
    const params = new URLSearchParams(search);

    const focusParam = params.get('focus');
    const requestedIds = focusParam
        ? focusParam.split(',').map((id) => id.trim().toLowerCase())
        : DEFAULT_FOCUS_IDS;
    let dateShown = new Date();
    if (params.has('t')) {
        const timeParam = params.get('t');
        if (timeParam === 'random') {
            dateShown = new Date(
                `${Math.ceil(Math.random() * 20_000) - 10_000}-${Math.ceil(Math.random() * 12)}-${Math.ceil(Math.random() * 12)}`,
            );
        } else {
            dateShown = new Date(timeParam);
        }
    }

    // A spacecraft not flying at that date can't be placed, so it's
    // dropped like an unknown id.
    const focusObjects = requestedIds
        .map((id) => THINGS_BY_ID.get(id))
        .filter(
            (object): object is Thing =>
                object !== undefined && object.isPresentAt(dateShown),
        );

    return {
        focusedThings:
            focusObjects.length > 0
                ? focusObjects
                : DEFAULT_FOCUS_IDS.map((id) => THINGS_BY_ID.get(id)!).filter(
                      (object) => object.isPresentAt(dateShown),
                  ),
        date: dateShown,
        focusFromUrl: focusParam !== null && focusObjects.length > 0,
    };
}

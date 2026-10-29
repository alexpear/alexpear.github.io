import { Body } from 'astronomy-engine';

const BODY_BY_LOWER_NAME: Record<string, Body> = {
    sun: Body.Sun,
    mercury: Body.Mercury,
    venus: Body.Venus,
    earth: Body.Earth,
    mars: Body.Mars,
    jupiter: Body.Jupiter,
    saturn: Body.Saturn,
    uranus: Body.Uranus,
    neptune: Body.Neptune,
    pluto: Body.Pluto,
};

const DEFAULT_FOCUS_BODIES: Body[] = [
    Body.Mercury,
    Body.Venus,
    Body.Earth,
    Body.Mars,
    Body.Jupiter,
    Body.Saturn,
    Body.Uranus,
    Body.Neptune,
    Body.Pluto,
];

export interface SpaceMapConfig {
    focusBodies: Body[];
    date: Date;
}

// Embed config lives in the query string, eg:
// spacemap.html?focus=jupiter,earth&t=2026-10-28T00:00:00Z
export function parseConfigFromUrl(search: string): SpaceMapConfig {
    const params = new URLSearchParams(search);

    const focusParam = params.get('focus');
    const parsedFocusBodies = focusParam
        ? focusParam
              .split(',')
              .map((name) => BODY_BY_LOWER_NAME[name.trim().toLowerCase()])
              .filter((body): body is Body => body !== undefined)
        : [];

    const timeParam = params.get('t');
    const parsedDate = timeParam ? new Date(timeParam) : new Date();

    return {
        focusBodies:
            parsedFocusBodies.length > 0
                ? parsedFocusBodies
                : DEFAULT_FOCUS_BODIES,
        date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    };
}

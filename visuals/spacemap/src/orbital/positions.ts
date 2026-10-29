import { Body, Ecliptic, HelioVector } from 'astronomy-engine';
import { PlanetDef } from './planetData';

export interface Point2D {
    x: number;
    y: number;
}

const MILLISECONDS_PER_DAY = 86400000;

// Flattened onto the ecliptic plane: this map is 2D and does not express
// orbital tilt (eg Pluto's), so we discard the z-component.
export function eclipticPositionAu(body: Body, date: Date): Point2D {
    const helioVector = HelioVector(body, date);
    const ecliptic = Ecliptic(helioVector);
    return { x: ecliptic.vec.x, y: ecliptic.vec.y };
}

export function orbitPathAu(
    planet: PlanetDef,
    date: Date,
    samples: number = 180,
): Point2D[] {
    const points: Point2D[] = [];
    for (let i = 0; i <= samples; i++) {
        const dayOffset = (planet.orbitalPeriodDays * i) / samples;
        const sampleDate = new Date(
            date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
        );
        points.push(eclipticPositionAu(planet.body, sampleDate));
    }
    return points;
}

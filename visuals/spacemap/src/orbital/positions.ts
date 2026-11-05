import {
    AstroTime,
    // Body,
    Ecliptic,
    // HelioVector,
    Vector,
} from 'astronomy-engine';
import { MILLISECONDS_PER_DAY, Point2D } from './types';

// Flattened onto the ecliptic plane: this map is 2D and does not express
// orbital tilt (eg Pluto's), so we discard the z-component.
// export function eclipticPositionAu(body: Body, date: Date): Point2D {
//     const helioVector = HelioVector(body, date);
//     const ecliptic = Ecliptic(helioVector);
//     return { x: ecliptic.vec.x, y: ecliptic.vec.y };
// }

// Same ecliptic flattening as eclipticPositionAu, but for a vector that
// isn't already a Vector instance (eg a StateVector's position components,
// such as from JupiterMoons or LagrangePoint).
export function toEclipticPoint(
    x: number,
    y: number,
    z: number,
    t: AstroTime,
): Point2D {
    const ecliptic = Ecliptic(new Vector(x, y, z, t));
    return { x: ecliptic.vec.x, y: ecliptic.vec.y };
}

// Traces an object's orbit by sampling its position across one period.
// Works for any periodic object (planet, moon, Lagrange point), not just planets.
export function tracedOrbitPathAu(
    positionAu: (date: Date) => Point2D,
    periodDays: number,
    date: Date,
    samples: number = 180,
): Point2D[] {
    const points: Point2D[] = [];
    for (let i = 0; i <= samples; i++) {
        const dayOffset = (periodDays * i) / samples;
        const sampleDate = new Date(
            date.getTime() + dayOffset * MILLISECONDS_PER_DAY,
        );
        points.push(positionAu(sampleDate));
    }
    return points;
}

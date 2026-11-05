import { LagrangePoint } from 'astronomy-engine';
import { toEclipticPoint, tracedOrbitPathAu } from './positions';
import { Point2D, Thing } from './types';

// A Lagrange point isn't a catalogable object: it's a position defined by
// a pair of bodies, so we compute it on demand instead of listing each one
// as a static def. `thing1` is the major body (eg Sol) and `thing2` is the
// minor body (eg Earth) of the two-body system, matching astronomy-engine's
// own major/minor convention; `lagrangeNumber` selects which of the 5 points
// (1, 2, 4, and 5 are the stable/commonly-used ones; 3, on the far side of
// the major body, is rarely referenced outside fiction).
export function lagrange(
    thing1: Thing,
    thing2: Thing,
    lagrangeNumber: number,
): Thing {
    if (!thing1.body || !thing2.body) {
        throw new Error(
            `lagrange() requires both Things to have a body: ${thing1.id}, ${thing2.id}`,
        );
    }
    const majorBody = thing1.body;
    const minorBody = thing2.body;

    // LagrangePoint() returns a vector relative to the major body's center,
    // so no extra offset is needed to place it in the map's frame.
    function positionAu(date: Date): Point2D {
        const stateVector = LagrangePoint(
            lagrangeNumber,
            date,
            majorBody,
            minorBody,
        );
        return toEclipticPoint(
            stateVector.x,
            stateVector.y,
            stateVector.z,
            stateVector.t,
        );
    }

    return {
        id: `${thing1.id}-${thing2.id}-l${lagrangeNumber}`,
        name: `${thing1.name}–${thing2.name} L${lagrangeNumber}`,
        colorHex: thing2.colorHex,
        kind: 'lagrangePoint',
        // Traces the minor body's orbit, since that's the period this
        // Lagrange point shares (eg Earth's, for a Sun-Earth point).
        orbitalPeriodDays: thing2.orbitalPeriodDays,
        positionAu,
        orbitPathAu: thing2.orbitalPeriodDays
            ? (date: Date): Point2D[] =>
                  tracedOrbitPathAu(positionAu, thing2.orbitalPeriodDays!, date)
            : undefined,
    };
}

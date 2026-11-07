import { Point2D } from '../orbital/types';

export interface Framing {
    centroid: Point2D;
    rotationDeg: number;
    scale: number; // screen pixels per AU
}

const PADDING_FRACTION = 0.3;
// Floor on the framed box size, so a single focus body (or several
// coincident ones) doesn't demand an infinite zoom.
const MIN_BOX_AU = 0.5;

function rotatePoint(point: Point2D, angleRad: number): Point2D {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
    };
}

function centroidOf(points: Point2D[]): Point2D {
    const sum = points.reduce(
        (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
        { x: 0, y: 0 },
    );
    return { x: sum.x / points.length, y: sum.y / points.length };
}

// Angle of the point cloud's principal axis, via the 2x2 covariance matrix.
function principalAxisAngleRad(points: Point2D[], centroid: Point2D): number {
    let sxx = 0;
    let syy = 0;
    let sxy = 0;
    for (const point of points) {
        const dx = point.x - centroid.x;
        const dy = point.y - centroid.y;
        sxx += dx * dx;
        syy += dy * dy;
        sxy += dx * dy;
    }
    if (sxx === 0 && syy === 0 && sxy === 0) {
        return 0;
    }
    return 0.5 * Math.atan2(2 * sxy, sxx - syy);
}

function boundingBoxAfterRotation(
    points: Point2D[],
    centroid: Point2D,
    angleRad: number,
): { width: number; height: number } {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of points) {
        const rotated = rotatePoint(
            { x: point.x - centroid.x, y: point.y - centroid.y },
            -angleRad,
        );
        minX = Math.min(minX, rotated.x);
        maxX = Math.max(maxX, rotated.x);
        minY = Math.min(minY, rotated.y);
        maxY = Math.max(maxY, rotated.y);
    }
    return { width: maxX - minX, height: maxY - minY };
}

// Frames the focus points in the viewport, rotating the map (in 90-degree
// steps off the point cloud's principal axis) when that lets the points
// fill more of the current aspect ratio.
export function computeFraming(
    focusPoints: Point2D[],
    viewportWidth: number,
    viewportHeight: number,
): Framing {
    const centroid = centroidOf(focusPoints);
    const principalAngleRad = principalAxisAngleRad(focusPoints, centroid);

    let bestRotationRad = 0;
    let bestScale = 0;
    for (const candidateRad of [
        principalAngleRad,
        principalAngleRad + Math.PI / 2,
    ]) {
        const box = boundingBoxAfterRotation(
            focusPoints,
            centroid,
            candidateRad,
        );
        const paddedWidth = Math.max(
            box.width * (1 + PADDING_FRACTION),
            MIN_BOX_AU,
        );
        const paddedHeight = Math.max(
            box.height * (1 + PADDING_FRACTION),
            MIN_BOX_AU,
        );
        const scale = Math.min(
            viewportWidth / paddedWidth,
            viewportHeight / paddedHeight,
        );
        if (scale > bestScale) {
            bestScale = scale;
            bestRotationRad = candidateRad;
        }
    }

    return {
        centroid,
        rotationDeg: (bestRotationRad * 180) / Math.PI,
        scale: bestScale,
    };
}

// Builds an AU-space-to-"world"-pixel-space transform: auto framing alone,
// with no pan/zoom baked in. World points are cached per Thing/orbit and
// only multiplied by the zoom at render time, while pan is a single
// translate on a wrapping <g> (see SpaceMap's viewTransform comment) -
// so a pan/zoom never re-runs this rotation math per point. That's the
// whole reason this is split out from makeAuToScreenTransform below.
export function makeAuToWorldTransform(
    framing: Framing,
): (auPoint: Point2D) => Point2D {
    const angleRad = (-framing.rotationDeg * Math.PI) / 180;
    return (auPoint: Point2D) => {
        const centered = {
            x: auPoint.x - framing.centroid.x,
            y: auPoint.y - framing.centroid.y,
        };
        const rotated = rotatePoint(centered, angleRad);
        return {
            x: rotated.x * framing.scale,
            // Ecliptic +y is counterclockwise (astronomical convention); SVG +y points down.
            y: -rotated.y * framing.scale,
        };
    };
}

// Builds an AU-space-to-screen-pixel-space transform: makeAuToWorldTransform
// above, composed with the viewer's manual pan/zoom. Rendering doesn't use
// this directly (see that function's comment) - it's for the few things
// that need an actual screen pixel position outside of rendering, eg
// deciding whether two Things are within MIN_MARKER_SEPARATION_PX of each
// other on screen right now.
export function makeAuToScreenTransform(
    framing: Framing,
    viewportWidth: number,
    viewportHeight: number,
    panOffset: Point2D,
    zoomMultiplier: number,
): (auPoint: Point2D) => Point2D {
    const toWorld = makeAuToWorldTransform(framing);
    return (auPoint: Point2D) => {
        const world = toWorld(auPoint);
        return {
            x: viewportWidth / 2 + panOffset.x + world.x * zoomMultiplier,
            y: viewportHeight / 2 + panOffset.y + world.y * zoomMultiplier,
        };
    };
}

// The pan/zoom part of the transform above is screen = viewportCenter +
// panOffset + effectiveScale * rotated(auPoint). Zooming by `zoomRatio`
// (newZoomMultiplier / oldZoomMultiplier) scales effectiveScale by that same
// ratio; this returns the panOffset that keeps `anchorScreen` (eg the
// cursor, or a pinch's midpoint) fixed on screen through that change, so the
// zoom feels anchored to it rather than to the framing's centroid.
export function panOffsetForZoomAnchor(
    anchorScreen: Point2D,
    viewportCenter: Point2D,
    panOffset: Point2D,
    zoomRatio: number,
): Point2D {
    return {
        x:
            (anchorScreen.x - viewportCenter.x) * (1 - zoomRatio) +
            zoomRatio * panOffset.x,
        y:
            (anchorScreen.y - viewportCenter.y) * (1 - zoomRatio) +
            zoomRatio * panOffset.y,
    };
}

export interface Point2D {
    x: number;
    y: number;
}

export interface CelestialObject {
    id: string; // lowercase key used in the ?focus= query param
    name: string; // display label
    color: string;
    // Physical bodies (planets, moons) render as a solid marker; Lagrange
    // points are not objects, so they render as a hollow marker instead.
    isPhysicalBody: boolean;
    positionAu: (date: Date) => Point2D;
    // Only set for objects whose traced orbit is worth drawing.
    orbitPathAu?: (date: Date) => Point2D[];
}

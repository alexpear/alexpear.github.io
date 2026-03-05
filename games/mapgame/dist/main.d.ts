declare const L: any;
declare const GRID_STEP: number;
declare const FONT_FRACTION: number;
declare const MIN_FONT_PX: number;
declare const MAX_FONT_PX: number;
declare class MapGame {
    map: any;
    playerMarker: Record<string, any> | undefined;
    renderedGoals: Map<string, Record<string, any>>;
    fogRectangles: Map<string, Record<string, any>>;
    locationKnown: boolean;
    playerScore: number;
    scoreEl: HTMLElement;
    coords2dates: Record<string, string>;
    constructor();
    updateAfterGPS(pos: GeolocationPosition): void;
    gpsError(err: GeolocationPositionError): void;
    visit(lat: number, long: number): void;
    updateScreen(): void;
    snapToGrid(val: number): number;
    static keyFormat(lat: number, long: number): string;
    updateScoreDisplay(): void;
    goalAt(lat: number, long: number): Goal;
    gridSpacingPx(): number;
    updateGoalVisuals(): void;
    stateString(): string;
    save(): void;
    load(): void;
    static run(): void;
}
declare class Goal {
    lastVisited: Date;
    constructor(lastVisited?: Date);
    daysSinceVisited(): number;
    pointsAvailable(): number;
    text(): string;
    visit(): void;
}

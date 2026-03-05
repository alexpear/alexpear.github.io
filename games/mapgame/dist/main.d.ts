declare const L: any;
declare const GRID_STEP: number;
declare const GOAL_FONT_PX: number;
declare const MIN_ZOOM: number;
declare const FogLayer: any;
declare class MapGame {
    map: any;
    playerMarker: Record<string, any> | undefined;
    renderedGoals: Map<string, Record<string, any>>;
    fogLayer: any;
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
    clearHoles(): any[];
    buildFogLayer(): void;
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

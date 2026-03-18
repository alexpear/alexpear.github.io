import { Goal } from './goal';
export declare class BlockScout {
    map: any;
    playerMarker: Record<string, any> | undefined;
    renderedGoals: Map<string, Record<string, any>>;
    fogRectangles: Map<string, Record<string, object>>;
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
    quickUpdateScreen(): void;
    icon(goal: Goal): object;
    panToPlayer(): void;
    stateString(): string;
    save(): void;
    load(): void;
    private _mockWideFont;
    private _setLastVisit;
    static run(): void;
}

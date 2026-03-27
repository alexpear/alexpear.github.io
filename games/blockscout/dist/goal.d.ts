export declare class Goal {
    lastVisited: Date;
    static readonly START_POINTS: number;
    constructor(lastVisited?: Date);
    daysSinceVisited(): number;
    pointsAvailable(): number;
    text(): string;
    today(): Date;
    visit(): void;
}

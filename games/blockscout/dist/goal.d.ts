export declare class Goal {
    lastVisited: Date;
    constructor(lastVisited?: Date);
    daysSinceVisited(): number;
    pointsAvailable(): number;
    text(): string;
    today(): Date;
    visit(): void;
}

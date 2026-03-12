// One of many places that you get points for visiting.
export class Goal {
    lastVisited: Date;

    constructor(lastVisited?: Date) {
        // Default to 1970 for never-visited places.
        this.lastVisited = lastVisited || new Date(0);
    }

    daysSinceVisited(): number {
        const ms = Date.now() - this.lastVisited.getTime();
        return ms / (1000 * 60 * 60 * 24);
    }

    pointsAvailable(): number {
        return Math.min(1000, Math.round(this.daysSinceVisited()));
    }

    text(): string {
        // Zero points => empty string => do not display a number.
        return String(this.pointsAvailable() || '');
    }

    visit(): void {
        this.lastVisited = new Date();
        this.lastVisited.setHours(0, 0, 0, 0); // midnight local time is the threshold between days.
    }
}

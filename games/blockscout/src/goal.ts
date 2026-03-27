// One of many places that you get points for visiting.
export class Goal {
    lastVisited: Date;

    // After you visit a Goal, its points start at START_POINTS the next midnight, & grow from there.
    static readonly START_POINTS: number = 4;

    constructor(lastVisited?: Date) {
        // Default to 1970 for never-visited places.
        this.lastVisited = lastVisited || new Date(0);
    }

    daysSinceVisited(): number {
        return Math.floor(
            (this.today().getTime() - this.lastVisited.getTime()) /
                (1000 * 60 * 60 * 24),
        );
    }

    pointsAvailable(): number {
        const daysSince = this.daysSinceVisited();

        if (daysSince <= 0) {
            return 0;
        }

        // Rewards jump from 0 to START_POINTS. Thus, visiting every day is more lucrative than visiting once every 1000 days.
        return Math.min(1000, Goal.START_POINTS + (daysSince - 1));
    }

    text(): string {
        // Zero points => empty string => do not display a number.
        return String(this.pointsAvailable() || '');
    }

    today(): Date {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // midnight local time is the threshold between days.
        return today;
    }

    visit(): void {
        this.lastVisited = this.today();
    }
}

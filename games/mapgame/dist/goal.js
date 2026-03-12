"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
// One of many places that you get points for visiting.
class Goal {
    constructor(lastVisited) {
        // Default to 1970 for never-visited places.
        this.lastVisited = lastVisited || new Date(0);
    }
    daysSinceVisited() {
        return Math.floor((this.today().getTime() - this.lastVisited.getTime()) /
            (1000 * 60 * 60 * 24));
    }
    pointsAvailable() {
        return Math.min(1000, Math.round(this.daysSinceVisited()));
    }
    text() {
        // Zero points => empty string => do not display a number.
        return String(this.pointsAvailable() || '');
    }
    today() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // midnight local time is the threshold between days.
        return today;
    }
    visit() {
        this.lastVisited = this.today();
    }
}
exports.Goal = Goal;

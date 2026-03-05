// Mobile game that suggests nearby places to go while exercising, eg biking or jogging.
const GRID_STEP = 0.01;
const GOAL_FONT_PX = 16;
const MIN_ZOOM = 11; // Below this, skip rendering to avoid too many objects
class MapGame {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/typedef
        this.map = L.map('map').setView([37.77, -122.42], 15); // Default: San Francisco
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.playerMarker = undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.renderedGoals = new Map();
        this.fogRectangles = new Map();
        this.locationKnown = false;
        // LATER could make this decay 1 point/day, eg by storing a started: Date and subtracting points from score equal to today - started.
        this.playerScore = 0;
        this.scoreEl = document.getElementById('score'); // as HTMLElement;
        // Dict storing Dates in string format.
        this.coords2dates = {};
        // --- Map setup ---
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);
        this.map.createPane('fogPane');
        this.map.getPane('fogPane').style.zIndex = '250'; // above tiles (200), below overlays (400)
        this.load();
        this.updateScoreDisplay();
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((pos) => this.updateAfterGPS(pos), (err) => this.gpsError(err), {
                enableHighAccuracy: true,
            });
        }
        this.map.on('moveend', () => this.updateGoalVisuals());
        this.updateScreen();
    }
    updateAfterGPS(pos) {
        const { latitude, longitude } = pos.coords;
        if (this.playerMarker) {
            this.playerMarker.setLatLng([latitude, longitude]);
        }
        else {
            this.playerMarker = L.circleMarker([latitude, longitude], {
                radius: 8,
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.9,
                weight: 2,
            }).addTo(this.map);
        }
        if (!this.locationKnown) {
            this.map.setView([latitude, longitude], 16);
            this.locationKnown = true;
        }
        this.visit(latitude, longitude);
    }
    gpsError(err) {
        console.error('Geolocation error:', err.message);
    }
    // LATER params might be neater as just coordKey: string
    visit(lat, long) {
        const goal = this.goalAt(lat, long);
        const points = goal.pointsAvailable();
        if (points > 0) {
            this.playerScore += points;
            goal.visit();
            this.coords2dates[MapGame.keyFormat(lat, long)] =
                new Date().toISOString();
            // LATER could call this less often, or on a cooldown timer, or check GPS position less often. Could research performance bottlenecks more.
            this.save();
            this.updateScreen();
        }
    }
    updateScreen() {
        this.updateGoalVisuals();
        this.updateScoreDisplay();
    }
    snapToGrid(val) {
        return Math.round(val / GRID_STEP) * GRID_STEP;
    }
    static keyFormat(lat, long) {
        // Round to avoid floating point drift
        const rlat = Math.round(lat * 100) / 100;
        const rlong = Math.round(long * 100) / 100;
        return rlat + ',' + rlong;
    }
    updateScoreDisplay() {
        this.scoreEl.textContent =
            'Score: ' + this.playerScore.toLocaleString();
    }
    goalAt(lat, long) {
        const coordKey = MapGame.keyFormat(lat, long);
        const dateStr = this.coords2dates[coordKey];
        return new Goal(dateStr ? new Date(dateStr) : undefined);
    }
    updateGoalVisuals() {
        if (this.map.getZoom() < MIN_ZOOM) {
            for (const [key, marker] of this.renderedGoals) {
                this.map.removeLayer(marker);
                this.renderedGoals.delete(key);
            }
            for (const [key, rect] of this.fogRectangles) {
                this.map.removeLayer(rect);
                this.fogRectangles.delete(key);
            }
            return;
        }
        const iconW = Math.round(GOAL_FONT_PX * 2.5);
        const iconH = Math.round(GOAL_FONT_PX * 1.4);
        const bounds = this.map.getBounds();
        const south = bounds.getSouth();
        const north = bounds.getNorth();
        const west = bounds.getWest();
        const east = bounds.getEast();
        const latMin = this.snapToGrid(south - GRID_STEP / 2);
        const latMax = this.snapToGrid(north + GRID_STEP / 2);
        const longMin = this.snapToGrid(west - GRID_STEP / 2);
        const longMax = this.snapToGrid(east + GRID_STEP / 2);
        // Track which keys are in the current viewport
        const visibleKeys = new Set();
        for (let lat = latMin; lat <= latMax + GRID_STEP / 2; lat += GRID_STEP) {
            for (let long = longMin; long <= longMax + GRID_STEP / 2; long += GRID_STEP) {
                const key = MapGame.keyFormat(lat, long);
                visibleKeys.add(key);
                const goal = this.goalAt(lat, long);
                const fogged = goal.pointsAvailable() >= 1000;
                if (fogged) {
                    // Cover cell with black fog
                    if (!this.fogRectangles.has(key)) {
                        const snappedLat = this.snapToGrid(lat);
                        const snappedLong = this.snapToGrid(long);
                        const rect = L.rectangle([
                            [
                                snappedLat - GRID_STEP / 2,
                                snappedLong - GRID_STEP / 2,
                            ],
                            [
                                snappedLat + GRID_STEP / 2,
                                snappedLong + GRID_STEP / 2,
                            ],
                        ], {
                            pane: 'fogPane',
                            color: 'black',
                            fillColor: 'black',
                            fillOpacity: 1,
                            weight: 0,
                            interactive: false,
                        }).addTo(this.map);
                        this.fogRectangles.set(key, rect);
                    }
                    // Hide goal label for this cell
                    const existingLabel = this.renderedGoals.get(key);
                    if (existingLabel) {
                        this.map.removeLayer(existingLabel);
                        this.renderedGoals.delete(key);
                    }
                }
                else {
                    // Remove fog if cell was recently visited
                    const existingFog = this.fogRectangles.get(key);
                    if (existingFog) {
                        this.map.removeLayer(existingFog);
                        this.fogRectangles.delete(key);
                    }
                    // Show goal label
                    const text = goal.text();
                    const existingLabel = this.renderedGoals.get(key);
                    if (!existingLabel) {
                        const icon = L.divIcon({
                            className: 'goal-label',
                            html: 
                            // LATER these +s are ugly, replace with ``s
                            '<span style="font-size:' +
                                GOAL_FONT_PX +
                                'px">' +
                                text +
                                '</span>',
                            iconSize: [iconW, iconH],
                            iconAnchor: [iconW / 2, iconH / 2],
                        });
                        const marker = L.marker([this.snapToGrid(lat), this.snapToGrid(long)], { icon, interactive: false }).addTo(this.map);
                        this.renderedGoals.set(key, marker);
                    }
                    else {
                        const icon = L.divIcon({
                            className: 'goal-label',
                            html: '<span style="font-size:' +
                                GOAL_FONT_PX +
                                'px">' +
                                text +
                                '</span>',
                            iconSize: [iconW, iconH],
                            iconAnchor: [iconW / 2, iconH / 2],
                        });
                        existingLabel.setIcon(icon);
                    }
                }
            }
        }
        // Remove markers and fog that are now outside the viewport
        for (const [key, marker] of this.renderedGoals) {
            if (!visibleKeys.has(key)) {
                this.map.removeLayer(marker);
                this.renderedGoals.delete(key);
            }
        }
        for (const [key, rect] of this.fogRectangles) {
            if (!visibleKeys.has(key)) {
                this.map.removeLayer(rect);
                this.fogRectangles.delete(key);
            }
        }
    }
    // LATER button to scroll & zoom to player location.
    // LATER How To Play '?' button
    stateString() {
        const state = {
            coords2dates: this.coords2dates,
            playerScore: this.playerScore,
        };
        return JSON.stringify(state);
    }
    // --- localStorage stubs (for future game mechanics) ---
    // Save & load are both the whole gamestate, ie playerScore AND coords2dates.
    save() {
        localStorage.setItem('mapGame', this.stateString());
    }
    // LATER menu option to download a save file. Also option to import a save file (merging it into current state).
    // Load the saved gamestate from local storage.
    load() {
        const raw = localStorage.getItem('mapGame');
        if (!raw) {
            return;
        }
        const worldState = JSON.parse(raw);
        if (worldState.playerScore) {
            this.playerScore = Number(worldState.playerScore);
        }
        if (worldState.coords2dates) {
            this.coords2dates = worldState.coords2dates;
        }
    }
    // NOTE Players that visit a vast quantity of places will have large gamestates. Hopefully this only affects performance at inhuman levels.
    static run() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const game = new MapGame();
    }
}
// One of many places that you get points for visiting.
class Goal {
    constructor(lastVisited) {
        // Default to 1970 for never-visited places.
        this.lastVisited = lastVisited || new Date(0);
    }
    daysSinceVisited() {
        const ms = Date.now() - this.lastVisited.getTime();
        return ms / (1000 * 60 * 60 * 24);
    }
    // LATER check for rounding exploits. Can i visit every 13 hours? How to structure a unit test for that?
    pointsAvailable() {
        return Math.min(1000, Math.round(this.daysSinceVisited()));
    }
    text() {
        return String(this.pointsAvailable());
    }
    visit() {
        this.lastVisited = new Date();
        // LATER could check if storing timestamps with less precision (eg just '20260226') is faster.
    }
}
// TODO unit tests about gamestate, saving & loading to storage format, player actions, visiting a place twice in same day.
// LATER improve VSCode integration with CC & with git.
MapGame.run();

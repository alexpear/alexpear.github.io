// Mobile game that suggests nearby places to go while exercising, eg biking or jogging.

// L (Leaflet) is loaded as a global by leaflet.js, a script that index.html loads from the unpkg.com CDN.
declare const L;
const GRID_STEP: number = 0.01;
const GOAL_FONT_PX: number = 16;
const MIN_ZOOM: number = 12; // User can't zoom out too much.
const FOG_BUFFER: number = 5; // Extra cells of fog rendered beyond the viewport edge

class MapGame {
    // eslint-disable-next-line @typescript-eslint/typedef
    map = L.map('map', {
        minZoom: MIN_ZOOM,
        renderer: L.canvas({ padding: 5 }),
    }).setView([37.77, -122.42], 15); // Default: San Francisco

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playerMarker: Record<string, any> | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderedGoals: Map<string, Record<string, any>> = new Map();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fogRectangles: Map<string, Record<string, any>> = new Map();
    locationKnown: boolean = false;

    // LATER could make this decay 1 point/day, eg by storing a started: Date and subtracting points from score equal to today - started.
    playerScore: number = 0;
    scoreEl: HTMLElement = document.getElementById('score'); // as HTMLElement;

    // Dict storing Dates in string format.
    coords2dates: Record<string, string> = {};

    constructor() {
        // --- Map setup ---
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.map.createPane('fogPane');
        this.map.getPane('fogPane').style.zIndex = '250'; // above tiles (200), below overlays (400)

        this.load();
        this.updateScoreDisplay();

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) => this.updateAfterGPS(pos),
                (err) => this.gpsError(err),
                {
                    enableHighAccuracy: true,
                },
            );
        }

        this.map.on('moveend', () => this.updateGoalVisuals());
        document
            .getElementById('recenter-btn')!
            .addEventListener('click', () => this.panToPlayer());
        const helpModal = document.getElementById('help-modal')!;
        document
            .getElementById('help-btn')!
            .addEventListener('click', () => helpModal.classList.add('open'));
        document
            .getElementById('help-close')!
            .addEventListener('click', () =>
                helpModal.classList.remove('open'),
            );
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.classList.remove('open');
        });

        this.updateScreen();
    }

    updateAfterGPS(pos: GeolocationPosition): void {
        const { latitude, longitude } = pos.coords;
        if (this.playerMarker) {
            this.playerMarker.setLatLng([latitude, longitude]);
        } else {
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

    gpsError(err: GeolocationPositionError): void {
        console.error('Geolocation error:', err.message);
    }

    // LATER params might be neater as just coordKey: string
    visit(lat: number, long: number): void {
        const goal = this.goalAt(lat, long);
        const points = goal.pointsAvailable();

        if (points > 0) {
            this.playerScore += points;
            goal.visit();
            this.coords2dates[MapGame.keyFormat(lat, long)] =
                new Date().toISOString();

            // LATER could call this less often, or on a cooldown timer, or check GPS position less often.
            this.save();
            this.updateScreen();
        }
    }

    updateScreen(): void {
        this.updateGoalVisuals();
        this.updateScoreDisplay();
    }

    snapToGrid(val: number): number {
        return Math.round(val / GRID_STEP) * GRID_STEP;
    }

    static keyFormat(lat: number, long: number): string {
        // Round to avoid floating point drift
        const rlat = Math.round(lat * 100) / 100;
        const rlong = Math.round(long * 100) / 100;
        return rlat + ',' + rlong;
    }

    updateScoreDisplay(): void {
        this.scoreEl.textContent =
            'Score: ' + this.playerScore.toLocaleString();
    }

    goalAt(lat: number, long: number): Goal {
        const coordKey = MapGame.keyFormat(lat, long);
        const dateStr = this.coords2dates[coordKey];
        return new Goal(dateStr ? new Date(dateStr) : undefined);
    }

    updateGoalVisuals(): void {
        const iconW = Math.round(GOAL_FONT_PX * 2.5);
        const iconH = Math.round(GOAL_FONT_PX * 1.4);
        const bounds = this.map.getBounds();
        const buf = GRID_STEP * FOG_BUFFER;

        const latMin = this.snapToGrid(bounds.getSouth() - buf);
        const latMax = this.snapToGrid(bounds.getNorth() + buf);
        const longMin = this.snapToGrid(bounds.getWest() - buf);
        const longMax = this.snapToGrid(bounds.getEast() + buf);

        const activeKeys = new Set<string>();

        for (
            let lat = latMin;
            lat <= latMax + GRID_STEP / 2;
            lat += GRID_STEP
        ) {
            for (
                let long = longMin;
                long <= longMax + GRID_STEP / 2;
                long += GRID_STEP
            ) {
                const key = MapGame.keyFormat(lat, long);
                activeKeys.add(key);

                const goal = this.goalAt(lat, long);
                const fogged = goal.pointsAvailable() >= 1000;

                if (fogged) {
                    // Add fog rectangle if not already present
                    if (!this.fogRectangles.has(key)) {
                        const s = this.snapToGrid(lat);
                        const w = this.snapToGrid(long);
                        const rect = L.rectangle(
                            [
                                [s - GRID_STEP / 2, w - GRID_STEP / 2],
                                [s + GRID_STEP / 2, w + GRID_STEP / 2],
                            ],
                            {
                                pane: 'fogPane',
                                color: 'black',
                                fillColor: 'black',
                                fillOpacity: 1,
                                weight: 0,
                                interactive: false,
                            },
                        ).addTo(this.map);
                        this.fogRectangles.set(key, rect);
                    }
                    // Hide goal label for fogged cell
                    const existingLabel = this.renderedGoals.get(key);
                    if (existingLabel) {
                        this.map.removeLayer(existingLabel);
                        this.renderedGoals.delete(key);
                    }
                } else {
                    // Remove fog rectangle for visited cell
                    const existingFog = this.fogRectangles.get(key);
                    if (existingFog) {
                        this.map.removeLayer(existingFog);
                        this.fogRectangles.delete(key);
                    }
                    // Show goal label
                    const text = goal.text();
                    const icon = L.divIcon({
                        className: 'goal-label',
                        html: `<span style="font-size:${GOAL_FONT_PX}px">${text}</span>`,
                        iconSize: [iconW, iconH],
                        iconAnchor: [iconW / 2, iconH / 2],
                    });
                    const existingLabel = this.renderedGoals.get(key);
                    if (!existingLabel) {
                        const marker = L.marker(
                            [this.snapToGrid(lat), this.snapToGrid(long)],
                            { icon, interactive: false },
                        ).addTo(this.map);
                        this.renderedGoals.set(key, marker);
                    } else {
                        existingLabel.setIcon(icon);
                    }
                }
            }
        }

        // Remove markers and fog outside the buffered viewport
        for (const [key, marker] of this.renderedGoals) {
            if (!activeKeys.has(key)) {
                this.map.removeLayer(marker);
                this.renderedGoals.delete(key);
            }
        }
        for (const [key, rect] of this.fogRectangles) {
            if (!activeKeys.has(key)) {
                this.map.removeLayer(rect);
                this.fogRectangles.delete(key);
            }
        }
    }

    panToPlayer(): void {
        if (this.locationKnown && this.playerMarker) {
            this.map.panTo(this.playerMarker.getLatLng());
        }
    }

    stateString(): string {
        const state = {
            coords2dates: this.coords2dates,
            playerScore: this.playerScore,
        };

        return JSON.stringify(state);
    }

    // --- localStorage stubs (for future game mechanics) ---

    // Save & load are both the whole gamestate, ie playerScore AND coords2dates.
    save(): void {
        localStorage.setItem('mapGame', this.stateString());
    }

    // LATER menu option to download a save file. Also option to import a save file (merging it into current state).

    // Load the saved gamestate from local storage.
    load(): void {
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

    static run(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const game = new MapGame();
    }
}

// One of many places that you get points for visiting.
class Goal {
    lastVisited: Date;

    constructor(lastVisited?: Date) {
        // Default to 1970 for never-visited places.
        this.lastVisited = lastVisited || new Date(0);
    }

    daysSinceVisited(): number {
        const ms = Date.now() - this.lastVisited.getTime();
        return ms / (1000 * 60 * 60 * 24);
    }

    // LATER check for rounding exploits. Can i visit every 13 hours? How to structure a unit test for that?
    pointsAvailable(): number {
        return Math.min(1000, Math.round(this.daysSinceVisited()));
    }

    text(): string {
        return String(this.pointsAvailable());
    }

    visit(): void {
        this.lastVisited = new Date();
        // LATER could check if storing timestamps with less precision (eg just '20260226') is faster.
    }
}

// TODO unit tests about gamestate, saving & loading to storage format, player actions, visiting a place twice in same day.
// LATER improve VSCode integration with CC & with git.

MapGame.run();

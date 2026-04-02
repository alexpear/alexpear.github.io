"use strict";
// Mobile game that suggests nearby places to go while exercising, eg biking or jogging.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockScout = void 0;
const goal_1 = require("./goal");
const GRID_STEP = 0.01;
const GOAL_FONT_PX = 32;
const FOG_BUFFER = 1; // Extra cells of fog rendered beyond the viewport edge
const HOUR = 60 * 60 * 1000; // in ms
const SAN_FRANCISCO = [37.77, -122.42];
const TEST_MODE = undefined; // 'font';
class BlockScout {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/typedef
        this.map = L.map('map', {
            renderer: L.canvas({ padding: 0.1 }),
            zoomControl: false,
        }).setView(SAN_FRANCISCO, 15);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.tileLayer = undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.playerMarker = undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.renderedGoals = new Map();
        this.fogRectangles = new Map();
        this.exploredRectangles = new Map();
        this.locationKnown = false;
        // LATER could make this decay 1 point/day, eg by storing a started: Date and subtracting points from score equal to today - started.
        this.playerScore = 0;
        this.scoreEl = document.getElementById('score');
        // Dict storing Dates in string format.
        this.coords2dates = {};
        this.lastSeenTime = new Date(0); // 1970
        this.lastSeenLat = SAN_FRANCISCO[0];
        this.lastSeenLong = SAN_FRANCISCO[1];
        // --- Map setup ---
        this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            // NOTE: This attribution string displays as hyperlinks in the bottom right of the screen.
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }).addTo(this.map);
        L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
        this.map.createPane('fogPane');
        this.map.getPane('fogPane').style.zIndex = '250'; // above tiles (200), below overlays (400)
        // Hide tiles during pan/zoom so unfogged street tiles don't show before fog is drawn.
        this.map.on('movestart', () => this.tileLayer.setOpacity(0));
        this.map.on('moveend', () => {
            if (this.map.getZoom() > 11) {
                this.tileLayer.setOpacity(1);
            }
        });
        this.load();
        this.updateScoreDisplay();
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((pos) => this.updateAfterGPS(pos.coords.latitude, pos.coords.longitude), (err) => this.gpsError(err), {
                enableHighAccuracy: true,
            });
        }
        this.map.on('moveend', () => this.updateAfterPan());
        document
            .getElementById('recenter-btn')
            .addEventListener('click', () => this.panToPlayer());
        const helpModal = document.getElementById('help-modal');
        document
            .getElementById('help-btn')
            .addEventListener('click', () => helpModal.classList.add('open'));
        document
            .getElementById('help-close')
            .addEventListener('click', () => helpModal.classList.remove('open'));
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal)
                helpModal.classList.remove('open');
        });
        setInterval(() => this.refreshNumbers(), 5000);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden)
                this.refreshNumbers();
        });
        // TODO brag screen for sharing with friends. Points earned in the last 7 days (including today). Performance relative to personal trends.
        this.updateScreen();
    }
    updateAfterPan() {
        this.updateAfterGPS(this.lastSeenLat, this.lastSeenLong);
    }
    // TODO bug 2026 march 18. Sometimes player dot does not react to recent real-life movement until you refresh the page. Goal labels and score display don't update either. Unclear whether visit() was called invisibly. Refreshing fixes everything.
    // Perhaps moveend should trigger a wrapper of updateAfterGPS(), using cached coords.
    updateAfterGPS(latitude, longitude) {
        // Bug TODO - refresh then wait for first GPS decection. It will center correctly but the playerMarker circle will be missing. Seen again 2026 mar 26 (even after waiting 5 for autoupdate).
        if (this.playerMarker) {
            this.playerMarker.setLatLng([latitude, longitude]);
        }
        else {
            this.playerMarker = L.circleMarker([latitude, longitude], {
                radius: 15,
                color: '#ffffff',
                fillColor: '#800080',
                fillOpacity: 0.9,
                weight: 2,
            }).addTo(this.map);
        }
        if (!this.locationKnown) {
            this.locationKnown = true;
            this.map.setView([latitude, longitude], 16);
        }
        else {
            // Infer a line of recent travel
            // If the last checkin was too long ago, no credit is inferred.
            const sinceLastSeen = Date.now() - this.lastSeenTime.getTime();
            const latDelta = Math.abs(this.lastSeenLat - latitude);
            const longDelta = Math.abs(this.lastSeenLong - longitude);
            const dist = Math.sqrt(latDelta ** 2 + longDelta ** 2);
            // Waiting then driving can be misread as biking. We want to be lenient with distracted hikers but strict with bikers who can more easily check in often.
            if (sinceLastSeen <= 2 * HOUR && dist <= 3 * GRID_STEP) {
                // Players that exceeded this speed limit were probably in a motor vehicle and not exercising.
                if (dist / sinceLastSeen < (10 * GRID_STEP) / HOUR) {
                    // Good to visit more intermediate points when traveling diagonally.
                    const visits = Math.ceil((latDelta + longDelta) / GRID_STEP);
                    let lastVisitedLat = this.lastSeenLat;
                    let lastVisitedLong = this.lastSeenLong;
                    for (let v = 1; v < visits; v++) {
                        const lat = this.lastSeenLat +
                            (latitude - this.lastSeenLat) * (v / visits);
                        const long = this.lastSeenLong +
                            (longitude - this.lastSeenLong) * (v / visits);
                        if (lat === lastVisitedLat &&
                            long === lastVisitedLong) {
                            continue; // skip repeats
                        }
                        this.visit(lat, long);
                        lastVisitedLat = lat;
                        lastVisitedLong = long;
                    }
                }
            }
        }
        this.visit(latitude, longitude);
        this.lastSeenTime = new Date();
        this.lastSeenLat = latitude;
        this.lastSeenLong = longitude;
        if (TEST_MODE === 'font') {
            this._mockWideFont(latitude, longitude);
        }
        this.updateScreen();
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
            const key = BlockScout.keyFormat(lat, long);
            this.coords2dates[key] = goal.lastVisited.toISOString();
            // LATER could call this less often, or on a cooldown timer, or check GPS position less often.
            this.save();
            const existingMarker = this.renderedGoals.get(key);
            if (existingMarker) {
                existingMarker.setIcon(this.icon(goal));
            }
        }
    }
    updateScreen() {
        this.quickUpdateScreen();
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
        const coordKey = BlockScout.keyFormat(lat, long);
        const dateStr = this.coords2dates[coordKey];
        return new goal_1.Goal(dateStr ? new Date(dateStr) : undefined);
    }
    quickUpdateScreen() {
        const bounds = this.map.getBounds();
        const buf = GRID_STEP * FOG_BUFFER;
        const latMin = this.snapToGrid(bounds.getSouth() - buf);
        const latMax = this.snapToGrid(bounds.getNorth() + buf);
        const longMin = this.snapToGrid(bounds.getWest() - buf);
        const longMax = this.snapToGrid(bounds.getEast() + buf);
        const activeKeys = new Set();
        // TODO bug - slow performance when very zoomed out
        if (this.map.getZoom() <= 11) {
            console.time('overview-total');
            console.time('overview-setup');
            this.tileLayer.setOpacity(0);
            this.map.getContainer().style.backgroundColor = 'black';
            console.timeEnd('overview-setup');
            console.time('overview-clear-normal-layers');
            // Clear normal-mode layers
            for (const rect of this.fogRectangles.values()) {
                this.map.removeLayer(rect);
            }
            this.fogRectangles.clear();
            for (const marker of this.renderedGoals.values()) {
                this.map.removeLayer(marker);
            }
            this.renderedGoals.clear();
            console.timeEnd('overview-clear-normal-layers');
            console.time('overview-render-loop');
            // Iterate only visited cells rather than every cell in the viewport.
            for (const key of Object.keys(this.coords2dates)) {
                const [lat, long] = key.split(',').map(Number);
                if (lat < latMin ||
                    lat > latMax ||
                    long < longMin ||
                    long > longMax) {
                    continue;
                }
                const goal = this.goalAt(lat, long);
                if (goal.pointsAvailable() < 1000) {
                    if (!this.exploredRectangles.has(key)) {
                        const s = this.snapToGrid(lat);
                        const w = this.snapToGrid(long);
                        const rect = L.rectangle([
                            [s - GRID_STEP / 2, w - GRID_STEP / 2],
                            [s + GRID_STEP / 2, w + GRID_STEP / 2],
                        ], {
                            pane: 'fogPane',
                            color: 'white',
                            fillColor: 'white',
                            fillOpacity: 1,
                            weight: 0,
                            interactive: false,
                        }).addTo(this.map);
                        this.exploredRectangles.set(key, rect);
                    }
                }
                else {
                    const existing = this.exploredRectangles.get(key);
                    if (existing) {
                        this.map.removeLayer(existing);
                        this.exploredRectangles.delete(key);
                    }
                }
            }
            console.timeEnd('overview-render-loop');
            console.time('overview-cull');
            for (const [key, rect] of this.exploredRectangles) {
                const [lat, long] = key.split(',').map(Number);
                if (lat < latMin ||
                    lat > latMax ||
                    long < longMin ||
                    long > longMax) {
                    this.map.removeLayer(rect);
                    this.exploredRectangles.delete(key);
                }
            }
            console.timeEnd('overview-cull');
            console.timeEnd('overview-total');
            return;
        }
        // Normal mode (zoom > 11): restore background, clear overview layers
        this.map.getContainer().style.backgroundColor = '';
        for (const rect of this.exploredRectangles.values()) {
            this.map.removeLayer(rect);
        }
        this.exploredRectangles.clear();
        for (let lat = latMin; lat <= latMax + GRID_STEP / 2; lat += GRID_STEP) {
            for (let long = longMin; long <= longMax + GRID_STEP / 2; long += GRID_STEP) {
                const key = BlockScout.keyFormat(lat, long);
                activeKeys.add(key);
                const goal = this.goalAt(lat, long);
                const fogged = goal.pointsAvailable() >= 1000;
                if (fogged) {
                    // Add fog rectangle if not already present
                    if (!this.fogRectangles.has(key)) {
                        const s = this.snapToGrid(lat);
                        const w = this.snapToGrid(long);
                        const rect = L.rectangle([
                            [s - GRID_STEP / 2, w - GRID_STEP / 2],
                            [s + GRID_STEP / 2, w + GRID_STEP / 2],
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
                    // Hide goal label for fogged cell
                    const existingLabel = this.renderedGoals.get(key);
                    if (existingLabel) {
                        this.map.removeLayer(existingLabel);
                        this.renderedGoals.delete(key);
                    }
                }
                else {
                    // Remove fog rectangle for visited cell
                    const existingFog = this.fogRectangles.get(key);
                    if (existingFog) {
                        this.map.removeLayer(existingFog);
                        this.fogRectangles.delete(key);
                    }
                    // When very zoomed out, don't show labels. They overlap each other.
                    if (this.map.getZoom() < 13) {
                        const existingLabel = this.renderedGoals.get(key);
                        if (existingLabel) {
                            this.map.removeLayer(existingLabel);
                            this.renderedGoals.delete(key);
                        }
                        continue;
                    }
                    if (!this.renderedGoals.get(key)) {
                        const icon = this.icon(goal);
                        const marker = L.marker([this.snapToGrid(lat), this.snapToGrid(long)], { icon, interactive: false }).addTo(this.map);
                        this.renderedGoals.set(key, marker);
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
    // Refresh the label text on already-rendered goal markers without rebuilding the full viewport.
    // Used by the periodic timer and visibility-change handler so stale point counts update overnight.
    refreshNumbers() {
        for (const [key, marker] of this.renderedGoals) {
            const [lat, long] = key.split(',').map(Number);
            marker.setIcon(this.icon(this.goalAt(lat, long)));
        }
        this.updateScoreDisplay();
    }
    icon(goal) {
        const iconW = Math.round(GOAL_FONT_PX * 2.5);
        const iconH = Math.round(GOAL_FONT_PX * 1.4);
        return L.divIcon({
            className: 'goal-label',
            html: `<span style="font-size:${GOAL_FONT_PX}px">${goal.text()}</span>`,
            iconSize: [iconW, iconH],
            iconAnchor: [iconW / 2, iconH / 2],
        });
    }
    panToPlayer() {
        if (this.locationKnown && this.playerMarker) {
            this.map.panTo(this.playerMarker.getLatLng());
        }
    }
    stateString() {
        const state = {
            coords2dates: this.coords2dates,
            playerScore: this.playerScore,
        };
        return JSON.stringify(state);
    }
    // Save & load are both the whole gamestate, ie playerScore AND coords2dates.
    save() {
        localStorage.setItem('mapGame', this.stateString());
    }
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
    // For testing.
    _mockWideFont(lat, long) {
        const aWhileAgo = new Date(Date.now() - 200 * 24 * HOUR);
        this._setLastVisit(lat, long + 0.01, aWhileAgo);
        this._setLastVisit(lat, long + 0.02, aWhileAgo);
    }
    // For testing.
    _setLastVisit(lat, long, date) {
        const goal = this.goalAt(lat, long);
        goal.lastVisited = date;
        this.coords2dates[BlockScout.keyFormat(lat, long)] = date.toISOString();
    }
    static run() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.blockscout = new BlockScout();
    }
}
exports.BlockScout = BlockScout;
// TODO call buildblockscout from Github CI. Stop having to commit dist/*.js.
// TODO Ability to export your save file. Ability to import a save file (merging it into current state).
// LATER Measure mobile performance in more detail. Can measure much of this from the emulator.
// LATER improve VSCode integration with CC.
// Run in browser, not during unit tests (DOM is empty at import time).
if (typeof document !== 'undefined' && document.getElementById('map')) {
    BlockScout.run();
}

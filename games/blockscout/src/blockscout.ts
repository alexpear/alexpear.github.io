// Mobile game that suggests nearby places to go while exercising, eg biking or jogging.

import { Goal } from './goal';
import { createClient } from '@supabase/supabase-js';

// The publishable key is safe to commit when row-level security is enabled (see supabase-setup.sql).
const SUPABASE_URL = 'https://jqbepxpfnhhpklmyrlrv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_lop0dZzKMPMf86bQUUSW-w_XZYJRLu3';
const supabase =
    SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
        ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
        : null;

// L (Leaflet) is loaded as a global by leaflet.js, a script that index.html loads from the unpkg.com CDN.
declare const L;
const GRID_STEP: number = 0.01;
const GOAL_FONT_PX: number = 32;
const FOG_BUFFER: number = 1; // Extra cells of fog rendered beyond the viewport edge
const HOUR = 60 * 60 * 1000; // in ms
const SAN_FRANCISCO = [37.77, -122.42];

const TEST_MODE: string = undefined; // 'font';

// 0 points → white, 1000 points → black
export function overviewColor(points: number): string {
    const redBlue = Math.round(255 * (1 - points / 1000));
    const green = Math.round(255 * Math.max(0, 1 - points / 500)); // Green fades quickly, leaving purples.
    return `rgb(${redBlue},${green},${redBlue})`;
}

export class BlockScout {
    // LATER if user hasnt refreshed in over a month, refresh the page to get latest logic. Be careful to avoid refresh loop obviously.

    // eslint-disable-next-line @typescript-eslint/typedef
    map = L.map('map', {
        renderer: L.canvas({ padding: 0.1 }),
        zoomControl: false,
    }).setView(SAN_FRANCISCO, 15);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tileLayer: Record<string, any> | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playerMarker: Record<string, any> | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderedGoals: Map<string, Record<string, any>> = new Map();
    fogRectangles: Map<string, Record<string, object>> = new Map();
    exploredRectangles: Map<string, Record<string, object>> = new Map();
    locationKnown: boolean = false;

    helpButton: HTMLElement;

    // LATER could make this decay 1 point/day, eg by storing a started: Date and subtracting points from score equal to today - started.
    playerScore: number = 0;
    scoreEl: HTMLElement = document.getElementById('score');

    // Dict storing Dates in string format.
    coords2dates: Record<string, string> = {};

    lastSeenTime: Date = new Date(0); // 1970
    lastSeenLat: number = SAN_FRANCISCO[0];
    lastSeenLong: number = SAN_FRANCISCO[1];

    // Cloud backup identity. Constructor calls this.load() which always overwrites userId with the id from browser storage, if one is present.
    userId: string = crypto.randomUUID();

    // PII because these can be combined with the relative coords in supabase to reconstruct where the user lives & works. These only ever are stored in the mobile browser & in the recovery URL's params.
    offsetLat: number = (Math.random() - 0.5) * 90;
    offsetLng: number = (Math.random() - 0.5) * 360;

    supabaseSaveTimeout: number | undefined = undefined;

    constructor() {
        // --- Map setup ---
        this.tileLayer = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
                // NOTE: This attribution string displays as hyperlinks in the bottom right of the screen.
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            },
        ).addTo(this.map);

        L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

        this.map.createPane('fogPane');
        this.map.getPane('fogPane').style.zIndex = '250'; // above tiles (200), below overlays (400)

        // Hide tiles during pan/zoom so unfogged street tiles don't show before fog is drawn.
        this.map.on('movestart', () => this.tileLayer.setOpacity(0));
        this.map.on('moveend', () => {
            if (this.map.getZoom() > 12) {
                this.tileLayer.setOpacity(1);
            }
        });

        this.load();
        this.updateScoreDisplay();

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) =>
                    this.updateAfterGPS(
                        pos.coords.latitude,
                        pos.coords.longitude,
                    ),
                (err) => this.gpsError(err),
                {
                    enableHighAccuracy: true,
                },
            );
        }

        this.map.on('moveend', () => this.updateAfterPan());

        document
            .getElementById('recenter-btn')!
            .addEventListener('click', () => this.panToPlayer());

        const helpModal = document.getElementById('help-modal')!; // The ! tells the Typescript compiler not to worry about the function returning undefined.
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

        setInterval(() => this.refreshNumbers(), 5000);

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.refreshNumbers();
        });

        // LATER brag screen for sharing with friends. Points earned in the last 7 days (including today). Performance relative to personal trends.
        // LATER Points/day metric displayed somewhere, eg brag screen.

        this.setupRecoveryUI();

        // void means we are treating this async func as a void by ignoring the Promise it returns.
        void this.maybeRecoverFromUrl();

        this.updateScreen();
    }

    updateAfterPan(): void {
        this.updateAfterGPS(this.lastSeenLat, this.lastSeenLong);
    }

    // bug 2026 march 18. Sometimes player dot does not react to recent real-life movement until you refresh the page. Goal labels and score display don't update either. Unclear whether visit() was called invisibly. Refreshing fixes everything.
    // Perhaps moveend should trigger a wrapper of updateAfterGPS(), using cached coords.
    updateAfterGPS(latitude: number, longitude: number): void {
        // Bug LATER - refresh then wait for first GPS decection. It will center correctly but the playerMarker circle will be missing. Seen again 2026 mar 26 (even after waiting 5 for autoupdate).
        if (this.playerMarker) {
            this.playerMarker.setLatLng([latitude, longitude]);
        } else {
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
        } else {
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
                    const visits = Math.ceil(
                        (latDelta + longDelta) / GRID_STEP,
                    );

                    let lastVisitedLat = this.lastSeenLat;
                    let lastVisitedLong = this.lastSeenLong;

                    for (let v = 1; v < visits; v++) {
                        const lat =
                            this.lastSeenLat +
                            (latitude - this.lastSeenLat) * (v / visits);
                        const long =
                            this.lastSeenLong +
                            (longitude - this.lastSeenLong) * (v / visits);

                        if (
                            lat === lastVisitedLat &&
                            long === lastVisitedLong
                        ) {
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

    updateScreen(): void {
        this.quickUpdateScreen();
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
        const coordKey = BlockScout.keyFormat(lat, long);
        const dateStr = this.coords2dates[coordKey];
        return new Goal(dateStr ? new Date(dateStr) : undefined);
    }

    quickUpdateScreen(): void {
        const bounds = this.map.getBounds();
        const buf = GRID_STEP * FOG_BUFFER;

        const latMin = this.snapToGrid(bounds.getSouth() - buf);
        const latMax = this.snapToGrid(bounds.getNorth() + buf);
        const longMin = this.snapToGrid(bounds.getWest() - buf);
        const longMax = this.snapToGrid(bounds.getEast() + buf);

        const activeKeys = new Set<string>();

        if (this.map.getZoom() <= 12) {
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
                if (
                    lat < latMin ||
                    lat > latMax ||
                    long < longMin ||
                    long > longMax
                ) {
                    continue;
                }
                const goal = this.goalAt(lat, long);
                if (goal.pointsAvailable() < 1000) {
                    const color = overviewColor(goal.pointsAvailable());
                    if (!this.exploredRectangles.has(key)) {
                        const s = this.snapToGrid(lat);
                        const w = this.snapToGrid(long);
                        const rect = L.rectangle(
                            [
                                [s - GRID_STEP / 2, w - GRID_STEP / 2],
                                [s + GRID_STEP / 2, w + GRID_STEP / 2],
                            ],
                            {
                                pane: 'fogPane',
                                color,
                                fillColor: color,
                                fillOpacity: 1,
                                weight: 0,
                                interactive: false,
                            },
                        ).addTo(this.map);
                        this.exploredRectangles.set(key, rect);
                    }
                } else {
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
                if (
                    lat < latMin ||
                    lat > latMax ||
                    long < longMin ||
                    long > longMax
                ) {
                    this.map.removeLayer(rect);
                    this.exploredRectangles.delete(key);
                }
            }
            console.timeEnd('overview-cull');

            console.timeEnd('overview-total');
            return;
        }

        // Normal mode (zoom > 12): restore background, clear overview layers
        this.map.getContainer().style.backgroundColor = '';
        for (const rect of this.exploredRectangles.values()) {
            this.map.removeLayer(rect);
        }
        this.exploredRectangles.clear();

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
                const key = BlockScout.keyFormat(lat, long);
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

                        const marker = L.marker(
                            [this.snapToGrid(lat), this.snapToGrid(long)],
                            { icon, interactive: false },
                        ).addTo(this.map);

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
    refreshNumbers(): void {
        for (const [key, marker] of this.renderedGoals) {
            const [lat, long] = key.split(',').map(Number);
            marker.setIcon(this.icon(this.goalAt(lat, long)));
        }
        this.updateScoreDisplay();
    }

    icon(goal: Goal): object {
        const iconW = Math.round(GOAL_FONT_PX * 2.5);
        const iconH = Math.round(GOAL_FONT_PX * 1.4);

        return L.divIcon({
            className: 'goal-label',
            html: `<span style="font-size:${GOAL_FONT_PX}px">${goal.text()}</span>`,
            iconSize: [iconW, iconH],
            iconAnchor: [iconW / 2, iconH / 2],
        });
    }

    panToPlayer(): void {
        if (this.locationKnown && this.playerMarker) {
            this.map.panTo(this.playerMarker.getLatLng());
        }
    }

    stateString(): string {
        return JSON.stringify({
            coords2dates: this.coords2dates,
            playerScore: this.playerScore,
            userId: this.userId,
            offsetLat: this.offsetLat,
            offsetLng: this.offsetLng,
        });
    }

    // Save & load are both the whole gamestate, ie playerScore AND coords2dates.
    save(): void {
        localStorage.setItem('mapGame', this.stateString());
        this.scheduleSupabaseSave();
    }

    scheduleSupabaseSave(): void {
        // If the timer is already going, cancel it & make a new one below.
        if (this.supabaseSaveTimeout !== undefined) {
            clearTimeout(this.supabaseSaveTimeout);
        }

        // TODO does this prop always become undefined after the timer?
        this.supabaseSaveTimeout = window.setTimeout(
            () => void this.pushToSupabase(),
            5000,
        );
    }

    async pushToSupabase(): Promise<void> {
        if (!supabase) return;
        const shifted: Record<string, string> = {};
        for (const [key, dateStr] of Object.entries(this.coords2dates)) {
            const [lat, lng] = key.split(',').map(Number);

            // All coords in the cloud are relative to the offset coord, which is PII & never touches the server.
            shifted[
                BlockScout.keyFormat(lat - this.offsetLat, lng - this.offsetLng)
            ] = dateStr;
        }

        await supabase.from('blockscout_saves').upsert({
            user_id: this.userId,
            data: { coords2dates: shifted, playerScore: this.playerScore },
            updated_at: new Date().toISOString(),
        });
    }

    get recoveryUrl(): string {
        return (
            `${location.origin}${location.pathname}` +
            `?uid=${this.userId}&off=${this.offsetLat},${this.offsetLng}`
        );
    }

    setupRecoveryUI(): void {
        this.helpButton = document.getElementById('help-btn')!;
        const recoveryModal = document.getElementById('recovery-modal')!;
        const urlText = document.getElementById('recovery-url-text')!;

        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.getElementById('recovery-safari-info')!.style.display =
                'block';
        }

        if (!localStorage.getItem('risk-banner-hidden')) {
            // ? button loads in backup reminder mode.
            this.helpButton.innerHTML = 'Save Game';
            this.helpButton.classList.add('backup-highlight');
        }

        document
            .getElementById('save-recovery-url-btn')!
            .addEventListener('click', () => {
                urlText.textContent = this.recoveryUrl;
                document.getElementById('help-modal').classList.remove('open');
                recoveryModal.classList.add('open');
            });

        document
            .getElementById('copy-url-btn')!
            .addEventListener('click', async () => {
                await navigator.clipboard.writeText(this.recoveryUrl);
                this.ceaseBackupHighlighting();
                const btn = document.getElementById(
                    'copy-url-btn',
                ) as HTMLButtonElement;
                btn.textContent = 'Copied!';
                window.setTimeout(() => {
                    btn.textContent = 'Copy URL';
                }, 2000);
            });

        document
            .getElementById('email-url-btn')!
            .addEventListener('click', () => {
                const subject = encodeURIComponent(
                    'My Block Scout recovery URL',
                );
                const body = encodeURIComponent(
                    `If you ever lose your game progress in Block Scout, click this personalized URL. (Safari in particular likes to delete game data without warning.) ${this.recoveryUrl}\n\n  On Safari, you can additionally protect your game progress by installing Block
                    Scout to your home screen: Click Safari's Share icon,
                    then 'Add to Home Screen', then 'Add'.`,
                );
                this.ceaseBackupHighlighting();
                location.href = `mailto:?subject=${subject}&body=${body}`;
            });

        document
            .getElementById('recovery-close-btn')!
            .addEventListener('click', () => {
                recoveryModal.classList.remove('open');
            });

        recoveryModal.addEventListener('click', (e) => {
            if (e.target === recoveryModal)
                recoveryModal.classList.remove('open');
        });
    }

    ceaseBackupHighlighting(): void {
        localStorage.setItem('risk-banner-hidden', '1');
        this.helpButton.innerHTML = '?';
        this.helpButton.classList.remove('backup-highlight');
    }

    async maybeRecoverFromUrl(): Promise<void> {
        const params = new URLSearchParams(location.search);
        const uid = params.get('uid');
        const off = params.get('off');
        if (!uid || !off) return;

        const [offLat, offLng] = off.split(',').map(Number);
        if (isNaN(offLat) || isNaN(offLng)) return;

        // Strip params immediately so a refresh doesn't re-trigger recovery.
        history.replaceState({}, '', location.pathname);

        if (!supabase) {
            console.warn(
                'BlockScout: recovery URL detected but Supabase is not configured.',
            );
            return;
        }

        // The constructor (which calls maybeRecoverFromUrl) will not be blocked during this await call.
        const { data, error } = await supabase
            .from('blockscout_saves')
            .select('data')
            .eq('user_id', uid)
            .single();

        if (error || !data) {
            console.warn('BlockScout: cloud recovery failed', error);
            return;
        }

        const cloudCoords: Record<string, string> =
            data.data?.coords2dates ?? {};
        let mergedCount = 0;

        for (const [key, dateStr] of Object.entries(cloudCoords)) {
            const [lat, lng] = key.split(',').map(Number);
            const realKey = BlockScout.keyFormat(lat + offLat, lng + offLng);
            const localDate = this.coords2dates[realKey];
            if (!localDate || dateStr > localDate) {
                this.coords2dates[realKey] = dateStr;
                mergedCount++;
            }
        }

        // Adopt the recovered identity so future saves go to the same cloud record.
        this.userId = uid;
        this.offsetLat = offLat;
        this.offsetLng = offLng;
        this.save();
        this.updateScreen();

        console.log(
            `BlockScout: recovery complete — merged ${mergedCount} blocks from cloud.`,
        );
    }

    // Load the saved gamestate from local storage.
    load(): void {
        const raw = localStorage.getItem('mapGame');
        if (!raw) return;

        const s = JSON.parse(raw);
        if (s.playerScore) this.playerScore = Number(s.playerScore);
        if (s.coords2dates) this.coords2dates = s.coords2dates;
        if (s.userId) this.userId = s.userId;
        if (typeof s.offsetLat === 'number') this.offsetLat = s.offsetLat;
        if (typeof s.offsetLng === 'number') this.offsetLng = s.offsetLng;
    }

    // NOTE Players that visit a vast quantity of places will have large gamestates. Hopefully this only affects performance at inhuman levels.

    // For testing.
    private _mockWideFont(lat: number, long: number): void {
        const aWhileAgo = new Date(Date.now() - 200 * 24 * HOUR);
        this._setLastVisit(lat, long + 0.01, aWhileAgo);
        this._setLastVisit(lat, long + 0.02, aWhileAgo);
    }

    // For testing.
    private _setLastVisit(lat: number, long: number, date: Date): void {
        const goal: Goal = this.goalAt(lat, long);
        goal.lastVisited = date;
        this.coords2dates[BlockScout.keyFormat(lat, long)] = date.toISOString();
    }

    // LATER ability to patch mistakes, eg if you use your phone while driving. Can also be used to manually set challenges perhaps. Menu > mode where you click on a block to select it > confirmation screen y/n. No brings you back to normal mode.

    static run(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).blockscout = new BlockScout();
    }
}

// LATER call buildblockscout from Github CI. Stop having to commit dist/*.js.
// LATER Measure mobile performance in more detail. Can measure much of this from the emulator.
// LATER improve VSCode integration with CC.

// Run in browser, not during unit tests (DOM is empty at import time).
if (typeof document !== 'undefined' && document.getElementById('map')) {
    BlockScout.run();
}

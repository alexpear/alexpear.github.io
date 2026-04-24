import {
    axialToWorld,
    hexCorners,
    HEX_WIDTH,
    worldToAxial,
} from './hex';
import { Planet } from './planet';
import { Place } from './place';

type Mode = 'map' | 'place';

interface Camera {
    // World-space coord at the center of the screen.
    x: number;
    y: number;
    // Pixels per world unit.
    scale: number;
}

// Scale at which one hex fills the screen horizontally. Computed per resize.
function placeScale(screenWidth: number): number {
    // Add a small margin so hex edges don't touch screen edges.
    return (screenWidth * 0.92) / HEX_WIDTH;
}

// Default map-view scale — roughly a hex per thumb-width on mobile.
function defaultMapScale(screenWidth: number): number {
    return Math.max(40, screenWidth / 8);
}

export class UI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private planet: Planet;
    private camera: Camera;
    private mode: Mode = 'map';

    // Interaction state
    private activeTouches: Map<number, { x: number; y: number }> = new Map();
    private pinchStart: {
        dist: number;
        scale: number;
        midWorld: { x: number; y: number };
    } | null = null;
    private mouseDragging = false;
    private lastPointer: { x: number; y: number } | null = null;

    // DPR-scaled screen size in CSS pixels
    private width: number = 0;
    private height: number = 0;

    constructor(canvas: HTMLCanvasElement, planet: Planet) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('2D context unavailable');
        this.ctx = ctx;
        this.planet = planet;
        this.camera = { x: 0, y: 0, scale: 60 };

        this.resize();
        this.camera.scale = defaultMapScale(this.width);

        window.addEventListener('resize', () => this.resize());

        canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), {
            passive: false,
        });
        canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), {
            passive: false,
        });
        canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), {
            passive: false,
        });
        canvas.addEventListener('touchcancel', (e) => this.onTouchEnd(e), {
            passive: false,
        });

        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.onWheel(e), {
            passive: false,
        });

        const loop = () => {
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    private resize() {
        const dpr = window.devicePixelRatio || 1;
        const w = this.canvas.clientWidth || window.innerWidth;
        const h = this.canvas.clientHeight || window.innerHeight;
        this.width = w;
        this.height = h;
        this.canvas.width = Math.floor(w * dpr);
        this.canvas.height = Math.floor(h * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ---- coord helpers ----

    private screenToWorld(sx: number, sy: number): { x: number; y: number } {
        return {
            x: (sx - this.width / 2) / this.camera.scale + this.camera.x,
            y: (sy - this.height / 2) / this.camera.scale + this.camera.y,
        };
    }

    private worldToScreen(wx: number, wy: number): { x: number; y: number } {
        return {
            x: (wx - this.camera.x) * this.camera.scale + this.width / 2,
            y: (wy - this.camera.y) * this.camera.scale + this.height / 2,
        };
    }

    // ---- input ----

    private onTouchStart(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            this.activeTouches.set(t.identifier, {
                x: t.clientX,
                y: t.clientY,
            });
        }
        if (this.activeTouches.size === 2) this.startPinch();
    }

    private onTouchMove(e: TouchEvent) {
        e.preventDefault();
        const prev = new Map(this.activeTouches);
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (this.activeTouches.has(t.identifier)) {
                this.activeTouches.set(t.identifier, {
                    x: t.clientX,
                    y: t.clientY,
                });
            }
        }
        if (this.activeTouches.size === 1) {
            const id = this.activeTouches.keys().next().value as number;
            const now = this.activeTouches.get(id)!;
            const before = prev.get(id);
            if (before) this.panByScreen(now.x - before.x, now.y - before.y);
        } else if (this.activeTouches.size === 2 && this.pinchStart) {
            const pts = Array.from(this.activeTouches.values());
            const dx = pts[0].x - pts[1].x;
            const dy = pts[0].y - pts[1].y;
            const dist = Math.hypot(dx, dy);
            const mid = {
                x: (pts[0].x + pts[1].x) / 2,
                y: (pts[0].y + pts[1].y) / 2,
            };
            const ratio = dist / this.pinchStart.dist;
            const newScale = this.pinchStart.scale * ratio;
            this.setScaleAnchored(newScale, mid.x, mid.y, this.pinchStart.midWorld);
        }
    }

    private onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            this.activeTouches.delete(e.changedTouches[i].identifier);
        }
        this.pinchStart = null;
        if (this.activeTouches.size === 2) this.startPinch();
        if (this.activeTouches.size === 0) this.onGestureEnd();
    }

    private startPinch() {
        const pts = Array.from(this.activeTouches.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const mid = {
            x: (pts[0].x + pts[1].x) / 2,
            y: (pts[0].y + pts[1].y) / 2,
        };
        this.pinchStart = {
            dist: Math.hypot(dx, dy),
            scale: this.camera.scale,
            midWorld: this.screenToWorld(mid.x, mid.y),
        };
    }

    private onMouseDown(e: MouseEvent) {
        this.mouseDragging = true;
        this.lastPointer = { x: e.clientX, y: e.clientY };
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.mouseDragging || !this.lastPointer) return;
        this.panByScreen(
            e.clientX - this.lastPointer.x,
            e.clientY - this.lastPointer.y,
        );
        this.lastPointer = { x: e.clientX, y: e.clientY };
    }

    private onMouseUp(_e: MouseEvent) {
        if (!this.mouseDragging) return;
        this.mouseDragging = false;
        this.lastPointer = null;
        this.onGestureEnd();
    }

    private onWheel(e: WheelEvent) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.0015);
        const anchorWorld = this.screenToWorld(e.clientX, e.clientY);
        this.setScaleAnchored(
            this.camera.scale * factor,
            e.clientX,
            e.clientY,
            anchorWorld,
        );
        this.onGestureEnd();
    }

    private panByScreen(dx: number, dy: number) {
        this.camera.x -= dx / this.camera.scale;
        this.camera.y -= dy / this.camera.scale;
    }

    private setScaleAnchored(
        newScale: number,
        anchorSx: number,
        anchorSy: number,
        anchorWorld: { x: number; y: number },
    ) {
        const minScale = 20;
        const maxScale = placeScale(this.width) * 1.2;
        this.camera.scale = Math.min(maxScale, Math.max(minScale, newScale));
        // Keep anchorWorld under (anchorSx, anchorSy).
        this.camera.x =
            anchorWorld.x - (anchorSx - this.width / 2) / this.camera.scale;
        this.camera.y =
            anchorWorld.y - (anchorSy - this.height / 2) / this.camera.scale;
    }

    // Called when a drag/pinch finishes. Handles mode transitions and snapping.
    private onGestureEnd() {
        const pScale = placeScale(this.width);
        if (this.camera.scale >= pScale * 0.85) {
            // Snap into Place View.
            this.mode = 'place';
            this.camera.scale = pScale;
            this.snapCameraToNearestHex();
        } else if (this.mode === 'place') {
            // Zoomed out below threshold — back to map mode.
            this.mode = 'map';
        } else {
            // In map mode, if drag ended while panning, do nothing.
        }
    }

    private snapCameraToNearestHex() {
        const a = worldToAxial(this.camera.x, this.camera.y);
        const w = axialToWorld(a.q, a.r);
        this.camera.x = w.x;
        this.camera.y = w.y;
    }

    // ---- rendering ----

    private draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, this.width, this.height);

        // Figure out which hexes are visible.
        const topLeft = this.screenToWorld(0, 0);
        const bottomRight = this.screenToWorld(this.width, this.height);
        // Sample corner axial coords and pad.
        const corners = [
            worldToAxial(topLeft.x, topLeft.y),
            worldToAxial(bottomRight.x, topLeft.y),
            worldToAxial(topLeft.x, bottomRight.y),
            worldToAxial(bottomRight.x, bottomRight.y),
        ];
        let minQ = Infinity,
            maxQ = -Infinity,
            minR = Infinity,
            maxR = -Infinity;
        for (const c of corners) {
            if (c.q < minQ) minQ = c.q;
            if (c.q > maxQ) maxQ = c.q;
            if (c.r < minR) minR = c.r;
            if (c.r > maxR) maxR = c.r;
        }
        minQ -= 2;
        maxQ += 2;
        minR -= 2;
        maxR += 2;

        for (let r = minR; r <= maxR; r++) {
            for (let q = minQ; q <= maxQ; q++) {
                this.drawHex(q, r);
            }
        }

        if (this.mode === 'place') this.drawPlaceOverlay();
    }

    private drawHex(q: number, r: number) {
        const ctx = this.ctx;
        const place = this.planet.place(q, r);
        const center = axialToWorld(q, r);
        const s = this.worldToScreen(center.x, center.y);
        const size = this.camera.scale; // world size is 1
        const corners = hexCorners(size);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const c = corners[i];
            const x = s.x + c.x;
            const y = s.y + c.y;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = place.color();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.stroke();

        // In place view, draw text inside the focused hex.
        if (this.mode === 'place') {
            const focus = worldToAxial(this.camera.x, this.camera.y);
            if (focus.q === q && focus.r === r) {
                this.drawPlaceText(place, s.x, s.y, size);
            }
        }
    }

    private drawPlaceText(place: Place, cx: number, cy: number, size: number) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const titleSize = Math.min(28, size * 0.09);
        const bodySize = Math.min(16, size * 0.055);
        ctx.font = `bold ${titleSize}px sans-serif`;
        ctx.fillText(place.name(), cx, cy - size * 0.35);
        ctx.font = `${bodySize}px sans-serif`;
        const lines = place.flavor();
        const lineGap = bodySize * 1.4;
        const startY = cy - ((lines.length - 1) * lineGap) / 2 + size * 0.05;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], cx, startY + i * lineGap);
        }
    }

    private drawPlaceOverlay() {
        const ctx = this.ctx;
        const focus = worldToAxial(this.camera.x, this.camera.y);
        const place = this.planet.place(focus.q, focus.r);
        // Subtle banner up top.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 0, this.width, 32);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Place View — ${place.name()}`, 10, 16);
    }
}

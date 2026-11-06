import React from 'react';
import { SpaceMapConfig } from '../config';
import { BASE_LAYER } from '../orbital/catalog';
import { Point2D, ThingKind } from '../orbital/types';
import { Thing } from '../orbital/thing';
import {
    computeFraming,
    makeAuToScreenTransform,
    panOffsetForZoomAnchor,
} from '../view/transform';

const RADIUS_PX: Record<ThingKind, number> = {
    star: 8,
    heliocentric: 5,
    moon: 5,
    asteroid: 3,
    spacecraft: 3,
    lagrangePoint: 4,
};
const MIN_ZOOM_MULTIPLIER = 0.05;
const MAX_ZOOM_MULTIPLIER = 100_000;
// Wheel deltaY -> zoom ratio. Chosen so an ordinary mouse wheel notch
// (deltaY roughly 100-120 in most browsers) is a gentle ~8% step; a trackpad's
// continuous small deltas each nudge the zoom by a fraction of a percent.
const WHEEL_ZOOM_SENSITIVITY = 0.0007;
// Clamp on a single wheel event's zoom ratio, so an inertial scroll's
// occasional large deltaY spike can't jump the zoom level all at once.
const MAX_WHEEL_ZOOM_RATIO = 1.3;
// When two Things would render within this many screen pixels of each
// other, the lower-priority one's marker and label are hidden rather than
// drawn on top of (or right next to) the other - mainly moons and distant
// asteroids/TNOs collapsing onto a planet, or onto each other, at low zoom.
// Real mass data isn't tracked anywhere here, so priority is approximated
// instead - see hidePriority() below: Sol always wins; otherwise a
// heliocentric planet always beats a non-heliocentric body; otherwise the
// shorter orbital period wins (eg Neptune beats Pluto). A tie only happens
// for two literally-identical orbital periods, which doesn't occur in this
// catalog.
const MIN_MARKER_SEPARATION_PX = 20;
// On some touchscreens, lifting both pinch fingers at (near) the same instant
// produces a spurious pointermove reporting one finger's coordinates as
// having jumped toward where the other finger had been, just before its
// pointerup arrives - a hardware/driver artifact, not a real finger movement.
// Since that fake jump still happens while both pointers are technically
// active, it would otherwise feed straight into the pinch's distance/midpoint
// math and show up as a sudden zoom+pan right as the gesture ends. No real
// finger (pinching or dragging) can plausibly move this many screen pixels
// between two consecutive pointermove events, so any single event implying a
// bigger jump than this is rejected outright rather than applied.
const MAX_PLAUSIBLE_POINTER_JUMP_PX = 200;

interface Props {
    config: SpaceMapConfig;
}

interface DragState {
    startClientX: number;
    startClientY: number;
    startPanOffset: Point2D;
}

// Distance and midpoint between the two pointers of a pinch gesture.
interface PinchState {
    distance: number;
    midpoint: Point2D;
}

// panOffset and zoomMultiplier are updated together: see applyZoom() for why.
interface ViewState {
    panOffset: Point2D;
    zoomMultiplier: number;
}

const INITIAL_VIEW_STATE: ViewState = {
    panOffset: { x: 0, y: 0 },
    zoomMultiplier: 1,
};

function pinchStateOf(pointers: Map<number, Point2D>): PinchState {
    const [a, b] = [...pointers.values()];
    return {
        distance: Math.hypot(b.x - a.x, b.y - a.y),
        midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
}

// See MIN_MARKER_SEPARATION_PX: a [category, orbitalPeriodDays] pair, lower
// in both is higher priority (less likely to be hidden on overlap). Category
// 0 (Sol) always beats 1 (a heliocentric planet), which always beats 2
// (everything else - moons, asteroids, TNOs); within a category, the
// shorter orbital period wins.
function hidePriority(thing: Thing): [number, number] {
    const category = thing.kind === 'star' ? 0 : thing.kind === 'heliocentric' ? 1 : 2;
    return [category, thing.orbitalPeriodDays ?? 0];
}

// True if `a` loses to `b` under hidePriority() - ie `a` is the one that
// should be hidden when the two render within MIN_MARKER_SEPARATION_PX.
function loses(a: Thing, b: Thing): boolean {
    const [aCategory, aPeriodDays] = hidePriority(a);
    const [bCategory, bPeriodDays] = hidePriority(b);
    if (aCategory !== bCategory) {
        return aCategory > bCategory;
    }
    return aPeriodDays > bPeriodDays;
}

export function SpaceMap({ config }: Props): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const dragStateRef = React.useRef<DragState | null>(null);
    const activePointersRef = React.useRef<Map<number, Point2D>>(new Map());
    const pinchStateRef = React.useRef<PinchState | null>(null);

    const [viewportSize, setViewportSize] = React.useState({
        width: 800,
        height: 600,
    });
    const [viewState, setViewState] =
        React.useState<ViewState>(INITIAL_VIEW_STATE);
    const { panOffset, zoomMultiplier } = viewState;

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return undefined;
        }
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setViewportSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const resetView = React.useCallback(() => {
        setViewState(INITIAL_VIEW_STATE);
    }, []);

    // Re-frame automatically whenever the embed config (focus list, timestamp) changes.
    React.useEffect(() => {
        resetView();
    }, [config, resetView]);

    const focusPoints = React.useMemo(
        () =>
            config.focusedThings.map((object) => object.position(config.date)),
        [config],
    );

    const framing = React.useMemo(
        () =>
            computeFraming(
                focusPoints,
                viewportSize.width,
                viewportSize.height,
            ),
        [focusPoints, viewportSize],
    );

    const toScreen = React.useMemo(
        () =>
            makeAuToScreenTransform(
                framing,
                viewportSize.width,
                viewportSize.height,
                panOffset,
                zoomMultiplier,
            ),
        [framing, viewportSize, panOffset, zoomMultiplier],
    );

    const baseLayerIdSet = React.useMemo(
        () => new Set(BASE_LAYER.map((thing) => thing.id)),
        [],
    );
    const focusIdSet = React.useMemo(
        () => new Set(config.focusedThings.map((object) => object.id)),
        [config],
    );
    // Moons, Lagrange points, etc: only rendered when they're in the current focus list.
    const focusedExtras = React.useMemo(
        () =>
            config.focusedThings.filter(
                (object) => !baseLayerIdSet.has(object.id),
            ),
        [config, baseLayerIdSet],
    );

    const displayedThings = React.useMemo(
        () => [...BASE_LAYER, ...focusedExtras],
        [focusedExtras],
    );

    // See MIN_MARKER_SEPARATION_PX for the approximation this applies.
    const hiddenThingIds = React.useMemo(() => {
        const screenPoints = displayedThings.map((thing) =>
            toScreen(thing.position(config.date)),
        );
        const hidden = new Set<string>();
        for (let i = 0; i < displayedThings.length; i++) {
            for (let j = 0; j < displayedThings.length; j++) {
                if (i === j) {
                    continue;
                }
                const distance = Math.hypot(
                    screenPoints[i].x - screenPoints[j].x,
                    screenPoints[i].y - screenPoints[j].y,
                );
                if (
                    distance < MIN_MARKER_SEPARATION_PX &&
                    loses(displayedThings[i], displayedThings[j])
                ) {
                    hidden.add(displayedThings[i].id);
                    break;
                }
            }
        }
        return hidden;
    }, [displayedThings, toScreen, config.date]);

    // Applies a zoom change by `zoomRatio` (newZoom / oldZoom) anchored at
    // `anchorScreen` (a cursor position or a pinch midpoint, in the SVG's
    // own coordinate space), so that point stays fixed on screen.
    //
    // panOffset and zoomMultiplier update in one setState call, not two,
    // because the ratio that actually reaches panOffsetForZoomAnchor has to
    // be the ratio zoomMultiplier actually moved by — not the requested
    // zoomRatio. Once zoomMultiplier is pinned at MIN/MAX, requested zoom
    // keeps coming in (eg still scrolling the wheel) while the multiplier
    // itself can't move any further; applying the full requested zoomRatio
    // to panOffset regardless would keep panning it every event even though
    // no zoom is actually happening, drifting it unboundedly off-screen.
    function applyZoom(anchorScreen: Point2D, zoomRatio: number): void {
        setViewState((current) => {
            const nextZoomMultiplier = clamp(
                current.zoomMultiplier * zoomRatio,
                MIN_ZOOM_MULTIPLIER,
                MAX_ZOOM_MULTIPLIER,
            );
            const appliedZoomRatio =
                nextZoomMultiplier / current.zoomMultiplier;
            return {
                zoomMultiplier: nextZoomMultiplier,
                panOffset: panOffsetForZoomAnchor(
                    anchorScreen,
                    { x: viewportSize.width / 2, y: viewportSize.height / 2 },
                    current.panOffset,
                    appliedZoomRatio,
                ),
            };
        });
    }

    function handlePointerDown(event: React.PointerEvent<SVGSVGElement>): void {
        event.currentTarget.setPointerCapture(event.pointerId);
        activePointersRef.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });
        if (activePointersRef.current.size === 2) {
            dragStateRef.current = null;
            pinchStateRef.current = pinchStateOf(activePointersRef.current);
        } else if (activePointersRef.current.size === 1) {
            dragStateRef.current = {
                startClientX: event.clientX,
                startClientY: event.clientY,
                startPanOffset: panOffset,
            };
        }
    }

    function handlePointerMove(event: React.PointerEvent<SVGSVGElement>): void {
        const previous = activePointersRef.current.get(event.pointerId);
        if (!previous) {
            return;
        }
        const next = { x: event.clientX, y: event.clientY };
        // See MAX_PLAUSIBLE_POINTER_JUMP_PX: discard a single event's
        // implausible jump rather than act on it. The stale `previous`
        // position is left in place, so a genuine subsequent move is judged
        // against it rather than against the rejected, corrupted one.
        if (Math.hypot(next.x - previous.x, next.y - previous.y) > MAX_PLAUSIBLE_POINTER_JUMP_PX) {
            return;
        }
        activePointersRef.current.set(event.pointerId, next);

        if (activePointersRef.current.size === 2 && pinchStateRef.current) {
            const nextPinchState = pinchStateOf(activePointersRef.current);
            const rect = event.currentTarget.getBoundingClientRect();
            applyZoom(
                {
                    x: nextPinchState.midpoint.x - rect.left,
                    y: nextPinchState.midpoint.y - rect.top,
                },
                nextPinchState.distance / pinchStateRef.current.distance,
            );
            pinchStateRef.current = nextPinchState;
            return;
        }

        const dragState = dragStateRef.current;
        if (!dragState) {
            return;
        }
        setViewState((current) => ({
            ...current,
            panOffset: {
                x:
                    dragState.startPanOffset.x +
                    (event.clientX - dragState.startClientX),
                y:
                    dragState.startPanOffset.y +
                    (event.clientY - dragState.startClientY),
            },
        }));
    }

    function handlePointerUp(event: React.PointerEvent<SVGSVGElement>): void {
        activePointersRef.current.delete(event.pointerId);
        pinchStateRef.current = null;
        const remaining = [...activePointersRef.current.values()];
        dragStateRef.current =
            remaining.length === 1
                ? {
                      startClientX: remaining[0].x,
                      startClientY: remaining[0].y,
                      startPanOffset: panOffset,
                  }
                : null;
    }

    function handleWheel(event: React.WheelEvent<SVGSVGElement>): void {
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        const anchorScreen: Point2D = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        const zoomRatio = clamp(
            Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY),
            1 / MAX_WHEEL_ZOOM_RATIO,
            MAX_WHEEL_ZOOM_RATIO,
        );
        applyZoom(anchorScreen, zoomRatio);
    }

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', position: 'relative' }}
        >
            <svg
                width={viewportSize.width}
                height={viewportSize.height}
                viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
                style={{
                    display: 'block',
                    cursor: 'grab',
                    touchAction: 'none',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
            >
                {BASE_LAYER.map((thing) => (
                    <OrbitPath
                        key={thing.id}
                        object={thing}
                        date={config.date}
                        toScreen={toScreen}
                    />
                ))}
                {focusedExtras.map((object) => (
                    <OrbitPath
                        key={object.id}
                        object={object}
                        date={config.date}
                        toScreen={toScreen}
                    />
                ))}
                {BASE_LAYER.filter(
                    (thing) => !hiddenThingIds.has(thing.id),
                ).map((thing) => (
                    <ObjectMarker
                        key={thing.id}
                        object={thing}
                        date={config.date}
                        toScreen={toScreen}
                        showLabel={focusIdSet.has(thing.id)}
                    />
                ))}
                {focusedExtras
                    .filter((object) => !hiddenThingIds.has(object.id))
                    .map((object) => (
                        <ObjectMarker
                            key={object.id}
                            object={object}
                            date={config.date}
                            toScreen={toScreen}
                            showLabel
                        />
                    ))}
            </svg>
            <button onClick={resetView} style={resetButtonStyle}>
                Reset view
            </button>
        </div>
    );
}

interface ObjectLayerProps {
    object: Thing;
    date: Date;
    toScreen: (point: Point2D) => Point2D;
}

function OrbitPath({
    object,
    date,
    toScreen,
}: ObjectLayerProps): JSX.Element | null {
    const pathAu = React.useMemo(
        () => object.orbitPath?.(date) ?? null,
        [object, date],
    );
    if (!pathAu) {
        return null;
    }
    const pathData =
        pathAu
            .map((point, index) => {
                const screenPoint = toScreen(point);
                return `${index === 0 ? 'M' : 'L'}${screenPoint.x.toFixed(2)},${screenPoint.y.toFixed(2)}`;
            })
            .join(' ') + ' Z';
    return (
        <path
            d={pathData}
            fill="none"
            stroke={object.colorHex}
            strokeOpacity={0.35}
            strokeWidth={1}
        />
    );
}

function ObjectMarker({
    object,
    date,
    toScreen,
    showLabel,
}: ObjectLayerProps & { showLabel: boolean }): JSX.Element {
    const screenPoint = toScreen(object.position(date));
    const radius = RADIUS_PX[object.kind];
    const isLagrangePoint = object.kind === 'lagrangePoint';
    return (
        <g>
            {isLagrangePoint ? (
                <circle
                    cx={screenPoint.x}
                    cy={screenPoint.y}
                    r={radius}
                    fill="none"
                    stroke={object.colorHex}
                    strokeWidth={1.5}
                    strokeDasharray="2,2"
                />
            ) : (
                <circle
                    cx={screenPoint.x}
                    cy={screenPoint.y}
                    r={radius}
                    fill={object.colorHex}
                />
            )}
            {showLabel && (
                <text
                    x={screenPoint.x + radius + 4}
                    y={screenPoint.y + 4}
                    fill="#e6e6e6"
                    fontSize={13}
                    fontFamily="sans-serif"
                >
                    {object.name}
                </text>
            )}
        </g>
    );
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

const resetButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '6px 12px',
    background: '#1b1f2b',
    color: '#e6e6e6',
    border: '1px solid #3a3f52',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
};

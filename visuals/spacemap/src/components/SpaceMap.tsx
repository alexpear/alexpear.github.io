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
// other, the smaller one's marker and label are hidden rather than drawn on
// top of (or right next to) the bigger one - mainly moons collapsing onto
// their parent planet at low zoom. Real mass data isn't tracked anywhere
// here, so "smaller" is approximated by thing.parentID !== 'sol': a moon or
// asteroid orbiting something other than Sol is assumed less massive than
// whatever it's crowding. That approximation can hide two mutually-close
// moons entirely (eg Saturn's co-orbital Janus and Epimetheus both yield to
// each other, since neither orbits Sol) rather than keeping the bigger one -
// an acceptable rough edge for now.
const MIN_MARKER_SEPARATION_PX = 20;
// On some touchscreens, lifting both pinch fingers at (near) the same instant
// produces a spurious pointermove for whichever pointer is reported as lifting
// last, jumping its coordinates toward where the other finger had been - which
// this code would otherwise read as a sudden one-finger drag. Delaying the
// handoff from pinch to single-finger drag by this long is enough to tell a
// simultaneous two-finger release (both pointerup events land within a few ms
// of each other) apart from a deliberate "lift one finger, keep panning with
// the other" gesture.
const PINCH_RELEASE_GRACE_MS = 120;

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

export function SpaceMap({ config }: Props): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const dragStateRef = React.useRef<DragState | null>(null);
    const activePointersRef = React.useRef<Map<number, Point2D>>(new Map());
    const pinchStateRef = React.useRef<PinchState | null>(null);
    const pinchReleaseTimeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (pinchReleaseTimeoutRef.current !== null) {
                window.clearTimeout(pinchReleaseTimeoutRef.current);
            }
        };
    }, []);

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
            if (displayedThings[i].parentID === 'sol') {
                continue;
            }
            for (let j = 0; j < displayedThings.length; j++) {
                if (i === j) {
                    continue;
                }
                const distance = Math.hypot(
                    screenPoints[i].x - screenPoints[j].x,
                    screenPoints[i].y - screenPoints[j].y,
                );
                if (distance < MIN_MARKER_SEPARATION_PX) {
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
        if (pinchReleaseTimeoutRef.current !== null) {
            window.clearTimeout(pinchReleaseTimeoutRef.current);
            pinchReleaseTimeoutRef.current = null;
        }
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
        if (!activePointersRef.current.has(event.pointerId)) {
            return;
        }
        activePointersRef.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

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
        const wasPinching = activePointersRef.current.size === 2;
        activePointersRef.current.delete(event.pointerId);
        pinchStateRef.current = null;
        if (pinchReleaseTimeoutRef.current !== null) {
            window.clearTimeout(pinchReleaseTimeoutRef.current);
            pinchReleaseTimeoutRef.current = null;
        }

        const remainingEntries = [...activePointersRef.current.entries()];
        if (remainingEntries.length !== 1) {
            dragStateRef.current = null;
            return;
        }

        if (!wasPinching) {
            dragStateRef.current = {
                startClientX: remainingEntries[0][1].x,
                startClientY: remainingEntries[0][1].y,
                startPanOffset: panOffset,
            };
            return;
        }

        // See PINCH_RELEASE_GRACE_MS: don't trust this remaining pointer with
        // a drag until it's clear the other finger isn't also lifting right now.
        dragStateRef.current = null;
        const remainingPointerId = remainingEntries[0][0];
        pinchReleaseTimeoutRef.current = window.setTimeout(() => {
            pinchReleaseTimeoutRef.current = null;
            const stillDown = activePointersRef.current.get(remainingPointerId);
            if (stillDown) {
                dragStateRef.current = {
                    startClientX: stillDown.x,
                    startClientY: stillDown.y,
                    startPanOffset: panOffset,
                };
            }
        }, PINCH_RELEASE_GRACE_MS);
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

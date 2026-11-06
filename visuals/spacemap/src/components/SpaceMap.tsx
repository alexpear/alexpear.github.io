import React from 'react';
import { useGesture } from '@use-gesture/react';
import { SpaceMapConfig } from '../config';
import { BASE_LAYER } from '../orbital/catalog';
import { Point2D, ThingKind } from '../orbital/types';
import { Thing } from '../orbital/thing';
import {
    computeFraming,
    makeAuToScreenTransform,
    makeAuToWorldTransform,
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

interface Props {
    config: SpaceMapConfig;
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

// See MIN_MARKER_SEPARATION_PX: a [category, orbitalPeriodDays] pair, lower
// in both is higher priority (less likely to be hidden on overlap). Category
// 0 (Sol) always beats 1 (a heliocentric planet), which always beats 2
// (everything else - moons, asteroids, TNOs); within a category, the
// shorter orbital period wins.
function hidePriority(thing: Thing): [number, number] {
    const category =
        thing.kind === 'star' ? 0 : thing.kind === 'heliocentric' ? 1 : 2;
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
    const svgRef = React.useRef<SVGSVGElement>(null);

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

    // Used only for the screen-pixel-distance check in hiddenThingIds below;
    // rendering itself uses toWorld, not this - see makeAuToWorldTransform's
    // comment for why.
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

    // Deliberately NOT dependent on panOffset/zoomMultiplier: this is the
    // "world" position every rendered element is actually placed at, with
    // the viewer's pan/zoom applied afterward as a single <g transform=...>
    // in the render below, instead of being baked into every point here.
    const toWorld = React.useMemo(
        () => makeAuToWorldTransform(framing),
        [framing],
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

    // Each Thing's AU position, computed once per date rather than once per
    // render - position() can be real work (eg a Lagrange point's two
    // astronomy-engine calls, or an eccentric orbit's Kepler solve), and
    // without this it would otherwise re-run on every pan/zoom tick too,
    // for every Thing on screen.
    const thingPositions = React.useMemo(
        () =>
            new Map(
                displayedThings.map((thing) => [
                    thing.id,
                    thing.position(config.date),
                ]),
            ),
        [displayedThings, config.date],
    );

    // Same positions, converted to world space (see toWorld's comment) -
    // what ObjectMarker actually renders at. Still independent of pan/zoom.
    const thingWorldPoints = React.useMemo(
        () =>
            new Map(
                displayedThings.map((thing) => [
                    thing.id,
                    toWorld(thingPositions.get(thing.id)!),
                ]),
            ),
        [displayedThings, thingPositions, toWorld],
    );

    // See MIN_MARKER_SEPARATION_PX for the approximation this applies.
    const hiddenThingIds = React.useMemo(() => {
        const screenPoints = displayedThings.map((thing) =>
            toScreen(thingPositions.get(thing.id)!),
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
    }, [displayedThings, thingPositions, toScreen]);

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

    // Same as applyZoom, but takes the new zoomMultiplier directly instead
    // of a ratio - used by the pinch gesture below, whose own `offset` is
    // already an absolute target (see the `pinch.from` option), not a
    // per-event delta.
    function applyAbsoluteZoom(
        anchorScreen: Point2D,
        targetZoomMultiplier: number,
    ): void {
        setViewState((current) => {
            const nextZoomMultiplier = clamp(
                targetZoomMultiplier,
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

    // Dragging (mouse or single-finger touch) and pinch-zoom (two-finger
    // touch) are both handled by @use-gesture rather than hand-rolled
    // Pointer Event tracking: a previous hand-rolled version had a
    // persistent bug where lifting both pinch fingers at once produced a
    // spurious jump, which survived two different hand-written mitigation
    // attempts. @use-gesture is a widely-used library that's already dealt
    // with this class of real-device touch-event inconsistency, so this
    // leans on that instead of trying to out-guess mobile touchscreens.
    //
    // onDrag's `offset` is wired to start from the current panOffset (see
    // `drag.from` below) each time a new drag begins, so it's already the
    // absolute new panOffset - not a delta to add to it. Same idea for
    // onPinch's `offset[0]` (`pinch.from`) against zoomMultiplier; `[1]`
    // is pinch rotation, unused here (this map doesn't rotate).
    // `pinching` (shared state) is true for the whole time 2 fingers are
    // down; canceling the drag then is what stops it from also trying to
    // pan while a pinch is already moving things around.
    useGesture(
        {
            onDrag: ({ pinching, cancel, offset: [x, y] }) => {
                if (pinching) {
                    cancel();
                    return;
                }
                setViewState((current) => ({
                    ...current,
                    panOffset: { x, y },
                }));
            },
            onPinch: ({ origin: [originX, originY], offset: [scale] }) => {
                const rect = svgRef.current?.getBoundingClientRect();
                if (!rect) {
                    return;
                }
                applyAbsoluteZoom(
                    { x: originX - rect.left, y: originY - rect.top },
                    scale,
                );
            },
        },
        {
            target: svgRef,
            eventOptions: { passive: false },
            drag: { from: () => [panOffset.x, panOffset.y] },
            pinch: {
                from: () => [zoomMultiplier, 0],
                // Wheel-to-zoom is handled by handleWheel/onWheel below,
                // already tuned for a gentle per-notch step; leave pinch
                // out of the wheel event entirely rather than double up.
                pinchOnWheel: false,
            },
        },
    );

    // Pan/zoom, applied once here rather than baked into every rendered
    // point - see makeAuToWorldTransform's comment. A pure pan only touches
    // this one attribute (OrbitPath/ObjectMarker don't re-render at all,
    // since none of their own props changed); a zoom also touches this plus
    // each ObjectMarker's own counter-scale (see ObjectMarker), but still
    // never touches OrbitPath, whose geometry the browser scales for free
    // as part of applying this same transform.
    const viewTransform = `translate(${viewportSize.width / 2 + panOffset.x}, ${viewportSize.height / 2 + panOffset.y}) scale(${zoomMultiplier})`;

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', position: 'relative' }}
        >
            <svg
                ref={svgRef}
                width={viewportSize.width}
                height={viewportSize.height}
                viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
                style={{
                    display: 'block',
                    cursor: 'grab',
                    touchAction: 'none',
                }}
                onWheel={handleWheel}
            >
                <g transform={viewTransform}>
                    {BASE_LAYER.map((thing) => (
                        <OrbitPath
                            key={thing.id}
                            object={thing}
                            date={config.date}
                            toWorld={toWorld}
                        />
                    ))}
                    {focusedExtras.map((object) => (
                        <OrbitPath
                            key={object.id}
                            object={object}
                            date={config.date}
                            toWorld={toWorld}
                        />
                    ))}
                    {BASE_LAYER.filter(
                        (thing) => !hiddenThingIds.has(thing.id),
                    ).map((thing) => (
                        <ObjectMarker
                            key={thing.id}
                            object={thing}
                            worldPoint={thingWorldPoints.get(thing.id)!}
                            zoomMultiplier={zoomMultiplier}
                            showLabel={focusIdSet.has(thing.id)}
                        />
                    ))}
                    {focusedExtras
                        .filter((object) => !hiddenThingIds.has(object.id))
                        .map((object) => (
                            <ObjectMarker
                                key={object.id}
                                object={object}
                                worldPoint={thingWorldPoints.get(object.id)!}
                                zoomMultiplier={zoomMultiplier}
                                showLabel
                            />
                        ))}
                </g>
            </svg>
            <button onClick={resetView} style={resetButtonStyle}>
                Reset view
            </button>
        </div>
    );
}

interface OrbitPathProps {
    object: Thing;
    date: Date;
    toWorld: (point: Point2D) => Point2D;
}

const OrbitPath = React.memo(function OrbitPath({
    object,
    date,
    toWorld,
}: OrbitPathProps): JSX.Element | null {
    const pathAu = React.useMemo(
        () =>
            object.kind === 'lagrangePoint'
                ? null
                : (object.orbitPath?.(date) ?? null),
        [object, date],
    );
    if (!pathAu) {
        return null;
    }
    const pathData =
        pathAu
            .map((point, index) => {
                const worldPoint = toWorld(point);
                return `${index === 0 ? 'M' : 'L'}${worldPoint.x},${worldPoint.y}`;
            })
            .join(' ') + ' Z';
    return (
        <path
            d={pathData}
            fill="none"
            stroke={object.colorHex}
            strokeOpacity={0.35}
            strokeWidth={1}
            // The path's own geometry (above) is in world space, so it's
            // meant to scale with the ancestor <g>'s zoom - but the stroke
            // itself should stay a crisp, constant screen pixel regardless
            // of zoom, same as before this was reworked to use a <g>
            // transform at all.
            vectorEffect="non-scaling-stroke"
        />
    );
});

interface ObjectMarkerProps {
    object: Thing;
    worldPoint: Point2D;
    zoomMultiplier: number;
    showLabel: boolean;
}

const ObjectMarker = React.memo(function ObjectMarker({
    object,
    worldPoint,
    zoomMultiplier,
    showLabel,
}: ObjectMarkerProps): JSX.Element {
    const radius = RADIUS_PX[object.kind];
    const isLagrangePoint = object.kind === 'lagrangePoint';
    return (
        // worldPoint positions the marker correctly under the ancestor <g>'s
        // zoom (see SpaceMap's viewTransform comment); scale(1/zoomMultiplier)
        // then cancels that same zoom for everything inside this <g>, so the
        // marker/label's own size on screen stays constant regardless of
        // zoom level, same as before this was reworked to use a <g>
        // transform at all. Both transforms are cheap - this is still far
        // less work per pan/zoom tick than recomputing every point's screen
        // position used to be.
        <g
            transform={`translate(${worldPoint.x}, ${worldPoint.y}) scale(${1 / zoomMultiplier})`}
        >
            {isLagrangePoint ? (
                <>
                    <line
                        x1={-radius}
                        y1={0}
                        x2={radius}
                        y2={0}
                        stroke={object.colorHex}
                        strokeWidth={1.5}
                    />
                    <line
                        x1={0}
                        y1={-radius}
                        x2={0}
                        y2={radius}
                        stroke={object.colorHex}
                        strokeWidth={1.5}
                    />
                </>
            ) : (
                <circle cx={0} cy={0} r={radius} fill={object.colorHex} />
            )}
            {showLabel && (
                <text
                    x={radius + 4}
                    y={4}
                    fill="#e6e6e6"
                    fontSize={13}
                    fontFamily="'Gelasio', Georgia, serif"
                >
                    {object.label ?? object.name}
                </text>
            )}
        </g>
    );
});

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
    // Buttons don't inherit font-family from body by default in every
    // browser (a long-standing UA-stylesheet quirk for form controls), so
    // this needs to be set explicitly to actually get Gelasio here too.
    fontFamily: "'Gelasio', Georgia, serif",
};

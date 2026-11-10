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
import { ThingMenu, computeMenuLayout } from './ThingMenu';

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
// heliocentric planet always beats a non-heliocentric body; any physical
// body beats a Lagrange point; otherwise the shorter orbital period wins (eg
// Neptune beats Pluto). A tie only happens for two literally-identical
// orbital periods - which is exactly what a Lagrange point shares with its
// small body (see Thing.lagrange()), hence Lagrange points' own category.
const MIN_MARKER_SEPARATION_PX = 20;
// Radius of each marker's invisible click/tap target, so tiny markers are
// still easy to hit with a finger. Half of MIN_MARKER_SEPARATION_PX, so two
// visible markers' targets never overlap.
const MARKER_HIT_RADIUS_PX = MIN_MARKER_SEPARATION_PX / 2;

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
// in both is higher priority (less likely to be hidden on overlap).
// Within a category, the shorter orbital period wins.
function hidePriority(thing: Thing): [number, number] {
    return [HIDE_CATEGORY[thing.kind], thing.orbitalPeriodDays ?? 0];
}

const HIDE_CATEGORY: Record<ThingKind, number> = {
    star: 0,
    heliocentric: 1,
    moon: 2,
    asteroid: 3,
    spacecraft: 4,
    lagrangePoint: 5,
};

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
    // The Thing whose info menu is open, if any.
    const [selectedThingId, setSelectedThingId] = React.useState<
        string | undefined
    >(undefined);
    // EXPERIMENTAL: the Thing whose 5 Lagrange points (with its parent) are
    // currently shown - the last non-Lagrange-point Thing clicked. It stays
    // put while the selection moves between it and those points, and is
    // cleared along with the selection when the menu closes. See
    // anchorLagrangePoints.
    const [lagrangeAnchorId, setLagrangeAnchorId] = React.useState<
        string | undefined
    >(undefined);

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

    // Everything shown regardless of selection.
    const baseDisplayedThings = React.useMemo(
        () => [...BASE_LAYER, ...focusedExtras],
        [focusedExtras],
    );

    // The anchor Thing's Lagrange points with its parent (see
    // lagrangeAnchorId), minus any already shown anyway - eg the catalog's
    // permanent Sol-Earth and Earth-Luna points, which would otherwise be
    // drawn twice under the same id. Memoized on the anchor, so the same
    // Thing objects persist while the selection moves among them.
    const anchorLagrangePoints = React.useMemo(() => {
        const anchor = baseDisplayedThings.find(
            (thing) => thing.id === lagrangeAnchorId,
        );
        if (!anchor) {
            return [];
        }
        const shownIds = new Set(baseDisplayedThings.map((thing) => thing.id));
        return anchor
            .lagrangePointsWithParent()
            .filter((point) => !shownIds.has(point.id));
    }, [baseDisplayedThings, lagrangeAnchorId]);

    const displayedThings = React.useMemo(
        () => [...baseDisplayedThings, ...anchorLagrangePoints],
        [baseDisplayedThings, anchorLagrangePoints],
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

    const menuLayout = computeMenuLayout(
        viewportSize.width,
        viewportSize.height,
    );
    const selectedThing = displayedThings.find(
        (thing) => thing.id === selectedThingId,
    );

    // Opens `thingId`'s info menu and pans (without zooming) so the Thing
    // sits at the center of the screen area the menu leaves uncovered.
    function selectThing(thingId: string): void {
        const worldPoint = thingWorldPoints.get(thingId);
        if (!worldPoint) {
            return;
        }
        setSelectedThingId(thingId);
        // Moving between the anchor and its own Lagrange points keeps them
        // shown; clicking anything else makes it the new anchor instead.
        if (!anchorLagrangePoints.some((point) => point.id === thingId)) {
            setLagrangeAnchorId(thingId);
        }
        // Inverse of makeAuToScreenTransform's
        // screen = viewportCenter + panOffset + world * zoomMultiplier.
        setViewState((current) => ({
            ...current,
            panOffset: {
                x:
                    menuLayout.uncoveredCenter.x -
                    viewportSize.width / 2 -
                    worldPoint.x * current.zoomMultiplier,
                y:
                    menuLayout.uncoveredCenter.y -
                    viewportSize.height / 2 -
                    worldPoint.y * current.zoomMultiplier,
            },
        }));
    }

    const closeMenu = React.useCallback(() => {
        setSelectedThingId(undefined);
        setLagrangeAnchorId(undefined);
    }, []);

    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                closeMenu();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeMenu]);

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
    //
    // Clicks/taps are handled here too, rather than via onClick, because a
    // browser fires click at the end of a drag as well. With `filterTaps`,
    // @use-gesture flags a press that barely moved as `tap` instead, so
    // only a real tap opens/closes the menu, and a tap never pans the map
    // (except to center a tapped Thing - see selectThing).
    useGesture(
        {
            onDrag: ({ pinching, cancel, tap, event, offset: [x, y] }) => {
                if (pinching) {
                    cancel();
                    return;
                }
                if (tap) {
                    const thingId = thingIdAtPoint(event);
                    if (thingId) {
                        selectThing(thingId);
                    } else {
                        closeMenu();
                    }
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
            drag: {
                from: () => [panOffset.x, panOffset.y],
                filterTaps: true,
            },
            pinch: {
                from: () => [zoomMultiplier, 0],
                // Wheel-to-zoom is handled by handleWheel/onWheel below,
                // already tuned for a gentle per-notch step; leave pinch
                // out of the wheel event entirely rather than double up.
                pinchOnWheel: false,
            },
        },
    );

    // Pan only, applied once here rather than baked into every rendered
    // point - a pure pan only touches this one attribute (OrbitPath and
    // ObjectMarker don't re-render at all, since none of their own props
    // changed).
    //
    // Zoom is deliberately NOT a scale() here: mobile browsers rasterize a
    // scaled SVG group into a bitmap at some resolution of their own
    // choosing and then stretch that bitmap, so after a pinch the whole map
    // (text included) could come out blurry/pixelated, at a seemingly random
    // level per gesture. Instead, zoom is multiplied into each point's
    // coordinates (see OrbitPath, ObjectMarker), so geometry is always drawn
    // at true screen resolution. OrbitPath still caches its world-space
    // points, so a zoom tick is just a multiply per point, not a re-solve.
    const viewTransform = `translate(${viewportSize.width / 2 + panOffset.x}, ${viewportSize.height / 2 + panOffset.y})`;

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
                            zoomMultiplier={zoomMultiplier}
                        />
                    ))}
                    {focusedExtras.map((object) => (
                        <OrbitPath
                            key={object.id}
                            object={object}
                            date={config.date}
                            toWorld={toWorld}
                            zoomMultiplier={zoomMultiplier}
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
                            selected={thing.id === selectedThingId}
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
                                selected={object.id === selectedThingId}
                            />
                        ))}
                    {anchorLagrangePoints
                        .filter((point) => !hiddenThingIds.has(point.id))
                        .map((point) => (
                            <ObjectMarker
                                key={point.id}
                                object={point}
                                worldPoint={thingWorldPoints.get(point.id)!}
                                zoomMultiplier={zoomMultiplier}
                                showLabel
                                selected={point.id === selectedThingId}
                            />
                        ))}
                </g>
            </svg>
            {selectedThing && (
                <ThingMenu
                    thing={selectedThing}
                    date={config.date}
                    layout={menuLayout}
                    onClose={closeMenu}
                />
            )}
            <button
                onClick={resetView}
                style={{
                    ...resetButtonStyle,
                    ...(selectedThing ? menuLayout.resetButtonOffset : {}),
                }}
            >
                Reset view
            </button>
        </div>
    );
}

interface OrbitPathProps {
    object: Thing;
    date: Date;
    toWorld: (point: Point2D) => Point2D;
    zoomMultiplier: number;
}

const OrbitPath = React.memo(function OrbitPath({
    object,
    date,
    toWorld,
    zoomMultiplier,
}: OrbitPathProps): JSX.Element | null {
    // World-space points (see makeAuToWorldTransform): independent of
    // pan/zoom, so only recomputed when the date or framing changes.
    const worldPoints = React.useMemo(() => {
        if (object.kind === 'lagrangePoint') {
            return undefined;
        }
        return object.orbitPath?.(date)?.map(toWorld);
    }, [object, date, toWorld]);
    // Screen-scale geometry relative to the viewport center + pan (which
    // SpaceMap's <g> applies as a translate). See SpaceMap's viewTransform
    // comment for why zoom is applied here rather than as an SVG scale().
    const pathData = React.useMemo(() => {
        if (!worldPoints) {
            return undefined;
        }
        return (
            worldPoints
                .map(
                    (point, index) =>
                        `${index === 0 ? 'M' : 'L'}${roundTenth(point.x * zoomMultiplier)},${roundTenth(point.y * zoomMultiplier)}`,
                )
                .join(' ') + ' Z'
        );
    }, [worldPoints, zoomMultiplier]);
    if (!pathData) {
        return null;
    }
    return (
        <path
            d={pathData}
            fill="none"
            stroke={object.colorHex}
            strokeOpacity={0.35}
            strokeWidth={1}
        />
    );
});

// Sub-pixel precision finer than this is invisible, and rounding keeps the
// path strings short.
function roundTenth(value: number): number {
    return Math.round(value * 10) / 10;
}

interface ObjectMarkerProps {
    object: Thing;
    worldPoint: Point2D;
    zoomMultiplier: number;
    showLabel: boolean;
    selected: boolean;
}

const ObjectMarker = React.memo(function ObjectMarker({
    object,
    worldPoint,
    zoomMultiplier,
    showLabel,
    selected,
}: ObjectMarkerProps): JSX.Element {
    const radius = RADIUS_PX[object.kind];
    const isLagrangePoint = object.kind === 'lagrangePoint';
    return (
        // Translate only, never scale: see SpaceMap's viewTransform comment
        // for why zoom is multiplied in here instead of being an SVG
        // scale(). The marker/label's own size stays constant on screen.
        // data-thing-id is how a tap on the marker or its label is mapped
        // back to this Thing - see thingIdAtPoint.
        <g
            transform={`translate(${worldPoint.x * zoomMultiplier}, ${worldPoint.y * zoomMultiplier})`}
            data-thing-id={object.id}
            style={{ cursor: 'pointer' }}
        >
            {/* Invisible, finger-sized tap target. */}
            <circle cx={0} cy={0} r={MARKER_HIT_RADIUS_PX} fill="transparent" />
            {selected && (
                <circle
                    cx={0}
                    cy={0}
                    r={radius + 4}
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth={1.5}
                />
            )}
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

// The id of the Thing whose marker/label is under the pointer, or undefined
// if it's empty space (or an orbit line) instead.
//
// Hit-tests by coordinates rather than reading event.target: @use-gesture
// captures the pointer on the <svg> when a drag starts (so a drag keeps
// tracking even if the pointer leaves it), which makes the pointerup that
// ends a tap report the <svg> itself as its target, never the marker.
function thingIdAtPoint(event: Event): string | undefined {
    if (!('clientX' in event) || !('clientY' in event)) {
        return undefined;
    }
    const { clientX, clientY } = event as PointerEvent;
    return (
        document
            .elementFromPoint(clientX, clientY)
            ?.closest('[data-thing-id]')
            ?.getAttribute('data-thing-id') ?? undefined
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
    // Buttons don't inherit font-family from body by default in every
    // browser (a long-standing UA-stylesheet quirk for form controls), so
    // this needs to be set explicitly to actually get Gelasio here too.
    fontFamily: "'Gelasio', Georgia, serif",
};

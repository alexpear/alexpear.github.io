import React from 'react';
import { useGesture } from '@use-gesture/react';
import { SpaceMapConfig } from '../config';
import { BASE_LAYER } from '../orbital/catalog';
import { Point2D, ThingKind } from '../orbital/types';
import { KM_PER_AU, Thing } from '../orbital/thing';
import {
    computeFraming,
    makeAuToScreenTransform,
    makeAuToWorldTransform,
    panOffsetForZoomAnchor,
} from '../view/transform';
import { searchThings } from '../orbital/search';
import { SearchResults } from './SearchResults';
import {
    SCREEN_MARGIN_PX,
    SEARCH_BAR_HEIGHT_PX,
    ThingMenu,
    computeMenuLayout,
} from './ThingMenu';

const RADIUS_PX: Record<ThingKind, number> = {
    star: 8,
    heliocentric: 5,
    moon: 5,
    asteroid: 3,
    comet: 3,
    spacecraft: 3,
    lagrangePoint: 4,
};
// The view on load when the URL has no ?focus= list: Sol-centered, wide
// enough to show the whole of Mars' orbit (aphelion ~1.666 AU) plus a
// little margin, along whichever of the screen's width/height is shorter.
const DEFAULT_VIEW_RADIUS_AU = 1.8;
// The default view's rotation: puts Earth's Jan 1 position straight up
// from Sol. Measured via astronomy-engine for Jan 1 of 2026-2040 - it
// stays within ~0.6 degrees of this every year.
const DEFAULT_VIEW_ROTATION_DEG = 10;
// Zoom limits, as the distance from the screen's center to the nearer edge
// (same measure as DEFAULT_VIEW_RADIUS_AU) - absolute, so they're the same
// whatever the ?focus= framing is. Zoomed fully out shows a bit past
// Sedna's aphelion (~937 AU), the farthest any catalog body gets from Sol;
// zoomed fully in shows ~150 km, enough to clearly separate LRO (~67-114
// km up) from Luna's surface. Zooming that far is only possible because
// every rendered coordinate is computed in screen space - see
// screenOffset's comment in SpaceMap.
const MAX_VIEW_RADIUS_AU = 1200;
const MIN_VIEW_RADIUS_AU = 1e-6;
// Wheel deltaY -> zoom ratio. Chosen so an ordinary mouse wheel notch
// (deltaY roughly 100-120 in most browsers) is a gentle ~8% step; a trackpad's
// continuous small deltas each nudge the zoom by a fraction of a percent.
const WHEEL_ZOOM_SENSITIVITY = 0.0007;
// Clamp on a single wheel event's zoom ratio, so an inertial scroll's
// occasional large deltaY spike can't jump the zoom level all at once.
const MAX_WHEEL_ZOOM_RATIO = 1.3;
// When two Things' markers would render within this many screen pixels of
// each other horizontally and vertically - or one's label would run into the
// other's marker or label (see collisionBoxes()) - the lower-priority one's
// marker and label are hidden rather than drawn on top of (or right next
// to) the other - mainly moons and distant asteroids/TNOs collapsing onto a
// planet, or onto each other, at low zoom.
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
// Gap between a marker's right edge and the start of its label: enough to
// clear the selection ring (radius + 4, plus half its 1.5px stroke).
const LABEL_GAP_PX = 8;
// How far a label's black backing (see ObjectMarker) extends past its text.
const LABEL_PADDING_X_PX = 3;
const LABEL_PADDING_Y_PX = 1;
// Estimated on-screen width of one character of a label (13px Gelasio),
// for sizing a labeled Thing's collision box - see collisionBoxes(). Erring
// wide: an overestimate just hides a neighbor slightly early, while an
// underestimate lets two names touch.
const LABEL_CHAR_WIDTH_PX = 7.5;
// The searchbar's width, except in portrait with the pane open, where it
// spans the screen.
const SEARCH_BAR_WIDTH_PX = 200;
// Gap between the searchbar and the controls stacked under it.
const CONTROLS_GAP_PX = 8;
// When a selected Thing's orbit is framed (see selectThing), the fraction
// of the screen area the menu leaves uncovered that the orbit fills, along
// whichever of width/height is tighter - the rest is a buffer around it.
const ORBIT_FRAME_FILL = 0.8;
// How long selectThing's pan/zoom to a Thing takes. Skipped (an instant
// jump) for anyone whose OS asks for reduced motion.
const VIEW_ANIMATION_MS = 500;

// A screen-space rectangle, as offsets from wherever it's anchored.
interface Box {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

// A Thing's on-screen radius in pixels: its fixed-size marker (RADIUS_PX),
// or - once zoomed in far enough that its real size is bigger than that -
// a circle of its true diameter, eg Luna's disk when zoomed in on LRO.
// `pixelsPerAu` is the current zoom level, in screen pixels per AU.
function drawnRadiusPx(thing: Thing, pixelsPerAu: number): number {
    const trueRadiusPx =
        thing.diameterKm === undefined
            ? 0
            : (thing.diameterKm / 2 / KM_PER_AU) * pixelsPerAu;
    return Math.max(RADIUS_PX[thing.kind], trueRadiusPx);
}

// The screen areas a Thing claims, relative to its center: a
// MIN_MARKER_SEPARATION_PX square around its center, plus (if it has one
// showing) its label, which starts just right of its drawn edge (see
// drawnRadiusPx) and is as long as the name. Two Things whose boxes
// overlap can't both be shown - see hiddenThingIds. A big true-size disk
// doesn't claim its whole area, just its center and label, so eg LRO stays
// visible as it passes close by Luna's disk.
function collisionBoxes(
    thing: Thing,
    labeled: boolean,
    radiusPx: number,
): Box[] {
    const half = MIN_MARKER_SEPARATION_PX / 2;
    const boxes: Box[] = [
        { left: -half, right: half, top: -half, bottom: half },
    ];
    if (labeled) {
        const labelLeft = radiusPx + LABEL_GAP_PX;
        boxes.push({
            left: labelLeft,
            right:
                labelLeft +
                (thing.label ?? thing.name).length * LABEL_CHAR_WIDTH_PX,
            top: -half,
            bottom: half,
        });
    }
    return boxes;
}

function boxesOverlap(
    aPoint: Point2D,
    aBoxes: Box[],
    bPoint: Point2D,
    bBoxes: Box[],
): boolean {
    return aBoxes.some((aBox) =>
        bBoxes.some(
            (bBox) =>
                aPoint.x + aBox.left < bPoint.x + bBox.right &&
                bPoint.x + bBox.left < aPoint.x + aBox.right &&
                aPoint.y + aBox.top < bPoint.y + bBox.bottom &&
                bPoint.y + bBox.top < aPoint.y + aBox.bottom,
        ),
    );
}

// How far past the screen's edges geometry is still drawn - see
// clipSegment. Enough that a stroke's own width (or a marker partly
// on-screen) never shows a cut-off edge.
const OFFSCREEN_MARGIN_PX = 50;
// Sol-orbiting bodies smaller than this are what the 'Show small
// heliocentrics' checkbox toggles. Mercury is the smallest planet, so this
// splits the planets from everything else orbiting Sol: comets, asteroids,
// and TNOs (Pluto & Eris included).
const SMALL_HELIOCENTRIC_MAX_DIAMETER_KM =
    Thing.byID('mercury')?.diameterKm ?? 4879;

// Earth's orbit bands, drawn as rings by renderEarthOrbitBands, at radii
// from Earth's center (its mean radius, 6,371 km, plus the altitude). Low
// Earth orbit is everything up to 2,000 km up (the ISS is ~400 km);
// medium Earth orbit is the wide band above that, shown at the altitude of
// the GPS satellites (~20,200 km), its best-known residents; geostationary
// orbit, 35,786 km up, is the one altitude where an orbit takes exactly a
// day, so a satellite there hangs over one spot on the equator.
const EARTH_ORBIT_BANDS: { label: string; radiusKm: number }[] = [
    { label: 'Low Earth orbit', radiusKm: 6371 + 2000 },
    { label: 'Medium Earth orbit (GPS)', radiusKm: 6371 + 20200 },
    { label: 'Geostationary orbit', radiusKm: 6371 + 35786 },
];
// Smaller than this, a ring would just be a halo around Earth's marker.
const MIN_ORBIT_BAND_RADIUS_PX = 25;
// Bigger than this, it's far too big to see as a ring anyway, and its
// coordinates would get big enough for browsers' 32-bit SVG math to blur
// (see SpaceMap's screenOffset).
const MAX_ORBIT_BAND_RADIUS_PX = 1e6;

// True for a Sol-orbiting body smaller than Mercury, and for anything
// orbiting one (eg Charon), which would otherwise be left circling an empty
// spot. A body with no known diameter (eg comet Pons-Brooks) counts as small.
function isSmallHeliocentric(thing: Thing): boolean {
    if (thing.kind === 'star') {
        return false;
    }
    if (thing.parentID !== 'sol') {
        const parent = Thing.byID(thing.parentID);
        return parent !== undefined && isSmallHeliocentric(parent);
    }
    return (thing.diameterKm ?? 0) < SMALL_HELIOCENTRIC_MAX_DIAMETER_KM;
}

// True for a small heliocentric itself (not its moons), and for every
// spacecraft. These only get their orbit line drawn while selected or
// moused over (there are too many of them, on too many crisscrossing
// orbits - eg half a dozen around Mars - to draw all the time); planets'
// and moons' orbit lines are always drawn.
function hasOnDemandOrbitLine(thing: Thing): boolean {
    return (
        thing.kind === 'spacecraft' ||
        (thing.parentID === 'sol' && isSmallHeliocentric(thing))
    );
}

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
// Earth gets priority over other heliocentrics.
function hidePriority(thing: Thing): [number, number] {
    return [
        thing.id === 'earth' ? 0 : HIDE_CATEGORY[thing.kind],
        thing.orbitalPeriodDays ?? 0,
    ];
}

const HIDE_CATEGORY: Record<ThingKind, number> = {
    star: 0,
    heliocentric: 1,
    moon: 2,
    asteroid: 3,
    comet: 3,
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
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const [viewportSize, setViewportSize] = React.useState({
        width: 800,
        height: 600,
    });
    const [viewState, setViewState] =
        React.useState<ViewState>(INITIAL_VIEW_STATE);
    const { panOffset, zoomMultiplier } = viewState;
    // The latest viewState, for animateView() to start from: its frames run
    // outside of any render, so they can't read viewState itself.
    const viewStateRef = React.useRef(viewState);
    viewStateRef.current = viewState;
    // The pending requestAnimationFrame of a running animateView(), if any.
    const animationFrameRef = React.useRef<number | undefined>(undefined);
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
    const [showSmallHeliocentrics, setShowSmallHeliocentrics] =
        React.useState(true);
    // The Thing whose marker/label the mouse is over, if any. See
    // hasOnDemandOrbitLine.
    const [hoveredThingId, setHoveredThingId] = React.useState<
        string | undefined
    >(undefined);
    // The searchbar's text. Kept after a result is picked, so clicking the
    // searchbar again brings the same results back.
    const [searchQuery, setSearchQuery] = React.useState('');
    // Whether the pane is in search-results mode rather than Thing-info
    // mode. Only takes effect while there's a query - see resultsShowing.
    const [searchActive, setSearchActive] = React.useState(false);
    const [highlightIndex, setHighlightIndex] = React.useState(0);

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

    // Stops a running animateView() where it is, eg when the user starts
    // dragging or zooming themselves partway through.
    const cancelViewAnimation = React.useCallback(() => {
        if (animationFrameRef.current !== undefined) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = undefined;
        }
    }, []);

    React.useEffect(() => cancelViewAnimation, [cancelViewAnimation]);

    const resetView = React.useCallback(() => {
        cancelViewAnimation();
        setViewState(INITIAL_VIEW_STATE);
    }, [cancelViewAnimation]);

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
            config.focusFromUrl
                ? computeFraming(
                      focusPoints,
                      viewportSize.width,
                      viewportSize.height,
                  )
                : {
                      centroid: { x: 0, y: 0 },
                      rotationDeg: DEFAULT_VIEW_ROTATION_DEG,
                      scale:
                          Math.min(viewportSize.width, viewportSize.height) /
                          (2 * DEFAULT_VIEW_RADIUS_AU),
                  },
        [config, focusPoints, viewportSize],
    );

    // Used for screen-pixel checks like hiddenThingIds below; rendering
    // itself uses toWorld plus screenOffset, not this - see
    // makeAuToWorldTransform's comment for why.
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
    // "world" position of every rendered element, cached per Thing/orbit,
    // with the viewer's pan/zoom applied afterward at render time (see
    // screenOffset) instead of being baked into every point here.
    const toWorld = React.useMemo(
        () => makeAuToWorldTransform(framing),
        [framing],
    );

    // The current zoom level, in screen pixels per AU: world space is AU
    // scaled by framing.scale (see makeAuToWorldTransform), then the
    // viewer's zoomMultiplier on top.
    const pixelsPerAu = framing.scale * zoomMultiplier;

    // Where world point (0, 0) - Sol, by default - is on screen, ie every
    // rendered point is screenOffset + world * zoomMultiplier. That sum is
    // computed here in JS (64-bit floats) for every point, rather than left
    // to an SVG transform: browsers compose SVG transforms in 32-bit
    // floats, good to only ~7 significant digits, and zoomed in on LRO a
    // body ~1 AU from Sol is ~400,000,000 pixels from Sol on screen - a
    // translate() of that size, cancelled out by another, would leave
    // everything jittering by dozens of pixels. Keeping every coordinate
    // the browser sees close to the screen avoids that (and see clipSegment
    // for orbit lines, whose far-off points would otherwise still be huge).
    //
    // Zoom is deliberately never an SVG scale() either: mobile browsers
    // rasterize a scaled SVG group into a bitmap at some resolution of their
    // own choosing and then stretch that bitmap, so after a pinch the whole
    // map (text included) could come out blurry/pixelated, at a seemingly
    // random level per gesture. Multiplying zoom into each point's
    // coordinates draws all geometry at true screen resolution instead.
    const screenOffset: Point2D = {
        x: viewportSize.width / 2 + panOffset.x,
        y: viewportSize.height / 2 + panOffset.y,
    };

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

    // BASE_LAYER, minus the small heliocentrics when their checkbox is
    // unchecked. Anything an embedding page explicitly asked for via ?focus=
    // stays regardless, so eg ?focus=pluto can't be left framing nothing.
    // Minus, too, any spacecraft not flying at this date (see
    // Thing.isPresentAt) - those can't be placed at all.
    const visibleBaseLayer = React.useMemo(
        () =>
            BASE_LAYER.filter(
                (thing) =>
                    thing.isPresentAt(config.date) &&
                    (showSmallHeliocentrics ||
                        !isSmallHeliocentric(thing) ||
                        (config.focusFromUrl && focusIdSet.has(thing.id))),
            ),
        [showSmallHeliocentrics, config, focusIdSet],
    );

    // Everything shown regardless of selection.
    const baseDisplayedThings = React.useMemo(
        () => [...visibleBaseLayer, ...focusedExtras],
        [visibleBaseLayer, focusedExtras],
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

    // Whether a Thing's name is drawn next to its marker: always, except
    // for a base-layer Thing that isn't in the focus list.
    const isLabeled = React.useCallback(
        (thing: Thing) =>
            focusIdSet.has(thing.id) || !baseLayerIdSet.has(thing.id),
        [focusIdSet, baseLayerIdSet],
    );

    const menuLayout = computeMenuLayout(
        viewportSize.width,
        viewportSize.height,
    );
    const selectedThing = displayedThings.find(
        (thing) => thing.id === selectedThingId,
    );

    const searchResults = React.useMemo(
        () => searchThings(searchQuery, config.date),
        [searchQuery, config.date],
    );
    // The pane shows search results while the searchbar is in use and has
    // text in it; otherwise the selected Thing's info, if any.
    const resultsShowing = searchActive && searchQuery.trim() !== '';
    const paneOpen = resultsShowing || selectedThing !== undefined;

    // Opens `thing`'s info menu. By default - a map click, on something
    // already in view - the view stays exactly where it is, unless the menu
    // would open over the Thing's marker or label (see coveredByMenu): then
    // it animates a pan (no zoom change) to center the Thing in the screen
    // area the menu leaves uncovered. With `moveView` -
    // used for search results, where the Thing may be anywhere and the user
    // likely has no idea of its scale yet - the view animates (see
    // animateView) to frame its whole orbit in the screen area the menu
    // leaves uncovered, with a buffer around it (see ORBIT_FRAME_FILL), eg
    // all of Sedna's ellipse, or Io's circle around Jupiter. Sol and
    // Lagrange points have no orbit line to frame, so for those it pans
    // (without zooming) to put the Thing at that area's center instead.
    //
    // Takes a Thing rather than an id because a search result may not be on
    // the map yet: the only catalog Things that aren't are the small
    // heliocentrics (and their moons) while their checkbox is unchecked, so
    // picking one of those ticks it.
    function selectThing(thing: Thing, moveView = false): void {
        const thingId = thing.id;
        if (!thingWorldPoints.has(thingId)) {
            setShowSmallHeliocentrics(true);
        }
        setSelectedThingId(thingId);
        setSearchActive(false);
        // Moving between the anchor and its own Lagrange points keeps them
        // shown; clicking anything else makes it the new anchor instead.
        if (!anchorLagrangePoints.some((point) => point.id === thingId)) {
            setLagrangeAnchorId(thingId);
        }
        const uncoveredAnchor: Point2D = {
            x: menuLayout.uncoveredCenter.x - viewportSize.width / 2,
            y: menuLayout.uncoveredCenter.y - viewportSize.height / 2,
        };
        const worldPoint =
            thingWorldPoints.get(thingId) ??
            toWorld(thing.position(config.date));
        if (!moveView) {
            if (coveredByMenu(thing)) {
                animateView(
                    worldPoint,
                    viewStateRef.current.zoomMultiplier,
                    uncoveredAnchor,
                );
            }
            return;
        }
        const orbitFrame = orbitFraming(thing);
        animateView(
            orbitFrame?.worldCenter ?? worldPoint,
            orbitFrame?.zoomMultiplier ?? viewStateRef.current.zoomMultiplier,
            uncoveredAnchor,
        );
    }

    // Whether the open menu would cover any of `thing`'s marker or label,
    // as approximated by its collision box (see collisionBox) at its
    // current screen position. The menu is a right sidebar, or the top half
    // of the screen in portrait - see computeMenuLayout.
    function coveredByMenu(thing: Thing): boolean {
        const auPoint = thingPositions.get(thing.id);
        if (!auPoint) {
            return false;
        }
        const point = toScreen(auPoint);
        const boxes = collisionBoxes(
            thing,
            isLabeled(thing),
            drawnRadiusPx(thing, pixelsPerAu),
        );
        if (menuLayout.isPortrait) {
            // The uncovered area is the bottom part, centered on
            // uncoveredCenter.y; the menu is everything above it.
            const menuBottom =
                viewportSize.height -
                2 * (viewportSize.height - menuLayout.uncoveredCenter.y);
            return boxes.some((box) => point.y + box.top < menuBottom);
        }
        // The uncovered area is the left part, centered on uncoveredCenter.x;
        // the menu is everything right of it.
        const menuLeft = 2 * menuLayout.uncoveredCenter.x;
        return boxes.some((box) => point.x + box.right > menuLeft);
    }

    // The Reset view button: closes the menu (or search results), and
    // animates back to the view the map opened on. INITIAL_VIEW_STATE (no
    // pan, zoom 1) puts world point (0, 0) at the screen's center.
    function animateResetView(): void {
        closeMenu();
        animateView({ x: 0, y: 0 }, INITIAL_VIEW_STATE.zoomMultiplier, {
            x: 0,
            y: 0,
        });
    }

    // Animates the view, over VIEW_ANIMATION_MS, to one where world-space
    // point `targetCenter` sits at screen point `anchor`, at zoom
    // `targetZoom`. `anchor` is relative to the screen's center, ie in
    // panOffset's terms - eg the center of the area the menu leaves
    // uncovered, or (0, 0) for the screen's own center.
    //
    // Zoom is interpolated geometrically (evenly in log space), since a
    // single selection can change it by a factor of 100,000+ (eg Io to
    // Sedna). The center isn't interpolated linearly alongside it, which
    // would swing the view far off course while zoomed in: instead it moves
    // in step with the view's *width* (1 / zoom). Zooming out, that keeps
    // the start point in view while the view widens, then pans once it's
    // wide; zooming in, it does most of the panning early, while the view is
    // still wide enough that a big move is a short one on screen.
    function animateView(
        targetCenter: Point2D,
        targetZoom: number,
        anchor: Point2D,
    ): void {
        cancelViewAnimation();
        // Inverse of makeAuToScreenTransform's
        // screen = viewportCenter + panOffset + world * zoomMultiplier.
        const viewAt = (center: Point2D, zoom: number): ViewState => ({
            zoomMultiplier: zoom,
            panOffset: {
                x: anchor.x - center.x * zoom,
                y: anchor.y - center.y * zoom,
            },
        });
        const start = viewStateRef.current;
        const startZoom = start.zoomMultiplier;
        // The world point currently at the anchor.
        const startCenter: Point2D = {
            x: (anchor.x - start.panOffset.x) / startZoom,
            y: (anchor.y - start.panOffset.y) / startZoom,
        };
        const reduceMotion = window.matchMedia?.(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (reduceMotion) {
            setViewState(viewAt(targetCenter, targetZoom));
            return;
        }

        const startWidth = 1 / startZoom;
        const targetWidth = 1 / targetZoom;
        // Below this, the zoom is effectively unchanged (eg a plain pan),
        // and the width-based progress would divide by ~0.
        const zoomChanges = Math.abs(Math.log(targetZoom / startZoom)) > 1e-6;
        const startTime = performance.now();

        function frame(now: number): void {
            const t = Math.min((now - startTime) / VIEW_ANIMATION_MS, 1);
            const eased = easeInOutCubic(t);
            const zoom = startZoom * (targetZoom / startZoom) ** eased;
            const centerProgress = zoomChanges
                ? (1 / zoom - startWidth) / (targetWidth - startWidth)
                : eased;
            setViewState(
                viewAt(
                    {
                        x:
                            startCenter.x +
                            (targetCenter.x - startCenter.x) * centerProgress,
                        y:
                            startCenter.y +
                            (targetCenter.y - startCenter.y) * centerProgress,
                    },
                    zoom,
                ),
            );
            animationFrameRef.current =
                t < 1 ? requestAnimationFrame(frame) : undefined;
        }
        animationFrameRef.current = requestAnimationFrame(frame);
    }

    // The zoom, and the world-space point to center on, that fit `thing`'s
    // orbit line into the screen area the menu leaves uncovered - or
    // undefined if it has no orbit line (Sol, a Lagrange point).
    function orbitFraming(
        thing: Thing,
    ): { zoomMultiplier: number; worldCenter: Point2D } | undefined {
        if (thing.kind === 'star' || thing.kind === 'lagrangePoint') {
            return undefined;
        }
        const worldPoints = thing.orbitPath(config.date).map(toWorld);
        if (worldPoints.length === 0) {
            return undefined;
        }
        const xs = worldPoints.map((point) => point.x);
        const ys = worldPoints.map((point) => point.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        // The uncovered area is centered on uncoveredCenter, so its size is
        // twice the distance from there to its nearer edge on each axis.
        const uncoveredWidth =
            2 *
            Math.min(
                menuLayout.uncoveredCenter.x,
                viewportSize.width - menuLayout.uncoveredCenter.x,
            );
        const uncoveredHeight =
            2 *
            Math.min(
                menuLayout.uncoveredCenter.y,
                viewportSize.height - menuLayout.uncoveredCenter.y,
            );
        // Math.max guards a degenerate (zero-width or -height) orbit.
        const zoomMultiplier = clamp(
            ORBIT_FRAME_FILL *
                Math.min(
                    uncoveredWidth / Math.max(maxX - minX, 1e-9),
                    uncoveredHeight / Math.max(maxY - minY, 1e-9),
                ),
            minZoomMultiplier,
            maxZoomMultiplier,
        );
        return {
            zoomMultiplier,
            worldCenter: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
        };
    }

    const closeMenu = React.useCallback(() => {
        setSelectedThingId(undefined);
        setLagrangeAnchorId(undefined);
        setSearchActive(false);
    }, []);

    // Leaves search-results mode, back to whatever the pane showed before:
    // the selected Thing's info, or nothing.
    const closeSearchResults = React.useCallback(() => {
        setSearchActive(false);
    }, []);

    // Escape backs out one step: from search results first, then the pane.
    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                if (resultsShowing) {
                    closeSearchResults();
                } else {
                    closeMenu();
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeMenu, closeSearchResults, resultsShowing]);

    // Picking a search result is the same as clicking that Thing on the
    // map. Blurring the searchbar puts away a phone's on-screen keyboard,
    // which would otherwise cover the map the Thing was just centered on.
    function pickSearchResult(thing: Thing): void {
        searchInputRef.current?.blur();
        selectThing(thing, true);
    }

    function handleSearchKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>,
    ): void {
        if (!resultsShowing || searchResults.length === 0) {
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightIndex((index) =>
                Math.min(index + 1, searchResults.length - 1),
            );
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === 'Enter') {
            pickSearchResult(
                searchResults[
                    Math.min(highlightIndex, searchResults.length - 1)
                ].thing,
            );
        }
    }

    // See MIN_MARKER_SEPARATION_PX for the approximation this applies.
    // Things claim their screen area in priority order (see loses()), and
    // one is hidden only if its box overlaps a Thing that's actually being
    // shown - so a hidden Thing's label can't knock out a third one.
    const hiddenThingIds = React.useMemo(() => {
        const candidates = displayedThings
            .map((thing) => ({
                thing,
                point: toScreen(thingPositions.get(thing.id)!),
                boxes: collisionBoxes(
                    thing,
                    isLabeled(thing),
                    drawnRadiusPx(thing, pixelsPerAu),
                ),
            }))
            // The selected Thing goes first, so it's always shown: a search
            // can select one that would otherwise lose its spot (eg Io,
            // zoomed out far enough to sit on top of Jupiter).
            .sort((a, b) => {
                if (a.thing.id === selectedThingId) {
                    return -1;
                }
                if (b.thing.id === selectedThingId) {
                    return 1;
                }
                if (loses(a.thing, b.thing)) {
                    return 1;
                }
                return loses(b.thing, a.thing) ? -1 : 0;
            });
        const shown: typeof candidates = [];
        const hidden = new Set<string>();
        for (const candidate of candidates) {
            const blocked = shown.some((other) =>
                boxesOverlap(
                    candidate.point,
                    candidate.boxes,
                    other.point,
                    other.boxes,
                ),
            );
            if (blocked) {
                hidden.add(candidate.thing.id);
            } else {
                shown.push(candidate);
            }
        }
        return hidden;
    }, [
        displayedThings,
        thingPositions,
        toScreen,
        isLabeled,
        selectedThingId,
        pixelsPerAu,
    ]);

    // MAX_/MIN_VIEW_RADIUS_AU, converted into zoomMultiplier's own terms
    // (a multiple of framing.scale, which does depend on ?focus=).
    const shorterSidePx = Math.min(viewportSize.width, viewportSize.height);
    const minZoomMultiplier =
        shorterSidePx / (2 * MAX_VIEW_RADIUS_AU) / framing.scale;
    const maxZoomMultiplier =
        shorterSidePx / (2 * MIN_VIEW_RADIUS_AU) / framing.scale;

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
                minZoomMultiplier,
                maxZoomMultiplier,
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
                minZoomMultiplier,
                maxZoomMultiplier,
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

    // pointerover bubbles, so this one handler on the <svg> sees the mouse
    // entering any marker (-> that Thing) or anything else (-> undefined).
    // Mouse only: a touch has no hover, and would otherwise leave the last
    // tapped Thing "hovered" after the finger lifts.
    function handlePointerOver(event: React.PointerEvent<SVGSVGElement>): void {
        if (event.pointerType !== 'mouse') {
            return;
        }
        setHoveredThingId(
            (event.target as Element)
                .closest('[data-thing-id]')
                ?.getAttribute('data-thing-id') ?? undefined,
        );
    }

    function handleWheel(event: WheelEvent): void {
        // Also stops a desktop trackpad pinch (which browsers report as a
        // ctrl+wheel) from zooming the whole page - see the listener below.
        event.preventDefault();
        cancelViewAnimation();
        const svg = svgRef.current;
        if (!svg) {
            return;
        }
        const rect = svg.getBoundingClientRect();
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

    // The latest handleWheel, for the listener below: that listener is
    // attached once, but handleWheel closes over this render's state.
    const handleWheelRef = React.useRef(handleWheel);
    handleWheelRef.current = handleWheel;

    // Attached by hand rather than via the <svg>'s onWheel prop, because
    // React attaches its own wheel listeners as passive (see
    // github.com/facebook/react/issues/19651), where preventDefault() is
    // silently ignored. A desktop trackpad pinch then zoomed the browser
    // page as well as the map: every step of that resized the map, and
    // with it re-ran the auto-framing, which used to re-trace every orbit
    // line (see OrbitPath) - enough to hang the page for a minute.
    React.useEffect(() => {
        const svg = svgRef.current;
        if (!svg) {
            return undefined;
        }
        const listener = (event: WheelEvent): void =>
            handleWheelRef.current(event);
        svg.addEventListener('wheel', listener, { passive: false });
        return () => svg.removeEventListener('wheel', listener);
    }, []);

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
                    const thing = displayedThings.find(
                        (candidate) => candidate.id === thingId,
                    );
                    if (thing) {
                        selectThing(thing);
                    } else {
                        closeMenu();
                    }
                    return;
                }
                cancelViewAnimation();
                setViewState((current) => ({
                    ...current,
                    panOffset: { x, y },
                }));
            },
            onPinch: ({ origin: [originX, originY], offset: [scale] }) => {
                cancelViewAnimation();
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
                // Wheel-to-zoom is handled by handleWheel above,
                // already tuned for a gentle per-notch step; leave pinch
                // out of the wheel event entirely rather than double up.
                pinchOnWheel: false,
            },
        },
    );

    // A marker/label for every Thing in `things` that isn't hidden (see
    // hiddenThingIds) and is at least partly on screen.
    function renderMarkers(
        things: Thing[],
        showLabel: (thing: Thing) => boolean,
    ): JSX.Element[] {
        const markers: JSX.Element[] = [];
        for (const thing of things) {
            if (hiddenThingIds.has(thing.id)) {
                continue;
            }
            const worldPoint = thingWorldPoints.get(thing.id)!;
            const screenPoint = {
                x: screenOffset.x + worldPoint.x * zoomMultiplier,
                y: screenOffset.y + worldPoint.y * zoomMultiplier,
            };
            const radius = drawnRadiusPx(thing, pixelsPerAu);
            // Generous on the right, for the label.
            const reach = radius + MIN_MARKER_SEPARATION_PX;
            if (
                screenPoint.x + reach + 300 < 0 ||
                screenPoint.x - reach > viewportSize.width ||
                screenPoint.y + reach < 0 ||
                screenPoint.y - reach > viewportSize.height
            ) {
                continue;
            }
            markers.push(
                <ObjectMarker
                    key={thing.id}
                    object={thing}
                    screenPoint={screenPoint}
                    radius={radius}
                    showLabel={showLabel(thing)}
                    selected={thing.id === selectedThingId}
                />,
            );
        }
        return markers;
    }

    // Reference rings around Earth for its orbit bands (see
    // EARTH_ORBIT_BANDS): not Things, just guides for the satellites
    // within them, eg the ISS in low Earth orbit. Each is only drawn while
    // big enough to tell apart from Earth, and while some of it is on
    // screen.
    function renderEarthOrbitBands(): JSX.Element[] {
        const earthAu = thingPositions.get('earth');
        if (!earthAu) {
            return [];
        }
        const earthWorld = thingWorldPoints.get('earth')!;
        const center = {
            x: screenOffset.x + earthWorld.x * zoomMultiplier,
            y: screenOffset.y + earthWorld.y * zoomMultiplier,
        };
        // The nearest and farthest the screen gets from Earth's center.
        const nearestX = Math.max(0, Math.min(viewportSize.width, center.x));
        const nearestY = Math.max(0, Math.min(viewportSize.height, center.y));
        const nearest = Math.hypot(nearestX - center.x, nearestY - center.y);
        const farthest = Math.hypot(
            Math.max(center.x, viewportSize.width - center.x),
            Math.max(center.y, viewportSize.height - center.y),
        );
        return EARTH_ORBIT_BANDS.flatMap(({ label, radiusKm }) => {
            const radiusPx = (radiusKm / KM_PER_AU) * pixelsPerAu;
            if (
                radiusPx < MIN_ORBIT_BAND_RADIUS_PX ||
                radiusPx > MAX_ORBIT_BAND_RADIUS_PX ||
                radiusPx < nearest ||
                radiusPx > farthest
            ) {
                return [];
            }
            return [
                <g key={label} pointerEvents="none">
                    <circle
                        cx={center.x}
                        cy={center.y}
                        r={radiusPx}
                        fill="none"
                        stroke="#8fa3c8"
                        strokeOpacity={0.35}
                        strokeDasharray="3 5"
                    />
                    <text
                        x={center.x}
                        y={center.y - radiusPx - 4}
                        textAnchor="middle"
                        fill="#8fa3c8"
                        fillOpacity={0.8}
                        fontSize={11}
                        fontFamily="'Gelasio', Georgia, serif"
                    >
                        {label}
                    </text>
                </g>,
            ];
        });
    }

    function renderOrbitPath(thing: Thing): JSX.Element {
        return (
            <OrbitPath
                key={thing.id}
                object={thing}
                date={config.date}
                toWorld={toWorld}
                zoomMultiplier={zoomMultiplier}
                screenOffsetX={screenOffset.x}
                screenOffsetY={screenOffset.y}
                viewportWidth={viewportSize.width}
                viewportHeight={viewportSize.height}
            />
        );
    }

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
                onPointerOver={handlePointerOver}
                onPointerLeave={() => setHoveredThingId(undefined)}
            >
                {visibleBaseLayer
                    .filter(
                        (thing) =>
                            !hasOnDemandOrbitLine(thing) ||
                            thing.id === selectedThingId ||
                            thing.id === hoveredThingId,
                    )
                    .map(renderOrbitPath)}
                {focusedExtras.map(renderOrbitPath)}
                {renderEarthOrbitBands()}
                {renderMarkers(visibleBaseLayer, isLabeled)}
                {renderMarkers(focusedExtras, () => true)}
                {renderMarkers(anchorLagrangePoints, () => true)}
            </svg>
            {resultsShowing ? (
                <SearchResults
                    results={searchResults}
                    highlightIndex={highlightIndex}
                    layout={menuLayout}
                    onHighlight={setHighlightIndex}
                    onPick={pickSearchResult}
                    onClose={closeSearchResults}
                />
            ) : (
                selectedThing && (
                    <ThingMenu
                        thing={selectedThing}
                        date={config.date}
                        layout={menuLayout}
                        onClose={closeMenu}
                    />
                )
            )}
            {/* Always at the top of the screen, and always this same
                element (only restyled, never moved in the DOM), so it keeps
                focus - and a phone keeps its keyboard up - when the first
                keystroke opens the pane. In portrait the pane opens
                underneath it, so it widens to span the pane's top edge;
                otherwise it shifts left with the other controls to clear
                the sidebar. */}
            <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                placeholder="Search"
                aria-label="Search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchActive(true);
                    setHighlightIndex(0);
                }}
                onFocus={() => setSearchActive(true)}
                onClick={() => setSearchActive(true)}
                onKeyDown={handleSearchKeyDown}
                style={{
                    ...searchInputStyle,
                    right: paneOpen
                        ? menuLayout.resetButtonOffset.right
                        : SCREEN_MARGIN_PX,
                    width:
                        paneOpen && menuLayout.isPortrait
                            ? viewportSize.width - 2 * SCREEN_MARGIN_PX
                            : SEARCH_BAR_WIDTH_PX,
                }}
            />
            <div
                style={{
                    ...controlsStyle,
                    ...(paneOpen ? menuLayout.resetButtonOffset : {}),
                    // Under the searchbar - except in portrait with the
                    // pane open, where the searchbar stays up on the pane
                    // and these sit just below the pane instead.
                    top:
                        paneOpen && menuLayout.isPortrait
                            ? menuLayout.resetButtonOffset.top
                            : SCREEN_MARGIN_PX +
                              SEARCH_BAR_HEIGHT_PX +
                              CONTROLS_GAP_PX,
                }}
            >
                <button onClick={animateResetView} style={resetButtonStyle}>
                    Reset view
                </button>
                <label style={checkboxLabelStyle}>
                    <input
                        type="checkbox"
                        checked={showSmallHeliocentrics}
                        onChange={(event) =>
                            setShowSmallHeliocentrics(event.target.checked)
                        }
                        style={{ margin: 0, cursor: 'pointer' }}
                    />
                    Show small heliocentrics
                </label>
            </div>
        </div>
    );
}

interface OrbitPathProps {
    object: Thing;
    date: Date;
    toWorld: (point: Point2D) => Point2D;
    zoomMultiplier: number;
    // Where world point (0, 0) is on screen - see SpaceMap's screenOffset.
    // Split into numbers, not a Point2D, so React.memo can compare them.
    screenOffsetX: number;
    screenOffsetY: number;
    viewportWidth: number;
    viewportHeight: number;
}

const OrbitPath = React.memo(function OrbitPath({
    object,
    date,
    toWorld,
    zoomMultiplier,
    screenOffsetX,
    screenOffsetY,
    viewportWidth,
    viewportHeight,
}: OrbitPathProps): JSX.Element | null {
    // The orbit itself, in AU: only re-traced when the date changes. Tracing
    // is the expensive part - a planet's is 2,000 astronomy-engine position
    // calculations - so it's kept separate from the framing (toWorld),
    // which changes whenever the map is resized.
    const auPoints = React.useMemo(() => {
        if (object.kind === 'lagrangePoint') {
            return undefined;
        }
        return object.orbitPath?.(date);
    }, [object, date]);
    const closed = React.useMemo(
        () => object.orbitPathIsClosed(date),
        [object, date],
    );
    // World-space points (see makeAuToWorldTransform): independent of
    // pan/zoom, so only recomputed when the orbit or framing changes - a
    // cheap rotate-and-scale per point.
    const worldPoints = React.useMemo(
        () => auPoints?.map(toWorld),
        [auPoints, toWorld],
    );
    // Screen-space geometry (see SpaceMap's screenOffset), clipped to just
    // past the screen's edges - see clipSegment.
    const pathData = React.useMemo(() => {
        if (!worldPoints || worldPoints.length < 2) {
            return undefined;
        }
        const clipRect = {
            left: -OFFSCREEN_MARGIN_PX,
            top: -OFFSCREEN_MARGIN_PX,
            right: viewportWidth + OFFSCREEN_MARGIN_PX,
            bottom: viewportHeight + OFFSCREEN_MARGIN_PX,
        };
        const screenPoints = worldPoints.map((point) => ({
            x: screenOffsetX + point.x * zoomMultiplier,
            y: screenOffsetY + point.y * zoomMultiplier,
        }));
        const commands: string[] = [];
        // Whether the last drawn segment ended exactly at its own (unclipped)
        // end point, so the next one can continue from there with L rather
        // than starting a new subpath with M.
        let penDown = false;
        // A closed loop's last point joins back to its first.
        const segmentCount = closed
            ? screenPoints.length
            : screenPoints.length - 1;
        for (let i = 0; i < segmentCount; i++) {
            const clipped = clipSegment(
                screenPoints[i],
                screenPoints[(i + 1) % screenPoints.length],
                clipRect,
            );
            if (!clipped) {
                penDown = false;
                continue;
            }
            const [start, end, endClipped] = clipped;
            if (!penDown || start !== screenPoints[i]) {
                commands.push(`M${roundTenth(start.x)},${roundTenth(start.y)}`);
            }
            commands.push(`L${roundTenth(end.x)},${roundTenth(end.y)}`);
            penDown = !endClipped;
        }
        return commands.length > 0 ? commands.join(' ') : undefined;
    }, [
        worldPoints,
        closed,
        zoomMultiplier,
        screenOffsetX,
        screenOffsetY,
        viewportWidth,
        viewportHeight,
    ]);
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

// Clips the line segment a->b to `rect` (Liang-Barsky): returns the part
// inside it as [start, end, whether end was cut short], or undefined if no
// part is inside. `start` is `a` itself (the same object) when it wasn't
// cut short.
//
// Orbit lines are clipped like this, rather than handed whole to the
// browser, because zoomed in close their far side is enormous in screen
// pixels - eg Earth's orbit, zoomed in on LRO, spans ~2,500,000,000 pixels
// - and browsers draw SVG in 32-bit floats, where coordinates that size
// are off by hundreds of pixels (see SpaceMap's screenOffset).
function clipSegment(
    a: Point2D,
    b: Point2D,
    rect: { left: number; top: number; right: number; bottom: number },
): [Point2D, Point2D, boolean] | undefined {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let tStart = 0;
    let tEnd = 1;
    // Each [p, q] pair is one of the rect's 4 edges, as the inequality
    // p * t <= q that a point a + t * (b - a) has to satisfy to be inside it.
    const edges: [number, number][] = [
        [-dx, a.x - rect.left],
        [dx, rect.right - a.x],
        [-dy, a.y - rect.top],
        [dy, rect.bottom - a.y],
    ];
    for (const [p, q] of edges) {
        if (p === 0) {
            // Parallel to this edge: entirely inside or outside of it.
            if (q < 0) {
                return undefined;
            }
            continue;
        }
        const t = q / p;
        if (p < 0) {
            tStart = Math.max(tStart, t);
        } else {
            tEnd = Math.min(tEnd, t);
        }
        if (tStart > tEnd) {
            return undefined;
        }
    }
    const start =
        tStart === 0 ? a : { x: a.x + tStart * dx, y: a.y + tStart * dy };
    const end = tEnd === 1 ? b : { x: a.x + tEnd * dx, y: a.y + tEnd * dy };
    return [start, end, tEnd !== 1];
}

// Sub-pixel precision finer than this is invisible, and rounding keeps the
// path strings short.
function roundTenth(value: number): number {
    return Math.round(value * 10) / 10;
}

interface ObjectMarkerProps {
    object: Thing;
    // Already in screen space - see SpaceMap's screenOffset.
    screenPoint: Point2D;
    // See drawnRadiusPx.
    radius: number;
    showLabel: boolean;
    selected: boolean;
}

const ObjectMarker = React.memo(function ObjectMarker({
    object,
    screenPoint,
    radius,
    showLabel,
    selected,
}: ObjectMarkerProps): JSX.Element {
    const isLagrangePoint = object.kind === 'lagrangePoint';
    // Spacecraft are diamonds, to tell them apart from natural bodies -
    // once zoomed out far enough to be drawn at marker size (see
    // drawnRadiusPx), which for a spacecraft is always.
    const isSpacecraft = object.kind === 'spacecraft';
    // A bit past `radius` at its corners, so it reads as about the same
    // size as a circle of that radius.
    const diamondRadius = radius * 1.3;
    const labelText = object.label ?? object.name;

    // The label's rendered size, for the black backing behind it, which
    // keeps it readable over anything bright (eg Luna's disk). Measured
    // rather than estimated, since glyph widths vary - and measured again
    // once the webfont has loaded, since it's drawn in a fallback font
    // until then.
    const labelRef = React.useRef<SVGTextElement>(null);
    const [labelSize, setLabelSize] = React.useState<
        { width: number; height: number; top: number } | undefined
    >(undefined);
    React.useLayoutEffect(() => {
        if (!showLabel) {
            return undefined;
        }
        let cancelled = false;
        const measure = (): void => {
            const text = labelRef.current;
            if (cancelled || !text) {
                return;
            }
            const box = text.getBBox();
            setLabelSize({ width: box.width, height: box.height, top: box.y });
        };
        measure();
        document.fonts?.ready.then(measure);
        return () => {
            cancelled = true;
        };
    }, [showLabel, labelText]);

    return (
        // data-thing-id is how a tap on the marker or its label is mapped
        // back to this Thing - see thingIdAtPoint.
        <g
            transform={`translate(${screenPoint.x}, ${screenPoint.y})`}
            data-thing-id={object.id}
            style={{ cursor: 'pointer' }}
        >
            {/* Invisible, finger-sized tap target - or the whole disk, once
                that's bigger. */}
            <circle
                cx={0}
                cy={0}
                r={Math.max(MARKER_HIT_RADIUS_PX, radius)}
                fill="transparent"
            />
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
            ) : isSpacecraft ? (
                <polygon
                    points={`0,${-diamondRadius} ${diamondRadius},0 0,${diamondRadius} ${-diamondRadius},0`}
                    fill={object.colorHex}
                />
            ) : (
                <circle cx={0} cy={0} r={radius} fill={object.colorHex} />
            )}
            {showLabel && labelSize && (
                <rect
                    x={radius + LABEL_GAP_PX - LABEL_PADDING_X_PX}
                    y={labelSize.top - LABEL_PADDING_Y_PX}
                    width={labelSize.width + 2 * LABEL_PADDING_X_PX}
                    height={labelSize.height + 2 * LABEL_PADDING_Y_PX}
                    rx={2}
                    fill="#000"
                    fillOpacity={0.75}
                />
            )}
            {showLabel && (
                <text
                    ref={labelRef}
                    x={radius + LABEL_GAP_PX}
                    y={4}
                    fill="#e6e6e6"
                    fontSize={13}
                    fontFamily="'Gelasio', Georgia, serif"
                >
                    {labelText}
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

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

// The top-right stack of controls: the Reset view button, with the 'Show
// small heliocentrics' checkbox under it. Moves as one when the menu opens
// (see MenuLayout.resetButtonOffset).
const searchInputStyle: React.CSSProperties = {
    position: 'absolute',
    top: SCREEN_MARGIN_PX,
    height: SEARCH_BAR_HEIGHT_PX,
    boxSizing: 'border-box',
    padding: '0 10px',
    background: '#1b1f2b',
    color: '#e6e6e6',
    border: '1px solid #3a3f52',
    borderRadius: 4,
    // 16px, not the other controls' 13: iOS Safari zooms the whole page in
    // when an input with smaller text than that is focused.
    fontSize: 16,
    fontFamily: "'Gelasio', Georgia, serif",
};

const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: SCREEN_MARGIN_PX,
    right: SCREEN_MARGIN_PX,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
};

const checkboxLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#e6e6e6',
    fontSize: 13,
    fontFamily: "'Gelasio', Georgia, serif",
    cursor: 'pointer',
    userSelect: 'none',
};

const resetButtonStyle: React.CSSProperties = {
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

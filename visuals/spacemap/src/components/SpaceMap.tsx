import React from 'react';
import { SpaceMapConfig } from '../config';
import { BASE_LAYER } from '../orbital/catalog';
import { Point2D, ThingKind } from '../orbital/types';
import { Thing } from '../orbital/thing';
import { computeFraming, makeAuToScreenTransform } from '../view/transform';

const RADIUS_PX: Record<ThingKind, number> = {
    star: 8,
    planet: 5,
    moon: 5,
    asteroid: 3,
    spacecraft: 3,
    lagrangePoint: 4,
};
const MIN_ZOOM_MULTIPLIER = 0.05;
const MAX_ZOOM_MULTIPLIER = 50;
const WHEEL_ZOOM_STEP = 1.15;

interface Props {
    config: SpaceMapConfig;
}

interface DragState {
    startClientX: number;
    startClientY: number;
    startPanOffset: Point2D;
}

export function SpaceMap({ config }: Props): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const dragStateRef = React.useRef<DragState | null>(null);

    const [viewportSize, setViewportSize] = React.useState({
        width: 800,
        height: 600,
    });
    const [panOffset, setPanOffset] = React.useState<Point2D>({ x: 0, y: 0 });
    const [zoomMultiplier, setZoomMultiplier] = React.useState(1);

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
        setPanOffset({ x: 0, y: 0 });
        setZoomMultiplier(1);
    }, []);

    // Re-frame automatically whenever the embed config (focus list, timestamp) changes.
    React.useEffect(() => {
        resetView();
    }, [config, resetView]);

    const focusPoints = React.useMemo(
        () =>
            config.focusObjects.map((object) => object.positionAu(config.date)),
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
        () => new Set(config.focusObjects.map((object) => object.id)),
        [config],
    );
    // Moons, Lagrange points, etc: only rendered when they're in the current focus list.
    const focusedExtras = React.useMemo(
        () =>
            config.focusObjects.filter(
                (object) => !baseLayerIdSet.has(object.id),
            ),
        [config, baseLayerIdSet],
    );

    function handlePointerDown(event: React.PointerEvent<SVGSVGElement>): void {
        dragStateRef.current = {
            startClientX: event.clientX,
            startClientY: event.clientY,
            startPanOffset: panOffset,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: React.PointerEvent<SVGSVGElement>): void {
        const dragState = dragStateRef.current;
        if (!dragState) {
            return;
        }
        setPanOffset({
            x:
                dragState.startPanOffset.x +
                (event.clientX - dragState.startClientX),
            y:
                dragState.startPanOffset.y +
                (event.clientY - dragState.startClientY),
        });
    }

    function handlePointerUp(): void {
        dragStateRef.current = null;
    }

    function handleWheel(event: React.WheelEvent<SVGSVGElement>): void {
        event.preventDefault();
        const zoomStep =
            event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
        setZoomMultiplier((current) =>
            clamp(current * zoomStep, MIN_ZOOM_MULTIPLIER, MAX_ZOOM_MULTIPLIER),
        );
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
                {BASE_LAYER.map((thing) => (
                    <ObjectMarker
                        key={thing.id}
                        object={thing}
                        date={config.date}
                        toScreen={toScreen}
                        showLabel={focusIdSet.has(thing.id)}
                    />
                ))}
                {focusedExtras.map((object) => (
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
        () => object.orbitPathAu?.(date) ?? null,
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
    const screenPoint = toScreen(object.positionAu(date));
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

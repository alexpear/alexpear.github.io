import { Body } from 'astronomy-engine';
import React from 'react';
import { SpaceMapConfig } from '../config';
import { PLANETS, PlanetDef } from '../orbital/planetData';
import { eclipticPositionAu, orbitPathAu, Point2D } from '../orbital/positions';
import { computeFraming, makeAuToScreenTransform } from '../view/transform';

const BODY_RADIUS_PX = 5;
const SUN_RADIUS_PX = 8;
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
            config.focusBodies.map((body) =>
                eclipticPositionAu(body, config.date),
            ),
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

    const focusBodySet = React.useMemo(
        () => new Set<Body>(config.focusBodies),
        [config.focusBodies],
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

    const sunScreenPoint = toScreen({ x: 0, y: 0 });

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
                {PLANETS.map((planet) => (
                    <OrbitPath
                        key={planet.name}
                        planet={planet}
                        date={config.date}
                        toScreen={toScreen}
                    />
                ))}
                <circle
                    cx={sunScreenPoint.x}
                    cy={sunScreenPoint.y}
                    r={SUN_RADIUS_PX}
                    fill="#ffd27f"
                />
                {PLANETS.map((planet) => {
                    const auPoint = eclipticPositionAu(
                        planet.body,
                        config.date,
                    );
                    const screenPoint = toScreen(auPoint);
                    const isFocused = focusBodySet.has(planet.body);
                    return (
                        <g key={planet.name}>
                            <circle
                                cx={screenPoint.x}
                                cy={screenPoint.y}
                                r={BODY_RADIUS_PX}
                                fill={planet.color}
                            />
                            {isFocused && (
                                <text
                                    x={screenPoint.x + BODY_RADIUS_PX + 4}
                                    y={screenPoint.y + 4}
                                    fill="#e6e6e6"
                                    fontSize={13}
                                    fontFamily="sans-serif"
                                >
                                    {planet.name}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <button onClick={resetView} style={resetButtonStyle}>
                Reset view
            </button>
        </div>
    );
}

interface OrbitPathProps {
    planet: PlanetDef;
    date: Date;
    toScreen: (point: Point2D) => Point2D;
}

function OrbitPath({ planet, date, toScreen }: OrbitPathProps): JSX.Element {
    const pathAu = React.useMemo(
        () => orbitPathAu(planet, date),
        [planet, date],
    );
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
            stroke={planet.color}
            strokeOpacity={0.35}
            strokeWidth={1}
        />
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

import React from 'react';
import { THINGS_BY_ID } from '../orbital/catalog';
import { Point2D } from '../orbital/types';
import { Thing } from '../orbital/thing';

// Desktop sidebar width; capped to half the viewport on narrow-but-still-
// landscape windows so the map keeps at least half the screen.
const SIDEBAR_WIDTH_PX = 340;

// Where the info menu sits, and the center of the screen area it leaves
// uncovered - which is where a clicked Thing gets panned to. The menu
// overlays the map rather than shrinking it, so opening/closing it doesn't
// change the auto-framing (computeFraming) underneath.
export interface MenuLayout {
    // Portrait (taller than wide, ie mobile): the top half of the screen.
    // Otherwise: a right sidebar.
    isPortrait: boolean;
    menuStyle: React.CSSProperties;
    uncoveredCenter: Point2D;
    // Where the Reset view button goes while the menu is open, so the menu
    // doesn't cover it.
    resetButtonOffset: { top: number; right: number };
}

export function computeMenuLayout(width: number, height: number): MenuLayout {
    if (height > width) {
        return {
            isPortrait: true,
            menuStyle: { top: 0, left: 0, width: '100%', height: height / 2 },
            uncoveredCenter: { x: width / 2, y: (height * 3) / 4 },
            resetButtonOffset: { top: height / 2 + 12, right: 12 },
        };
    }
    const sidebarWidth = Math.min(SIDEBAR_WIDTH_PX, width / 2);
    return {
        isPortrait: false,
        menuStyle: { top: 0, right: 0, width: sidebarWidth, height: '100%' },
        uncoveredCenter: { x: (width - sidebarWidth) / 2, y: height / 2 },
        resetButtonOffset: { top: 12, right: sidebarWidth + 12 },
    };
}

interface Props {
    thing: Thing;
    date: Date;
    layout: MenuLayout;
    onClose: () => void;
}

export function ThingMenu({
    thing,
    date,
    layout,
    onClose,
}: Props): JSX.Element {
    const parent =
        thing.parentID !== thing.id
            ? THINGS_BY_ID.get(thing.parentID)
            : undefined;

    // Memoized because this menu re-renders on every pan/zoom tick of the
    // map behind it, and a moon's position walks up its parent chain.
    const distanceFromSolAu = React.useMemo(
        () => thing.distanceFromSolAu(date),
        [thing, date],
    );

    // LATER: ~10 fields per Thing, eg surface gravity, lightspeed lag from
    // Earth.
    const fields: [string, string][] = [];
    if (parent) {
        fields.push(['Orbits', parent.name]);
    }
    if (thing.kind !== 'star') {
        fields.push(['Distance from Sol', formatAu(distanceFromSolAu)]);
    }
    // A Lagrange point is a location, not a physical body: no size or mass
    // to report, as opposed to a body whose value just isn't known.
    if (thing.kind !== 'lagrangePoint') {
        fields.push([
            'Diameter',
            thing.diameterKm === undefined
                ? 'Unknown'
                : `${formatDiameterKm(thing.diameterKm)} km`,
        ]);
        fields.push([
            'Mass',
            thing.massKg === undefined
                ? 'Unknown'
                : formatScientific(thing.massKg, 'kg'),
        ]);
    }

    return (
        <div
            style={{
                ...menuBaseStyle,
                ...layout.menuStyle,
                borderLeft: layout.isPortrait ? undefined : menuBorder,
                borderBottom: layout.isPortrait ? menuBorder : undefined,
            }}
        >
            <div style={headerStyle}>
                <h2 style={titleStyle}>
                    <span
                        style={{
                            ...swatchStyle,
                            background: thing.colorHex,
                        }}
                    />
                    {thing.name}
                </h2>
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <dl style={fieldListStyle}>
                {fields.map(([label, value]) => (
                    <React.Fragment key={label}>
                        <dt style={fieldLabelStyle}>{label}</dt>
                        <dd style={fieldValueStyle}>{value}</dd>
                    </React.Fragment>
                ))}
            </dl>
            <p style={placeholderStyle}>More details coming soon.</p>
        </div>
    );
}

// 4 significant figures: enough to see Earth's distance vary over a year
// (0.983-1.017 AU), without false precision for distant bodies.
function formatAu(au: number): string {
    return `${au.toLocaleString('en-US', { maximumSignificantDigits: 4 })} AU`;
}

// Whole km for anything big; one decimal place for the few tiny moons
// (Phobos, Deimos) where whole km would lose most of the precision.
function formatDiameterKm(km: number): string {
    return km.toLocaleString('en-US', {
        maximumFractionDigits: km < 100 ? 1 : 0,
    });
}

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

// eg 5.97e24 -> "5.97 × 10²⁴ kg", to 3 significant figures.
function formatScientific(value: number, unit: string): string {
    const [mantissa, exponent] = value.toExponential(2).split('e');
    const superscript = String(Number(exponent))
        .split('')
        .map((char) => (char === '-' ? '⁻' : SUPERSCRIPT_DIGITS[Number(char)]))
        .join('');
    return `${Number(mantissa)} × 10${superscript} ${unit}`;
}

const menuBorder = '1px solid #3a3f52';

const menuBaseStyle: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    padding: '16px 20px',
    overflowY: 'auto',
    background: 'rgba(17, 20, 29, 0.94)',
    color: '#e6e6e6',
    fontFamily: "'Gelasio', Georgia, serif",
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
};

const titleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
};

const swatchStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
};

const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#e6e6e6',
    fontSize: 28,
    lineHeight: 1,
    padding: '0 4px',
    cursor: 'pointer',
    fontFamily: "'Gelasio', Georgia, serif",
};

const fieldListStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: 16,
    rowGap: 6,
    margin: '16px 0 0',
};

const fieldLabelStyle: React.CSSProperties = {
    color: '#9aa0b4',
};

const fieldValueStyle: React.CSSProperties = {
    margin: 0,
};

const placeholderStyle: React.CSSProperties = {
    marginTop: 16,
    color: '#9aa0b4',
    fontStyle: 'italic',
};

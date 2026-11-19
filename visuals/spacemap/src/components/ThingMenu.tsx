import React from 'react';
import { THINGS_BY_ID } from '../orbital/catalog';
import { Point2D } from '../orbital/types';
import { Thing } from '../orbital/thing';

// Desktop sidebar width; capped to half the viewport on narrow-but-still-
// landscape windows so the map keeps at least half the screen.
const SIDEBAR_WIDTH_PX = 340;

const EARTH_KG = 5.97e24;

// The searchbar's height and its margin from the screen edges. Lives here
// because the pane has to leave room for it: in portrait the searchbar
// sits on top of the pane's top edge (see MenuPane).
export const SEARCH_BAR_HEIGHT_PX = 32;
export const SCREEN_MARGIN_PX = 12;
// Space above the pane's header (the Thing's name and × button): from the
// pane's top edge, or in portrait from the bottom of the searchbar that
// overlays it.
const MENU_TOP_PADDING_PX = 20;

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

// The info pane's outer box: shared by ThingMenu (one Thing's info) and
// SearchResults (the searchbar's results), which fill it with content.
export function MenuPane({
    layout,
    children,
}: {
    layout: MenuLayout;
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div
            style={{
                ...menuBaseStyle,
                ...layout.menuStyle,
                borderLeft: layout.isPortrait ? undefined : menuBorder,
                borderBottom: layout.isPortrait ? menuBorder : undefined,
                // In portrait the searchbar overlays the pane's top edge.
                paddingTop: layout.isPortrait
                    ? SCREEN_MARGIN_PX +
                      SEARCH_BAR_HEIGHT_PX +
                      MENU_TOP_PADDING_PX
                    : MENU_TOP_PADDING_PX,
            }}
        >
            {children}
        </div>
    );
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

    // At the map's date, not now - see distanceFromSolAu's memo comment.
    const lagFromEarthSeconds = React.useMemo(
        () => THINGS_BY_ID.get('earth')!.lightSeconds(thing, date),
        [thing, date],
    );

    // LATER: ~10 fields per Thing, eg surface gravity, lightspeed lag from
    // Earth.
    const fields: [string, string][] = [];

    fields.push(['Distance from Sol', formatAu(distanceFromSolAu)]);

    if (distanceFromSolAu < 0.0001) {
        fields.push(['Sunniness', `Maximum`]);
    } else {
        const sunnyPercentString = (
            (1 / distanceFromSolAu ** 2) *
            100
        ).toLocaleString('en-US', { maximumSignificantDigits: 2 });

        fields.push(['Sunniness', `${sunnyPercentString}% of Earth normal`]);
    }

    fields.push([`Lag from Earth`, formatSeconds(lagFromEarthSeconds)]);

    if (thing.kind === 'spacecraft') {
        if (thing.agency) {
            fields.push(['Agency', thing.agency]);
        }
        if (thing.launchYear) {
            fields.push(['Launched', String(thing.launchYear)]);
        }
    }

    // A Lagrange point is a location, not a physical body: no size or mass
    // to report, as opposed to a body whose value just isn't known. Nor
    // does a spacecraft have any worth comparing to a world's.
    if (thing.kind !== 'lagrangePoint' && thing.kind !== 'spacecraft') {
        let diameterText: string;

        if (thing.diameterKm === undefined) {
            diameterText = 'Unknown';
        } else if (thing.diameterKm <= 1000) {
            diameterText = `${formatDiameterKm(thing.diameterKm)} km`;
        } else {
            diameterText = formatEarthRatio(thing.diameterKm / 12756);
        }
        fields.push(['Diameter', diameterText]);

        if (thing.diameterKm !== undefined) {
            const surfaceArea = 4 * Math.PI * (thing.diameterKm / 2) ** 2;

            const EARTH_KM2 = 510.1e6;
            fields.push([
                'Surface Area',
                formatEarthRatio(surfaceArea / EARTH_KM2),
            ]);
        }

        // TODO surface area via lookup table: Argentina, etc.

        fields.push([
            'Mass',
            thing.massKg === undefined
                ? 'Unknown'
                : formatEarthRatio(thing.massKg / EARTH_KG),
        ]);
    }

    const residents = thing.residentsAt(date);

    // How far to trust a spacecraft's drawn position. Orbiting a planet or
    // moon, it's on a snapshot of its real orbit, but at an illustrative
    // point along it; elsewhere, it's on a simplified version of its real
    // trajectory.
    const positionNote =
        thing.kind !== 'spacecraft'
            ? undefined
            : THINGS_BY_ID.get(thing.parentID)?.kind === 'star'
              ? 'Trajectory simplified from JPL Horizons data.'
              : 'Orbit from JPL Horizons data.';

    return (
        <MenuPane layout={layout}>
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
            {thing.description && (
                <p style={descriptionStyle}>{thing.description}</p>
            )}
            {residents.length > 0 && (
                <>
                    <h3 style={sectionTitleStyle}>
                        {thing.kind === 'lagrangePoint'
                            ? 'Spacecraft here'
                            : 'On the surface'}
                    </h3>
                    <dl style={fieldListStyle}>
                        {residents.map((resident) => (
                            <React.Fragment key={resident.name}>
                                <dt style={fieldLabelStyle}>{resident.name}</dt>
                                <dd style={fieldValueStyle}>{resident.note}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </>
            )}
            {positionNote && <p style={placeholderStyle}>{positionNote}</p>}
        </MenuPane>
    );
}

function formatAu(au: number): string {
    return `${au.toLocaleString('en-US', { maximumSignificantDigits: 2 })} AU`;
}

// Whole km for anything big; one decimal place for the few tiny moons
// (Phobos, Deimos) where whole km would lose most of the precision.
function formatDiameterKm(km: number): string {
    return km.toLocaleString('en-US', {
        maximumFractionDigits: km < 100 ? 1 : 0,
        maximumSignificantDigits: 2,
    });
}

// 2 significant digits, like the other fields: 1 rounded away almost all
// the variation, eg Vesta's ~11-28 minutes came out as only "10 min",
// "20 min" or "30 min".
function formatSeconds(seconds: number): string {
    if (seconds < 59.5) {
        return `${seconds.toLocaleString('en-US', {
            maximumSignificantDigits: 2,
        })} sec`;
    } else if (seconds < 59.5 * 60) {
        const minutes = seconds / 60;
        return `${minutes.toLocaleString('en-US', {
            maximumSignificantDigits: 2,
        })} min`;
    } else if (seconds < 23.5 * 3600) {
        const hours = seconds / 3600;
        return `${hours.toLocaleString('en-US', {
            maximumSignificantDigits: 2,
        })} hour`;
    } else {
        const days = seconds / 86400;
        return `${days.toLocaleString('en-US', {
            maximumSignificantDigits: 2,
        })} day`;
    }
}

function formatEarthRatio(ratio: number): string {
    if (ratio < 1) {
        const denominator = (1 / ratio).toLocaleString('en-US', {
            maximumSignificantDigits: 2,
        });

        return `1 / ${denominator} of Earth`;
    }

    return `${ratio.toLocaleString('en-US', {
        maximumSignificantDigits: 2,
    })} Earths`;
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

export const headerStyle: React.CSSProperties = {
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

export const swatchStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
};

export const closeButtonStyle: React.CSSProperties = {
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

const descriptionStyle: React.CSSProperties = {
    margin: '16px 0 0',
    lineHeight: 1.45,
};

const sectionTitleStyle: React.CSSProperties = {
    margin: '20px 0 0',
    fontSize: 16,
    fontWeight: 700,
};

export const placeholderStyle: React.CSSProperties = {
    marginTop: 16,
    color: '#9aa0b4',
    fontStyle: 'italic',
};

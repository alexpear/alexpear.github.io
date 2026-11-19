import React from 'react';
import { SearchResult } from '../orbital/search';
import { Thing } from '../orbital/thing';
import {
    MenuLayout,
    MenuPane,
    closeButtonStyle,
    headerStyle,
    placeholderStyle,
    swatchStyle,
} from './ThingMenu';

// Semi-major axis beyond which a Sol-orbiting minor body is described as a
// Trans-Neptunian object rather than an asteroid: Neptune's own, roughly.
const TNO_MIN_SEMI_MAJOR_AXIS_AU = 30;

interface Props {
    results: SearchResult[];
    // Index into `results` of the row the arrow keys / mouse are on; Enter
    // in the searchbar picks it.
    highlightIndex: number;
    layout: MenuLayout;
    onHighlight: (index: number) => void;
    onPick: (thing: Thing) => void;
    onClose: () => void;
}

// The info pane's other mode: the searchbar's results, shown in place of a
// Thing's info (ThingMenu) while a search is being typed.
export function SearchResults({
    results,
    highlightIndex,
    layout,
    onHighlight,
    onPick,
    onClose,
}: Props): JSX.Element {
    const highlightedRowRef = React.useRef<HTMLButtonElement>(null);

    // Keeps the highlighted row on screen as the arrow keys move it.
    React.useEffect(() => {
        highlightedRowRef.current?.scrollIntoView({ block: 'nearest' });
    }, [highlightIndex, results]);

    return (
        <MenuPane layout={layout}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Search results</h2>
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            {results.length === 0 ? (
                <p style={placeholderStyle}>No matches</p>
            ) : (
                <div style={listStyle}>
                    {results.map(({ thing, resident, matchedAlias }, index) => (
                        <button
                            key={`${thing.id}/${resident?.name ?? ''}`}
                            ref={
                                index === highlightIndex
                                    ? highlightedRowRef
                                    : undefined
                            }
                            onClick={() => onPick(thing)}
                            onMouseEnter={() => onHighlight(index)}
                            style={{
                                ...rowStyle,
                                background:
                                    index === highlightIndex
                                        ? '#262b3b'
                                        : 'none',
                            }}
                        >
                            <span
                                style={{
                                    ...swatchStyle,
                                    background: thing.colorHex,
                                }}
                            />
                            <span>
                                <span style={nameStyle}>
                                    {resident?.name ?? thing.name}
                                </span>
                                <span style={subtitleStyle}>
                                    {resident
                                        ? `${resident.note} · at ${thing.name}`
                                        : describeThing(thing)}
                                    {matchedAlias && ` · aka ${matchedAlias}`}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </MenuPane>
    );
}

// A few words on what a Thing is, to tell apart similar names (eg the
// asteroid Ganymed from Jupiter's moon Ganymede).
function describeThing(thing: Thing): string {
    switch (thing.kind) {
        case 'star':
            return 'Star';
        case 'planet':
            return 'Planet';
        case 'moon': {
            const parent = Thing.byID(thing.parentID);
            return parent ? `Moon of ${parent.name}` : 'Moon';
        }
        case 'asteroid':
            return (thing.semiMajorAxisAu ?? 0) > TNO_MIN_SEMI_MAJOR_AXIS_AU
                ? 'Trans-Neptunian object'
                : 'Asteroid';
        case 'comet':
            return 'Comet';
        case 'spacecraft': {
            const parent = Thing.byID(thing.parentID);
            return parent && parent.kind !== 'star'
                ? `Spacecraft orbiting ${parent.name}`
                : 'Spacecraft';
        }
        case 'lagrangePoint':
            return 'Lagrange point';
    }
}

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 400,
    color: '#9aa0b4',
};

const listStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    // Rows run to the pane's edges, past its 20px side padding, so the
    // highlight is a full-width band.
    margin: '10px -20px 0',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 20px',
    border: 'none',
    color: '#e6e6e6',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 16,
    fontFamily: "'Gelasio', Georgia, serif",
};

const nameStyle: React.CSSProperties = {
    display: 'block',
};

const subtitleStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    color: '#9aa0b4',
};

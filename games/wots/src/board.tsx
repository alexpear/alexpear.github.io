import React from 'react';
import type { BoardProps } from 'boardgame.io/react';
import {
    WotsState,
    HIVE_IDS,
    HIVE_NAMES,
    VIP_ROLES,
    LOYALTY_MULTIPLIERS,
    agentsPerTurn,
    scoreFor,
    HiveId,
} from './game';

// ─── Theme ───────────────────────────────────────────────────────────────────

const HIVE_COLOR: Record<HiveId, string> = {
    eu: 'rgb(83, 115, 227)',
    humanist: 'rgb(254, 209, 29)',
    cousins: 'rgb(88, 249, 255)',
    mitsubishi: 'rgb(254, 23, 23)',
    mason: 'rgb(142, 89, 255)',
};

const HIVE_BG: Record<HiveId, string> = {
    eu: '#0d1f3c',
    humanist: '#2a2200',
    cousins: '#0d2a22',
    mitsubishi: '#2a0d0d',
    mason: '#1a0d2a',
};

// Cubes per hive in a full game
const TOTAL_CUBES: Record<HiveId, number> = {
    eu: 20,
    humanist: 20,
    cousins: 20,
    mitsubishi: 20,
    mason: 20,
};

// ─── Wheel positions ──────────────────────────────────────────────────────────
// TODO: rotate based on G.roundWheelPosition

type WheelPosition = 'current' | 'tl' | 'tr' | 'bl' | 'br' | 'bottom';

// ─── VIP card ────────────────────────────────────────────────────────────────

interface VipCardProps {
    role: string;
    occupant: string | null;
    canPlace: boolean;
    onPlace: () => void;
    size: 'large' | 'medium' | 'small';
}

function VipCard({ role, occupant, canPlace, onPlace, size }: VipCardProps) {
    const w = size === 'large' ? 110 : size === 'medium' ? 80 : 44;
    const h = size === 'large' ? 90 : size === 'medium' ? 70 : 50;
    const fontSize = size === 'large' ? 11 : size === 'small' ? 9 : 10;

    return (
        <div
            onClick={() => canPlace && onPlace()}
            style={{
                width: w,
                height: h,
                border: `1px solid ${canPlace ? '#aaa' : '#444'}`,
                background: occupant !== null ? '#2a2a3a' : '#181818',
                cursor: canPlace ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 3px',
                boxSizing: 'border-box',
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    fontSize,
                    color: '#aaa',
                    textAlign: 'center',
                    lineHeight: 1.2,
                }}
            >
                {size === 'small' ? role.slice(0, 4) : role}
            </div>
            <div
                style={{
                    fontSize: size === 'small' ? 9 : 11,
                    color:
                        occupant !== null ? '#ccf' : canPlace ? '#666' : '#333',
                    textAlign: 'center',
                }}
            >
                {occupant !== null
                    ? `P${occupant}`
                    : canPlace
                      ? '+ place'
                      : '—'}
            </div>
        </div>
    );
}

// ─── VIP section (one hive) ───────────────────────────────────────────────────
// TODO rename to HiveSection
interface VipSectionProps {
    hiveId: HiveId;
    position: WheelPosition;
    G: WotsState;
    ctx: any;
    moves: any;
    playerID: string;
    isActive: boolean;
}

function VipSection({
    hiveId,
    position,
    G,
    ctx,
    moves,
    playerID,
    isActive,
}: VipSectionProps) {
    const isCurrent = position === 'current';
    const isBottom = position === 'bottom';
    const size = isCurrent ? 'large' : isBottom ? 'medium' : 'small';
    const color = HIVE_COLOR[hiveId];
    const bg = HIVE_BG[hiveId];
    const needed = agentsPerTurn(ctx.numPlayers);
    const player = G.players[playerID];
    const canStillPlace =
        isActive &&
        ctx.phase === 'deployAgents' &&
        (player?.agentsOnBoard ?? 0) < needed;

    const vips = G.hiveSquares[hiveId];

    return (
        <div
            style={{
                background: bg,
                border: `1px solid ${color}`,
                padding: isCurrent ? '6px 8px' : '4px',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    fontSize: isCurrent ? 13 : 10,
                    fontWeight: 'bold',
                    color,
                    marginBottom: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {isCurrent
                    ? HIVE_NAMES[hiveId]
                    : HIVE_NAMES[hiveId].split(' ')[0]}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: isCurrent || isBottom ? 'row' : 'column',
                    gap: 3,
                    flex: 1,
                    overflow: 'hidden',
                    alignItems: isCurrent || isBottom ? 'flex-start' : 'center',
                }}
            >
                {VIP_ROLES.map((role, i) => (
                    <VipCard
                        key={i}
                        role={role}
                        occupant={vips[i]}
                        canPlace={canStillPlace && vips[i] === null}
                        onPlace={() => moves.placeAgent(hiveId, i)}
                        size={size}
                    />
                ))}
            </div>
            {!isCurrent && (
                <div
                    style={{
                        fontSize: 9,
                        color: color + '88',
                        marginTop: 2,
                        textAlign: 'center',
                    }}
                >
                    Supply ↓
                </div>
            )}
        </div>
    );
}

// ─── Between Rounds section ───────────────────────────────────────────────────

function BetweenRoundsSection({ round }: { round: number }) {
    const steps = [
        'Deploy Agents',
        'Hive Turns',
        'Discard to 5',
        'Swap Loyalties',
    ];
    return (
        <div
            style={{
                background: '#111',
                border: '1px solid white',
                padding: '6px',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                overflow: 'hidden',
            }}
        >
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#aaa' }}>
                Round {round} / 4
            </div>
            <div style={{ fontSize: 9, color: 'white', marginBottom: 2 }}>
                Between Rounds
            </div>
            {steps.map((s) => (
                <div
                    key={s}
                    style={{
                        fontSize: 9,
                        color: 'white',
                        padding: '2px 4px',
                        border: '1px solid #2a2a2a',
                    }}
                >
                    {s}
                </div>
            ))}
        </div>
    );
}

// ─── Map ──────────────────────────────────────────────────────────────────────

function MapCenter({ G }: { G: WotsState }) {
    return (
        <div style={{ position: 'relative', lineHeight: 0 }}>
            <img
                src="image/wots-map-backdrop.png"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                alt="World map"
            />
            {/* Scoreboard overlay */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '8%',
                    left: '54%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid white',
                    padding: '4px 10px',
                    fontSize: 11,
                    color: '#ccc',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                }}
            >
                {HIVE_IDS.map((h) => {
                    const onBoard = Object.values(G.territories).reduce(
                        (s, t) => s + (t.troops[h] ?? 0),
                        0,
                    );
                    return (
                        <div key={h} style={{ color: HIVE_COLOR[h] }}>
                            {HIVE_NAMES[h].split(' ')[0]}: {onBoard} troops
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Below-fold sections ──────────────────────────────────────────────────────

const belowSectionStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #1e1e1e',
};

const sectionHeadStyle: React.CSSProperties = {
    margin: '0 0 8px',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
};

function Scoreboard({ G, ctx }: { G: WotsState; ctx: any }) {
    const harbingersPerHive = Object.fromEntries(
        HIVE_IDS.map((h) => [
            h,
            Object.values(G.territories)
                .filter((t) => {
                    const my = t.troops[h] ?? 0;
                    if (my > 0)
                        return !HIVE_IDS.some(
                            (o) => o !== h && (t.troops[o] ?? 0) >= my,
                        );
                    return (
                        t.homeHive === h &&
                        HIVE_IDS.every((o) => (t.troops[o] ?? 0) === 0)
                    );
                })
                .reduce((s, t) => s + t.harbingerCount, 0),
        ]),
    );

    return (
        <section style={belowSectionStyle}>
            <h3 style={sectionHeadStyle}>Scoreboard</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div>
                    <div
                        style={{
                            fontSize: 11,
                            color: 'white',
                            marginBottom: 4,
                        }}
                    >
                        Harbingers controlled
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {HIVE_IDS.map((h) => (
                            <div
                                key={h}
                                style={{ fontSize: 12, color: HIVE_COLOR[h] }}
                            >
                                {HIVE_NAMES[h].split(' ')[0]}:{' '}
                                {harbingersPerHive[h]} ⚑
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 11,
                            color: 'white',
                            marginBottom: 4,
                        }}
                    >
                        Player scores (if game ended now)
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {Array.from({ length: ctx.numPlayers }, (_, i) =>
                            String(i),
                        ).map((pid) => (
                            <div
                                key={pid}
                                style={{ fontSize: 12, color: '#ccc' }}
                            >
                                P{pid}: {scoreFor(G, pid)} pts
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface PlayerAreaProps {
    G: WotsState;
    ctx: any;
    viewingPlayerID: string;
    subjectPlayerID: string;
    isTurn: boolean;
}

function PlayerArea({
    G,
    ctx,
    viewingPlayerID,
    subjectPlayerID,
    isTurn,
}: PlayerAreaProps) {
    const isSelf = viewingPlayerID === subjectPlayerID;
    const player = G.players[subjectPlayerID];
    const isFirst = G.firstPlayer === subjectPlayerID;

    return (
        <div
            style={{
                border: `1px solid ${isTurn ? '#8f8' : '#333'}`,
                padding: '8px 12px',
                background: '#0f0f0f',
                flex: '1 1 200px',
                minWidth: 180,
            }}
        >
            <div
                style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: isTurn ? '#8f8' : '#bbb',
                    marginBottom: 6,
                }}
            >
                Player {subjectPlayerID}
                {isFirst && (
                    <span
                        style={{ fontSize: 10, color: '#fa0', marginLeft: 8 }}
                    >
                        1st
                    </span>
                )}
                {isTurn && (
                    <span
                        style={{ fontSize: 10, color: '#8f8', marginLeft: 8 }}
                    >
                        ← turn
                    </span>
                )}
            </div>

            <div style={{ fontSize: 11, color: 'white', marginBottom: 4 }}>
                Loyalty tokens
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'wrap',
                    marginBottom: 8,
                }}
            >
                {player?.loyaltyTokens.map((token, i) => (
                    <div
                        key={i}
                        title={
                            isSelf
                                ? `${LOYALTY_MULTIPLIERS[i]}× ${HIVE_NAMES[token.hiveId]}`
                                : undefined
                        }
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background:
                                isSelf || token.revealed
                                    ? HIVE_BG[token.hiveId]
                                    : '#1a1a1a',
                            border: `2px solid ${isSelf || token.revealed ? HIVE_COLOR[token.hiveId] : 'white'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color:
                                isSelf || token.revealed
                                    ? HIVE_COLOR[token.hiveId]
                                    : 'white',
                            cursor: isSelf ? 'help' : 'default',
                        }}
                    >
                        {isSelf || token.revealed
                            ? `${LOYALTY_MULTIPLIERS[i]}×`
                            : '?'}
                    </div>
                ))}
            </div>

            <div
                style={{
                    fontSize: 11,
                    color: 'white',
                    marginBottom: isSelf ? 6 : 0,
                }}
            >
                Cards:{' '}
                <span style={{ color: '#999' }}>
                    {isSelf ? '— (none yet)' : '0'}
                </span>
            </div>

            {isSelf && (
                <div style={{ fontSize: 11, color: 'white' }}>
                    Next agent name:{' '}
                    <select
                        style={{
                            background: '#1a1a1a',
                            color: '#aaa',
                            border: '1px solid white',
                            fontSize: 11,
                        }}
                    >
                        <option>Agent A</option>
                        <option>Agent B</option>
                        <option>Agent C</option>
                    </select>
                </div>
            )}
        </div>
    );
}

function CubeReserves({ G }: { G: WotsState }) {
    return (
        <section style={belowSectionStyle}>
            <h3 style={sectionHeadStyle}>Cubes Off-Board</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {HIVE_IDS.map((h) => {
                    const onBoard = Object.values(G.territories).reduce(
                        (s, t) => s + (t.troops[h] ?? 0),
                        0,
                    );
                    return (
                        <div
                            key={h}
                            style={{ fontSize: 12, color: HIVE_COLOR[h] }}
                        >
                            {HIVE_NAMES[h].split(' ')[0]}:{' '}
                            {TOTAL_CUBES[h] - onBoard}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function DeckCounts() {
    return (
        <section style={belowSectionStyle}>
            <h3 style={sectionHeadStyle}>Cards in Decks</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {HIVE_IDS.map((h) => (
                    <div key={h} style={{ fontSize: 12, color: HIVE_COLOR[h] }}>
                        {HIVE_NAMES[h].split(' ')[0]}: —
                    </div>
                ))}
            </div>
        </section>
    );
}

function LogPane() {
    return (
        <section style={belowSectionStyle}>
            <h3 style={sectionHeadStyle}>Log</h3>
            <div
                style={{
                    height: 100,
                    background: '#080808',
                    border: '1px solid #222',
                    padding: '6px 8px',
                    fontSize: 11,
                    color: 'white',
                    overflowY: 'auto',
                }}
            >
                Game started.
            </div>
        </section>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function WotsBoard({
    G,
    ctx,
    moves,
    playerID,
    isActive,
}: BoardProps<WotsState>) {
    const myID = playerID ?? '0';
    const needed = agentsPerTurn(ctx.numPlayers);
    const player = G.players[myID];
    const agentsLeft = needed - (player?.agentsOnBoard ?? 0);
    const isDeployPhase = ctx.phase === 'deployAgents';

    const statusText =
        isDeployPhase && ctx.currentPlayer === myID
            ? `Your turn — place ${agentsLeft} more agent${agentsLeft !== 1 ? 's' : ''}`
            : isDeployPhase
              ? `Waiting for Player ${ctx.currentPlayer}`
              : 'Hive Turns resolving…';

    const sharedProps = { G, ctx, moves, playerID: myID, isActive };

    return (
        <div
            style={{
                background: '#0d0d0d',
                color: '#ddd',
                fontFamily: 'sans-serif',
                minWidth: 600,
            }}
        >
            {/* Status bar */}
            <div
                style={{
                    padding: '6px 12px',
                    background: '#111',
                    borderBottom: '1px solid #2a2a2a',
                    fontSize: 13,
                    color: isActive && isDeployPhase ? '#8f8' : '#888',
                }}
            >
                <strong style={{ color: '#ccc' }}>
                    Round {G.round}/4 · {ctx.phase}
                </strong>
                {' — '}
                {statusText}
            </div>

            {/* Round wheel + map */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateAreas: `
                        "tl current tr"
                        "tl map     tr"
                        "bl bottom  br"
                    `,
                    gridTemplateColumns: '190px 1fr 190px',
                    gridTemplateRows: '160px auto 160px',
                    gap: 3,
                    padding: 3,
                    maxWidth: 1100,
                    margin: '0 auto',
                }}
            >
                <div style={{ gridArea: 'tl' }}>
                    <BetweenRoundsSection round={G.round} />
                </div>
                <div style={{ gridArea: 'current' }}>
                    <VipSection
                        hiveId="eu"
                        position="current"
                        {...sharedProps}
                    />
                </div>
                <div style={{ gridArea: 'tr' }}>
                    <VipSection
                        hiveId="humanist"
                        position="tr"
                        {...sharedProps}
                    />
                </div>
                <div style={{ gridArea: 'map' }}>
                    <MapCenter G={G} />
                </div>
                <div style={{ gridArea: 'bl' }}>
                    <VipSection hiveId="mason" position="bl" {...sharedProps} />
                </div>
                <div style={{ gridArea: 'bottom' }}>
                    <VipSection
                        hiveId="mitsubishi"
                        position="bottom"
                        {...sharedProps}
                    />
                </div>
                <div style={{ gridArea: 'br' }}>
                    <VipSection
                        hiveId="cousins"
                        position="br"
                        {...sharedProps}
                    />
                </div>
            </div>

            {/* Below-fold: scroll down to see */}
            <div
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    borderTop: '2px solid #1e1e1e',
                    marginTop: 3,
                }}
            >
                <Scoreboard G={G} ctx={ctx} />

                <section style={belowSectionStyle}>
                    <h3 style={sectionHeadStyle}>Player Areas</h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {Array.from({ length: ctx.numPlayers }, (_, i) =>
                            String(i),
                        ).map((pid) => (
                            <PlayerArea
                                key={pid}
                                G={G}
                                ctx={ctx}
                                viewingPlayerID={myID}
                                subjectPlayerID={pid}
                                isTurn={ctx.currentPlayer === pid}
                            />
                        ))}
                    </div>
                </section>

                <CubeReserves G={G} />
                <DeckCounts />
                <LogPane />

                {ctx.gameover && (
                    <section
                        style={{ ...belowSectionStyle, borderColor: '#c84' }}
                    >
                        <h3 style={{ ...sectionHeadStyle, color: '#c84' }}>
                            Game Over
                        </h3>
                        <div>Winner: Player {ctx.gameover.winner}</div>
                        {Object.entries(
                            ctx.gameover.scores as Record<string, number>,
                        ).map(([pid, score]) => (
                            <div
                                key={pid}
                                style={{ fontSize: 12, marginTop: 4 }}
                            >
                                Player {pid}: {score} pts
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

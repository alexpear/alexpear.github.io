import React from 'react';
import type { BoardProps } from 'boardgame.io/react';
import {
    WotsState,
    HIVE_IDS,
    HIVE_NAMES,
    SQUARE_ROLES,
    LOYALTY_MULTIPLIERS,
    agentsPerTurn,
    scoreFor,
} from './game';

const HIVE_COLORS: Record<string, string> = {
    eu: '#1a3a6b',
    humanist: '#8b7a00',
    cousins: '#1a6b5a',
    mitsubishi: '#6b1a1a',
    mason: '#4a1a6b',
};

export function WotsBoard({
    G,
    ctx,
    moves,
    playerID,
    isActive,
}: BoardProps<WotsState>) {
    const myID = playerID ?? '0';
    const player = G.players[myID];
    const needed = agentsPerTurn(ctx.numPlayers);
    const isDeployPhase = ctx.phase === 'deployAgents';

    return (
        <div
            style={{
                fontFamily: 'sans-serif',
                padding: '12px',
                width: '360px',
                background: '#111',
                color: '#ddd',
                border: '1px solid #444',
            }}
        >
            <h3 style={{ margin: '0 0 8px', color: '#adf' }}>
                Whispers of the Stars — Player {myID}
            </h3>

            <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                <span>Round {G.round} / 4</span>
                {'  '}
                <span style={{ color: '#aaa' }}>Phase: {ctx.phase}</span>
                {'  '}
                {isActive && isDeployPhase && (
                    <span style={{ color: '#8f8', fontWeight: 'bold' }}>
                        Your turn
                    </span>
                )}
            </div>

            {/* Hive Banners */}
            <div style={{ marginBottom: '12px' }}>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#aaa',
                        marginBottom: '4px',
                    }}
                >
                    HIVE BANNERS — click a square to place agent (
                    {player?.agentsOnBoard ?? 0}/{needed})
                </div>
                {HIVE_IDS.map((hiveId) => (
                    <div
                        key={hiveId}
                        style={{
                            marginBottom: '4px',
                            padding: '4px',
                            background: HIVE_COLORS[hiveId] + '55',
                            border: '1px solid ' + HIVE_COLORS[hiveId],
                        }}
                    >
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginBottom: '3px',
                            }}
                        >
                            {HIVE_NAMES[hiveId]}
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {SQUARE_ROLES.map((role, i) => {
                                const occupant = G.hiveSquares[hiveId][i];
                                const canPlace =
                                    isActive &&
                                    isDeployPhase &&
                                    occupant === null &&
                                    (player?.agentsOnBoard ?? 0) < needed;
                                return (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            canPlace &&
                                            moves.placeAgent(hiveId, i)
                                        }
                                        disabled={!canPlace}
                                        title={role}
                                        style={{
                                            flex: 1,
                                            padding: '3px 0',
                                            fontSize: '11px',
                                            background:
                                                occupant !== null
                                                    ? '#556'
                                                    : '#222',
                                            color:
                                                occupant !== null
                                                    ? '#ccf'
                                                    : '#888',
                                            border: '1px solid #555',
                                            cursor: canPlace
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                    >
                                        {role.slice(0, 4)}
                                        {occupant !== null
                                            ? `·P${occupant}`
                                            : ''}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Territory Table */}
            <div style={{ marginBottom: '12px' }}>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#aaa',
                        marginBottom: '4px',
                    }}
                >
                    TERRITORIES
                </div>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '11px',
                    }}
                >
                    <thead>
                        <tr style={{ color: '#888' }}>
                            <th
                                style={{
                                    textAlign: 'left',
                                    paddingRight: '4px',
                                }}
                            >
                                Name
                            </th>
                            {HIVE_IDS.map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        textAlign: 'center',
                                        width: '28px',
                                    }}
                                >
                                    {h.slice(0, 3)}
                                </th>
                            ))}
                            <th style={{ textAlign: 'center', width: '20px' }}>
                                ⚑
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(G.territories).map((t) => (
                            <tr key={t.id}>
                                <td style={{ paddingRight: '4px' }}>
                                    {t.name}
                                    {t.homeHive ? (
                                        <span style={{ color: '#666' }}>
                                            {' '}
                                            ({t.homeHive.slice(0, 3)})
                                        </span>
                                    ) : null}
                                </td>
                                {HIVE_IDS.map((h) => (
                                    <td
                                        key={h}
                                        style={{
                                            textAlign: 'center',
                                            color:
                                                (t.troops[h] ?? 0) > 0
                                                    ? HIVE_COLORS[h] ===
                                                      undefined
                                                        ? '#fff'
                                                        : '#ddf'
                                                    : '#333',
                                        }}
                                    >
                                        {t.troops[h] ?? 0}
                                    </td>
                                ))}
                                <td
                                    style={{
                                        textAlign: 'center',
                                        color: '#ff8',
                                    }}
                                >
                                    {t.harbingerCount > 0
                                        ? t.harbingerCount
                                        : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Loyalty Tokens */}
            <div>
                <div
                    style={{
                        fontSize: '12px',
                        color: '#aaa',
                        marginBottom: '4px',
                    }}
                >
                    YOUR LOYALTY (peek only)
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {player?.loyaltyTokens.map((token, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '3px 6px',
                                background: HIVE_COLORS[token.hiveId] + '88',
                                border:
                                    '1px solid ' +
                                    (token.revealed ? '#ff8' : '#555'),
                                fontSize: '11px',
                                borderRadius: '3px',
                            }}
                        >
                            <span style={{ color: '#ff8' }}>
                                {LOYALTY_MULTIPLIERS[i]}×
                            </span>{' '}
                            {token.revealed
                                ? HIVE_NAMES[token.hiveId]
                                : token.hiveId}
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Over */}
            {ctx.gameover && (
                <div
                    style={{
                        marginTop: '16px',
                        padding: '10px',
                        background: '#222',
                        border: '1px solid #ff8',
                    }}
                >
                    <div
                        style={{
                            color: '#ff8',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                        }}
                    >
                        GAME OVER — Player {ctx.gameover.winner} wins!
                    </div>
                    {Object.entries(
                        ctx.gameover.scores as Record<string, number>,
                    ).map(([pid, score]) => (
                        <div key={pid} style={{ fontSize: '13px' }}>
                            Player {pid}: {score} points
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

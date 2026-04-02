import { INVALID_MOVE } from 'boardgame.io/core';
import type { Game } from 'boardgame.io';

export const HIVE_IDS = ['eu', 'humanist', 'cousins', 'mitsubishi', 'mason'] as const;
export type HiveId = (typeof HIVE_IDS)[number];

export const HIVE_NAMES: Record<HiveId, string> = {
    eu: 'European Union',
    humanist: 'Humanist Hive',
    cousins: 'Cousins Collective',
    mitsubishi: 'Mitsubishi Corporation',
    mason: 'Masonic Empire',
};

// Loyalty slot multipliers in order (index 0 = most loyal)
export const LOYALTY_MULTIPLIERS = [4, 3, 2, 0, -1] as const;
export type LoyaltyMultiplier = (typeof LOYALTY_MULTIPLIERS)[number];

// Each hive has 4 squares players can place agents on
export const SQUARE_ROLES = ['Logistics', 'Opposition', 'Marshal', 'Leader'] as const;
export type SquareRole = (typeof SQUARE_ROLES)[number];

export interface Territory {
    id: string;
    name: string;
    troops: Partial<Record<HiveId, number>>;
    homeHive: HiveId | null;
    harbingerCount: number;
    adjacentTo: string[];
}

export interface LoyaltyToken {
    hiveId: HiveId;
    multiplier: LoyaltyMultiplier;
    revealed: boolean;
}

export interface PlayerState {
    loyaltyTokens: LoyaltyToken[]; // index maps to LOYALTY_MULTIPLIERS
    agentsOnBoard: number;
}

export interface WotsState {
    territories: Record<string, Territory>;
    // hiveSquares[hiveId][squareIndex] = playerID or null
    hiveSquares: Record<HiveId, (string | null)[]>;
    players: Record<string, PlayerState>;
    round: number;
    firstPlayer: string;
}

export function agentsPerTurn(numPlayers: number): number {
    return numPlayers === 2 ? 3 : 2;
}

// Whether a hive controls a territory (has most troops, or is home hive with no enemies)
function controlledBy(territory: Territory, hiveId: HiveId): boolean {
    const myTroops = territory.troops[hiveId] ?? 0;
    if (myTroops > 0) {
        return !Object.entries(territory.troops).some(
            ([h, n]) => h !== hiveId && (n ?? 0) >= myTroops,
        );
    }
    return (
        territory.homeHive === hiveId &&
        Object.values(territory.troops).every((n) => (n ?? 0) === 0)
    );
}

function harbingersControlledBy(G: WotsState, hiveId: HiveId): number {
    return Object.values(G.territories).reduce(
        (sum, t) => sum + (controlledBy(t, hiveId) ? t.harbingerCount : 0),
        0,
    );
}

export function scoreFor(G: WotsState, playerID: string): number {
    const player = G.players[playerID];
    if (!player) return 0;
    return player.loyaltyTokens.reduce(
        (sum, token) => sum + token.multiplier * harbingersControlledBy(G, token.hiveId),
        0,
    );
}

const INITIAL_TERRITORIES: Record<string, Territory> = {
    paris: {
        id: 'paris',
        name: 'Paris',
        troops: { mason: 2 },
        homeHive: 'mason',
        harbingerCount: 1,
        adjacentTo: ['london', 'madrid', 'rome'],
    },
    london: {
        id: 'london',
        name: 'London',
        troops: { eu: 2 },
        homeHive: 'eu',
        harbingerCount: 1,
        adjacentTo: ['paris'],
    },
    madrid: {
        id: 'madrid',
        name: 'Madrid',
        troops: { humanist: 2 },
        homeHive: 'humanist',
        harbingerCount: 0,
        adjacentTo: ['paris', 'rome'],
    },
    rome: {
        id: 'rome',
        name: 'Rome',
        troops: { cousins: 1 },
        homeHive: 'cousins',
        harbingerCount: 1,
        adjacentTo: ['paris', 'madrid', 'istanbul'],
    },
    istanbul: {
        id: 'istanbul',
        name: 'Istanbul',
        troops: { mitsubishi: 1 },
        homeHive: 'mitsubishi',
        harbingerCount: 0,
        adjacentTo: ['rome', 'tokyo'],
    },
    tokyo: {
        id: 'tokyo',
        name: 'Tokyo',
        troops: { mitsubishi: 3 },
        homeHive: 'mitsubishi',
        harbingerCount: 2,
        adjacentTo: ['istanbul'],
    },
};

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function emptyHiveSquares(): Record<HiveId, (string | null)[]> {
    return Object.fromEntries(HIVE_IDS.map((h) => [h, [null, null, null, null]])) as Record<
        HiveId,
        (string | null)[]
    >;
}

export const WotsGame: Game<WotsState> = {
    name: 'wots',

    setup: ({ ctx }) => {
        const players: Record<string, PlayerState> = {};
        for (let i = 0; i < ctx.numPlayers; i++) {
            const shuffledHives = shuffle([...HIVE_IDS]);
            players[String(i)] = {
                loyaltyTokens: LOYALTY_MULTIPLIERS.map((multiplier, idx) => ({
                    hiveId: shuffledHives[idx],
                    multiplier,
                    revealed: false,
                })),
                agentsOnBoard: 0,
            };
        }
        return {
            territories: INITIAL_TERRITORIES,
            hiveSquares: emptyHiveSquares(),
            players,
            round: 1,
            firstPlayer: '0',
        };
    },

    moves: {
        placeAgent: ({ G, ctx, playerID }, hiveId: HiveId, squareIndex: number) => {
            if (!HIVE_IDS.includes(hiveId)) return INVALID_MOVE;
            if (squareIndex < 0 || squareIndex > 3) return INVALID_MOVE;
            if (G.hiveSquares[hiveId][squareIndex] !== null) return INVALID_MOVE;

            const player = G.players[playerID];
            const needed = agentsPerTurn(ctx.numPlayers);
            if (player.agentsOnBoard >= needed) return INVALID_MOVE;

            G.hiveSquares[hiveId][squareIndex] = playerID;
            player.agentsOnBoard += 1;
        },
    },

    turn: {
        maxMoves: 1,
    },

    phases: {
        deployAgents: {
            start: true,
            turn: {
                maxMoves: 1,
            },
            endIf: ({ G, ctx }) => {
                const needed = agentsPerTurn(ctx.numPlayers);
                return Object.values(G.players).every((p) => p.agentsOnBoard >= needed);
            },
            next: 'hiveTurns',
        },
        hiveTurns: {
            // TODO: resolve actual hive actions (move troops, attack, draw cards)
            onBegin: ({ G }) => {
                G.hiveSquares = emptyHiveSquares();
                for (const player of Object.values(G.players)) {
                    player.agentsOnBoard = 0;
                }
                G.round += 1;
            },
            endIf: () => true, // stub: skip hive turns for now
            next: 'deployAgents',
        },
    },

    endIf: ({ G, ctx }) => {
        if (G.round > 4) {
            const scores: Record<string, number> = {};
            for (let i = 0; i < ctx.numPlayers; i++) {
                scores[String(i)] = scoreFor(G, String(i));
            }
            const winner = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
            return { scores, winner };
        }
    },
};

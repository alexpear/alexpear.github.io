import React from 'react';
import ReactDOM from 'react-dom/client';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { WotsGame } from './game';
import { WotsBoard } from './board';

const WotsClient = Client({
    game: WotsGame,
    board: WotsBoard,
    multiplayer: Local(),
    debug: false,
    numPlayers: 2,
});

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(
    <div
        style={{
            display: 'flex',
            gap: '24px',
            padding: '20px',
            background: '#0a0a0a',
            minHeight: '100vh',
            alignItems: 'flex-start',
        }}
    >
        <WotsClient playerID="0" />
        <WotsClient playerID="1" />
    </div>,
);

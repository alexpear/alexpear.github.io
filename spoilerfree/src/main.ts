// TODO rename main.ts files more specifically.

const Util = require('../../util/util');

const LEAGUES = [
    { name: 'NWSL Women', id: 254 },
    { name: 'NWSL Challenge Cup', id: 255 },
    { name: 'Liga MX Femenil', id: 513 },
    { name: 'UWCL', id: 545 },
    { name: 'WSL (England)', id: 188 },
];

interface Team {
    name: string;
    logo: string;
}

// TODO rename types.
interface Fixture {
    fixture: {
        id: number;
        date: string;
        venue: { name: string; city: string };
        status: { short: string; long: string };
    };
    league: { name: string };
    teams: { home: Team; away: Team };
    goals: { home?: number; away?: number };
}

class SpoilerFreeApp {
    apiKey: string;
    selectedLeague: { name: string; id: number } | undefined;
    selectedFixture: Fixture | undefined;

    constructor() {
        this.apiKey = sessionStorage.getItem('sfApiKey') || '';
        this.render();
    }

    render(): void {
        const input = document.getElementById(
            'api-key-input',
        ) as HTMLInputElement;

        document
            .getElementById('save-key-btn')!
            .addEventListener('click', () => {
                const val = input.value.trim();
                if (!val) return;
                this.apiKey = val;
                sessionStorage.setItem('sfApiKey', val);
                Util.logDebug(`api key saved to session storage.`);
            });

        for (const league of LEAGUES) {
            const btn = document.createElement('button');
            btn.textContent = league.name;
            btn.className = 'league-btn';
            btn.addEventListener('click', () => this.selectLeague(league));
            document.getElementById('league-picker')!.appendChild(btn);
        }
    }

    async selectLeague(league: { name: string; id: number }): Promise<void> {
        this.selectedLeague = league;
        document.getElementById('match-detail')!.style.display = 'none';
        document.getElementById('match-list')!.innerHTML = '<p>Loading...</p>';

        for (const btn of document.querySelectorAll<HTMLButtonElement>(
            '.league-btn',
        )) {
            btn.classList.toggle('active', btn.textContent === league.name);
        }

        Util.logDebug(`Selected league: ${league.name} (ID: ${league.id})`);

        try {
            const fixtures = await this.fetchFixtures(league.id);
            this.renderMatchList(fixtures);
        } catch (e) {
            document.getElementById('match-list')!.innerHTML =
                `<p class="error">Error loading matches: ${e}</p>`;
        }
    }

    async fetchFixtures(leagueId: number): Promise<Fixture[]> {
        if (!this.apiKey) {
            throw new Error('No API key set. Please enter your API key above.');
        }
        const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2024`;
        const res = await fetch(url, {
            headers: { 'x-rapidapi-key': this.apiKey },
        });
        if (!res.ok) {
            // Could debug here to research better error support.
            throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        for (const key in data.error) {
            Util.error(data.error[key]);
        }

        Util.logDebug(
            `Fetched fixtures for league ID ${leagueId}: ${data.response}`,
        );

        return data.response as Fixture[];
    }

    renderMatchList(fixtures: Fixture[]): void {
        const list = document.getElementById('match-list')!;
        list.innerHTML = '';

        if (!fixtures || fixtures.length === 0) {
            list.innerHTML = '<p>No recent matches found.</p>';
            return;
        }

        for (const fixture of fixtures) {
            const card = document.createElement('div');
            card.className = 'match-card';

            const date = new Date(fixture.fixture.date);
            const dateStr = date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });

            card.innerHTML = `
                <span class="team home-team">${fixture.teams.home.name}</span>
                <span class="vs">vs</span>
                <span class="team away-team">${fixture.teams.away.name}</span>
                <span class="match-date">${dateStr}</span>
            `;

            card.addEventListener('click', () => this.selectMatch(fixture));
            list.appendChild(card);
        }
    }

    selectMatch(fixture: Fixture): void {
        this.selectedFixture = fixture;
        this.renderMatchDetail(fixture);
    }

    renderMatchDetail(fixture: Fixture): void {
        const detail = document.getElementById('match-detail')!;
        detail.style.display = 'block';

        const date = new Date(fixture.fixture.date);
        const dateStr = date.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        const timeStr = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });

        const venue = fixture.fixture.venue;
        const venueStr = venue?.name
            ? `${venue.name}, ${venue.city}`
            : 'Venue unknown';

        detail.innerHTML = `
            <div class="detail-header">
                <button id="close-detail">✕</button>
                <span class="detail-league">${fixture.league.name}</span>
            </div>
            <div class="detail-teams">
                <div class="detail-team">${fixture.teams.home.name}</div>
                <div class="detail-separator">vs</div>
                <div class="detail-team">${fixture.teams.away.name}</div>
            </div>
            <div class="detail-meta">
                <div>${dateStr} · ${timeStr}</div>
                <div>${venueStr}</div>
                <div class="status">${fixture.fixture.status.long}</div>
            </div>
            <div class="score-hidden">[ Score hidden — click to reveal ]</div>
            <div class="score-revealed" style="display:none">
                ${fixture.teams.home.name} ${fixture.goals.home ?? '?'} – ${fixture.goals.away ?? '?'} ${fixture.teams.away.name}
            </div>
            <div class="action-buttons">
                <!-- Future action buttons placeholder -->
            </div>
        `;

        detail
            .querySelector<HTMLButtonElement>('#close-detail')!
            .addEventListener('click', () => {
                detail.style.display = 'none';
            });

        detail
            .querySelector<HTMLDivElement>('.score-hidden')!
            .addEventListener('click', () => {
                detail.querySelector<HTMLDivElement>(
                    '.score-hidden',
                )!.style.display = 'none';
                detail.querySelector<HTMLDivElement>(
                    '.score-revealed',
                )!.style.display = 'block';
            });

        detail.scrollIntoView({ behavior: 'smooth' });
    }
}

new SpoilerFreeApp();

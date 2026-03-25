// TODO rename main.ts files more specifically.

const LEAGUES = [
    { name: 'NWSL Women', id: 4521 },
    { name: 'NWSL Challenge Cup', id: 5178 },
];

const SEASON = new Date().getFullYear();

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123';
/** A limitation of thesportsdb.com is that it only tells us the 2 scores & the winner. It doesn't tell us when each goal was. It's possible this info is on NWSL's official site via scraping... */

interface SdbEvent {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    dateEvent: string;
    strTime: string;
    strVenue: string;
    strCity: string;
    intHomeScore?: string;
    intAwayScore?: string;
    strStatus: string;
    strLeague: string;
}

class SpoilerFreeApp {
    selectedLeague: { name: string; id: number } | undefined;
    selectedEvent: SdbEvent | undefined;
    eventStatuses: Record<string, 'seen'>;

    constructor() {
        this.render();

        this.eventStatuses = JSON.parse(
            localStorage.getItem('spoilerfree') || '{}',
        );
    }

    render(): void {
        for (const league of LEAGUES) {
            const btn = document.createElement('button');
            btn.textContent = league.name;
            btn.className = 'league-btn';
            btn.addEventListener('click', () => this.selectLeague(league));
            document.getElementById('league-picker')!.appendChild(btn);
        }

        this.selectLeague(LEAGUES[0]); // Default to NWSL
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

        try {
            const events = await this.fetchEvents(league.id);
            this.renderMatchList(events);
        } catch (e) {
            document.getElementById('match-list')!.innerHTML =
                `<p class="error">Error loading matches: ${e}</p>`;
        }
    }

    async fetchEvents(leagueId: number): Promise<SdbEvent[]> {
        const url = `${SPORTSDB_BASE}/eventsseason.php?id=${leagueId}&s=${SEASON}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        return (data.events || []) as SdbEvent[];
    }

    renderMatchList(events: SdbEvent[]): void {
        const list = document.getElementById('match-list')!;
        list.innerHTML = '';

        if (events.length === 0) {
            list.innerHTML = '<p>No matches found.</p>';
            return;
        }

        for (const event of events) {
            const card = document.createElement('div');
            const seen = this.eventStatuses[event.idEvent] === 'seen';
            card.className = 'match-card' + (seen ? ' seen' : '');
            card.dataset.eventId = event.idEvent;

            const dateStr = new Date(
                event.dateEvent + 'T12:00:00',
            ).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });

            card.innerHTML = `
                <span class="team home-team">${event.strHomeTeam}</span>
                <span class="vs">vs</span>
                <span class="team away-team">${event.strAwayTeam}</span>
                <span class="match-date">${dateStr}</span>
                ${seen ? '<span class="seen-badge">seen</span>' : ''}
            `;

            card.addEventListener('click', () => this.selectMatch(event));
            list.appendChild(card);
        }
    }

    selectMatch(event: SdbEvent): void {
        this.selectedEvent = event;
        this.renderMatchDetail(event);
    }

    markAsSeen(idEvent: string): void {
        this.eventStatuses[idEvent] = 'seen';
        localStorage.setItem('spoilerfree', JSON.stringify(this.eventStatuses));

        const card = document.querySelector<HTMLElement>(
            `[data-event-id="${idEvent}"]`,
        );
        if (card) {
            card.classList.add('seen');
            if (!card.querySelector('.seen-badge')) {
                const badge = document.createElement('span');
                badge.className = 'seen-badge';
                badge.textContent = 'seen';
                card.appendChild(badge);
            }
        }
    }

    renderMatchDetail(event: SdbEvent): void {
        const detail = document.getElementById('match-detail')!;
        detail.style.display = 'block';

        const dateStr = new Date(
            event.dateEvent + 'T12:00:00',
        ).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        const timeStr = event.strTime
            ? new Date(
                  `${event.dateEvent}T${event.strTime}`,
              ).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : 'Time TBD';

        const venueStr = event.strVenue
            ? `${event.strVenue}${event.strCity ? ', ' + event.strCity : ''}`
            : 'Venue unknown';

        const hasScore =
            event.intHomeScore !== null && event.intHomeScore !== undefined;

        detail.innerHTML = `
            <div class="detail-header">
                <button id="close-detail">✕</button>
                <span class="detail-league">${event.strLeague}</span>
            </div>
            <div class="detail-teams">
                <div class="detail-team">${event.strHomeTeam}</div>
                <div class="detail-separator">vs</div>
                <div class="detail-team">${event.strAwayTeam}</div>
            </div>
            <div class="detail-meta">
                <div>${dateStr} · ${timeStr}</div>
                <div>${venueStr}</div>
                <div class="status">${event.strStatus || ''}</div>
            </div>
            ${
                hasScore
                    ? `<div class="score-hidden">[ Score hidden — click to reveal ]</div>
                       <div class="score-revealed" style="display:none">
                           ${event.strHomeTeam} ${event.intHomeScore} – ${event.intAwayScore} ${event.strAwayTeam}
                       </div>`
                    : `<div class="no-score">No score yet</div>`
            }
            <div class="action-buttons">
                <button id="mark-seen-btn"${this.eventStatuses[event.idEvent] === 'seen' ? ' disabled' : ''}>
                    ${this.eventStatuses[event.idEvent] === 'seen' ? 'Already seen' : 'Mark as seen'}
                </button>
            </div>
        `;

        detail
            .querySelector<HTMLButtonElement>('#close-detail')!
            .addEventListener('click', () => {
                detail.style.display = 'none';
            });

        if (hasScore) {
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
        }

        detail
            .querySelector<HTMLButtonElement>('#mark-seen-btn')!
            .addEventListener('click', () => {
                this.markAsSeen(event.idEvent);
                detail.querySelector<HTMLButtonElement>(
                    '#mark-seen-btn',
                )!.textContent = 'Already seen';
                detail.querySelector<HTMLButtonElement>(
                    '#mark-seen-btn',
                )!.disabled = true;
            });

        detail.scrollIntoView({ behavior: 'smooth' });
    }
}

new SpoilerFreeApp();

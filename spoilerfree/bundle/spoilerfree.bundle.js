(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// TODO rename main.ts files more specifically.
const LEAGUES = [
    { name: 'NWSL Women', id: 4521 },
    { name: 'NWSL Challenge Cup', id: 5178 },
];
const SEASON = new Date().getFullYear();
const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123';
class SpoilerFreeApp {
    constructor() {
        this.render();
    }
    render() {
        for (const league of LEAGUES) {
            const btn = document.createElement('button');
            btn.textContent = league.name;
            btn.className = 'league-btn';
            btn.addEventListener('click', () => this.selectLeague(league));
            document.getElementById('league-picker').appendChild(btn);
        }
        this.selectLeague(LEAGUES[0]); // Default to NWSL
    }
    async selectLeague(league) {
        this.selectedLeague = league;
        document.getElementById('match-detail').style.display = 'none';
        document.getElementById('match-list').innerHTML = '<p>Loading...</p>';
        for (const btn of document.querySelectorAll('.league-btn')) {
            btn.classList.toggle('active', btn.textContent === league.name);
        }
        try {
            const events = await this.fetchEvents(league.id);
            this.renderMatchList(events);
        }
        catch (e) {
            document.getElementById('match-list').innerHTML =
                `<p class="error">Error loading matches: ${e}</p>`;
        }
    }
    async fetchEvents(leagueId) {
        const url = `${SPORTSDB_BASE}/eventsseason.php?id=${leagueId}&s=${SEASON}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        return (data.events || []);
    }
    renderMatchList(events) {
        const list = document.getElementById('match-list');
        list.innerHTML = '';
        if (events.length === 0) {
            list.innerHTML = '<p>No matches found.</p>';
            return;
        }
        for (const event of events) {
            const card = document.createElement('div');
            card.className = 'match-card';
            const dateStr = new Date(event.dateEvent + 'T12:00:00').toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            card.innerHTML = `
                <span class="team home-team">${event.strHomeTeam}</span>
                <span class="vs">vs</span>
                <span class="team away-team">${event.strAwayTeam}</span>
                <span class="match-date">${dateStr}</span>
            `;
            card.addEventListener('click', () => this.selectMatch(event));
            list.appendChild(card);
        }
    }
    selectMatch(event) {
        this.selectedEvent = event;
        this.renderMatchDetail(event);
    }
    renderMatchDetail(event) {
        const detail = document.getElementById('match-detail');
        detail.style.display = 'block';
        const dateStr = new Date(event.dateEvent + 'T12:00:00').toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        const timeStr = event.strTime
            ? new Date(`${event.dateEvent}T${event.strTime}`).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
            })
            : 'Time TBD';
        const venueStr = event.strVenue
            ? `${event.strVenue}${event.strCity ? ', ' + event.strCity : ''}`
            : 'Venue unknown';
        const hasScore = event.intHomeScore !== null && event.intHomeScore !== undefined;
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
            ${hasScore
            ? `<div class="score-hidden">[ Score hidden — click to reveal ]</div>
                       <div class="score-revealed" style="display:none">
                           ${event.strHomeTeam} ${event.intHomeScore} – ${event.intAwayScore} ${event.strAwayTeam}
                       </div>`
            : `<div class="no-score">No score yet</div>`}
            <div class="action-buttons">
                <!-- Future action buttons placeholder -->
            </div>
        `;
        detail
            .querySelector('#close-detail')
            .addEventListener('click', () => {
            detail.style.display = 'none';
        });
        if (hasScore) {
            detail
                .querySelector('.score-hidden')
                .addEventListener('click', () => {
                detail.querySelector('.score-hidden').style.display = 'none';
                detail.querySelector('.score-revealed').style.display = 'block';
            });
        }
        detail.scrollIntoView({ behavior: 'smooth' });
    }
}
new SpoilerFreeApp();

},{}]},{},[1]);

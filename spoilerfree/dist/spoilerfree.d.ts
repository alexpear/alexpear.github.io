declare const LEAGUES: {
    name: string;
    id: number;
}[];
declare const SEASON: number;
declare const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123';
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
declare class SpoilerFreeApp {
    selectedLeague:
        | {
              name: string;
              id: number;
          }
        | undefined;
    selectedEvent: SdbEvent | undefined;
    eventStatuses: Record<string, 'seen'>;
    constructor();
    render(): void;
    selectLeague(league: { name: string; id: number }): Promise<void>;
    fetchEvents(leagueId: number): Promise<SdbEvent[]>;
    renderMatchList(events: SdbEvent[]): void;
    selectMatch(event: SdbEvent): void;
    markAsSeen(idEvent: string): void;
    renderMatchDetail(event: SdbEvent): void;
}

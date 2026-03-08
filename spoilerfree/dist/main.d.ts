declare const LEAGUES: {
    name: string;
    id: number;
}[];
declare const SEASON: number;
declare const SPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/123";
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
    selectedLeague: {
        name: string;
        id: number;
    } | undefined;
    selectedEvent: SdbEvent | undefined;
    constructor();
    render(): void;
    selectLeague(league: {
        name: string;
        id: number;
    }): Promise<void>;
    fetchEvents(leagueId: number): Promise<SdbEvent[]>;
    renderMatchList(events: SdbEvent[]): void;
    selectMatch(event: SdbEvent): void;
    renderMatchDetail(event: SdbEvent): void;
}

declare const Util: any;
declare const LEAGUES: {
    name: string;
    id: number;
}[];
interface Team {
    name: string;
    logo: string;
}
interface Fixture {
    fixture: {
        id: number;
        date: string;
        venue: {
            name: string;
            city: string;
        };
        status: {
            short: string;
            long: string;
        };
    };
    league: {
        name: string;
    };
    teams: {
        home: Team;
        away: Team;
    };
    goals: {
        home?: number;
        away?: number;
    };
}
declare class SpoilerFreeApp {
    apiKey: string;
    selectedLeague:
        | {
              name: string;
              id: number;
          }
        | undefined;
    selectedFixture: Fixture | undefined;
    constructor();
    render(): void;
    selectLeague(league: { name: string; id: number }): Promise<void>;
    fetchFixtures(leagueId: number): Promise<Fixture[]>;
    renderMatchList(fixtures: Fixture[]): void;
    selectMatch(fixture: Fixture): void;
    renderMatchDetail(fixture: Fixture): void;
}

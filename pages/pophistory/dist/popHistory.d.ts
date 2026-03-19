import { TownCensus } from './townCensus';
export declare class PopHistory {
    coord2census: Record<string, TownCensus[]>;
    importCensusList(censuses: TownCensus[]): void;
    townCoordsInBox(
        lat1: number,
        long1: number,
        lat2: number,
        long2: number,
    ): [number, number][];
    previousCensus(
        lat: number,
        long: number,
        year: number,
    ): TownCensus | undefined;
    nextCensus(lat: number, long: number, year: number): TownCensus | undefined;
    popAt(lat: number, long: number, year: number): number;
    static run(): void;
}

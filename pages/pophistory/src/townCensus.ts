// A record of a population estimate for a specific placetime.

export interface TownCensus {
    population: number;
    lat: number;
    long: number; // longitude

    // -1 = 2 BCE
    //  0 = 1 BCE
    //  1 = 1 CE
    year: number;
    confidence: number; // 0 to 1
}

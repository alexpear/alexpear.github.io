// A record of a population estimate for a specific placetime.

export class TownCensus {
    population: number;
    lat: number;
    long: number; // longitude
    year: number; // 1 = 1 CE, 0 = 1 BCE, -1 = 2 BCE, etc.
    confidence: number; // 0 to 1
}

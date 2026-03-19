// A simulator for the history of Earth's population changes, across all placetimes.

import { TownCensus } from './townCensus';
import Util from '../../util/util';

export class PopHistory {
    coord2census: Record<string, TownCensus[]> = {}; // maps "lat,long" to a list of censuses for that location, sorted by year

    importCensusList(censuses: TownCensus[]): void {
        const tempCoord2census: Record<string, TownCensus[]> = {};

        for (const census of censuses) {
            const key = `${census.lat},${census.long}`;

            if (tempCoord2census[key]) {
                tempCoord2census[key].push(census);
            } else {
                tempCoord2census[key] = [census];
            }
        }

        for (const key in tempCoord2census) {
            if (this.coord2census[key]) {
                this.coord2census[key] = this.coord2census[key].concat(
                    tempCoord2census[key],
                );
            } else {
                this.coord2census[key] = tempCoord2census[key];
            }

            // sort this town's censuses by year
            this.coord2census[key].sort((a, b) => {
                const difference = a.year - b.year;

                if (difference === 0) {
                    if (a.confidence >= b.confidence) {
                        // Mark inferior duplicates
                        b.confidence = 0;
                    } else {
                        a.confidence = 0;
                    }

                    return 0;
                }

                return difference;
            });

            // remove duplicate censuses
            this.coord2census[key] = this.coord2census[key].filter(
                (census) => census.confidence !== 0,
            );
        }
    }

    townCoordsInBox(
        lat1: number,
        long1: number,
        lat2: number,
        long2: number,
    ): [number, number][] {
        // LATER test performance & explore speedups

        return Object.keys(this.coord2census)
            .map((key) => key.split(',').map(Number) as [number, number])
            .filter(
                ([lat, long]) =>
                    lat >= Math.min(lat1, lat2) &&
                    lat <= Math.max(lat1, lat2) &&
                    long >= Math.min(long1, long2) &&
                    long <= Math.max(long1, long2),
            );
    }

    // The most recent census before the given year.
    previousCensus(
        lat: number,
        long: number,
        year: number,
    ): TownCensus | undefined {
        const censuses: TownCensus[] = this.coord2census[`${lat},${long}`];

        if (!censuses || censuses.length === 0) {
            return;
        }

        let lastSeen: TownCensus | undefined = undefined;

        for (const census of censuses) {
            if (census.year > year) {
                return lastSeen;
            }

            lastSeen = census;
        }

        return lastSeen;
    }

    nextCensus(
        lat: number,
        long: number,
        year: number,
    ): TownCensus | undefined {
        const censuses: TownCensus[] = this.coord2census[`${lat},${long}`];

        if (!censuses) {
            return;
        }

        for (const census of censuses) {
            if (census.year < year) {
                continue;
            }

            return census;
        }

        return;
    }

    popAt(lat: number, long: number, year: number): number {
        let previous = this.previousCensus(lat, long, year);
        const next = this.nextCensus(lat, long, year);

        if (!previous && !next) {
            return 0;
        }
        if (previous && !next) {
            return previous.population;
        }
        if (!previous && next) {
            // Invent an Ice Age town matriarch.
            previous = {
                population: 1,
                lat,
                long,
                year: -20_000,
                confidence: 0.01,
            };
        }

        // the percent thru the uncertain interval we are.
        const intervalCompleteness =
            (year - previous.year) / (next.year - previous.year);

        return Math.round(
            Math.exp(
                // e^param
                Math.log(previous.population) +
                    intervalCompleteness *
                        (Math.log(next.population) -
                            Math.log(previous.population)),
            ),
        );
    }

    static run(): void {}
}

PopHistory.run();

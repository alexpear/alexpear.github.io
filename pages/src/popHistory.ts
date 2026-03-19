// A simulator for the history of Earth's population changes, across all placetimes.

import { TownCensus } from './townCensus';
import Util from '../../util/util';

export class PopHistory {
    coord2census: Record<string, TownCensus[]> = {}; // maps "lat,long" to a list of censuses for that location, sorted by year

    importCensusList(censuses: TownCensus[]): void {}

    townCoordsInBox(
        lat1: number,
        long1: number,
        lat2: number,
        long2: number,
    ): [number, number][] {
        // TODO
        return [[0, 0]];
    }

    // The most recent census before the given year.
    previousCensus(
        lat: number,
        long: number,
        year: number,
    ): TownCensus | undefined {
        const censuses: TownCensus[] = this.coord2census[`${lat},${long}`];

        if (!censuses) {
            // TODO think about missing data cases.
            Util.error({
                lat,
                long,
                year,
            });
        }

        let previous: TownCensus | undefined = undefined;

        for (const census of censuses) {
            if (census.year > year) {
                return previous;
            }

            previous = census;
        }

        return previous;
    }

    nextCensus(
        lat: number,
        long: number,
        year: number,
    ): TownCensus | undefined {
        const censuses: TownCensus[] = this.coord2census[`${lat},${long}`];

        if (!censuses) {
            // TODO think about missing data cases.
            Util.error({
                lat,
                long,
                year,
            });
        }

        for (const census of censuses) {
            if (census.year < year) {
                continue;
            }

            return census;
        }
    }

    popAt(lat: number, long: number, year: number): number {
        const latest: TownCensus = this.previousCensus(lat, long, year);
        const next: TownCensus = this.nextCensus(lat, long, year);

        // the percent thru the uncertain interval we are.
        const intervalCompleteness =
            (year - latest.year) / (next.year - latest.year);

        return Math.round(
            Math.exp(
                // e^param
                Math.log(latest.population) +
                    intervalCompleteness *
                        (Math.log(next.population) -
                            Math.log(latest.population)),
            ),
        );
    }

    static run(): void {}
}

PopHistory.run();

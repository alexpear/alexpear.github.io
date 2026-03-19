(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// A simulator for the history of Earth's population changes, across all placetimes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopHistory = void 0;
class PopHistory {
    constructor() {
        this.coord2census = {}; // maps "lat,long" to a list of censuses for that location, sorted by year
    }
    importCensusList(censuses) {
        const tempCoord2census = {};
        for (const census of censuses) {
            const key = `${census.lat},${census.long}`;
            if (tempCoord2census[key]) {
                tempCoord2census[key].push(census);
            }
            else {
                tempCoord2census[key] = [census];
            }
        }
        for (const key in tempCoord2census) {
            if (this.coord2census[key]) {
                this.coord2census[key] = this.coord2census[key].concat(tempCoord2census[key]);
            }
            else {
                this.coord2census[key] = tempCoord2census[key];
            }
            // sort this town's censuses by year
            this.coord2census[key].sort((a, b) => {
                const difference = a.year - b.year;
                if (difference === 0) {
                    if (a.confidence >= b.confidence) {
                        // Mark inferior duplicates
                        b.confidence = 0;
                    }
                    else {
                        a.confidence = 0;
                    }
                    return 0;
                }
                return difference;
            });
            // remove duplicate censuses
            this.coord2census[key] = this.coord2census[key].filter((census) => census.confidence !== 0);
        }
    }
    townCoordsInBox(lat1, long1, lat2, long2) {
        // LATER test performance & explore speedups
        return Object.keys(this.coord2census)
            .map((key) => key.split(',').map(Number))
            .filter(([lat, long]) => lat >= Math.min(lat1, lat2) &&
            lat <= Math.max(lat1, lat2) &&
            long >= Math.min(long1, long2) &&
            long <= Math.max(long1, long2));
    }
    // The most recent census before the given year.
    previousCensus(lat, long, year) {
        const censuses = this.coord2census[`${lat},${long}`];
        if (!censuses || censuses.length === 0) {
            return;
        }
        let lastSeen = undefined;
        for (const census of censuses) {
            if (census.year > year) {
                return lastSeen;
            }
            lastSeen = census;
        }
        return lastSeen;
    }
    nextCensus(lat, long, year) {
        const censuses = this.coord2census[`${lat},${long}`];
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
    popAt(lat, long, year) {
        let previous = this.previousCensus(lat, long, year);
        const next = this.nextCensus(lat, long, year);
        if (previous && !next) {
            return previous.population;
        }
        if (!previous) {
            if (!next) {
                return 0;
            }
            else {
                // Invent an Ice Age town matriarch.
                previous = {
                    population: 1,
                    lat,
                    long,
                    year: -20000,
                    confidence: 0.01,
                };
            }
        }
        // the ratio thru the uncertain interval we are.
        const intervalCompleteness = (year - previous.year) /
            (next.year - previous.year);
        return Math.round(Math.exp(
        // e^param
        Math.log(previous.population) +
            intervalCompleteness *
                (Math.log(next.population) -
                    Math.log(previous.population))));
    }
    static run() { }
}
exports.PopHistory = PopHistory;
PopHistory.run();

},{}]},{},[1]);

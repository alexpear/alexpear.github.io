// An expedition is a run, round, or game session.

import { Company } from './company';
import { Faction } from './faction';
import { Group } from './group';
import { Place } from './place';
import { Planet } from './planet';
import { Util } from './util';

export class Expedition {
    id: string = Util.uuid();
    planet: Planet;
    placeGrid: Place[][] = [[]];
    companies: Company[] = [];
    protagonist: Group; // A group of quantity 1
    playerFaction: Faction;

    /** Each Place points to all Things that are in it.
     * Times when we need to iterate over Things:
     * - What is in this Place?
     * - Every company takes its turn
     */

    constructor(planet: Planet) {
        this.planet = planet;

        this.playerFaction = Util.randomOf(this.planet.factions);
        const dropoff = this.playerFaction.outpostPlace;
        this.placeGrid[0][0] = dropoff;

        // LATER do buildings & faction item inventory fall under dropoffPlace or startingCompany()?

        this.protagonist = this.playerFaction.randomHero();
        const startingCompany = this.playerFaction.startingCompany(); // Starts at place 0,0 aka the dropoff
        startingCompany.add(this.protagonist);
        this.companies.push(startingCompany);
    }

    log(): string {
        const json = this.json();

        const loggedText = JSON.stringify(json, undefined, 4);

        console.log(loggedText);

        return loggedText;
    }

    json(): object {
        return {
            id: this.id,
            planet: this.planet.json(),
            // placeGrid: TODO once placeGrid is the source of truth for hexes
            companies: this.companies.map((company) => company.json()),
            protagonist: this.protagonist.id,
            playerFaction: this.playerFaction.id,
        };
    }
}

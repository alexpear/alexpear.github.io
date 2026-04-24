// An expedition is a run, round, or game session.

import { Company } from './company';
import { Faction } from './faction';
import { Group } from './group';
import { Place } from './place';
import { Planet } from './planet';
import { Util } from './util';

export class Expedition {
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
        const dropoff = this.playerFaction.dropoffPlace();
        this.placeGrid[0][0] = dropoff;

        // LATER do buildings & faction item inventory fall under dropoffPlace or startingCompany()?

        this.protagonist = this.playerFaction.randomHero();
        const startingCompany = this.playerFaction.startingCompany(); // Starts at place 0,0 aka the dropoff
        startingCompany.add(this.protagonist);
        this.companies.push(startingCompany);
    }
}

// A organization of allied & thematically unified creatures.

// import { Kind } from "./kind";
import { Company } from './company';
import { Group } from './group';
import { Idea } from './idea';
import { Place } from './place';
import { Util } from './util';

export class Faction {
    id: string = Util.uuid();
    // Each Faction has several offscreen cities. Each produces something useful. For example: [Human, Android, Sword, Armor, Robohorse]. These are the ingredients the faction can use.
    cities: Group[] = [];
    outpostPlace: Place;

    // When a player controls this faction, these groups start in the dropoff hex.
    // When this is a NPC faction, these groups will be encountered in random places.
    groups: Group[] = [];

    static readonly MAX_CITIES: number = 5;

    static random(budget: number = Util.randomBelow(1_000)): Faction {
        const faction = new Faction();

        // At least 1 city must produce a creature, or else the faction will just be a pile of items.
        faction.cities.push(new Group(Idea.randomCreature(), 1));
        for (let i = 1; i < Faction.MAX_CITIES; i++) {
            faction.cities.push(new Group(Idea.random(), 1));
        }

        let budgetLeft = budget;
        while (budgetLeft > 0) {
            const availableCreatures = Util.shuffle(
                faction.cities.filter((city) => city.isCreature()),
            );

            let i;
            for (i = 0; i < availableCreatures.length; i++) {
                const creature = availableCreatures[i];
                if (creature.cost() > budgetLeft) {
                    continue;
                }

                const maxQuantity = Math.floor(budgetLeft / creature.cost());
                const group = creature.copy(
                    Util.randomIntBetween(1, maxQuantity),
                );

                // TODO add randomItem() sometimes

                faction.groups.push(group);
                budgetLeft -= group.cost();
                break;
            }

            if (i === availableCreatures.length) {
                // Adding even 1 more individual is too expensive, so break out of the while loop.
                break;
            }
        }

        return faction;
    }

    cost(): number {
        return Util.sum(this.groups.map((group) => group.cost()));
    }

    startingCompany(): Company {
        const company = new Company(this.groups);
        company.factionID = this.id;
        return company;
    }

    randomIndividual(): Group {
        const city = Util.randomOf(
            this.cities.filter((city) => city.isCreature()),
        );

        return city.copy(1);
    }

    randomHero(): Group {
        const hero = this.randomIndividual();
        // hero.ideas.push(this.randomItem());
        // hero.ideas.push(this.randomItem());
        // hero.ideas.push(this.randomItem());
        return hero;
    }

    randomItem(): Group {
        return Util.randomOf(this.cities.filter((city) => city.isItem()));
    }

    json(): object {
        return {
            id: this.id,
            cities: this.cities.map((k) => k.json()),
            outpostPlace: this.outpostPlace?.json(),
            groups: this.groups.map((g) => g.json()),
        };
    }

    prettyString(): string {
        const groupLines = this.groups.map((g) => g.prettyString()).join('\n');
        const cityOutputs = this.cities
            .map((k) => k.prettyString())
            .sort()
            .join(', ');

        return [
            `Faction ${this.id}`,
            `Cities: ${cityOutputs}`,
            `Groups: ${groupLines}`,
        ].join('\n\n');
    }
}

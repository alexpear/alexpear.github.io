// A organization of allied & thematically unified creatures.

// import { Kind } from "./kind";
import { Company } from './company';
import { Group } from './group';
import { Idea } from './idea';
import { Kind } from './kind';
import { Place } from './place';
import { Util } from './util';

export class Faction {
    id: string = Util.uuid();
    // Each Faction has several offscreen cities. Each produces something useful. For example: [Human, Android, Sword, Armor, Robohorse]. These are the ingredients the faction can use.
    cities: Kind[] = [];
    outpostPlace: Place;

    // When a player controls this faction, these groups start in the dropoff hex.
    // When this is a NPC faction, these groups will be encountered in random places.
    groups: Group[] = [];

    static readonly MAX_CITIES: number = 5;

    static random(budget: number = Util.randomBelow(1_000)): Faction {
        const faction = new Faction();

        faction.cities.push(new Kind(Idea.randomCreature()));
        for (let i = 1; i < Faction.MAX_CITIES; i++) {
            faction.cities.push(new Kind(Idea.random()));
        }

        let budgetLeft = budget;
        while (budgetLeft > 0) {
            const kindsOfCreatures = Util.shuffle(
                faction.cities.filter((city) => city.mainIdea.isCreature()),
            );

            let i;
            for (i = 0; i < kindsOfCreatures.length; i++) {
                const kind = kindsOfCreatures[i];
                if (kind.cost() > budgetLeft) {
                    continue;
                }

                const maxQuantity = Math.floor(budgetLeft / kind.cost());
                const group = new Group(
                    kind,
                    Util.randomIntBetween(1, maxQuantity),
                );
                faction.groups.push(group);
                budgetLeft -= group.cost();
                break;
            }

            if (i === kindsOfCreatures.length) {
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
        return new Company(this.groups);
    }

    randomIndividual(): Group {
        const kind = Util.randomOf(
            this.cities.filter((city) => city.mainIdea.isCreature()),
        );

        return new Group(kind, 1);
    }

    randomHero(): Group {
        const hero = this.randomIndividual();
        hero.add(this.randomItem());
        hero.add(this.randomItem());
        hero.add(this.randomItem());
        return hero;
    }

    randomItem(): Kind {
        return Util.randomOf(
            this.cities.filter((city) => city.mainIdea.isItem()),
        );
    }

    json() {
        return {
            id: this.id,
            cities: this.cities.map((k) => k.json()),
            outpostPlace: this.outpostPlace?.json(),
            groups: this.groups.map((g) => g.json()),
        };
    }
}

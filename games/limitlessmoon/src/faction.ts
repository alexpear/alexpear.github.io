// A organization of allied & thematically unified creatures.

// import { Kind } from "./kind";
import { Company } from './company';
import { Group } from './group';
import { Place } from './place';
import { Thing } from './thing';
import { Util } from './util';

export class Faction {
    // Each Faction has several offscreen cities. Each produces 1 type of useful Thing for the faction to use. For example: [Human, Android, Sword, Armor, Robohorse]. These are the ingredients the faction can use.
    cities: Thing[] = [];
    outpostPlace: Place;
    groups: Group[] = [];

    static readonly MAX_CITIES: number = 5;

    static random(budget: number = Util.randomBelow(10_000)): Faction {
        const faction = new Faction();

        faction.cities.push(Idea.randomCreature());
        for (let i = 1; i < Faction.MAX_CITIES; i++) {
            faction.cities.push(Idea.random());
        }

        while (faction.totalCost() < budget) {
            const group = faction.randomIndividual();

            group.quantity = Util.randomIntBetween(
                1,
                Math.floor((budget - faction.totalCost()) / group.cost()),
            );

            faction.groups.push(group);
        }

        // TODO refactor that while to a do-while or something, so it can back out after randomIndividual() returns a high-cost Idea.

        return faction;
    }

    totalCost(): number {
        return Util.sum(this.groups.map((group) => group.cost()));
    }

    startingCompany(): Company {
        return new Company(this.groups);
    }

    randomIndividual(): Group {
        const kind = Util.randomOf(
            this.cities.filter((city) => city.template.isCreature()),
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
}

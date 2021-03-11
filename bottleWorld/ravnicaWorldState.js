'use strict';

const _ = require('lodash');

const BEvent = require('./bEvent.js');
const WorldState = require('./worldState.js');
const Timeline = require('./timeline.js');

const WGenerator = require('../generation/wgenerator.js');

const Coord = require('../util/coord.js');
const MtgColorSet = require('../util/mtgColorSet.js');
const Util = require('../util/util.js');

const Group = require('../wnode/group.js');
const RavnicaOrg = require('../wnode/ravnicaOrg.js');

class RavnicaWorldState extends WorldState {
    constructor () {
        super();

        this.timeline = new Timeline(this);

        for (let i = 0; i < 3; i++) {
            this.addNode(new RavnicaOrg());
        }

        this.initOpinions();

        const summary = this.statusSummary();
        // Util.log(summary);
    }

    initOpinions () {
        for (const a of this.activeNodes()) {
            for (const b of this.activeNodes()) {
                const aSet = new MtgColorSet(a.colors);
                const bSet = new MtgColorSet(b.colors);

                a.opinionOf[b.id] = aSet.opinionOf(bSet);
            }
        }
    }

    statusSummary () {
        return `On week ${this.t}:\n` +
            this.activeNodes().map(n => {
                const niceColors = MtgColorSet.icons(n.colors);
                // const abrvColors = MtgColorSet.abbreviate(n.colors);
                const name = `The ${n.displayName} Office (${niceColors}, ${n.wealth} ducats)\n`;

                const opinions = Object.keys(n.opinionOf)
                    .map(id => {
                        const other = this.fromId(id);
                        const otherColorAbrv = MtgColorSet.abbreviate(other.colors);

                        return `  Opinion of ${other.displayName} (${otherColorAbrv}): ${n.opinionOf[id]}`
                    })
                    .join('\n');

                return name + opinions;
            })
            .join('\n');
    }

    proceed () {
        this.activeNodes().forEach(org => {
            if (org.constructor.name !== 'RavnicaOrg') {
                return;
            }

            const action = org.act(this);
            
            if (action.type !== 'raid') {
                return;
            }

            const target = this.fromId(action.targetId);

            // Later this might be subclass RaidEvent
            const event = new BEvent(
                BEvent.TYPES.Raid,
                org,
                target,
                undefined,
                undefined,
                this.now()
            );

            let bag = {};
            bag[org.id] = org.wealth;
            bag[target.id] = target.wealth;

            const victor = Util.randomBagDraw(bag);

            if (victor === target.id) {
                // Later functionize this so that opinion changes happen inside the Org's class.
                target.opinionOf[org.id] -= 1;

                event.newTargetOpinion = target.opinionOf[org.id];
                event.stolen = 0;
                this.timeline.addEvent(event);
                return;
            }

            const stolen = Math.floor(target.wealth * 0.2);
            target.wealth -= stolen;
            org.wealth += stolen;

            target.opinionOf[org.id] -= 1;

            event.stolen = stolen;
            event.newTargetOpinion = target.opinionOf[org.id];

            this.timeline.addEvent(event);
        });

        this.t++;
    }

    logRecentEvents () {
        const events = this.timeline.getEventsAt(this.t - 1);

        events.forEach(e => {
            if (e.eventType !== BEvent.TYPES.Raid) {
                return;
            }

            Util.log(this.prettyEvent(e))
        });
    }

    prettyEvent (event) {
        // Util.log(event.toJson())

        const attacker = event.protagonist.prettyShortName();
        const aBrief = event.protagonist.displayName;
        const defender = event.target.prettyShortName();

        const outcome = event.stolen > 0 ?
            `The raiders ransacked the place & made off with ${event.stolen} stolen ducats. Now these thieves have ${event.protagonist.wealth} ducats & the defenders total ${event.target.wealth}` :
            `However, the raiders were repulsed & fled into the night`;

        const opinion = event.target.opinionOf[event.protagonist.id];

        return `At midnight on the Saturday of Week ${event.t}, the ${attacker} launched a ferocious raid on a building operated by the ${defender}. ${outcome}. The defenders' opinion of ${aBrief} is now ${opinion}.`
    }

    conflictExists () {
        // This end condition is disabled in this subclass for now.
        return false;
    }

    run () {
        while (this.t <= 52) {
            if (this.t % 12 === 0) {
                Util.log(this.statusSummary());
            }

            this.proceed();
            this.logRecentEvents()
        }
    }

    static example (timeline) {
        return new RavnicaWorldState();
    }

    static test () {
        const world = RavnicaWorldState.example();

        world.run();
    }

    static runFile () {
        return RavnicaWorldState.test();
    }
}

module.exports = RavnicaWorldState;

RavnicaWorldState.runFile();


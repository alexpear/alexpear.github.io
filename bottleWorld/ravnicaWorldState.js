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

        // TODO log about it what has been inited.
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
        // TODO also include the t, and each wealth
        return this.activeNodes()
            .map(n => {
                const niceColors = MtgColorSet.icons(n.colors);
                // const abrvColors = MtgColorSet.abbreviate(n.colors);
                const name = `The ${n.displayName} Office (${niceColors})\n`;

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
                event.stolen = 0;
                this.timeline.addEvent(event);
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

    conflictExists () {
        // This end condition is disabled in this subclass for now.
        return false;
    }

    run () {
        while (this.worthContinuing()) {
            if (this.t % 1 === 0) {
                Util.log(this.statusSummary());
            }

            this.proceed();
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


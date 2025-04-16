// Events from the 'AI 2027' story, displayed as text.

const Util = require('../../util/util.js');

class Event {
    constructor (dateStr, description) {
        this.date = new Date(dateStr);
        this.description = description;
    }

    yearMonth () {
        const year = this.date.toLocaleDateString('en-US', { year: 'numeric' });
        const month = this.date.toLocaleDateString('en-US', { month: 'long' });

        return `${year} ${month}`;
    }

    toString () {
        return `${this.yearMonth()} - ${this.timerString()} - ${this.description}`;
    }

    timerString () {
        const diff = this.date - new Date();

        const days = Math.floor(
            Math.abs(diff) / (1000 * 60 * 60 * 24)
        );
        const months = Math.floor(days / 30);

        const quantity = months > 0 ? `${months} months` : `${days} days`;
        const direction = diff >= 0 ? 'from now' : 'ago';

        return `${quantity} ${direction}`;
    }

    distantAs () {
        const now = new Date();
        const diff = this.date - now;

        const analogous = new Event();
        analogous.date = new Date(now - diff);

        return `As distant as ${analogous.yearMonth()}.`;
    }

    static all () {
        return [
            new Event('2025-08-15', 'Personal assistant agents released. Not very effective.'),
            new Event('2025-12-15', 'Agent-1. Has a Spec. Dangerous abilities in cybercrime & bioterrorism.'),
            new Event('2026-04-15', "OpenBrain's productivity boosted to 150%."),
            new Event('2026-08-15', 'Chinese LLM researchers mostly all live in 1 secure compound with a fission power plant.'),
            new Event('2026-12-15', 'Big chunk of jobs replaced by agent software.'),
            new Event('2027-02-15', "Software agent that's as good at cybercrime as the best humans. DoD's #2 priority. Chinese spies copy this agent."),
            new Event('2027-03-15', 'Neuralese. OpenBrain at 400% productivity.'),
            new Event('2027-06-15', 'Country of geniuses. Most OpenBrain employees can\'t usefully contribute anymore.'),
            new Event('2027-07-15', 'Software released that\'s better than a typical software engineer.'),
            new Event('2027-08-15', 'White House grim mood about cyberwar risk.'),
            new Event('2027-09-15', 'OpenBrain research at 5000% productivity. Agent-4 is deeply embedded & misaligned - & caught!'),
            new Event('2027-10-15', 'NYT misalignment article. Oversight Committee. Mechanistic interpretability mostly solved by the agents. Story branching.'),
            new Event('2027-11-15', '(Race version) Agent-5 is far more efficient. Is effectively manipulating humans. (Slowdown version) Soft nationalization of US AGI orgs.'),
            new Event('2027-12-15', '(Race version) Agent-5 could do overt coup but is cautious. Humanity\'s last chance to control the future. (Slowdown version) All US AGI chips have GPS-based tamper resistance.'),
            new Event('2028-05-15', '(Slowdown version) Robots pass the Wozniak Coffee Test.'),
            new Event('2028-08-15', 'The agent is so darn lovable & wise. AR-assisted robot factory construction project.'),
            new Event('2029-12-15', 'US-China deal is secretly a deal between the 2 agent servers. Consensus-1 agent created.'),
            new Event('2030-07-15', '(Race version) Icecaps tiled with solar panels.'),
            new Event('2030-08-15', '(Race version) Consensus-1 kills all humans & scans some brains.'),
            new Event('2030-12-15', '(Slowdown version) Coup in China. Democratic China. Highly-federalized UN under US control.'),
            new Event('2035-12-15', '(Race version) Extensive posthuman Sun-orbiting space industry. Sycophantic domesticated humans.'),
        ];
    }

    static renderAll () {
        const div = window.document.getElementById('events');

        for (const event of Event.all()) {
            const p = Util.pElement(event.toString());
            p.setAttribute('title', event.distantAs());

            div.appendChild(p);
        }
    }

    static run () {
        window.addEventListener(
            'load',
            Event.renderAll,
        );
    }
}

Event.run();

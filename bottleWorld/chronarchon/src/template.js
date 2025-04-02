// Each type of species or archetype in this world is represented by 1 Template instance.

require('yamlify/register');
const Encyclopedia = require('./encyclopedia.yml');
// LATER may need to store encyclopedia.yml as a .js or .json if browserify etc can't handle .yml files. But i like .yml for human readability.
// TODO require -> fs
// LATER decide whether & how to import & store templates from other users.

/* Opts
- .yml.js 
- yamlify
- .json 
*/

const Util = require('../../../util/util.js');
const Yaml = require('js-yaml');

class Template {
    constructor (name) {
        const entry = this.find(name);
        Object.assign(this, entry);
        
        this.id = Util.uuid();
    }

    find (name) {
        const TYPES = [
            'creatures',
            'items',
            'traits',
            'places',
        ];

        const CONTEXT = Template.ENCYCLOPEDIA[ Template.CONTEXT ];

        for (const type of TYPES) {
            const entries = CONTEXT[type];

            // Util.logDebug({
            //     name,
            //     type,
            //     entries,
            // });

            if (entries && entries[name]) {
                const entry = entries[name];
                entry.name = name;
                entry.type = type;

                return entry;
            }
        }

        Util.error(`Template not found: ${name}, in the ${Template.CONTEXT} context.`);
    }

    static example () {
        return new Template('farmer');
    }

    static init () {
        // Template.ENCYCLOPEDIA = Yaml.load(Encyclopedia);
        Template.ENCYCLOPEDIA = Encyclopedia;

        if (! Template.CONTEXT) {
            Template.CONTEXT = 'fantasy';
        }

        Template.ALIGNMENT = Template.ENCYCLOPEDIA[ Template.CONTEXT ].alignments;
        // Template.ALIGNMENT.radiant would now equal 'radiant'

        Util.logDebug({
            TemplateDotENCYCLOPEDIA: Template.ENCYCLOPEDIA,
            TemplateDotCONTEXT: Template.CONTEXT,
            TemplateDotALIGNMENT: Template.ALIGNMENT,
        });

        // LATER could do a system of auto-adding implied tags.
        // eg 'weapon' => gear
        // human => person biped animal living
    }
}

module.exports = Template;

Template.init();

// Each type of species or archetype in this world is represented by 1 Template instance.

const Encyclopedia = require('./encyclopedia.yml.js');
// LATER decide whether & how to import & store templates from other users.

const Util = require('../../../util/util.js');
const Yaml = require('js-yaml');

class Template {
    constructor (entry, name) {
        // const entry = this.find(name);
        Object.assign(this, entry);

        this.name = name;        
        this.id = Util.uuid();

        if (this.tags) {
            this.tags = this.tags.split(/\s/);
        }
    }

    // static named (name) {
    //     return Template.find(name);
    // }

    static find (name) {
        const CONTEXT = Template.ENCYCLOPEDIA[ Template.CONTEXT ];

        for (const type of Template.TYPES) {
            const entries = CONTEXT[type];

            // Util.logDebug({
            //     name,
            //     type,
            //     entries,
            // });

            if (entries && entries[name]) {
                const entry = entries[name];
                // entry.name = name;
                entry.type = type;

                return entry;
            }
        }

        Util.error(`Template not found: ${name}, in the ${Template.CONTEXT} context.`);
    }

    static example () {
        return Template.ENCYCLOPEDIA.scifi.creatures.soldier;
    }

    static allCreatures () {
        return Template.inCategory('creatures');
    }

    static async drawableCreatures () {
        return await Template.drawablesAmong(
            Template.inCategory('creatures')
        );  
    }

    static async drawablesAmong (templates) {
        const promisedTemplates = await Promise.all(
            templates.map(
                async (template) => await template.hasImage() ?
                    template :
                    false
            )
        );

        return promisedTemplates.filter(response => response);
    }

    // LATER this & similar image filepath funcs will need to escape special characters from user input filenames.
    async hasImage () {
        try {
            const response = await fetch(
                `images/${ this.name }.png`,
                { method: 'HEAD' } // header only, quicker.
            );

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    static allItems () {
        return Template.inCategory('items');
    }

    static allPlaces () {
        return Template.inCategory('places');
    }

    static inCategory (category) {
        return Object.values(
            Template.ENCYCLOPEDIA[ Template.CONTEXT ][ category ]
        );
    }

    // LATER standardize whether random*() funcs should be in Template or in a Entity subclass.
    static async randomGroup () {
        return Util.randomOf(await Template.drawableCreatures());

        // LATER filter out incomplete or blank templates.
    }

    static randomGroupCLI () {
        return Util.randomOf(Template.allCreatures());
    }

    static randomItem () {
        return Util.randomOf(
            Template.allItems()
                // Exclude upgrades
                .filter(item => item.tags && ! item.tags.includes('upgrade'))
        );
    }

    static async randomPrimary () {
        return Util.randomOf(
            await Template.drawablesAmong(
                Template.allItems()
                    .filter(item => item.tags && item.tags.includes('primary'))
            )
        );
    }

    static randomUpgrade () {
        const template = Util.randomOf(
            Template.allItems()
                .filter(item => item.tags && item.tags.includes('upgrade'))
        );

        // Util.logDebug({
        //     template,
            // allItems: Template.allItems(),
        // });

        return template;
    }

    static async randomXHanded (hands = 2) {
        return Util.randomOf(
            await Template.drawablesAmong(
                Template.allItems()
                    .filter(
                        item => item.tags && item.hands === hands
                    )
            )
        );
    }

    static init () {
        Template.ENCYCLOPEDIA = Yaml.load(
            Encyclopedia.yamlString,
            { json: true }, // json: true means duplicate keys in a mapping will override values rather than throwing an error.
        );

        if (! Template.CONTEXT) {
            Template.CONTEXT = 'scifi';
            // LATER i dont really like this variable, at least with the current name. Maybe move it to a member field of World?
        }

        Template.ALIGNMENT = Template.ENCYCLOPEDIA[ Template.CONTEXT ].alignments;
        // Template.ALIGNMENT.radiant would now equal 'radiant'

        // Loop over .ENCYCLOPEDIA & convert each entry to a Template instance.
        for (const contextName in Template.ENCYCLOPEDIA) {
            const context = Template.ENCYCLOPEDIA[contextName];

            for (const type of Template.TYPES) {
                for (const templateName in context[type]) {
                    const object = context[type][templateName];

                    context[type][templateName] = new Template(object, templateName);
                }
            }
        }

        // Util.logDebug({
        //     TemplateDotENCYCLOPEDIA: Template.ENCYCLOPEDIA,
        //     TemplateDotCONTEXT: Template.CONTEXT,
        //     TemplateDotALIGNMENT: Template.ALIGNMENT,
        // });

        // LATER could do a system of auto-adding implied tags.
        // eg weapon => gear
        // human => person biped animal living
    }
}

Template.TYPES = [
    'creatures',
    'items',
    'traits',
    'places',
];

Template.init();

module.exports = Template;

'use strict';

// Generates HTML wiki pages

const Util = require('../util/util.js');

class WikiWriter {
    constructor () {
        this.structure = this.starStructure();
    }

    starStructure () {
        return {
            juno: {
                ur: {
                    urusalim: 'page',
                    mechapolis: 'hide', // Mecca
                },
                indus: {
                    cylonca: 'hide', // Sri Lanka
                },
                gaia: {
                    madagasco: 'hide',
                },
                medeaTerra: {
                    nilus: 'hide', // Egypt
                    aethyopae: 'hide',
                    tunis: 'hide', // Carthage
                    amorocco: 'hide',
                    iberia: 'hide',
                    gallia: 'hide',
                    italica: 'hide',
                    aegea: 'hide',
                    byzantium: 'hide',
                },
                medeaRegnum: {
                    niphon: 'hide', // Japan
                    formosa: 'hide', // Taiwan
                    arkeo: 'hide', // Korea
                    omnigaol: 'hide', // Mongolia
                    tibod: 'hide', // Tibet
                },
                borea: {
                    germanus: 'hide',
                    magyarorbis: 'hide', // Hungary
                    austerost: 'hide', // Austria
                    polech: 'hide', // Poland
                    helvetica: 'hide', // Switzerland
                    midgard: 'hide',
                    eire: 'hide',
                    britannia: 'hide',
                },
                cyberia: {
                    ukrania: 'hide',
                    rus: 'hide',
                    kazhakia: 'hide',
                },
                thetis: {
                    lao: 'hide',
                    cambod: 'hide',
                    thailuna: 'hide',
                    indonus: 'hide', // Indonesia
                    malazia: 'hide',
                    mranmax: 'hide', // Myanmar/Burma
                    uvietu: 'hide', // Vietnam
                    panyupayana: 'hide', // Philippines
                },
            },
            americus: {
                galapangaea: 'hide', // Galapagos
                americusII: 'hide',
                americusIII: 'hide',
                americusIV: 'hide',
                americusV: 'hide',
                americusVI: 'hide',
                americusVII: 'hide',
                americusVIII: 'hide',
                americusIX: 'hide',
                americusX: 'hide',
                americusXI: 'hide',
                americusXII: {
                    amazonia: 'hide',
                    andea: 'hide',
                },
                nacada: {
                    cascadia: 'hide',
                    petramontia: 'hide', // Rocky Mountains
                    perardua: 'hide', // Kansas
                    aztecha: 'hide', // Mexico
                },
                americusXIV: 'hide',
            },
            pacificus: {
                australis: {
                    tacticaMania: 'hide',
                },
                technofiji: 'hide',
                neoZeo: 'hide',
                samox: 'hide', // Samoa
                micropolis: 'hide', // Micronesia
                hedronii: 'hide', // Hawai'i
            },
            niflheim: {
                erebus: 'hide', // Antarctica
            }
        };
    }

    setupPages () {
        // console.log(`setupPages() - this.structure: ${Util.stringify(this.structure)}`);

        this.pages = [];

        for (let starKey in this.structure) {
            // console.log(`operating on star ${starKey}`);
            const star = new Page(starKey);
            this.pages.push(star);

            for (let planetKey in this.structure[starKey]) {
                const planet = new Page(starKey, planetKey);
                this.pages.push(planet);

                const planetStructure = this.structure[starKey][planetKey];
                if (Util.isString(planetStructure)) { continue; }

                for (let moonKey in planetStructure) {
                    const moon = new Page(starKey, planetKey, moonKey);
                    this.pages.push(moon);

                    // console.log(`operating on moon ${moonKey} - starKey ${starKey}, planetKey ${planetKey}`)
                }
            }
        }

        this.pages.map(p => console.log(this.pageDesc(p)));
    }

    /* Tactica Mania is a moon orbiting the planet Australis.
    Australis is a planet orbiting the star Pacificus. It is orbited by: Tactica Mania.
    Pacificus is a star. It is orbited by: Australis, Technofiji, Neo Zeo, ..., & Hedronii.
    */
    pageDesc (page) {
        let desc = `${page.title} is a ${page.typeName()}`;

        const starKey = page.path[0];
        const planetKey = page.path[1];

        const star = this.structure[ starKey ];
        const planet = this.structure[ starKey ][ planetKey ];

        // Util.logDebug({
        //     desc,
        //     star,
        //     planet,
        //     page,
        //     pageTypeName: page.typeName(),
        //     context: `pageDesc() top`,
        // });

        if (page.typeName() === 'star') {
            const orbitList = Object.keys(star)
                .map(planet => Util.fromCamelCase(planet))
                .join(', ');

            desc += `. It is orbited by: ${orbitList}.`;
        }
        else {
            const parentIndex = page.path.length - 2;
            const parent = Util.fromCamelCase(
                page.path[parentIndex]
            );
            const parentType = parentIndex === 0 ?
                'star' :
                'planet';

            desc += ` orbiting the ${parentType} ${parent}.`;

            if (page.typeName() === 'planet' && ! Util.isString(planet)) {
                const orbitList = Object.keys(planet)
                    .map(moon => Util.fromCamelCase(moon))
                    .join(', ');

                desc += ` It is orbited by: ${orbitList}.`;
            }
        }

        return desc;
    }

    htmlPassage (content) {
        return this.asElement(content, 'p');
    }

    asElement (content, elementName) {
        // TODO make content HTML-friendly, escape etc.
        return `<${elementName}>${content}</${elementName}>`;
    }

    static run () {
        const wiki = new WikiWriter();
        wiki.setupPages();
    }
}

class Page {
    constructor (starKey, planetKey, moonKey) {
        this.path = [starKey, planetKey, moonKey]
            .filter(k => !! k);

        this.key = this.path[this.path.length - 1];
        this.title = Util.fromCamelCase(this.key);

        // this.path = this.path.map(k => Util.fromCamelCase(k));
    }

    typeName () {
        const MAP = {
            1: 'star',
            2: 'planet',
            3: 'moon',
        };

        return MAP[this.path.length];
    }
}

WikiWriter.run();

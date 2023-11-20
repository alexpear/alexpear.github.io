'use strict';

// Generates HTML wiki pages

const Util = require('../../util/util.js');

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
                hadronii: 'hide', // Hawai'i
            },
            niflheim: {
                erebus: 'hide', // Antarctica
            }
        };
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
    }
}

WikiWriter.run();

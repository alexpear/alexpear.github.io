'use strict';

// Generates HTML wiki pages

const Util = require('../util/util.js');
const fs = require('fs');
const path = require('path');

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
                    remia: 'hide',
                    aegea: 'hide',
                    byzantium: 'hide',
                },
                medeaRegnum: {
                    niphon: 'hide', // Japan - Nohin?
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

        this.pages.map(
            p => {
                const html = this.pageHtml(p);
                const desiredFileName = p.key + '.html';

                console.log(); // Newline.
                Util.logDebug({
                    desiredFileName,
                    html,
                });

                // NOTE - Uncomment this to overwrite html files in this dir:
                // fs.writeFileSync(
                //     path.join(__filename, '..', desiredFileName),
                //     html,
                //     'utf8'
                // );
            }
        );
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
                .map(planet => this.link(planet))
                .join(', ');

            desc += ` in the <a href="cluster.html">Cleo Cluster</a>. It is orbited by: ${orbitList}.`;
        }
        else {
            // <a href="juno.html">

            const parentIndex = page.path.length - 2;
            const parentKey = page.path[parentIndex];
            const parentTitle = Util.fromCamelCase(parentKey);
            const parentType = parentIndex === 0 ?
                'star' :
                'planet';

            desc += ` orbiting the ${parentType} ${this.link(parentKey)}.`;

            if (page.typeName() === 'planet' && ! Util.isString(planet)) {
                const orbitList = Object.keys(planet)
                    .map(moon => this.link(moon))
                    .join(', ');

                desc += ` It is orbited by: ${orbitList}.`;
            }
        }

        return desc;
    }

    link (key) {
        return `<a href="${key}.html">${Util.fromCamelCase(key)}</a>`;
    }

    pageHtml (page) {
        return `<html>
  <head>
    <meta charset="utf-8">
    <link href="wikiPage.css" rel="stylesheet" />
  </head>

  <body>
    <div id="header"></div>

    <div id="main">
      <label id="title">${page.title}</label>
      <p id="desc">${this.pageDesc(page)}</p>
    </div>
  </body>
</html>
`;
    }

    htmlPassage (content) {
        return this.asElement(content, 'p');
    }

    asElement (content, elementName) {
        // TODO make content HTML-friendly, escape etc.
        return `<${elementName}>${content}</${elementName}>`;
    }

    // One-off script for ease of writing HTML.
    convertShorthandCache () {
        const shorthand = `
            Cyc 48: The Universal Stellar Compass is invented on [medeaRegnum].
            Cyc 49: Kaesar Julius invades his own Republic from orbit, then declares himself the first Emperor of [remia].
            Cyc 50: Godmind DEI_YESHUA takes human form, then is crucified by [remia] on [urusalim]. The Second Temple of Urusalim is soon destroyed.
            Cyc 51: Kaesar Markus Aurelius of [remia] writes his Meditations on philosophy.
            Cyc 52: Saint George slays the Dragon of DEI_LUCIFER on [britannia].
            Cyc 53: Known records about DEI_YESHUA are collected & called the New Testament. Kaesar Constantine of [remia] forsakes DEI_ZEUS & pledges his empire to DEI_YESHUA.
            Cyc 54: Saint Jerome translates the New Testament into the Remian language so that it can be read more widely. [remia] is sacked by a fleet from [borea], but [byzantium] remains unconquered.
            Cyc 55: The Church of DEI_YESHUA is a Pentarchy of [nilus], [urusalim], Antioculus, [byzantium], & [remia]. On [britannia], King Arthur Pendragon gathers the Mecha of Camelot. Beowulf slays the mechamonster Grendel.
            Cyc 56: Prophet Mohammed, Sybil of [mechapolis], receives the Revelation of DEI_MONAD.
            Cyc 57: The Revelation of Mohammed is recognized as far west as [iberia].
            Cyc 58: Charlemagne is crowned Holy Emperor of [borea] by the Pope of [remia]. Borea buckles under the Viking pressure of [midgard].
            Cyc 59: Deadly plasma arrows are developed by the armies of [medeaRegnum].
            Cyc 60: Leif Erikson of is the first mortal in many cycles to travel from [juno] to [americus]. He lives briefly in [nacada] then returns to [midgard]. The Church of DEI_YESHUA schisms between [remia] & [byzantium]. William of [gallia] conquers [britannia]. The first modern university is founded in Bologna, [iberia]. Avicenna of [ur] pioneers the study of minds.
            Cyc 61: University of Oxford founded in [britannia].
            Cyc 62: The Great Khan of [omnigaol] conquers many worlds, including [medeaRegnum]. Plasma cannons & bombs enter wider use in the Medea Regnum zone. [neoZeo] & [hedronii] are settled by Pacificus ships.
            Cyc 63: The Extinguishing Plague infects Venezia & leaves [borea] & [medeaTerra] severely underpopulated. Dante of [remia] writes his epic vision of [samsara].
            Cyc 64: Johannes Gutenberg publishes Yeshuan texts on an early commnet in [germanus]. The plasma rifle is perfected. Zheng He's treasure fleet launches from [medeaRegnum]. Cristóbal Colón returns to [iberia] from the [americus] system & advocates interstellar conquest.
            Cyc 65: Starting in [Borea], the Yeshuan Church enters into civil war over disagreements about how to interpret Network logs.
            Cyc 66: In [britannia], Isaac Newton supplants the Aristotelian theory of planetary motion with his gravitas model.
            Cyc 67: The Revolution of [gallia] brings democracy to the world stage.
        `;

        // TODO - name & page for Easter Island, settled Cyc 53. Also Tahiti, settled earlier.

        console.log(
            this.shorthand2Html(shorthand)
        );
    }

    shorthand2Html (shorthand) {
        const lines = shorthand.split('\n');

        return lines.map(
            line => {
                line = line.trim();
                let leftI = line.indexOf('[');

                while (leftI >= 0) {
                    // const rightI = line.slice(leftI).indexOf(']');
                    const rightI = line.indexOf(']');
                    const key = line.slice(leftI + 1, rightI);
                    const displayName = Util.fromCamelCase(key);

                    line = line.slice(0, leftI) + `<a href="${key}.html">${displayName}</a>` + line.slice(rightI + 1);

                    leftI = line.indexOf('[');

                    Util.logDebug({
                        line,
                        leftI,
                        rightI,
                        key,
                        displayName,
                    });

                    // break;
                }

                return this.htmlPassage(line);
            }
        )
        .join('\n');
    }

    static run () {
        const wiki = new WikiWriter();
        // wiki.setupPages();
        wiki.convertShorthandCache();
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

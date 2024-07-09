'use strict';

const Util = require('../util.js');

const { exec } = require('child-process');
const fs = require('fs');
const https = require('node:https');
const path = require('path');

class FandomScraper {
    static run () {
        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('fandomscraper.js') ||
            ! process.argv[2]) {

            return Util.logError(`Usage: node fandomscraper.js harrypotter`);
        }

        const scraper = new FandomScraper(process.argv[2]);
    }

    constructor (wikiName) {
        this.wikiName = wikiName;
        this.wikiDirPath = path.join(__filename, '..', this.wikiName);

        this.start();
    }

    start () {
        if (fs.existsSync(this.wikiDirPath)) {
            // A directory for this wiki already exists here.

            const fileNames = fs.readdirSync(this.wikiDirPath);

            if (fileNames.some(
                name => name.endsWith('.html')
            )) {
                return Util.logError(`HTML files for ${this.wikiName}.fandom.com are already downloaded. Stopping.`);
            }
        }
        else {
            fs.mkdirSync(this.wikiDirPath);
        }

        // Read this wiki's Statistics page
        const chunks = [];

        // https.get() - LATER
        const statsRequest = https.request(
            `https://${this.wikiName}.fandom.com/wiki/Special:Statistics`,
            {},
            response => {
                console.log(`STATUS: ${response.statusCode}`);

                response.setEncoding('utf8');

                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    Util.log('No more data in response.');

                    this.parseStatisticsResponse(chunks);
                });
            },
        );

        statsRequest.on('error', (e) => {
            throw new Error(e);
        });

        // LATER - honestly i'm slightly confused what end() is doing.
        statsRequest.end();
    }

    parseStatisticsResponse (chunks) {
        // Find the link to latest xml in the Statistics response.
        const ID_STRING = "id='mw-input-wp1'";

        const responseString = chunks.join('');

        const beforeAfterId = responseString.split(ID_STRING);

        // Then look for the next unescaped 'href' after that.
        const afterHref = beforeAfterId[1]
            .split('href="')[1]
            .trim();

        // const urlPart = afterHref.slice(2);
        const endQuoteIndex = afterHref.indexOf('"');
        const url = afterHref.slice(0, endQuoteIndex);

        // debug
        const snippetAfterHref = afterHref.slice(0, 6);

        Util.logDebug({
            wp1Index: responseString.indexOf('mw-input-wp1'),
            anyHrefIndex: responseString.indexOf('href'),
            // responseStart: responseString.slice(0, 9999),
            beforeAfterLengths: beforeAfterId.map(s => s.length),
            afterHrefStart: afterHref.slice(0, 99),
            endQuoteIndex,
            snippetAfterHref,
            url,
        });

        this.downloadXml(url);
    }

    downloadXml (url) {
        this.xmlName = 'pages_current.xml';

        const writeStream = fs.createWriteStream(`${this.wikiName}/${this.xmlName}.7z`);

        const xmlRequest = https.get(
            url,
            response => response.pipe(writeStream)
        );

        xmlRequest.on(
            'error',
            e => { throw new Error(e); }
        );

        xmlRequest.on(
            'finish',
            () => this.decompress()
        );
    }

    decompress () {
        exec(
            `7za x ${this.wikiName}/${this.xmlName}.7z`,
            (error, stdout, stderr) => {
                if (error) {
                    throw new Error(error);
                }

                if (stderr) {
                    console.error(stderr);
                }

                console.log(stdout);
            }
        );
    }
}

module.exports = FandomScraper;

FandomScraper.run();

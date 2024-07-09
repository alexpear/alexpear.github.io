'use strict';

const Util = require('../util.js');

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

        const wikiName = process.argv[2];
        const wikiDirPath = path.join(__filename, '..', wikiName);

        if (fs.existsSync(wikiDirPath)) {
            // A directory for this wiki already exists here.

            const fileNames = fs.readdirSync(wikiDirPath);

            if (fileNames.some(
                name => name.endsWith('.html')
            )) {
                return Util.logError(`HTML files for ${wikiName}.fandom.com are already downloaded. Stopping.`);
            }
        }
        else {
            fs.mkdirSync(wikiDirPath);
        }

        // Read this wiki's Statistics page
        const chunks = [];

        const statsRequest = https.request(
            `https://${wikiName}.fandom.com/wiki/Special:Statistics`,
            {},
            response => {
                console.log(`STATUS: ${response.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

                response.setEncoding('utf8');

                response.on('data', (chunk) => {
                    // console.log(chunk);
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    Util.log('No more data in response.');

                    FandomScraper.parseStatisticsResponse(chunks);
                });
            },
        );

        statsRequest.on('error', (e) => {
            throw new Error(e);
        });

        // LATER - honestly i'm slightly confused what end() is doing.
        statsRequest.end();
    }

    static parseStatisticsResponse (chunks) {
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

        FandomScraper.downloadXml(url);
    }

    static downloadXml (url) {
        const writeStream = fs.createWriteStream(`${wikiName}/pages_current.xml.7z`);

    }
}

module.exports = FandomScraper;

FandomScraper.run();

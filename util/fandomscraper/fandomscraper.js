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
                console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

                response.setEncoding('utf8');

                response.on('data', (chunk) => {
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

        statsRequest.end();

        // Find the link to latest xml in the Statistics response.
        const ID_STRING = "id='mw-input-wp1'";

        const responseString = chunks.join('');

        Util.logDebug({
            wp1Index: responseString.indexOf('mw-input-wp1'),
            anyHrefIndex: responseString.indexOf('href'),
            responseStart: responseString.slice(0, 9999),
        });

        const beforeAfterId = responseString.split(ID_STRING);

        // Then look for the next 'href' after that.
        const afterHref = beforeAfterId[1]
            .split('href')[1]
            .trim();

        const urlPart = afterHref.slice(2);
        const endQuoteIndex = urlPart.indexOf('"');
        const url = urlPart.slice(0, endQuoteIndex);

        Util.log(url);

    }

    static parseStatisticsResponse (chunks) {
        // TODO
    }
}

module.exports = FandomScraper;

FandomScraper.run();

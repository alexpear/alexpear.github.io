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

            if (fs.globSync(wikiName + '/*.html')) {
                return Util.logError(`HTML files for ${wikiName}.fandom.com are already downloaded. Stopping.`);
            }
        }
        else {
            fs.mkdirSync(wikiDirPath);
        }

        // Read this wiki's Statistics page
        const statsRequest = https.request(
            `https://${wikiName}.fandom.com/Special:Statistics`,
            {},
            response => {
                console.log(`STATUS: ${response.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

                res.setEncoding('utf8');

                res.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });

                res.on('end', () => {
                    console.log('No more data in response.');
                });
            },
        );

        request.on('error', (e) => {
            throw new Error(e);
        });

        req.end();

        // TODO find the link to latest xml in the Statistics response.

    }
}

module.exports = FandomScraper;

FandomScraper.run();

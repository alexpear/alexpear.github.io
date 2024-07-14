'use strict';

const Util = require('../util.js');

const fs = require('fs');
const https = require('node:https');
const { JSDOM } = require('jsdom');
const path = require('path');
const { spawn } = require('child_process');
const Split = require('split');
const XmlStream = require('xml-stream');

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

            if (this.dirContains('.html')) {
                return;
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

    dirContains (ending) {
        if (fs.existsSync(this.wikiDirPath)) {
            // A directory for this wiki already exists here.

            const fileNames = fs.readdirSync(this.wikiDirPath);

            if (fileNames.some(
                name => name.endsWith(ending)
            )) {
                Util.log(`${ending} file(s) for ${this.wikiName}.fandom.com already downloaded.`);

                return true;
            }
        }

        return false;
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
        this.url = afterHref.slice(0, endQuoteIndex);

        // debug
        const snippetAfterHref = afterHref.slice(0, 6);

        Util.logDebug({
            wp1Index: responseString.indexOf('mw-input-wp1'),
            anyHrefIndex: responseString.indexOf('href'),
            // responseStart: responseString.slice(0, 9999),
            beforeAfterLengths: beforeAfterId.map(s => s.length),
            // afterHrefStart: afterHref.slice(0, 99),
            endQuoteIndex,
            // snippetAfterHref,
            url: this.url,
        });

        this.setupXml();
    }

    setupXml () {
        this.xmlName = 'pages_current.xml';

        if (this.dirContains('.7z')) {
            // Debug for cleaning up 0-byte .7z files.
            // throw new Error(`You should call -> mv ${this.wikiName}/${this.xmlName}.7z backup/${this.wikiName}_${Math.random().toString().slice(2)}_${this.xmlName}.7z`);

            // Skip ahead.
            this.decompress();
            return;
        }

        Util.logDebug({
            context: `setupXml()`
        });

        this.writeStream = fs.createWriteStream(`${this.wikiName}/${this.xmlName}.7z`);

        this.writeStream.on(
            'open',
            fileDescriptor => this.downloadXml()
        );
    }

    downloadXml () {
        Util.logDebug({
            context: `top of downloadXml()`
        });

        const xmlRequest = https.get(
            this.url,
            response => response.pipe(this.writeStream)
        );

        xmlRequest.on(
            'error',
            e => { throw new Error(e); }
        );

        this.writeStream.on(
            'finish',
            () => {
                Util.logDebug({
                    context: `downloadXml(), 'finish' event emitted.`
                });

                this.writeStream.close();
                this.decompress();
            }
        );
    }

    decompress () {
        if (this.dirContains('.xml')) {
            // Skip ahead.
            this.parseXml();
            return;
        }

        const archivePath = `${this.wikiName}/${this.xmlName}.7z`;

        Util.logDebug(`7za x ${archivePath} -o${this.wikiName}`);

        const decompression = spawn('7za', ['x', archivePath, `-o${this.wikiName}`]);

        decompression.stdout.on(
            'data',
            data => console.log(data)
        );

        decompression.stderr.on(
            'data',
            data => console.error(data)
        );

        decompression.on(
            'close',
            exitCode => {
                Util.log(`decompress() ended w/ exit code ${exitCode}`);
                this.parseXml();
            }
        );
    }

    parseXml () {
        Util.logDebug(`start of parseXml()`);

        let examplesLogged = 0;

        const readStream = fs.createReadStream(`${this.wikiName}/${this.xmlName}`);

        const xmlStream = new XmlStream(readStream);

        xmlStream.on(
            'endElement: page',
            pageObj => {
                // If you have already logged many times, be less willing to log again.
                if (Math.random() < 1) {//} (1 / (examplesLogged + 1))) {
                    examplesLogged++;

                    // TODO bug - i think this .js module crashes silently when logging one of the first DC pages.
                    Util.logDebug({
                        examplesLogged,
                        pageObj,
                        title: pageObj?.title,
                    });

                    // if (
                    //     ! pageObj ||
                    //     ! pageObj.revision
                    // ) {

                    // }

                    // const textString = Util.access(pageObj, 'revision.text.$text');

                    // if (! textString) {
                    //     return;
                    // }

                    const textFormatted = pageObj?.revision?.text?.['$text']
                        .replaceAll(' | ', '\n')
                        .replaceAll(' *', '\n *');

                    console.log(pageObj?.title);
                    console.log(textFormatted);
                    console.log();
                }
            }
        );

        readStream.on(
            'close',
            event => {
                Util.log(`parseXml() done`);
            }
        );
    }
}

module.exports = FandomScraper;

FandomScraper.run();

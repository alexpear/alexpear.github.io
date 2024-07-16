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
                // return;
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

        let pageCount = 0;
        let examplesLogged = 0;

        const SKIPPED_PREFICES = [
            'File',
            'File Talk',
            'User',
            'Talk',
            'User Talk',
            'Category Talk',
            'Template',
            'Template Talk',
            'Thread',
            'Board Thread',
            'Message Wall',
            'User blog',
            'User blog comment',
            'MediaWiki',
        ];

        const prefices = {};

        const readStream = fs.createReadStream(`${this.wikiName}/${this.xmlName}`);

        const xmlStream = new XmlStream(readStream);

        xmlStream.on(
            'endElement: page',
            pageObj => {
                pageCount++;

                const title = pageObj?.title;

                let prefix;

                if (title) {
                    if (title.includes(':')) {
                        prefix = title.split(':')[0];
                    }
                    else {
                        prefix = 'normal';
                    }
                }
                else {
                    prefix = 'noTitle';
                }

                if (prefices[prefix]) {
                    prefices[prefix]++;
                }
                else {
                    prefices[prefix] = 1;
                }

                // if (/^10+$/.test(pageCount)) {
                //     console.log(`Page ${pageCount}:`);

                //     this.logHistogram(prefices);
                // }

                if (SKIPPED_PREFICES.includes(prefix)) {
                    return;
                }

                // const debugStr = Util.access(pageObj, 'revision.text.$text');
                // if (debugStr?.indexOf('| Province') >= 0) {
                //     Util.logDebug(debugStr);
                // }

                // If you have already logged many times, be less willing to log again.
                if (Math.random() < (1 / Math.pow(2, examplesLogged))) {
                    examplesLogged++;

                    const textString = Util.access(pageObj, 'revision.text.$text');

                    if (! textString) {
                        return Util.log(pageObj);
                    }

                    // const textFormatted = textString.replaceAll(' | ', '\n')
                    //     .replaceAll(' *', '\n *');

                    console.log(`Example ${examplesLogged}:`);
                    // console.log(pageObj?.title);
                    console.log(this.pageHtmlStr(pageObj?.title, textString));
                    console.log();

                    // TODO
                    // Some wikis still download empty .7z files
                    // Write to a .html file
                    // Convert {{curly link}}s to <a href>s as well as [[square]] ones
                    // Except not double-curlys like those big ones that cover almost the entire page, like {{DC Database:Character Template ...
                    // . Maybe do this by just skipping ahead if the first few chars are: {{DC Database:
                    // . But somehow make that initial string dynamic because it varies by wiki.
                    // . Or perhaps check for another {{ while already inSquares === false.
                }
            }
        );

        readStream.on(
            'close',
            event => {
                this.logHistogram(prefices);

                Util.log(`parseXml() done`);
            }
        );
    }

    pageHtmlStr (title, text) {
        Util.logDebug({
            context: `pageHtmlStr() top`,
            title,
            text,
        });

        const HEADSTUFF =
`<html>
  <head>
    <meta charset="utf-8">
    <link href="wikiArticle.css" rel="stylesheet" />
  </head>

  <body>
    <div id="header"></div>

    <div id="main">
      <label id="title">`;

        const ENDSTUFF =`
     </div>
  </body>
</html>`;

        return `${HEADSTUFF}${title}</label>
        <p>${ this.strAsHtml(text) }</p>${ENDSTUFF}`;
    }

    strAsHtml (wikiStr) {
        let htmlStr = '';
        let index = 0;

        wikiStr = wikiStr.replaceAll(/ [A-z]+\s+= \|/g, '') // Remove empty attributes.
            .replaceAll(' | ', '\n<br>')
            .replaceAll(' *', '\n<br> *');

        // If this conditional encounters a lot of pages like: {{template1}} {{template2}}, remove it.
        if (
            wikiStr.startsWith('{{') &&
            wikiStr.endsWith('}}')
        ) {
            wikiStr = wikiStr.slice(
                2,
                wikiStr.length - 4
            );
        }

        for (let n = 0; n < 9999999; n++) {
            // Util.logDebug({
            //     context: `strAsHtml() top of loop`,
            //     index,
            //     htmlStrLength: htmlStr.length,
            //     wikiStrLength: wikiStr.length,
            // });

            // LATER tidy or functionize if possible. And add tests.

            const stepsToOpenSquare = wikiStr.slice(index)
                .indexOf('[[');
            const stepsToOpenCurly = wikiStr.slice(index)
                .indexOf('{{');

            let stepsToOpen = 0;
            let inSquares = true;

            if (stepsToOpenSquare < 0) {
                if (stepsToOpenCurly < 0) {
                    htmlStr += wikiStr.slice(index);
                    break; // Done looping.
                }

                stepsToOpen = stepsToOpenCurly;
                inSquares = false;
            }
            else {
                if (stepsToOpenCurly < 0) {
                    stepsToOpen = stepsToOpenSquare;
                    inSquares = true;
                }
                else {
                    if (stepsToOpenSquare < stepsToOpenCurly) {
                        stepsToOpen = stepsToOpenSquare;
                        inSquares = true;
                    }
                    else {
                        stepsToOpen = stepsToOpenCurly;
                        inSquares = false;
                    }
                }
            }

            // Add normal text
            htmlStr += wikiStr.slice(
                index,
                index + stepsToOpen
            );

            index += stepsToOpen;

            const stepsToBar = wikiStr.slice(index)
                .indexOf('|');

            const closeSymbol = inSquares ? ']]' : '}}';

            const stepsToClose = wikiStr.slice(index)
                .indexOf(closeSymbol);

            const stepsToNextSquares = wikiStr.slice(index + 2)
                .indexOf('[[');
            const stepsToNextCurlies = wikiStr.slice(index + 2)
                .indexOf('{{');

            const stepsToNestedOpen = Math.min(stepsToNextSquares, stepsToNextCurlies);

            if (
                stepsToNestedOpen >= 0 &&
                (stepsToNestedOpen + 2) < stepsToClose
            ) {
                // We discovered nesting, so we treat the outer brackets as inert text.
                htmlStr += wikiStr.slice(index, index + 2);
                index += 2;
                continue;
            }

            let linkedTitle = '';
            let linkName = '';

            if (
                0 <= stepsToBar &&
                stepsToBar < stepsToClose
            ) {
                linkedTitle = wikiStr.slice(
                    index + 2,
                    index + stepsToBar
                );

                linkName = wikiStr.slice(
                    index + stepsToBar + 1,
                    index + stepsToClose
               );
            }
            else {
                // No bar in this link.
                linkedTitle = wikiStr.slice(
                    index + 2,
                    index + stepsToClose
                );

                linkName = linkedTitle;
            }

            htmlStr += `<a href="${linkedTitle}.html">${linkName}</a>`;

            index += stepsToClose + 2;
        }

        return htmlStr;
    }

    logHistogram (obj) {
        const sorted = Object.entries(obj)
            .sort(
                (tupleA, tupleB) => {
                    if (tupleA[1] !== tupleB[1]) {
                        return tupleA[1] - tupleB[1];
                    }

                    return tupleB[0].localeCompare(tupleA[0]);
                }
            )
            .map(
                tuple => `${tuple[0]}: x${tuple[1]}`
            );

        Util.log(sorted);
    }
}

module.exports = FandomScraper;

FandomScraper.run();

// Run this script to transform downloaded Complicity pdf to TTS-ready image files.

// Prereqs:
// Mac Lechuza laptop
// ~/Downloads/complicity/tts/pdf2jpg-tts.js

// brew install poppler
// ^ this installs pdfseparate & pdftoppm

// brew install imagemagick
// ^ installs convert

const Util = require('/Users/nexech/alexpear.github.io/util/util.js');

const CP = require('child_process');
const FS = require('fs');

function run () {

    // Later, collect all copies from Downloads. Will have to deal with name collisions.
    // mv `~/Downloads/Complicity\ TI\ Card\ Game*.pdf` `${__dirname}/unedited-pdf-for-script`

    // Later, find last-modified pdf in that dir. That way we dont have to hard code its exact file name here.

    Util.logDebug(`pdfseparate ${__dirname}/unedited-pdf-for-script/Complicity\\ TI\\ Card\\ Game.pdf page%d.pdf`);

    CP.execSync(`pdfseparate ${__dirname}/unedited-pdf-for-script/Complicity\\ TI\\ Card\\ Game.pdf page%d.pdf`);

    // TODO operate on sets of pages by card back:
        // Ignore rules pages 1-6
        // Hive cards
            // Okay to leave Bank among the Hives. TTS script can pull it out during setup.
        // Role cards
        // Landscape cards

    const allFileNames = FS.readdirSync(__dirname);

    const pageFileNames = allFileNames.filter(
        name => /^page[0-9]+.pdf$/.test(name)
    );

    const pageNumbers = pageFileNames.map(
        name => Number(
            name.slice(4, name.length - 4)
        )
    );

    const lastPageNum = Math.max(...pageNumbers);

    const firstCardPage = 7;

    for (let i = firstCardPage; i <= lastPageNum; i++) {
        console.log(`starting to process pdftoppm page ${i}`);

        CP.execSync(`pdftoppm -jpeg -r 400 ${__dirname}/page${i}.pdf page${i}`);

        // now crop the output jpg
        // Surprisingly page 7 has different margins
        const dimensions = i === 7 ?
            '3000x4216+118+93' :
            '3000x4216+118+38';

        CP.execSync(`magick page${i}-1.jpg -crop ${dimensions} cropped${i}.jpg`);
        // TODO double check these pixels, esp the last param - height offset
    }

    const jpgNames = Array.from(
        { length: lastPageNum },
        (_unused, i) => i + 1,
    )
    .filter(
        num => num >= firstCardPage
    )
    .map(
        num => `cropped${num}.jpg`
    )
    .join(' ');

    // Stitch all pages into big JPGs
    CP.execSync(`magick ${jpgNames} +append jpgs-for-tts/test.jpg`);

    // Cleanup
    CP.execSync(`mv *.jpg *.pdf temp/`);
}

run();

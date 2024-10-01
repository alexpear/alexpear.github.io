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
    // Find last-modified pdf in Downloads/ dir.
    const latestPdfName = String(
        CP.execSync(`ls -t ~/Downloads/Complicity\\ TI\\ Card\\ Game*.pdf | head -n1`)
    );

    const escapedLatest = latestPdfName.trim()
        .replace( /\s/g, '\\ ' )
        .replace( /\(/g, '\\(' )
        .replace( /\)/g, '\\)' );

    const cpCommand = `cp ${escapedLatest} ${__dirname}/unedited-pdf-for-script/Complicity\\ TI\\ Card\\ Game.pdf`;
    console.log(cpCommand);
    CP.execSync(cpCommand);

    const separateCommand = `pdfseparate ${__dirname}/unedited-pdf-for-script/Complicity\\ TI\\ Card\\ Game.pdf page%d.pdf`;
    console.log(separateCommand);
    CP.execSync(separateCommand);

    // Ignore rules pages 1-6
    // Hive cards
        // Okay to leave Bank among the Hives. The Steam Workshop table can pull it out as part of setup.
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

    // Hardcoded page numbers that don't change much.
    const firstCardPage = 7;
    const firstRolePage = 11;
    const lastPageNum = Math.max(...pageNumbers);
    const firstLandscapePage = lastPageNum;

    for (let i = firstCardPage; i <= lastPageNum; i++) {
        console.log(`pdftoppm - page ${i}`);

        CP.execSync(`pdftoppm -jpeg -r 400 ${__dirname}/page${i}.pdf page${i}`);

        // now crop the output jpg
        let dimensions = '3000x4216+117+39'; // TODO double check this one

        if (i === firstCardPage) {
            // Surprisingly the first card page has different margins
            dimensions = '3000x4216+117+94';
        }
        else if (i >= firstLandscapePage) {
            dimensions = '2806x3017+294+39';
        }

        CP.execSync(`magick page${i}-1.jpg -crop ${dimensions} cropped${i}.jpg`);
    }

    const allPageNums = Array.from(
        { length: lastPageNum },
        (_unused, i) => i + 1,
    );

    const hiveJpgNames = allPageNums.filter(
        num => firstCardPage <= num && num < firstRolePage
    )
    .map(
        num => `cropped${num}.jpg`
    )
    .join(' ');

    // Stitch hive pages into big JPG
    CP.execSync(`magick ${hiveJpgNames} +append complicity-tts/hive-cards.jpg`);

    // TODO jpg needs to be 10x7 at most
    // Hives: 2x2 pages = 6x6 cards

    const roleJpgNames = allPageNums.filter(
        num => firstRolePage <= num && num < firstLandscapePage
    )
    .map(
        num => `cropped${num}.jpg`
    )
    .join(' ');

    // Stitch role pages into big JPGs
    CP.execSync(`magick ${roleJpgNames} +append complicity-tts/role-cards.jpg`);

    // 9 pages of Roles - 81 > 70 - needs multiple jpgs
    // 1st jpg: 3x2 pages = 9x6 cards
    // 2nd jpg: 3x1 pages = 9x3 cards

    if (lastPageNum > firstLandscapePage) {
        Util.logError({
            problem: `Expected only 1 page of landscape-orientation cards at the end of the pdf.`,
            lastPageNum,
            firstLandscapePage,
        });
    }

    CP.execSync(`mv cropped${firstLandscapePage}.jpg complicity-tts/starter-cards-landscape.jpg`);

    // Cleanup
    CP.execSync(`mv *.jpg *.pdf temp/`);

    console.log('Done - .jpg files in complicity-tts/ folder have been updated :)');
}

run();

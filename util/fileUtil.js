'use strict';

const Util = require('./util.js');

const Crypto = require('crypto');
const FS = require('fs');

class FileUtil {
    static init () {
        FileUtil.clearCache();
        FileUtil.DUPLICATE = 'duplicate';
    }

    static flattenDir () {
        // Might cache all checksums in target dir.
        FileUtil.init();

        const targetPath = process.cwd();
        Util.logDebug(`process.cwd() is ${process.cwd()}`);
        // Okay, so process.cwd() is where you run the node command from, and it does not end in '/', at least on MacOS.

        if (! FS.existsSync(targetPath + '/' + FileUtil.DUPLICATE)) {
            Util.logDebug('going to create duplicate dir');
            FS.mkdirSync(FileUtil.DUPLICATE);
        }

        FileUtil.flattenTo(targetPath, targetPath);

        FileUtil.clearCache();
    }

    // Helper func
    static flattenTo (notFlatPath, targetPath) {
        const items = FS.readdirSync(notFlatPath);
        for (let item of items) {
            // Util.logDebug(`${item} in ${notFlatPath} has typeof ${typeof item}`);

            const itemPath = notFlatPath + '/' + item;
            // console.log(`  itemPath is ${itemPath}`);

            if (FS.lstatSync(itemPath).isDirectory()) {
                if (item === FileUtil.DUPLICATE) {
                    console.log('    duplicate/ dir detected');
                    continue;
                }

                // console.log('    dir detected');

                FileUtil.flattenTo(itemPath, targetPath);
            }

            FileUtil.moveSafely(itemPath, targetPath);
        }
    }

    static moveSafely (itemPath, targetPath) {
        // console.log(`    moveSafely(${itemPath}, ${targetPath}) called.`);

        const parts = itemPath.split('/');
        let itemName = parts[parts.length - 1];
        const fileAtTarget = targetPath + '/' + itemName;

        if (itemPath === fileAtTarget) {
            return;
        }

        const contents = FS.readFileSync(itemPath);
        const checksum = FileUtil.checksum(contents);
        // console.log(`      checksum is ${checksum}`);

        if (FileUtil.cache[checksum]) {
            // File already present in target dir.
            const dupPath = targetPath + '/' + FileUtil.DUPLICATE + '/' + itemName;
            console.log(`      dupPath is ${dupPath}`);
            FS.renameSync(itemPath, dupPath);
            return;
        }

        if (FS.existsSync(fileAtTarget)) {
            // Name collision
            itemName = FileUtil.appendHash(itemName);
            console.log(`      new itemName is ${itemName}`);
        }

        console.log(`      About to call FS.renameSync(${itemPath}, ${targetPath + '/' + itemName})`);

        // This seems to work even when the filename has a space in it.
        FS.renameSync(itemPath, targetPath + '/' + itemName);

        FileUtil.cache[checksum] = itemName;
    }

    static checksum (str) {
        return Crypto.createHash('md5')
            .update(str, 'utf8')
            .digest('hex');
    }

    // No side effects
    static appendHash (str) {
        const hash = '-' + Util.newId(5);
        // console.log(`      hash is ${hash}`);

        const doti = str.lastIndexOf('.');

        if (doti < 0) {
            return str + hash;
        }

        return str.slice(0, doti) +
            hash +
            str.slice(doti, str.length);
    }

    static clearCache () {
        FileUtil.cache = {};
    }

    static run () {
        FileUtil.flattenDir();
    }
}

FileUtil.run();

/*
Notes
Useful funcs
fs.opendirSync()
*/



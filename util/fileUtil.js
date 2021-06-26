'use strict';

const Util = require('./util.js');

const FS = require('fs');

class FileUtil {
    static init () {
        FileUtil.clearCache();
        FileUtil.DUPLICATE = 'duplicate';
    }

    // TODO replace placeholder funcs in this file with real filesystem calls.

    static flattenDir () {
        // Might cache all checksums in target dir.
        FileUtil.init();

        const targetPath = process.cwd();
        Util.logDebug(`process.cwd() is ${process.cwd()}`);
        // Okay, so process.cwd() is where you run the node command from, and it does not end in '/', at least on MacOS.

        if (! FS.existsSync(targetPath + '/' + FileUtil.DUPLICATE)) {
            Util.logDebug('going to create duplicate dir');
            // FS.mkdirSync(FileUtil.DUPLICATE);
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
            Util.logDebug(`itemPath is ${itemPath}`);

            if (FS.lstatSync(itemPath).isDirectory()) {
                if (item === FileUtil.DUPLICATE) {
                    continue;
                }

                // Make sure to not get confused between item name and path TODO
                FileUtil.flattenTo(itemPath, targetPath);
                continue;
            }

            FileUtil.moveSafely(itemPath, targetPath);
        }
    }

    static moveSafely (itemPath, targetPath) {
        Util.logDebug(`moveSafely(${itemPath}, ${targetPath}) called.`);
        return; // remove later

        const checksum = checksum(item);

        if (FileUtil.cache[checksum]) {
            // File already present in target dir.
            mv(item, targetPath + FileUtil.DUPLICATE);
            return;
        }

        if (FS.existsSync(pathAndFile)) {
            // Name collision
            itemName = FileUtil.appendHash(item);
            FS.renameSync(itemPath, itemName);
            itemPath
        }

        mv(item, targetPath);

        FileUtil.cache[checksum] = item;
    }

    static appendHash (str) {
        const parts = str.split('.');

        // Later could make this shorter
        const hash = Util.newId();

        if (parts.length === 1) {
            return str + hash;
        }

        const penult = parts.length - 2;
        parts[penult] = parts[penult] + hash;

        return parts.join('');
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
fs.mkdirSync()
fs.opendirSync()
fs.renameSync()
*/



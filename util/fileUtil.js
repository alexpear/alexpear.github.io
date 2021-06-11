'use strict';

const Util = require('./util.js');

class FileUtil {
    static init () {
        FileUtil.clearCache();
        FileUtil.DUPLICATE = 'duplicate';
    }

    static flattenDir () {
        // Might cache all checksums in target dir.
        FileUtil.init();

        // TODO replace placeholder funcs in this file with real filesystem calls.
        const targetPath = pwd();

        FileUtil.flattenTo(targetPath, targetPath);

        FileUtil.clearCache();
    }

    // Helper func
    static flattenTo (unflattenedPath, targetPath) {
        for (let item in ls(unflattenedPath)) {
            const itemPath = unflattenedPath + '/' + item;

            if (isDir(item)) {
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
        const checksum = checksum(item);

        if (FileUtil.cache[checksum]) {
            // File already present in target dir.
            mv(item, targetPath + FileUtil.DUPLICATE);
            return;
        }

        if (ls(targetPath).indexOf(item) >= 0) {
            // Name collision
            itemName = FileUtil.appendHash(item);
            rename(itemPath, itemName);
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
        FileUtil.flattenDir(;
    }
}

FileUtil.run();



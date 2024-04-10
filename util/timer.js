'use strict';

// Utils for keeping track of times

class Timer {
    static hoursLeft (start, ratioDone, now) {
        const elapsed = now - start;
        // const ratioLeft = 1 - ratioDone;
        const total = elapsed / ratioDone;

        const left = total - elapsed;

        console.log(`${left.toFixed(1)} hours left`);
        return left;

        // start - (now + hoursLeft) === elapsed + hoursLeft
        // ratioLeft === hoursLeft / (elapsed + hoursLeft)
        // 1 - ratioDone === hoursLeft / (now - start + hoursLeft)
        // (1 - ratioDone) * (now - start + hoursLeft) === hoursLeft
        // (now - start + hoursLeft) - ratioDone * (now - start + hoursLeft) === h
        // now - start + h - ratioDone * (now - start) - ratioDone * h === h
        // (1 - ratioDone) * (now - start) - ratioDone * h === 0
        // (1 - ratioDone) * (now - start) === ratioDone * h
        // (1 - ratioDone) * (now - start) / ratioDone === h
        // could stop here
        // (1 - ratioDone) * (elapsed) / ratioDone === h
        // (elapsed - elapsed * ratioDone) / ratioDone === h
        // elapsed / ratioDone - elapsed === h
    }

    static run (start, ratioDone, now) {
        return Timer.hoursLeft(start, ratioDone, now);
    }
}

// Timer.run(9.4, 0.65, 13.8); // 2.4 left
Timer.run(9.4, 0.8, 14.5); // 1.3 left

'use strict';

const Util = require('../util/util.js');

const d20 = require('d20');

class Dice {
	static check (dc, modifier) {
		if (! Util.exists(dc)) {
			dc = 15;
		}

		modifier = modifier || 0;

		const roll = d20.roll(20);

		if (roll === 1) {
			return Dice.CriticalFailure;
		}
		else if (roll === 20) {
			return Dice.CriticalSuccess;
		}
		else if ((roll + modifier) >= dc) {
			return Dice.Success;
		}

		return Dice.Failure;
	}
}

Dice.CriticalSuccess = 'criticalSuccess';
Dice.Success = 'success';
Dice.Failure = 'failure';
Dice.CriticalFailure = 'criticalFailure';

module.exports = Dice;

// Dice.test();

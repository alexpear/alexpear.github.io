'use strict';

module.exports = `

* output
1 army

* childrenof army
4x
2x
1x

* childrenof oldArmy
6x
3x
1x

* childrenof 4x
{unit}

* childrenof 2x
{unit}

* childrenof 1x
{unit}

* alias size
9 500Points
5 1000Points
9 1500Points
9 2000Points
9 3000Points

* alias unitCount
9 6Units
9 10Units
9 20Units
9 30Units

* childrenof armyDistribution
{distributions}

* alias distributions
9 Bulk x3 Support x2 Unique x1
9 Bulk x6 Support x3 Unique x1
9 Bulk x13 Support x6 Unique x1

* alias unit
9 {infantry}
7 {vehicle}

* alias infantry
20 infantryPlatoon
9 heavyWeaponsSquad
7 sniperSquad
6 specialCommandStaff
8 sactionedPsyker
9 freshConscripts
9 penalLegion
9 ogyrns
9 ratlings
1 squats
9 tempestusStormtroopers
8 motorbikeScouts
9 roughRiders

* alias vehicle
9 sentinelWalker
9 lemanRussTank
3 banebladeSupertank
9 basiliskArtillery
9 valkyrie



`;

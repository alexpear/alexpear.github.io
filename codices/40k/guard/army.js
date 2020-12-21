'use strict';

module.exports = `

* output
1 army

* childrenof army
bulk
support
unique
{size}

* childrenof bulk
{unit}

* childrenof support
{unit}

* childrenof unique
{unit}

* alias size
9 500Points
5 1000Points
9 1500Points
9 2000Points
9 3000Points

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

* alias vehicle
9 sentinelWalker
9 lemanRussTank
3 banebladeSupertank
9 basiliskArtillery
9 valkyrie



`;

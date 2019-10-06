module.exports = `

* output
4 eliteMinor
4 gruntMinor
4 {anyJackal}
2 bruteMinor
1 droneMinor

* alias anyGrunt
4 gruntMinor
1 gruntMajor

* alias gruntLeader
4 gruntMajor
4 gruntHeavy
3 gruntUltra
2 gruntDeacon
2 specOpsGrunt

* alias anyJackal
4 shieldJackal
4 rifleJackal
1 skirmisherJackal

* alias eliteLeader
4 eliteMajor
2 eliteUltra
1 {rareElite}

* alias rareElite
4 specOpsElite
2 eliteOssoona
4 eliteZealot
1 eliteShipmaster
2 eliteFieldMarshal
0 eliteHonorGuard
0 eliteCouncilor

* alias pilot
4 eliteMinor
4 gruntMinor
1 bruteMinor


* template eliteMinor
tags: elite infantry
weight: 350
size: 2

* childrenof eliteMinor
{item/eliteMinorWeapon}

* template hunter
size: 3

* childrenof hunter
item/hunterCannon
item/hunterShield

* template bruteMinor
tags: brute infantry
size: 2

* childrenof bruteMinor
{item/bruteMinorWeapon}
item/spikeGrenade

* childrenof bruteStalker
{item/bruteMinorWeapon}
item/mauler
item/flameGrenade
item/activeCamoflage

* template shieldJackal
tags: jackal infantry
weight: 80
size: 1.5

* childrenof shieldJackal
item/handShield
item/plasmaPistol

* template rifleJackal
tags: jackal infantry
weight: 80
size: 1.5

* childrenof rifleJackal
{item/jackalRifle}
item/plasmaPistol

* template skirmisherJackal
tags: jackal infantry
weight: 80
size: 1.5

* childrenof skirmisherJackal
{item/skirmisherWeapon}

* template gruntMinor
size: 1

* childrenof gruntMinor
{item/gruntWeapon}
plasmaGrenade

* template droneMinor
size: 1.5

* childrenof droneMinor
{item/droneWeapon}

* template engineer
size: 1.5

* childrenof engineer
item/bombHarness

`;

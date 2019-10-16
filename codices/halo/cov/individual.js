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
size: 2
weight: 350
individuals: 1
maxSp: 100
damage: 65
attackDelay: 2
speed: 4

* childrenof eliteMinor
{item/eliteMinorWeapon}

* template hunter
size: 3
individuals: 1

* childrenof hunter
item/hunterCannon
item/hunterShield

* template bruteMinor
tags: brute infantry
size: 2
weight: 600
individuals: 1

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
individuals: 1

* childrenof shieldJackal
item/handShield
item/plasmaPistol

* template rifleJackal
tags: jackal infantry
weight: 80
size: 1.5
individuals: 1

* childrenof rifleJackal
{item/jackalRifle}
item/plasmaPistol

* template skirmisherJackal
tags: jackal infantry
weight: 80
size: 1.5
individuals: 1

* childrenof skirmisherJackal
{item/skirmisherWeapon}

* template gruntMinor
size: 1.5
weight: 250
individuals: 1
maxSp: 20
damage: 1
attackDelay: 2
speed: 2

* childrenof gruntMinor
{item/gruntWeapon}
plasmaGrenade

* template droneMinor
size: 1.5
individuals: 1

* childrenof droneMinor
{item/droneWeapon}

* template engineer
size: 1.5
individuals: 1

* childrenof engineer
item/bombHarness

`;

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
tags: elite infantry fleetGen
size: 2
weight: 350
individuals: 1
maxSp: 100
damage: 65
attackDelay: 2
speed: 4

* childrenof eliteMinor
{item/eliteMinorWeapon}

* childrenof hunter
item/hunterCannon
item/hunterShield

* template bruteMinor
tags: brute infantry fleetGen
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
tags: jackal infantry gridWar
weight: 80
cost: 1
size: 1
individuals: 1
speed: 12
moveType: infantry
durability: 150
resistance: pierce 3 fire 2
weapon: plasmaPistol

* childrenof shieldJackal
item/handShield
item/plasmaPistol

* template rifleJackal
tags: jackal infantry
cost: 1
weight: 80
size: 1
individuals: 1
speed: 13
moveType: infantry
durability: 60
weapon: carbine

* childrenof rifleJackal
{item/jackalRifle}
item/plasmaPistol

* template sniperJackal
size: 1
cost: 1
speed: 13
moveType: infantry
durability: 60
weapon: beamRifle

* template skirmisherJackal
tags: jackal infantry
weight: 80
size: 1.5
individuals: 1
cost: 2
speed: 13
moveType: infantry
durability: 60
weapon: beamRifle

* childrenof skirmisherJackal
{item/skirmisherWeapon}

* template gruntMinor
tags: fleetGen
size: 1.5
weight: 250
individuals: 1
maxSp: 20
durability: 3
damage: 1
attackDelay: 2
speed: 2
weapon: plasmaPistol

* childrenof gruntMinor
{item/gruntWeapon}
plasmaGrenade

* template droneMinor
tags: fleetGen
size: 1.5
individuals: 1

* childrenof droneMinor
{item/droneWeapon}

* template engineer
tags: fleetGen
size: 1.5
cost: 10
individuals: 1
speed: 7
durability: 50

* childrenof engineer
item/bombHarness

* template grunt
cost: 4
size: 1
speed: 8
moveType: infantry
ac: 19
sp: 30
durability: 30
toHit: 3
damage: 9
shots: 2
weapon: needler

* template gruntTest
tags: test
cost: 4
size: 1
speed: 8
moveType: infantry
durability: 30
weapon: rocketLauncher

* template jackal
cost: 7
size: 1
speed: 1
moveType: infantry
ac: 19
sp: 50
durability: 50
resistance: fire 2 pierce 5
toHit: 3
damage: 9
shots: 2
weapon: plasmaPistol

* template drone
cost: 5
size: 1
speed: 30
moveType: air
durability: 30
weapon: plasmaPistol

* template elite
cost: 15
size: 2
speed: 15
moveType: infantry
ac: 19
sp: 190
durability: 190
resistance: fire 1 impact 1
toHit: 3
damage: 9
shots: 2
weapon: plasmaRifle

* template brute
cost: 20
size: 2
speed: 9
moveType: infantry
ac: 19
sp: 190
durability: 190
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: spiker

* template bruteChieftain
cost: 200
size: 2
speed: 14
moveType: infantry
durability: 450
weapon: gravityHammer

* template hunter
cost: 140
size: 3
speed: 8
moveType: infantry
ac: 19
sp: 450
durability: 450
resistance: heat 2
toHit: 3
damage: 9
shots: 2
individuals: 1
weapon: fuelRodCannon

* template ghost
cost: 140
size: 4
speed: 35
moveType: skimmer
ac: 19
sp: 350
durability: 350
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaTurret
comment: 'vehicle templates in files named individual.txt are used to store Group traits in the GridWar bottle world.'

* template shade
cost: 15
size: 4
speed: 0
moveType: infantry
durability: 200
weapon: shadeCannon

* template spectre
cost: 200
size: 7
speed: 24
moveType: skimmer
ac: 19
sp: 400
durability: 400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaTurret

* template chopper
cost: 135
size: 6
speed: 28
moveType: wheeled
ac: 19
sp: 350
durability: 350
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: bruteShot

* template bruteProwler
cost: 190
size: 7
speed: 24
moveType: skimmer
ac: 19
sp: 400
durability: 400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaTurret

* template wraith
cost: 500
size: 9
speed: 18
moveType: skimmer
ac: 19
sp: 2500
durability: 2500
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaMortar

* template banshee
cost: 410
size: 7
speed: 60
moveType: air
ac: 19
sp: 400
durability: 400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: fuelRodCannon

* template phantom
cost: 240
size: 33
speed: 25
moveType: air
ac: 19
sp: 3500
durability: 3500
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: shadeCannon

* template spirit
cost: 235
size: 33
speed: 25
moveType: air
ac: 19
sp: 3500
durability: 3400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: shadeCannon

* template scarab
cost: 1400
size: 49
speed: 8
moveType: infantry
ac: 19
sp: 10000
durability: 10000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: scarabCannon

* template spire
tags: fleetGen
size: 50
speed: 25
moveType: air
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaTurret

* template lich
size: 103
cost: 2000
speed: 25
moveType: air
ac: 19
sp: 20000
durability: 20000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: shadeCannon

* template kraken
cost: 4500
size: 200
speed: 25
moveType: infantry
ac: 19
sp: 30000
durability: 30000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaMortar

* template harvester
cost: 6000
size: 278
speed: 25
moveType: infantry
ac: 19
sp: 40000
durability: 30000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: scarabCannon

* template corvette
cost: 10000
size: 980
speed: 25
moveType: air
ac: 19
sp: 20000
durability: 20000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: plasmaMortar

* template ccsLightCruiser
cost: 20000
size: 300
speed: 25
durability: 500000
moveType: air
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: scarabCannon

* template supercarrier
tags: fleetGen
size: 29000
durability: 10000000

* template highCharity
tags: fleetGen
size: 348000

`;

module.exports = `
* output
5 civilian
7 crewMember
10 marinePrivate
7 officer
5 odst
1 spartan

* template human
tags: creature animal biped terrestrial biological fleetGen
individuals: 1
weight: 80
size: 1.7
speed: 3
stealth: 10
sp: 10
damage: 2

* childrenof human
{gender}
mbti

* alias gender
10 female
10 male
1 postgender

* childrenof civilian
human

* childrenof crewMember
{unsc/item}
human

* alias scienceTeamMember
4 civilian
1 {output}

* alias squadLeader
4 marinePrivate
4 marineSpecialist
1 officer
1 odst

* childrenof marineSpecialist
{unsc/item/veteranWeapon}
{unsc/item/smallWeapon}
{unsc/item}
unsc/item/flakHelmet
unsc/item/flakArmor
human

* childrenof officer
{unsc/item/smallWeapon}
unsc/item/leatherCase
human

* childrenof helljumper
unsc/item/jetpack
{helljumperMember}

* alias helljumperMember
100 odst
1 spartan

* template spartan
tags: creature cyborg
cost: 35
size: 1.5
speed: 5
moveType: infantry
stealth: 12
weight: 120
sp: 20
durability: 28
damage: 4
weapon: dmr

* childrenof spartan
{unsc/item/anyWeapon}
{unsc/item/anyWeapon}
{unsc/item/anyGear}
unsc/item/fragGrenade
unsc/item/fragGrenade
{unsc/item/spartanMod}
{unsc/item/spartanArmor}
human

* alias driver
8 marinePrivate
10 crewMember
4 odst
1 spartan

* template dropPod
tags: thing vehicle fleetGen
weight: 1000

* childrenof dropPod
{dropPodSoldier}

* alias dropPodSoldier
80 odst
2 marineSpecialist
1 spartan
1 {output}

* alias groupStatted
4 marinePrivate
4 odst

* template marinePrivate
cost: 9
tags: creature fleetGen
size: 1
speed: 1
ac: 17
sp: 70
durability: 70
resistance: heat 2, pierce 1
weapon: assaultRifle
toHit: 2
damage: 2
shots: 3
comment: We are testing Death Planet using marinePrivate and have simplified their weapons temporarily. This marine has a SMG.

* childrenof marinePrivate
{unsc/item/giWeapon}
{unsc/item}
unsc/item/flakHelmet
unsc/item/flakArmor
human

* template marine
tags: creature
cost: 2
size: 1
speed: 9
moveType: infantry
ac: 17
sp: 70
durability: 70
resistance: fire 2, pierce 2
toHit: 2
damage: 2
shots: 3
attacks:
  SMG: +2 x2, 2 pierce
weapon: assaultRifle
comment: GridWar calls them 'marine', not 'marinePrivate'.

* template odst
cost: 11
tags: creature
size: 1
speed: 9
moveType: infantry
ac: 19
sp: 100
durability: 100
resistance: fire 2, pierce 3
toHit: 2
damage: 2
shots: 3
weapon: battleRifle
attacks: 
  battleRifle: +2 x2, 2 pierce
comment: I believe nothing reads the 'attacks' section yet.

* childrenof odst
{unsc/item/veteranWeapon}
{unsc/item/smallWeapon}
{unsc/item/anyGear}
unsc/item/visrHelmet
unsc/item/odstArmor
unsc/item/fragGrenade
human

* template officer
tags: creature fleetGen
size: 1
speed: 9
moveType: infantry
sp: 14
durability: 14
weapon: lightPistol

* template mongoose
cost: 3
size: 4
speed: 2
moveType: wheeled
ac: 21
sp: 80
durability: 80
resistance: heat 2 pierce 1
toHit: 1
damage: 50
shots: 0.5
weapon: smg

* template warthog
cost: 190
size: 6
speed: 25
moveType: wheeled
ac: 19
sp: 400
durability: 400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: chaingun
comment: 'vehicle templates in files named individual.txt are used to store Group traits in the GridWar bottle world.'

* template transportWarthog
size: 6
tags: fleetGen
comment: 'Later this would benefit from template inheritance.'

* template mantis
cost: 240
size: 4
speed: 9
moveType: infantry
durability: 2000
weapon: chaingun

* template hornet
cost: 300
size: 10
speed: 25
moveType: hover
ac: 19
sp: 350
durability: 350
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: rocketLauncher

* template wasp
cost: 300
size: 9
speed: 40
moveType: hover
durability: 350
weapon: rocketLauncher

* template scorpion
cost: 500
size: 10
speed: 15
moveType: wheeled
ac: 21
sp: 2200
durability: 2200
resistance: heat 1 pierce 4
toHit: 1
damage: 50
shots: 0.5
weapon: tankCannon

* template elephant
cost: 300
size: 25
speed: 9
moveType: wheeled
ac: 19
sp: 2000
durability: 2000
resistance: heat 2 pierce 5
toHit: 3
damage: 9
shots: 2
weapon: chaingun

* template falcon
cost: 300
size: 10
speed: 25
moveType: hover
ac: 19
sp: 360
durability: 360
resistance: heat 2
weapon: chaingun

* template pelican
cost: 350
size: 31
speed: 25
moveType: hover
ac: 19
sp: 50
durability: 1400
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: chaingun

* template mammoth
cost: 400
size: 68
speed: 25
moveType: wheeled
ac: 19
sp: 50
durability: 10000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: tacticalMac

* template missileSilo
tags: fleetGen
cost: 2000
size: 40
speed: 0
moveType: wheeled
ac: 19
sp: 3000
durability: 3000
resistance: heat 2
weapon: icbm

* template macTurret
cost: 1
size: 30
speed: 0
moveType: wheeled
durability: 400
weapon: tacticalMac

* template frigate
cost: 10000
size: 500
speed: 25
moveType: hover
ac: 19
sp: 30000
durability: 30000
resistance: heat 2
toHit: 3
damage: 9
shots: 2
weapon: frigateMac

* template marathonCruiser
tags: fleetGen
size: 1170
comment: possibly rename to cruiser

* template spiritOfFire
tags: fleetGen
size: 2500

* template infinity
tags: fleetGen
size: 5000
moveType: hover

`;

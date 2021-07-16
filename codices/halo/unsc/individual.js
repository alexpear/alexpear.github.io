module.exports = `
* output
5 civilian
7 crewMember
10 marinePrivate
7 officer
5 odst
1 spartan

* template human
tags: creature animal biped terrestrial biological
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
size: 1.5
weight: 120
sp: 20
durability: 28
damage: 4
speed: 5
stealth: 12
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
tags: thing vehicle
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
tags: creature
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
size: 1
speed: 1
ac: 17
sp: 10
resistance: fire 2, pierce 2
toHit: 2
damage: 2
shots: 3
attacks: 
  SMG: +2 x2, 2 pierce
comment: GridWar calls them 'marine', not 'marinePrivate'. This marine has a SMG.

* template odst
cost: 11
tags: creature
size: 1
speed: 1
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
size: 1
speed: 1
sp: 5

* template mongoose
size: 4
speed: 2
ac: 21
sp: 150
resistance: heat 2
toHit: 1
damage: 50
shots: 0.5

* template warthog
size: 6
speed: 25
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2
comment: 'vehicle templates in files named individual.txt are used to store Group traits in the GridWar bottle world.'

* template transportWarthog
size: 6
comment: 'Later this would benefit from template inheritance.'

* template mantis
size: 4

* template hornet
size: 10
speed: 25
moveType: hover
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template wasp
size: 9

* template scorpion
size: 10
speed: 2
ac: 21
sp: 150
resistance: heat 2
toHit: 1
damage: 50
shots: 0.5

* template elephant
size: 25
speed: 25
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template falcon
size: 10
speed: 25
moveType: hover
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template pelican
size: 31
speed: 25
moveType: hover
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template mammoth
size: 68
speed: 25
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template missileSilo
size: 40
speed: 0
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 99
shots: 2

* template frigate
size: 500
speed: 25
moveType: hover
ac: 19
sp: 50
resistance: heat 2
toHit: 3
damage: 9
shots: 2

* template marathonCruiser
size: 1170

* template spiritOfFire
size: 2500

* template infinity
size: 5000
moveType: hover

`;

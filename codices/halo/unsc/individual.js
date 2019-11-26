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
maxSp: 10
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

* template marinePrivate
tags: creature
comment: We are testing Death Planet using marinePrivate and have simplified their weapons temporarily.

* childrenof marinePrivate
unsc/item/dmr
{unsc/item}
unsc/item/flakHelmet
unsc/item/flakArmor
human

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

* childrenof odst
{unsc/item/veteranWeapon}
{unsc/item/smallWeapon}
{unsc/item/anyGear}
unsc/item/visrHelmet
unsc/item/odstArmor
unsc/item/fragGrenade
human

* childrenof helljumper
unsc/item/jetpack
{helljumperMember}

* alias helljumperMember
100 odst
1 spartan

* template spartan
tags: creature cyborg
size: 2
weight: 120
maxSp: 20
damage: 4
speed: 5
stealth: 12

* childrenof spartan
unsc/item/dmr
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

`;

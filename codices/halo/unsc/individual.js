module.exports = `
* output
5 civilian
7 crewMember
10 marinePrivate
7 officer
5 odst
1 spartan

* template human
individuals: 1
weight: 70
size: 2
speed: 10
stealth: 10

* childrenof human
{gender}

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

* childrenof marinePrivate
{unsc/item/giWeapon}
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
{unsc/item/commandGear}
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
weight: 1000

* childrenof dropPod
{dropPodSoldier}

* alias dropPodSoldier
80 odst
2 marineSpecialist
1 spartan
1 {output}

`;

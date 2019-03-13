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
{halo/unsc/item}
human

* childrenof marinePrivate
{halo/unsc/item/giWeapon}
{halo/unsc/item}
halo/unsc/item/flakHelmet
halo/unsc/item/flakArmor
human

* alias squadLeader
4 marinePrivate
4 marineSpecialist
1 officer
1 odst

* childrenof marineSpecialist
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item}
halo/unsc/item/flakHelmet
halo/unsc/item/flakArmor
human

* childrenof officer
{halo/unsc/item/smallWeapon}
{halo/unsc/item/commandGear}
human

* childrenof odst
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item/anyGear}
halo/unsc/item/visrHelmet
halo/unsc/item/odstArmor
halo/unsc/item/fragGrenade
human

* childrenof spartan
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyGear}
halo/unsc/item/fragGrenade
halo/unsc/item/fragGrenade
human

* alias driver
8 marinePrivate
10 crewMember
4 odst
1 spartan
`;

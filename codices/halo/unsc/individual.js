module.exports = `
* output
5 civilian
7 crewMember
10 marinePrivate
7 officer
5 odst
1 spartan

* childrenof civilian
{gender}

* childrenof crewMember
{halo/unsc/item}
{gender}

* template marinePrivate
individuals: 1
weight: 70

* childrenof marinePrivate
{halo/unsc/item/giWeapon}
{halo/unsc/item}
halo/unsc/item/flakHelmet
halo/unsc/item/flakArmor
{gender}

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
{gender}

* childrenof officer
{halo/unsc/item/smallWeapon}
{halo/unsc/item/commandGear}
{gender}

* childrenof odst
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item/anyGear}
halo/unsc/item/visrHelmet
halo/unsc/item/odstArmor
halo/unsc/item/fragGrenade
{gender}

* childrenof spartan
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyGear}
halo/unsc/item/fragGrenade
halo/unsc/item/fragGrenade
{gender}

* alias driver
8 marinePrivate
10 crewMember
4 odst
1 spartan

* alias gender
10 female
10 male
1 postgender
`;

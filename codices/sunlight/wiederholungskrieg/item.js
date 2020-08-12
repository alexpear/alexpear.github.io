module.exports = `* output
4 {carryableItem}
0 {vehicleComponent}
0 {spaceshipComponent}
0 {capitalComponent}
0 Hmm ... maybe this whole file should be carryable-only. Would mean less boilerplate.

* alias carryableItem
0 carryableMeleeWeapon
0 carryableRangedWeapon
1 carryableBomb



* alias carryableWeaponMod
20 heavy
19 lightweight
0 wristMounted (because inapplicable to grenades and this is a general alias)
8 electric
5 magnetic
5 acid
4 toxin
5 ion
4 tracker
8 fire
7 thermal
7 guided

* childrenof carryableBomb
{carryableBombChassis}
{carryableBombMod}

* alias carryableBombChassis
4 grenade
2 bomb

* alias carryableBombMod
10 {carryableWeaponMod}
1 laser
1 plasma
1 spiderweb
1 flash

`;

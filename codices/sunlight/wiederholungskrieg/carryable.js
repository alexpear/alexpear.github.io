module.exports = `* output
4 meleeWeapon
4 rangedWeapon
1 bombWeapon
0 heldItem
0 wornItem

* childrenof meleeWeapon
{meleeMod}
{meleeChassis}

* alias meleeChassis
6 mace
6 hammer
1 glove
1 claw
10 knife
10 sword
20 spear
4 pike
4 glaive
4 halberd
6 axe
1 hatchet
1 whip
2 flail
2 javelin

* template mace
weight: 7
slot: hand

* childrenof rangedWeapon
{rangedMod}
{rangedChassis}

* alias rangedChassis
10 pistol
15 smg
15 carbine
8 shotgun
15 rifle
10 longrifle
2 shortbow
2 longbow
4 crossbow
1 harpoon
4 repeater
3 chaingun
3 cannon

* childrenof bombWeapon
{bombMod}
{bombChassis}

* alias bombChassis
4 grenade
2 grenadeLauncher
2 bomb

* alias weaponMod
20 heavy
19 lightweight
8 electric
5 magnetic
5 acid
4 toxin
5 ion
4 tracker
8 fire
7 thermal
7 guided
2 concealed
1 {softScienceMod}

* alias meleeMod
30 {weaponMod}
5 wristMounted

* alias rangedMod
30 {weaponMod}
4 wristMounted
3 rail
10 laser
6 beam
4 plasma
5 spiderweb
8 scoped
9 extendedRange
6 stealth
6 bayonet

* alias bombMod
10 {weaponMod}
1 laser
1 plasma
1 spiderweb
1 flash

* alias softScienceMod
9 hardlight
12 stun
10 nanite
3 grav
2 temporal
1 void

`;

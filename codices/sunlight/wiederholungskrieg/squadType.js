module.exports = `* output
9 infantry
6 cavalry
6 vehicle

* childrenof infantry
{wiederholungskrieg/carryable/weapon}
{wiederholungskrieg/carryable/held}
{trait}
{role}

* alias trait
9 biologicallyEnhanced
9 veteran
10 nothing

* alias role
9 lightInfantry
9 heavyInfantry
7 stealthInfantry
7 shockInfantry
9 freshlyConscripted
20 nothing

* childrenof lightInfantry
70 nothing
9 hoverboard
9 hoverboots
9 rocketBoots
9 grapplingHook
9 jetpack
9 combatWings
4 teleportHarness

* childrenof cavalry
{mount}
{wiederholungskrieg/carryable/weapon}
{wiederholungskrieg/carryable/held}
{trait}
{cavalryRole}

* alias mount
20 horse
9 motorcycle
9 jetbike
1 cybersphynx

* alias cavalryRole
9 lightCavalry
9 heavyCavalry
9 nothing

* childrenof vehicle
{locomotion}
{vehicleWeap}
{vehicleRole}

* alias locomotion
9 wheels
9 treads
9 {legs}
7 hoverpods
6 wings
5 flightRotor

* alias legs
9 2Legs
9 4Legs
9 6Legs
2 8Legs
2 20Legs

* alias vehicleWeap
9 cannon
9 machineGuns
4 mortar
9 swords
3 sledgehammer

* alias vehicleRole
19 troopTransport
9 ultralight
9 heavyArmor
9 superheavy
9 oversized
9 maximumSpeed
19 radarInvisible
9 massProduced

`;

module.exports = `

* output
4 plasmaPistol
4 plasmaRifle
4 needler

* alias weapon
10 {gruntWeapon}
1 voidsTear
5 plasmaRifle
2 plasmaRepeater
1 stormRifle
1 concussionRifle
3 {bruteMadeWeapon}
4 {anyCarbine}
2 needleRifle
2 energySword
2 beamRifle
2 focusRifle
2 plasmaCannon
2 fuelRodCannon
2 {anyPlasmaCaster}
1 plasmaLauncher
1 hunterCannon

* alias gruntWeapon
1 plasmaPistol
1 needler

* alias grenade
6 plasmaGrenade
2 spikeGrenade
1 flameGrenade

* alias bruteMadeWeapon
5 spiker
3 brutePlasmaRifle
1 scaleOfSoiraptPlasmaRifle
3 bruteShot
2 mauler
1 gravityHammer

* alias anyCarbine
20 carbine
1 rainOfOblivionCarbine
1 bloodOfSubanCarbine

* alias anySniper
1 beamRifle
1 focusRifle

* alias anyPlasmaCaster
5 plasmaCaster
1 scourgeOfFirePlasmaCaster
1 whiteScarPlasmaCaster

* alias jackalMajorWeapon
6 plasmaPistol
1 needler
1 plasmaRifle
0 1-handed UNSC weaps from the black market, etc

* alias jackalRifle
10 {anyCarbine}
1 needleRifle
1 beamRifle
1 focusRifle

* alias skirmisherWeapon
2 plasmaPistol
1 {jackalRifle}

* alias droneWeapon
10 {gruntWeapon}
2 plasmaRifle
1 brutePlasmaRifle

* alias eliteMinorWeapon
20 plasmaRifle
5 plasmaRifle, plasmaRifle
2 plasmaRepeater
1 needleRifle
1 beamRifle
1 focusRifle
1 stormRifle
1 {anyPlasmaCaster}
4 needler
1 needler, needler
1 plasmaRifle, needler
1 plasmaPistol

* alias distinguishedEliteWeapon
10 {eliteMinorWeapon}
1 concussionRifle
4 energySword
2 fuelRodCannon
1 plasmaLauncher

* alias bruteMinorWeapon
10 spiker
5 bruteShot
5 brutePlasmaRifle
5 {anyCarbine}
5 needler
2 needleRifle
1 {anySniper}
1 plasmaPistol
1 mauler

* alias bruteChieftainWeapon
5 plasmaCannon
6 fuelRodCannon
10 gravityHammer
1 needler, needler
2 focusRifle
2 whiteScarPlasmaCaster
3 plasmaLauncher
3 hunterCannon

* alias anyGear
1 flare
1 gravLift
1 regenField
1 bubbleShield
1 armorLock
1 invincibility


* template plasmaRifle
cost: 4
tags: action plasma fullAuto
size: 0.6
weight: 6
range: 40
shotsPerSecond: 10
hit: 4
damage: 17

* template plasmaPistol
cost: 3
tags: action plasma
size: 0.4
weight: 4
range: 40
shotsPerSecond: 9
hit: 3
damage: 11

* template needler
cost: 4
tags: action needle
size: 0.5
weight: 5
range: 40
shotsPerSecond: 9
hit: 6
damage: 23



`;

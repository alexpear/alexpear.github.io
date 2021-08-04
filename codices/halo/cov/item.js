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
tags: action plasma 1handed
size: 0.6
weight: 6
range: 40
shotsPerSecond: 10
hit: 4
damage: 17
damageType: fire

* template plasmaPistol
cost: 3
tags: action plasma 1handed
size: 0.4
weight: 4
range: 40
shotsPerSecond: 9
hit: 3
damage: 11
damageType: fire

* template needler
cost: 5
tags: action needle 1handed
size: 0.5
weight: 5
range: 40
shotsPerSecond: 9
hit: 6
damage: 23
damageType: pierce

* template carbine
cost: 38
tags: action
size: 1
range: 80
shotsPerSecond: 6
hit: 4
damage: 16
damageType: pierce

* template beamRifle
tags: action
cost: 11
size: 1.8
range: 200
shotsPerSecond: 1
hit: 20
damage: 150
damageType: pierce

* template fuelRodCannon
cost: 7
tags: action
size: 1.4
range: 60
shotsPerSecond: 2
hit: 2
damage: 160
damageType: impact

* template plasmaTurret
tags: action
cost: 73
size: 1.2
range: 70
shotsPerSecond: 8
hit: 3
damage: 40
damageType: fire

* template shadeCannon
tags: action
cost: 8
size: 1.6
range: 300
shotsPerSecond: 3
hit: 3
damage: 20
damageType: fire

* template plasmaMortar
tags: action
cost: 30
size: 3
range: 3000
shotsPerSecond: 0.3
hit: 2
damage: 900
damageType: impact

* template scarabCannon
tags: action
cost: 100
size: 4
range: 800
shotsPerSecond: 0.2
hit: 6
damage: 2000
damageType: fire

* template spiker
tags: action
cost: 4
size: 0.5
range: 30
shotsPerSecond: 8
hit: 1
damage: 14
damageType: pierce

* template bruteShot
tags: action
cost: 9
size: 1
canTarget: ground
range: 50
shotsPerSecond: 2
hit: 3
damage: 90
damageType: impact

* template gravityHammer
tags: action
cost: 5
size: 2.5
range: 3
shotsPerSecond: 1.3
hit: 10
damage: 250
damageType: impact
`;

module.exports = `* output
10 {anyWeapon}
20 {anyGear}
1 {gunComponent}

* alias anyWeapon
10 {smallWeapon}
0 gi means General Issue
10 {giWeapon}
1 {specialInfantryWeapon}
1 {highWeightWeapon}
0 {alienWeapon}

* alias smallWeapon
10 reachPistol
4 heavyPistol
4 silencedPistol
3 lightPistol
2 gunfighterPistol
1 machinePistol
3 smg
1 smgBayonet
3 combatKnife

* alias giWeapon
4 smg
4 assaultRifle
4 br
3 dmr
1 shotgun
0 Later generate attachments and weapon traits, perhaps on customWeapon

* alias specialInfantryWeapon
4 shotgun
4 saw
4 sniperRifle
4 hydra
4 grenadeLauncher
4 rocketLauncher
4 laser
2 turret
3 flamethrower
4 {smallWeapon}, {smallWeapon}

* alias veteranWeapon
10 {giWeapon}
10 {specialInfantryWeapon}

* alias cqcWeapon
9 smg
10 shotgun
8 assaultRifle
4 silencedPistol
1 saw
1 {specialInfantryWeapon}

* alias cqcGear
4 flashbangGrenade
4 smokeGrenade
3 fragGrenade, fragGrenade
1 powerDrainDevice
1 bubbleShield
4 tripMine
1 satchelCharge
4 periscope
4 extraArmor
4 titaniumBayonet
4 combatKnife

* alias longRangeWeapon
8 br
8 dmr
6 sniperRifle
6 hydra
4 rocketLauncher
2 saw
1 covenantCarbine

* alias highWeightWeapon
6 {warthogTurret}
3 binaryRifle
2 plasmaTurret
2 incinerationCannon
2 gravityHammer
2 oniChaingun
1 splinterTurret

* alias stattedWeapon
4 {giWeapon}

* alias anyGear
4 targetDesignator
4 secureDatapad
4 medkit
4 demolitionCharges
4 {giGear}
4 {commandGear}
4 {smallWeapon}
4 jetpack
2 emp
2 plasmaRifle

* alias giGear
4 fragGrenade
4 {smallWeapon}
4 portableTent
4 extraAmmo
4 extraRations
4 camoCloak
3 smokeGrenade
3 trenchShovel
3 radiationPills
2 flashbangGrenade
2 deployableCover
2 caffeinePills
1 medkit

* childrenof leatherCase
{commandGear}

* alias commandGear
4 targetLocator
4 secureDatapad
4 memoryChip
4 oneTimePad
4 microwaveAntenna
3 emp
2 telescope
2 binoculars
0 {alienWeapon}
0 {alienGrenade}
1 paperMap
1 bubbleShield

* alias gunComponent
4 2xScope
3 4xScope
3 10xScope
4 morphScope
4 hybridScope
4 cogScope
3 visrScopeForGun
3 kineticBolts
3 stabilizationJetsForGun
4 titaniumBayonet
4 energyBayonet
3 extendedMagazine
3 laserSight
4 silencer
1 longBarrel
1 soundDampener
4 threatMarker
3 knightBlade
0 etc

* alias airComponent
4 missilePod
2 targetDesignator
2 gaussTurret
2 laser
1 needleTurret

* alias warthogTurret
6 chaingun
2 gaussTurret
1 missilePod
1 vespinTurret
1 needleTurret

* alias spartanMod
3 spartan2Augmentations
4 spartan3Augmentations
4 spartan4Augmentations

* alias spartanArmor
4 mjolnirArmor
4 spiArmor
3 infiltrationSuit

* template mjolnirArmor
weight: 454
sp: 40
resistance: fire 4, pierce 4, impact 3, vacuum 10
tags: armor fleetGen

* alias armorMod
4 armorLock
4 dropShield
5 activeCamo
4 hologram
5 thrusterPack
4 emp
3 autoSentry
3 regenField
4 prometheanVision
4 hardlightShield

* alias alienWeapon
0 {cov/item/smallWeapon}
0 {forerunner/item/smallWeapon}

* alias alienGrenade
0 {banished/item/grenade}
0 {forerunner/item/grenade}

* childrenof memoryChip
{classifiedData}

* alias classifiedData
18 {ai}
8 navigationData
5 weaponPlans
6 cyberintrusionSuite
1 forerunnerCoordinates
2 archaeologicalReport
1 blackmailMaterial
1 falsifiedMilitaryPlans

* alias ai
10 shipboardAi
4 dumbAi
2 civilianSmartAi
1 covenantAi

* template flakArmor
sp: 20
resistance: fire 1, pierce 1, impact 1
tags: armor fleetGen
comment: Later we can model armor using resistances. But for MRB1 we can just use a big SP bonus.

* template lightPistol
tags: action firearm 1handed
cost: 4
range: 20
shotsPerSecond: 6
hit: 1
damage: 17
damageType: pierce

* template reachPistol
tags: action bullet firearm 1handed
range: 70
shotsPerSecond: 2
hit: 11
damage: 40
damageType: pierce

* template heavyPistol
tags: action firearm 1handed
range: 70
shotsPerSecond: 2
hit: 14
damage: 60
damageType: pierce

* template smg
tags: action bullet firearm fullAuto
canTarget: all
range: 20
shotsPerSecond: 15
hit: 6
damage: 7
damageType: pierce

* template assaultRifle
tags: action bullet fullAuto
cost: 7
range: 40
shotsPerSecond: 15
hit: 8
damage: 11
damageType: pierce

* template battleRifle
tags: action bullet
cost: 8
range: 90
shotsPerSecond: 7.2
hit: 13
damage: 5
damageType: pierce

* template dmr
tags: action bullet firearm optics
range: 100
shotsPerSecond: 3
hit: 90
damage: 10
damageType: pierce

* template shotgun
tags: action bullet
range: 9
shotsPerSecond: 1
hit: 5
damage: 90
damageType: pierce
attackDelay: 2

* template sniperRifle
tags: action firearm
range: 800
shotsPerSecond: 1.1
hit: 100
damage: 150
damageType: pierce

* template rocketLauncher
tags: action heavy
cost: 4
range: 150
shotsPerSecond: 0.3
hit: 9
damage: 500
damageType: impact

* template chaingun
tags: action firearm
range: 60
shotsPerSecond: 5
hit: 10
damage: 25
damageType: pierce

* template tankCannon
tags: action firearm
range: 3000
shotsPerSecond: 0.3
hit: 80
damage: 700
damageType: impact

* template macTurret
tags: action
range: 4000
shotsPerSecond: 0.1
hit: 80
damage: 3000
damageType: pierce

`;

module.exports = `
* output
1 {giWeapon}

* alias anyWeapon
4 {giWeapon}
4 {specialWeapon}

* alias giWeapon
4 suppressor
4 boltshot
4 lightrifle

* alias specialWeapon
1 songOfPeace
1 razorsEdge
1 closedFist
1 openHand
1 barbedLance
1 dyingStar
10 sentinelBeam
1 ultraSentinelBeam
20 splinterTurret
20 scattershot
1 loathsomeThing
1 didactsSignet
10 binaryRifle
1 retinaOfTheMindsEye
1 twinJewelsOfMaethrillian
10 incinerationCannon
1 riverOfLight
1 heartseeker
10 knightsBlade

* alias grenade
1 pulseGrenade
1 splinterGrenade

* alias gear
4 hardLightShield
4 autoturret
4 regenerationField
4 prometheanVision

* template sentinelBeam
tags: action
cost: 10
size: 1
range: 80
shotsPerSecond: 1
hit: 6
damage: 50
damageType: fire

* template boltshot
tags: action
cost: 7
size: 0.4
range: 40
shotsPerSecond: 4
hit: 7
damage: 30
damageType: fire
comment: Halo 5

* template lightrifle
tags: action
cost: 9
size: 1.1
range: 90
shotsPerSecond: 3
hit: 7
damage: 40
damageType: fire

* template incinerationCannon
tags: action
cost: 14
size: 2
range: 80
shotsPerSecond: 0.3
hit: 5
damage: 450
damageType: fire

* template phaetonCannon
tags: action
cost: 30
size: 10
range: 100
shotsPerSecond: 0.5
hit: 8
damage: 400
damageType: fire

`;
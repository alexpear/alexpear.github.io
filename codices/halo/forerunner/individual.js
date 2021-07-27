module.exports = `
* output
50 sentinel
1 enforcer
3 knight
30 crawler
6 watcher
10 soldier
1 survivor

* childrenof sentinel
forerunner/item/sentinelBeam

* childrenof knight
forerunner/item/knightsBlade
{forerunner/item/anyWeapon}
{forerunner/item/gear}
{forerunner/item/grenade}

* childrenof crawler
forerunner/item/boltshot

* childrenof watcher
forerunner/item/boltshot

* childrenof soldier
{forerunner/item/anyWeapon}

* childrenof survivor
{forerunner/item/anyWeapon}
{forerunner/item/grenade}
{forerunner/item/gear}

* template sentinel
size: 2
moveType: air
weapon: sentinelBeam

* template enforcer
size: 7
moveType: air
weapon: bruteShot

* template crawler
size: 1
speed: 18
moveType: infantry
durability: 70
weapon: boltshot

* template soldier
size: 1
speed: 23
moveType: infantry
durability: 100
weapon: lightrifle

* template knight
size: 3
speed: 12
moveType: infantry
durability: 400
weapon: incinerationCannon

* template survivor
size: 3
speed: 13
moveType: infantry

* template phaeton
size: 10
speed: 28
moveType: air
durability: 1400
weapon: phaetonCannon

* template phaetonCannon
tags: action
hit: 2

* template keyship
size: 13000
moveType: air
durability: 20000000


`;

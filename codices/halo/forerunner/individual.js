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
cost: 10
size: 2
speed: 25
durability: 120
moveType: air
weapon: sentinelBeam

* template enforcer
cost: 140
size: 7
speed: 8
moveType: air
durability: 1500
weapon: bruteShot

* template crawler
cost: 2
size: 1
speed: 18
moveType: infantry
durability: 70
weapon: boltshot

* template soldier
cost: 3
size: 1
speed: 23
moveType: infantry
durability: 100
weapon: lightrifle

* template knight
cost: 145
size: 3
speed: 12
moveType: infantry
durability: 400
weapon: incinerationCannon
comments: TODO There is a bug where it gets confused about what a incinerationCannon is.

* template survivor
cost: 100
size: 3
speed: 13
moveType: infantry
durability: 2000
weapon: boltshot

* template phaeton
cost: 600
size: 10
speed: 28
moveType: air
durability: 1400
weapon: phaetonCannon

* template keyship
tags: fleetGen
size: 13000
moveType: air
durability: 20000000


`;

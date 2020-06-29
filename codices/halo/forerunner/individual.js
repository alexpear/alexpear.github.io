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

* template enforcer
size: 7

* template crawler
size: 1

* template soldier
size: 1

* template knight
size: 3

* template survivor
size: 3

* template phaeton
size: 10

* template keyship
size: 13000



`;

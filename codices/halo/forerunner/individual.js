module.exports = `
* output
50 sentinel
1 enforcer
3 knight
30 crawler
6 watcher
10 soldier

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

`;
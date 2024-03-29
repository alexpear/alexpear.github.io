module.exports = `
* output
4 {squad}

* alias squad
4 {infantrySquad}

* alias infantrySquad
4 marineSquad

* template marineSquad
quantity: 10

* children of marineSquad
marine

* template marine
hp: 2
defense: 11
alignment: LG
tags: human soldier tech10 unsc

* children of marine
{basicWeapon}
flakArmor

* template flakArmor
defense: 6
resistance: fire 1, piercing 1
tags: armor

* alias basicWeapon
4 smg
4 assaultRifle
4 battleRifle
3 dmr
1 shotgun

* template smg
tags: action bullet fullAuto
range: 20
hit: 3
damage: 1

* template assaultRifle
tags: action bullet fullAuto
range: 30
hit: 3
damage: 1

* template battleRifle
tags: action bullet
range: 50
hit: 3
damage: 1

* template dmr
tags: action bullet
range: 60
hit: 3
damage: 1

* template shotgun
tags: action bullet
range: 5
hit: 5
damage: 2

`;

module.exports = `* output
1 {ship}

* alias ship
10 frigate
10 marathonClass
2 gladiusClass
2 phoenixClass
1 infinityClass

* template frigate
weight: 200000000

* childrenof frigate
halo/unsc/item/frigateMac
{navalCargo}

* alias navalCargo
4 halo/unsc/item/missileBattery
4 additionalArmor
4 halo/unsc/company/spaceFighterWing
4 halo/unsc/company/boardingCompany
4 {halo/unsc/battalion}

* template prowler
weight: 907000

* childrenof prowler
{halo/unsc/squad/priorityAsset}
{halo/unsc/company}

* template gladiusClass
weight: 100000

* childrenof gladiusClass
halo/unsc/item/frigateMac
halo/unsc/item/frigateMac
{navalCargo}

* template orbitalDefensePlatform
weight: 2900000000

* childrenof orbitalDefensePlatform
halo/unsc/item/marathonMac

* template marathonClass
weight: 9000000000

* childrenof marathonClass
halo/unsc/item/marathonMac
{navalCargo}
{navalCargo}

* template phoenixClass
weight: 2000000

* childrenof phoenixClass
halo/unsc/item/marathonMac
{halo/unsc/battalion}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}

* template infinityClass
weight: 907000000000

* childrenof infinityClass
halo/unsc/item/infinityMac
{halo/unsc/battalion}
{halo/unsc/battalion}
{halo/unsc/battalion}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}

`;
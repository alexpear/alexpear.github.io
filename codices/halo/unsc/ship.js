module.exports = `* output
1 {ship}

* alias ship
10 frigate
10 marathonClassCruiser
2 gladiusClassCorvette
2 phoenixClassCarrier
1 infinityClassSupercarrier

* template frigate
weight: 200000000

* childrenof frigate
halo/unsc/item/frigateMac
halo/unsc/squad/bridgeCrew
{navalCargo}

* alias navalCargo
4 halo/unsc/squad/missileBattery
4 additionalArmor
4 halo/unsc/company/spaceFighterWing
4 halo/unsc/battalion/boardingBattalion
4 {halo/unsc/battalion}
4 halo/unsc/squad/logisticalCargo

* template prowler
weight: 907000

* childrenof prowler
halo/unsc/squad/bridgeCrew
{halo/unsc/squad/priorityAsset}
{halo/unsc/company}

* template gladiusClassCorvette
weight: 36000000

* childrenof gladiusClassCorvette
halo/unsc/squad/bridgeCrew
halo/unsc/item/frigateMac
{navalCargo}

* template orbitalDefensePlatform
weight: 2900000000

* childrenof orbitalDefensePlatform
halo/unsc/squad/bridgeCrew
halo/unsc/item/marathonMac
halo/unsc/company/cqcCompany
halo/unsc/squad/crewFireteam
halo/unsc/squad/crewFireteam
halo/unsc/squad/crewFireteam
halo/unsc/squad/crewFireteam

* template marathonClassCruiser
weight: 9000000000

* childrenof marathonClassCruiser
halo/unsc/item/marathonMac
halo/unsc/squad/bridgeCrew
{navalCargo}
{navalCargo}

* template phoenixClassCarrier
weight: 44000000000

* childrenof phoenixClassCarrier
halo/unsc/item/marathonMac
halo/unsc/squad/bridgeCrew
{halo/unsc/battalion}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}

* template infinityClassSupercarrier
weight: 907000000000

* childrenof infinityClassSupercarrier
halo/unsc/item/infinityMac
halo/unsc/squad/bridgeCrew
halo/unsc/squad/scienceTeam
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
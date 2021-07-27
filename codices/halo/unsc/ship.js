module.exports = `* output
1 {ship}

* alias ship
10 frigate
10 marathonClassCruiser
2 gladiusClassCorvette
2 phoenixClassCarrier
1 infinity

* template frigate
weight: 200000000

* childrenof frigate
unsc/item/frigateMac
unsc/squad/bridgeCrew
{navalCargo}

* alias navalCargo
4 unsc/squad/missileBattery
4 additionalArmor
4 unsc/company/spaceFighterWing
4 unsc/battalion/boardingBattalion
4 {unsc/battalion}
4 unsc/squad/logisticalCargo

* template prowler
weight: 907000

* childrenof prowler
unsc/squad/bridgeCrew
{unsc/squad/priorityAsset}
{unsc/company}

* template gladiusClassCorvette
weight: 36000000

* childrenof gladiusClassCorvette
unsc/squad/bridgeCrew
unsc/item/frigateMac
{navalCargo}

* template orbitalDefensePlatform
weight: 2900000000

* childrenof orbitalDefensePlatform
unsc/squad/bridgeCrew
unsc/item/marathonMac
unsc/company/cqcCompany
unsc/squad/crewFireteam
unsc/squad/crewFireteam
unsc/squad/crewFireteam
unsc/squad/crewFireteam

* template marathonClassCruiser
weight: 9000000000

* childrenof marathonClassCruiser
unsc/item/marathonMac
unsc/squad/bridgeCrew
{navalCargo}
{navalCargo}

* template phoenixClassCarrier
weight: 44000000000

* childrenof phoenixClassCarrier
unsc/item/marathonMac
unsc/squad/bridgeCrew
{unsc/battalion}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}

* template infinity
weight: 907000000000

* childrenof infinity
unsc/item/infinityMac
unsc/squad/missileBattery
unsc/squad/missileBattery
unsc/squad/missileBattery
unsc/squad/missileBattery
unsc/squad/missileBattery
unsc/squad/missileBattery
frigate
frigate
frigate
frigate
frigate
frigate
frigate
frigate
frigate
frigate
unsc/squad/bridgeCrew
unsc/squad/scienceTeam
unsc/squad/scienceTeam
unsc/squad/scienceTeam
unsc/squad/scienceTeam
unsc/squad/scienceTeam
unsc/squad/scienceTeam
{unsc/battalion}
{unsc/battalion}
{unsc/battalion}
{unsc/battalion}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}
{navalCargo}

`;
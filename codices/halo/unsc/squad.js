module.exports = `* output
1 {squad}

* alias squad
10 {infantrySquad}
10 {vehicleSquad}

* alias infantrySquad
4 marineSquad
1 {rareInfantry}

* alias rareInfantry
6 odstSquad
2 spartanSquad

* alias vehicleSquad
3 mongooseSquad
1 gungooseSquad
6 {warthog}
5 {aircraft}
3 scorpion
2 elephant

* alias warthog
2 scoutWarthog
2 transportWarthog
4 turretWarthog

* children of mongooseSquad
{infantrySquad}

* children of gungooseSquad
{infantrySquad}

* children of scorpion
{driver}
marineSquad

* alias driver
8 combatEngineer
1 odst
1 spartan

* children of transportWarthog
{infantrySquad}

* children of falcon
{infantrySquad}

* children of hornet
{infantrySquad}

* children of wasp
{driver}
chaingun
{airModule}

* alias airModule
4 missilePod
2 targetDesignator
2 gaussTurret
2 laser
1 needleTurret

* children of scoutWarthog
{infantrySquad}

* children of turretWarthog
{warthogTurret}
{infantrySquad}

* alias warthogTurret
6 chaingun
2 gaussTurret
1 missilePod
1 vespinTurret
1 needleTurret

* alias aircraft
4 falcon
4 hornet
4 wasp
4 pelican
1 longsword
1 saber
1 sparrowhawk

* children of pelican
{airModule}
{infantrySquad}

* children of elephant
{infantrySquad}
{turret}
{turret}

* children of mammoth
{infantrySquad}
{turret}
{turret}
{turret}
{turret}

* alias airSpeedSquad
4 {aircraft}

* alias fastSquad
6 {warthog}
3 mongooseSquad
2 gungooseSquad

* alias fastCompatibleSquad
4 {fastSquad}
2 {airSpeedSquad}

* alias slowSquad
20 {infantrySquad}
10 scorpion
2 elephant
1 mammoth

* alias slowCompatibleSquad
4 {slowSquad}
1 {fastSquad}
1 {airSpeedSquad}

* alias staticSquad
4 fortifiedInfantrySquad
2 bunker
1 {bigGun}

* alias staticCompatibleSquad
10 {staticSquad}
3 {slowSquad}
2 {fastSquad}
1 {airSpeedSquad}

* childrenof fortifiedInfantrySquad
{infantryFireteam}
{infantryFireteam}
{turret}
{turret}

* childrenof bunker
{infantrySquad}

* alias bigGun
4 aaGun
1 missileSilo
1 tacticalMac

* childrenof aaGun
crewFireteam

* childrenof missileSilo
crewFireteam

* childrenof tacticalMac
crewFireteam

`;

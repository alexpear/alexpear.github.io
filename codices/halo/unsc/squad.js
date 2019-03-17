module.exports = `* output
1 {squad}

* alias squad
10 {infantrySquad}
10 {vehicleSquad}

* alias infantrySquad
4 marineSquad
1 {rareInfantrySquad}

* childrenof marineSquad
marineFireteam
marineFireteam
marineFireteam

* childrenof marineFireteam
{halo/unsc/individual/squadLeader}
halo/unsc/individual/marinePrivate
halo/unsc/individual/marinePrivate
halo/unsc/individual/marinePrivate

* alias rareInfantrySquad
10 odstSquad
0 odstJetpackSquad
1 spartanSquad

* childrenof odstSquad
odstFireteam
odstFireteam
odstFireteam

* childrenof odstFireteam
halo/unsc/individual/odst
halo/unsc/individual/odst
halo/unsc/individual/odst
halo/unsc/individual/odst

* childrenof spartanSquad
spartanFireteam
spartanFireteam

* childrenof spartanFireteam
halo/unsc/individual/spartan
halo/unsc/individual/spartan
halo/unsc/individual/spartan
halo/unsc/individual/spartan

* alias infantryFireteam
20 marineFireteam
5 odstFireteam
2 crewFireteam
1 spartanFireteam

* childrenof crewFireteam
halo/unsc/individual/officer
halo/unsc/individual/crewMember
halo/unsc/individual/crewMember
halo/unsc/individual/crewMember

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

* childrenof mongooseSquad
mongoose
mongoose

* template mongoose
weight: 406

* childrenof mongoose
{halo/unsc/individual/driver}
{halo/unsc/individual}

* childrenof gungooseSquad
gungoose
gungoose

* template gungoose
weight: 420

* childrenof gungoose
{halo/unsc/individual/driver}

* childrenof scorpion
{halo/unsc/individual/driver}
marineFireteam

* childrenof falcon
{infantryFireteam}
{airModule}

* children of hornet
{halo/unsc/individual/driver}
{halo/unsc/individual}
{halo/unsc/individual}
{airModule}

* children of wasp
{halo/unsc/individual/driver}
chaingun
{airModule}

* alias airModule
6 {turret}
1 targetDesignator
1 laser

* template warthogChassis
weight: 3000
defense: 10
tags: vehicle

* children of scoutWarthog
{halo/unsc/individual/driver}
{halo/unsc/individual}
warthogChassis

* childrenof transportWarthog
{infantryFireteam}
warthogChassis

* children of turretWarthog
{turret}
{halo/unsc/individual/driver}
{halo/unsc/individual}
{halo/unsc/individual}
warthogChassis

* alias turret
0 TODO: Move this to halo/unsc/item
6 chaingun
2 gaussTurret
1 missilePod
1 vespinTurret
1 needleTurret

* template chaingun
weight: 100

* template missilePod
weight: 200

* alias aircraft
4 falcon
4 hornet
4 wasp
4 pelican
1 longsword
1 saber
1 sparrowhawk

* template falcon
weight: 1500

* template hornet
weight: 1000

* template wasp
weight: 1000

* template pelican
weight: 138000

* children of pelican
{airModule}
{pelicanCargo}

* alias pelicanCargo
10 {infantrySquad}
4 {warthog}
2 ammoCrate
1 gungooseSquad
1 mongooseSquad
1 mantis
1 scorpion

* template scorpion
weight: 35000
armor: 20

* template elephant
weight: 205000

* children of elephant
{turret}
{turret}
crewFireteam
marineFireteam
{8mCargo}

* alias 8mCargo
10 {warthog}
10 {infantrySquad}
6 supplyCrate
8 mongooseSquad
2 gungooseSquad
3 mantis

* alias 10mCargo
10 {8mCargo}
4 scorpion

* template mammoth
weight: 484000

* children of mammoth
crewFireteam
{infantrySquad}
{10mCargo}
{10mCargo}
{10mCargo}
{turret}
{turret}
{turret}
{turret}
tacticalMac

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

* alias 4slowCompatibleSquads
10 {slowSquad}, {slowCompatibleSquad}, {slowCompatibleSquad}, {slowCompatibleSquad}
1 mammoth

* alias slowCompatibleSquad
4 {slowSquad}
1 {fastSquad}
1 {airSpeedSquad}

* alias staticSquad
4 fortifiedInfantrySquad
2 bunker
1 {bigGun}

* alias 4staticCompatibleSquads
10 {staticSquad}, {staticCompatibleSquad}, {staticCompatibleSquad}, {staticCompatibleSquad}
1 mammoth

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

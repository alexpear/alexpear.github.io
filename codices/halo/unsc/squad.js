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

* childrenof falcon
{halo/unsc/individual/driver}
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
0 TODO move this to halo/unsc/item
6 {turret}
1 targetDesignator
1 laser
1 decoyLauncher

* template warthogChassis
weight: 3000
defense: 10
tags: vehicle

* children of scoutWarthog
{halo/unsc/individual/driver}
{halo/unsc/individual}
warthogChassis

* childrenof transportWarthog
{halo/unsc/individual/driver}
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
{halo/unsc/individual/driver}
{infantrySquad}
{pelicanDangling}

* alias pelicanDangling
8 nothing
4 {warthog}
2 supplyCrate
1 gungooseSquad
1 mongooseSquad
1 mantis
1 scorpion

* template mantis
weight: 5200

* children of mantis
{halo/unsc/individual/driver}
{turret}
{turret}

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
forklift
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

* alias stealthSquad
4 odstSquad
1 infantrySquad

* alias staticSquad
4 fortifiedInfantrySquad
1 bunker
1 firebase
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
{infantrySquad}
halo/unsc/item/sandbags
{turret}
{turret}

* childrenof bunker
{infantrySquad}

* childrenof firebase
{infantrySquad}
{turret}

* alias bigGun
4 aaGun
1 missileBattery
1 tacticalMac

* childrenof aaGun
crewFireteam

* childrenof missileBattery
crewFireteam

* childrenof tacticalMac
crewFireteam

* alias priorityAsset
50 tier3asset, tier3asset
2 tier2asset
1 tier1asset
0 NOTE: These are not squads, but are sometimes squad-sized

* alias tier1asset
2 novaBomb
1 luminary
1 cryptum
4 huragok
1 forerunnerMonitor
1 forerunnerArtefact

* alias tier2asset
4 navComputer
4 halo/unsc/item/memoryChip
4 slipspaceDrive
1 captiveProphet

* alias tier3asset
4 halo/unsc/individual/officer
3 halo/unsc/individual/civilian
2 {halo/unsc/item/alienWeapon}
2 {halo/unsc/item/alienGrenade}

`;

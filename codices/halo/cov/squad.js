module.exports = `
* output
5 {lance}
2 hunterPair
5 {vehicle}

* alias lance
10 lightLance
4 eliteLance
0 {eliteLance}
1 specOpsLance
2 bruteLance
1 skirmisherLance
2 droneLance

* childrenof lightLance
{lightLanceLeader}
{lightLanceTroops}

* alias lightLanceLeader
4 individual/eliteMinor
0 NOTE: Brutes only lead Brute squads, because this is set before the Great Schism.
3 individual/shieldJackal
3 {individual/gruntLeader}

* alias lightLanceTroops
4 {individual/anyGrunt}, {individual/anyGrunt}, {individual/anyGrunt}, {individual/anyGrunt}, {individual/anyGrunt}, {individual/anyGrunt}
2 individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal
1 individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal
1 individual/skirmisherJackal, individual/skirmisherJackal, individual/skirmisherJackal, individual/skirmisherJackal, individual/skirmisherJackal, individual/skirmisherJackal, individual/skirmisherJackal
0 TODO: A 'x6' syntax would be nice here.

* childrenof eliteLance
{individual/eliteLeader}
individual/eliteMinor
individual/eliteMinor
individual/eliteMinor
individual/eliteMinor
individual/eliteMinor
individual/eliteMinor
individual/eliteMinor

* alias vehicle
10 {dropship}
7 {anyGhost}
2 banshee
3 {anyWraith}
1 revenant
2 spectre
1 scarab
1 lich

* childrenof scarab
{lance}
{lance}

* childrenof lich
{lance}
{lance}
{cargo10m}

* alias dropship
1 phantom
1 spirit

* alias bruteVehicle
2 chopper
1 prowler
1 banshee
2 phantom

* alias bruteJurisdictionSquad
5 bruteLightLance
3 bruteLance
2 bruteChieftainSquad
1 droneLance
1 hunterPair
0 TODO: modify vehicle to exclude phantoms that contain elites, or anything with elite pilots. Elites refuse to serve under Brutes.
5 {vehicle}
5 {bruteVehicle}

* childrenof bruteLightLance
individual/bruteMinor
{lightLanceTroops}

* childrenof bruteLance
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor

* alias fastBruteSquad
5 phantom
6 bruteVehicle
3 {anyGhost}
1 revenant
1 droneLance

* childrenof bruteChieftainSquad
individual/bruteChieftain
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor

* childrenof bruteStalkerSquad
individual/bruteStalker
individual/bruteStalker
individual/bruteStalker
individual/bruteStalker
individual/bruteStalker
individual/bruteStalker
individual/bruteStalker


* childrenof phantom
individual/gruntMinor
{lance}
{cargo10m}

* childrenof spirit
individual/gruntMinor
{lance}
{cargo10m}

* alias cargo10m
5 hunterPair
6 {anyGhost}, {anyGhost}
2 chopper
3 revenant
6 spectre
4 sniperPlatform
6 {anyWraith}

* childrenof sniperPlatform
individual/rifleJackal
item/plasmaCannon

* childrenof hunterPair
hunter
hunter

* alias anyGhost
10 ghost
3 ghostUltra
1 templeGhost

* alias anyWraith
10 wraith
3 aAWraith
3 wraithUltra
1 templeWraith

* childrenof ghost
{individual/pilot}

* childrenof spectre
{individual/eliteLeader}
individual/eliteMajor
individual/eliteMinor
individual/eliteMinor

* childrenof banshee
individual/eliteMinor

* childrenof shadeTurret
individual/gruntMinor

* childrenof chopper
individual/bruteMinor

* childrenof prowler
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor
individual/bruteMinor

* childrenof revenant
{individual/eliteLeader}
individual/eliteMinor

* childrenof wraith
{individual/eliteLeader}


`;

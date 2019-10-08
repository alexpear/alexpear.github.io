module.exports = `
* output
5 {lance}
2 hunterPair
5 {vehicle}

* alias lance
10 lightLance
4 eliteLance
0 {eliteLance}
1 specOpsLightLance
1 specOpsEliteLance
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
4 {6LanceJackals}

* alias 6LanceJackals
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

* alias specOpsSquad
4 specOpsLightLance
2 specOpsEliteLance
3 {vehicle}
4 dropPodSquad

* childrenof specOpsLightLance
individual/specOpsElite
{lightLanceTroops}

* childrenof specOpsEliteLance
individual/specOpsElite
individual/specOpsElite
individual/specOpsElite
individual/specOpsElite
individual/specOpsElite
individual/specOpsElite
individual/specOpsElite


* alias airVehicle
4 banshee
5 {dropship}
1 seraph
1 lich
1 vampire

* alias fastVehicle
10 {airVehicle}
7 {anyGhost}
2 spectre

* alias vehicle
30 {fastVehicle}
10 {anyWraith}
3 revenant
3 locust
1 scarab
1 gruntMech

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


* alias elitesOnlySquad
10 {elitesOnlyVehicle}
6 {elitesOnlyLance}

* alias elitesOnlyVehicle
1 vampire
1 seraph
3 revenant
10 spectre
15 {anyWraith}
20 elitesOnlyPhantom
15 eliteGhost
10 banshee

* alias elitesOnlyLance
10 eliteLance
4 stealthEliteLance
4 eliteRangerLance
3 eliteLeadershipLance
1 specOpsEliteLance


* alias bruteVehicle
4 chopper
2 prowler
2 gruntGhost
2 bruteBanshee
4 brutePhantom
1 bruteRevenant
2 bruteWraith

* alias bruteJurisdictionSquad
10 {bruteJurisdictionLance}
10 {bruteVehicle}

* alias bruteJurisdictionLance
8 bruteLightLance
6 bruteLance
2 bruteChieftainSquad
2 bruteStalkerSquad
1 droneLance
1 hunterPair

* childrenof brutePhantom
individual/gruntMinor
{bruteJurisdictionLance}
{bruteCargo10m}

* alias bruteCargo10m
6 gruntGhost, gruntGhost
4 chopper, chopper
3 prowler
2 bruteRevenant
4 sniperPlatform
6 bruteWraith

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
5 brutePhantom
6 {bruteVehicle}
3 gruntGhost
1 bruteRevenant
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


* alias jackalSquad
10 jackalLance
10 jackalSpirit

* childrenof jackalLance
individual/rifleJackal
{6LanceJackals}

* childrenof jackalSpirit
individual/rifleJackal
jackalLance
sniperPlatform


* childrenof droneLance
individual/droneMinor
individual/droneMinor
individual/droneMinor
individual/droneMinor
individual/droneMinor
individual/droneMinor
individual/droneMinor


* childrenof phantom
individual/gruntMinor
{lance}
{cargo10m}

* childrenof spirit
individual/gruntMinor
{lance}
{cargo10m}

* alias cargo10m
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
individual/hunter
individual/hunter

* alias anyGhost
10 gruntGhost
3 ghostUltra
1 swordGhost
1 templeGhost

* alias anyWraith
10 wraith
3 aAWraith
3 wraithUltra
1 templeWraith

* alias armorSquad
10 {anyWraith}
5 revenant
2 scarab
3 {mobileSquad}

* childrenof ghost
{individual/pilot}

* childrenof gruntGhost
individual/gruntMinor

* childrenof bruteGhost
individual/bruteMinor

* childrenof ghostUltra
individual/eliteMajor

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

* alias mobileSquad
10 {lance}
10 {vehicle}
3 {bruteJurisdictionSquad}
2 hunterPair



`;

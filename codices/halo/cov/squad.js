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
3 individual/jackal
3 {individual/gruntLeader}

* alias lightLanceTroops
4 {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}
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
7 {ghost}
2 banshee
3 {wraith}
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
2 {dropship}

* childrenof phantom
{lance}
{cargo10m}

* alias cargo10m
5 hunterPair
6 {ghost}, {ghost}
2 chopper
3 revenant
6 spectre
4 sniperPlatform
6 {wraith}

* childrenof hunterPair
hunter
hunter

* alias ghost
10 ghost
3 ghostUltra
1 templeGhost

* alias wraith
10 wraith
3 aAWraith
3 wraithUltra
1 templeWraith



`;

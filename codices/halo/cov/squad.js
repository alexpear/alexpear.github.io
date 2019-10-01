module.exports = `
* output
5 {lance}
2 hunterPair

* alias lance
10 lightLance
4 eliteLance
0 {eliteLance}
0 specOpsLance
0 bruteLance
0 skirmisherLance
0 droneLance

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

* childrenof phantom
{cargo10m}

* alias cargo10m
10 {lance}
5 hunterPair
5 {ghost}, {ghost}
2 chopper
3 revenant
6 spectre
4 sniperPlatform
6 {wraith}

* childrenof hunterPair
hunter
hunter




`;

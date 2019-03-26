module.exports = `
* output
1 {lance}

* alias lance
10 lightLance
0 eliteLance
0 bruteLance
0 skirmisherLance
0 droneLance

* childrenof lightLance
{lightLanceLeader}
{lightLanceTroops}

* alias lightLanceLeader
4 individual/elite
0 NOTE: Brutes only lead Brute squads, because this is set before the Great Schism.
3 individual/jackal
3 {individual/gruntLeader}

* alias lightLanceTroops
0 13 + 1 = 14
0 TODO: A 'x13' syntax would be nice here.
4 {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}, {individual/grunt}
2 individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal, individual/shieldJackal
1 individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal, individual/rifleJackal

* childrenof eliteLance
{individual/eliteLeader}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}
{individual/elite}

`;

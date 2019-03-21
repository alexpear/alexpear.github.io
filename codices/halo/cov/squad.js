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
{lanceLeader}
{lightLanceTroops}

* alias lanceLeader
4 cov/individual/elite
0 NOTE: Brutes only lead Brute squads, because this is set before the Great Schism.
4 cov/individual/jackal
4 {cov/individual/gruntLeader}

* alias lightLanceTroops
0 13 + 1 = 14
4 {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}, {cov/individual/grunt}
4 cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal, cov/individual/shieldJackal

`;

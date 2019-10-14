module.exports = `
* output
100 pod
40 {combatForm}
20 carrierForm
10 {pureForm}
10 brainForm
1 giantTentacle

* alias combatForm
4 infectedHuman
3 infectedElite
1 infectedBrute

* alias pureForm
4 pureQuadriped
4 pureThrower
4 pureTank

* childrenof infectedHuman
{halo/unsc/item}

* childrenof infectedElite
{halo/cov/item}

* childrenof infectedBrute
{halo/cov/item}

`;

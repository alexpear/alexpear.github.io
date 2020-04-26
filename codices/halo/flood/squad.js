module.exports = `
* output
150 {infantryPack}
30 {vehicle}

* alias infantryPack
100 podSwarm
40 combatPack
20 carrierPack
5 purePack

* alias vehicle
10 pelican
5 warthog
3 scorpion
10 phantom
7 ghost
2 wraith
1 banshee

* childrenof podSwarm
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod
individual/pod

* template podGroup
tags: group
consistsOf: individual/pod
quantity: 13
speed: 4
comment: used in the Ring Bottle World.

* childrenof combatPack
{individual/combatForm}
{individual/combatForm}
{individual/combatForm}
{individual/combatForm}
{individual/combatForm}

* childrenof carrierPack
individual/carrierForm
individual/carrierForm
individual/carrierForm

* childrenof purePack
{individual/pureForm}
{individual/pureForm}
{individual/pureForm}
{individual/pureForm}
{individual/pureForm}
{individual/pureForm}
{individual/pureForm}

* childrenof pelican
individual/brainForm
{infantryPack}

* childrenof phantom
individual/brainForm
{infantryPack}

`;

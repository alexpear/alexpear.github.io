module.exports = `

* output
1 {60people}, {500t}
0 This theater limits warbands both by player count and by total weight of vehicles & heavy gear (1t = 1000kg)
0 The weight budget can also be spent on battlefield abilities like air support, artillery missions, and other tricks.

* alias 60people


* alias 500t
1 giantWarMachine
10 {200t}, {200t}, {100t}

* childrenof giantWarMachine
{giantPropulsion}
{hugeGear}

* alias giantPropulsion
2 treads
1 wheels
4 spiderLegs
1 millipede
4 bipedal
4 repulsorlift

* alias hugeGear
4 hugeMachineGun





`;
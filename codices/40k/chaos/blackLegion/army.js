'use strict';

module.exports = `

* output
1 blackLegionArmy

* childrenof blackLegionArmy
4x
2x
1x

* childrenof 4x
{unit}

* childrenof 2x
{unit}

* childrenof 1x
{unit}

* alias unit
9 {infantry}
5 {vehicle}

* alias infantry
9 cultists
4 traitorMilitia
4 beastmen
4 mutants
9 {astartes}
9 {daemon}
5 magosOfTheDarkMechanicum

* alias astartes
9 traitorAstartes
9 chosen
9 possessed
9 aspiringChampionAndBodyguards
9 chaosLord
9 sorcerer
4 raptors
2 havocs
5 obliterators
9 terminators
9 noiseMarines
9 plagueMarines
9 berserkers
9 thousandSons
1 fallenOfCypher

* alias daemon
9 chaosSpawn
9 daemonPrince
9 nurglings
9 plaguebearers
9 bloodletters
5 fleshHounds
7 juggernaut
9 daemonettes
9 flamers
9 horrors
9 screamers
4 furies
9 keeperOfSecrets
9 greatUncleanOne
9 bloodthirster
9 lordOfChange

* alias vehicle
9 rhino
9 predator
9 defiler
1 daemonEngine
9 landRaider
9 thunderhawkGunship
9 bikers

* childrenof rhino
{infantry}

* childrenof landRaider
{infantry}

* childrenof thunderhawkGunship
{infantry}

`;

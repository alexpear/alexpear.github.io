'use strict';

module.exports = `

* output
1 novel

* childrenof novel
planet
defenders
aggressors
motif
influences
sceneLocations
outcome

* childrenof planet
terrain

* childrenof terrain
hot
grasslands

* childrenof defenders
{faction}

* childrenof aggressors
{faction}

* alias faction
31 {humanFaction}
10 {eldarFaction}
5 tau
6 necrons
6 orks
7 tyranids

* alias humanFaction
10 {imperialFaction}
5 {chaosFaction}

* alias imperialFaction
20 adeptusAstartes
8 inquisition
20 imperialGuard
8 adeptusMechanicus
1 imperialNavy
1 officioAssassinorum
1 adeptusArbites
1 adeptusCustodes
1 rogueTraders
1 imperialKnights

* childrenof adeptusAstartes
{chapter}

* alias chapter
10 ultramarines
10 whiteScars
10 ravenGuard
10 imperialFists
10 bloodAngels
10 darkAngels
10 ironHands
10 salamanders
10 spaceWolves
8 blackTemplars
1 silverTemplars
2 crimsonFists
1 legionOfTheDamned

* childrenof inquisition
{ordo}

* alias ordo
4 ordoHereticus
4 ordoMalleus
4 ordoXenos

* alias chaosFaction
10 traitorLegions
6 chaosCult
1 beastmen
1 chaosKnights
1 fallenSororitas

* childrenof traitorLegions
{traitorLegion}

* alias traitorLegion
10 blackLegion
10 deathGuard
10 emperorsChildren
10 thousandSons
10 worldEaters
10 nightLords
10 ironWarriors
10 wordBearers
10 alphaLegion

* alias eldarFaction
8 craftworldEldar
7 darkEldar
3 harlequins
3 ynnari
1 exodites
1 outcasts

* childrenof outcome
{resolution}
{consequence}

* alias resolution
4 defendersRepelAggressors
4 aggressorsConquerPlanet
1 thisWarIsNotOver
2 truce

* alias consequence
4 heavyDefenderCasualties
4 heavyAggressorCasualties
1 peaceIsShattered
4 nothing


`;

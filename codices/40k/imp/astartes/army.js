'use strict';

module.exports = `

* output
1 adeptusAstartesArmy

* childrenof adeptusAstartesArmy
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
8 {vehicle}

* alias infantry
22 tacticalSquad
9 assaultSquad
9 devastatorSquad
5 sniperScouts
5 shotgunScouts
4 scoutBikers
9 bikers
4 attackBike
3 vanguardVeterans
3 sternguardVeterans
7 techmarine
4 reclusiamSquad
4 librarian
5 commandSquad
9 terminatorsWithStormShield
4 terminatorsWithAssaultCannon
9 primarisSquad
1 thunderfireCannon
1 primarisInterceptors
9 centurions

* alias vehicle
9 landspeeder
19 rhino
2 razorback
9 landRaider
7 vindicator
9 predator
3 whirlwind
5 closeCombatDreadnought
4 lascannonDreadnought
1 contemptorDreadnought
9 thunderhawkGunship
19 dropPod
1 invictorWarsuit
1 stormhawkInterceptor
1 stormravenGunship
2 stormtalonGunship

* childrenof rhino
{infantry}

* childrenof razorback
{infantry}

* childrenof landRaider
{infantry}

* childrenof dropPod
{infantry}

* childrenof thunderhawkGunship
{infantry}

`;

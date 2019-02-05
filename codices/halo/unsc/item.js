module.exports = `* output
10 {anyWeapon}
10 {anyGear}
4 {component}

* alias anyWeapon
10 {smallWeapon}
0 gi means General Issue
0 {giWeapon}
0 {specialInfantryWeapon}
0 {highWeightWeapon}
0 {alienWeapon}

* alias smallWeapon
10 reachPistol

* alias anyGear
4 targetDesignator
4 secureDatapad
4 medkit
4 demolitionCharges
4 {giGear}
4 {commandGear}
4 {smallWeapon}
4 jetpack
2 emp
2 plasmaRifle

* alias giGear
4 fragGrenade
4 {smallWeapon}
4 portableTent
4 extraAmmo
4 extraRations
4 camoCloak
3 smokeGrenade
3 trenchShovel
3 radiationPills
2 flashBangGrenade
2 deployableCover
2 caffeinePills
1 medkit

* alias commandGear
4 targetLocator
4 secureDatapad
4 oneTimePad
4 microwaveAntenna
3 emp
2 telescope
2 binoculars
0 {alienWeapon}
0 {alienGrenade}
1 paperMap
1 bubbleShield

* alias component
4 2xScope
3 4xScope
3 10xScope
3 visrScopeForGun
3 kineticBolts
3 stabilizationJetsForGun
0 etc

`;

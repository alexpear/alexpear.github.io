module.exports = `
* output
1 fleet

* childrenof fleet
{fleetChildren}

* alias fleetChildren
10 {majorElement}, {majorElement}, {majorElement}, {majorElement}, {majorElement}
1 halo/unsc/ship/infinityClassSupercarrier

* alias majorElement
20 halo/unsc/ship/marathonClassCruiser
20 {minorElement}, {minorElement}
1 halo/unsc/ship/phoenixClassCarrier

* alias minorElement
4 halo/unsc/ship/frigate
2 halo/unsc/ship/gladiusClassCorvette
1 halo/unsc/ship/prowler

`;
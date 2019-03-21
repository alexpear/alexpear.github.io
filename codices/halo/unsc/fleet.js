module.exports = `
* output
1 fleet

* childrenof fleet
{fleetChildren}

* alias fleetChildren
10 {majorElement}, {majorElement}, {majorElement}, {majorElement}, {majorElement}
1 unsc/ship/infinityClassSupercarrier

* alias majorElement
20 unsc/ship/marathonClassCruiser
20 {minorElement}, {minorElement}
1 unsc/ship/phoenixClassCarrier

* alias minorElement
4 unsc/ship/frigate
2 unsc/ship/gladiusClassCorvette
1 unsc/ship/prowler

`;
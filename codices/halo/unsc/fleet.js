module.exports = `
* output
1 fleet

* childrenof fleet
{fleetChildren}

* alias fleetChildren
10 {majorElement}, {majorElement}, {majorElement}, {majorElement}, {majorElement}
1 halo/unsc/ship/infinityClass

* alias majorElement
4 halo/unsc/ship/marathonClass
4 {minorElement}, {minorElement}

* alias minorElement
4 halo/unsc/ship/frigate
1 halo/unsc/ship/prowler

`;
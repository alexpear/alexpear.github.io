module.exports = `
* output
1 decade

* childrenof decade
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}
{battalion}

* alias battalion
1 airBattalion
4 groundBattalion
1 bruteBattalion

* childrenof groundBattalion
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}
{mobileCompany}


* alias company
1 staticCompany
10 {mobileCompany}

* alias mobileCompany
10 groundCompany
5 fastCompany
5 airCompany
5 bruteCompany
3 bruteFastCompany
2 excavationCompany
4 eliteCompany
2 gruntCompany
2 specOpsCompany
3 armorCompany
2 commandCompany
1 {specialistCompany}

* alias specialistCompany
4 droneCompany
4 jackalCompany
1 hunterCompany
1 demonhunterCompany
1 antipersonnelCompany
1 antiAirCompany
1 antiarmorCompany
4 boardingCompany
4 dropPodCompany

`;
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

* childrenof staticBattalion
staticCompany
staticCompany
staticCompany
staticCompany
{company}
{company}
{company}
{company}
{company}
{company}

* childrenof bruteBattalion
bruteCompany
bruteCompany
bruteCompany
bruteCompany
bruteCompany
bruteCompany
bruteFastCompany
bruteFastCompany
bruteFastCompany
bruteFastCompany

* childrenof bruteCompany
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}
{squad/bruteJurisdictionSquad}

* childrenof bruteFastCompany
{squad/fastBruteSquad}
{squad/fastBruteSquad}
{squad/fastBruteSquad}
{squad/fastBruteSquad}
{squad/fastBruteSquad}
{squad/fastBruteSquad}
{squad/fastBruteSquad}

* childrenof airBattalion
airCompany
airCompany
airCompany
airCompany
airCompany
airCompany
airCompany


* alias company
1 staticCompany
10 {mobileCompany}

* alias mobileCompany
20 groundCompany
8 fastCompany
5 airCompany
5 bruteCompany
1 bruteFastCompany
1 excavationCompany
4 eliteCompany
2 gruntCompany
1 specOpsCompany
3 armorCompany
2 commandCompany
1 {specialistCompany}

* childrenof groundCompany
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}

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

* childrenof specOpsCompany
squad/specOpsEliteLance
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}

* childrenof airCompany
{squad/airSquad}
{squad/airSquad}
{squad/airSquad}
{squad/airSquad}
{squad/airSquad}
{squad/airSquad}
{squad/airSquad}


`;

// Later: Combine these into the above when their prereqs exist
const drafts = `

`;

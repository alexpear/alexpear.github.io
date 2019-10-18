module.exports = `
* output
1 {battalion}

* alias battalion
2 airBattalion
10 groundBattalion
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
2 bruteCompany
1 bruteFastCompany
2 eliteCompany
2 gruntCompany
1 specOpsCompany
3 armorCompany
1 commandCompany
1 {specialistCompany}

* alias specialistCompany
4 droneCompany
4 jackalCompany
1 hunterCompany
2 excavationCompany
1 demonhunterCompany
1 antipersonnelCompany
1 antiAirCompany
1 antiarmorCompany
4 boardingCompany
4 dropPodCompany

* childrenof groundCompany
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}

* childrenof specOpsCompany
squad/specOpsEliteLance
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}
{squad/specOpsSquad}

* childrenof fastCompany
{squad/fastVehicle}
{squad/fastVehicle}
{squad/fastVehicle}
{squad/fastVehicle}
{squad/fastVehicle}
{squad/fastVehicle}
{squad/fastVehicle}

* childrenof airCompany
{squad/airVehicle}
{squad/airVehicle}
{squad/airVehicle}
{squad/airVehicle}
{squad/airVehicle}
{squad/airVehicle}
{squad/airVehicle}

* childrenof armorCompany
{squad/armorSquad}
{squad/armorSquad}
{squad/armorSquad}
{squad/armorSquad}
{squad/armorSquad}
{squad/armorSquad}
{squad/armorSquad}

* childrenof eliteCompany
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}
{squad/elitesOnlySquad}

* childrenof excavationCompany
squad/kraken
squad/scarab
squad/scarab
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}
{squad/mobileSquad}


* childrenof milade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade
hectakilade

* childrenof hectakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade
dekakilade

* childrenof dekakilade
kilade
kilade
kilade
kilade
kilade
kilade
kilade
kilade
kilade
kilade

* alias notes
0 hectade works fine, but even kilade hit a JS out of memory error in the CLI.

* childrenof kilade
hectade
hectade
hectade
hectade
hectade
hectade
hectade
hectade
hectade
hectade

* childrenof hectade
decade
decade
decade
decade
decade
decade
decade
decade
decade
decade

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


`;

// Later: Combine these into the above when their prereqs exist
const drafts = `

`;

'use strict';

module.exports = `

* output
1 organization

* childrenof organization
{teams}
{funding}
{unpoweredStaff}
{jurisdictionSize}
{hq}
{dimension}

* alias teams
20 team
5 team, team
4 team, team, team
2 team, team, team, team
1 team, team, team, team, team

* alias funding
10 nothing
10 limitedFunding
10 reliableFunding
4 veryWellFunded
1 budgetOfAMajorMilitaryPower

* alias reputation
10 ironcladReputation
10 establishedReputation
8 mysteriousReputation
8 shakyReputation
8 reputationForFailure
5 abysmalReputation

* alias unpoweredStaff
10 nothing
10 aFewUnpoweredAssociates
4 legalTeam
4 legalTeam, pRTeam
1 spyNetwork
2 unpoweredParamilitarySquad

* alias jurisdictionSize
4 smallJurisdiction
4 sizeableJurisdiction
4 largeJurisdiction

* alias hq
4 nothing
5 meagerHeadquarters
5 modestHeadquarters
4 fortifiedHeadquarters
2 sprawlingHeadquarters

* alias dimension
10 earthGimel
1 earthCheit
6 earthNun
3 earthShin
1 earthBet
1 earthHe 


* childrenof team 
{capes}
{reputation}

* alias capes
1 parahumans/cape
2 parahumans/cape, parahumans/cape
4 parahumans/cape, parahumans/cape, parahumans/cape
10 parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape
10 parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape
10 parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape
4 parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape
1 parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape, parahumans/cape


`;

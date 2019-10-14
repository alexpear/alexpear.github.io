module.exports = `
* output
1 {installationSquad}
1 {prometheanSquad}

* alias installationSquad
100 sentinelTeam
10 enforcerTeam
1 ancilla

* alias prometheanSquad
2 knightPair
4 knightLance
4 soldierSquad
4 crawlerSquad
1 phaetonTeam

* childrenof sentinelTeam
individual/sentinel
individual/sentinel
individual/sentinel
individual/sentinel
individual/sentinel
individual/sentinel
individual/sentinel

* childrenof enforcerTeam
individual/enforcer
individual/enforcer

* childrenof knightPair
individual/knight
individual/knight

* childrenof knightLance
individual/knight
individual/watcher
individual/soldier
individual/soldier

* childrenof soldierSquad
individual/soldier
individual/soldier
individual/soldier
individual/soldier
individual/soldier
individual/soldier
individual/soldier

* childrenof crawlerSquad
individual/crawler
individual/crawler
individual/crawler
individual/crawler
individual/crawler
individual/crawler
individual/crawler

* childrenof phaetonTeam
phaeton
individual/watcher

`;

/*
Sketching about Forerunner armies
. Battalions of 500 combatants
. Air battalions
  . Sentinels, Ultra Sentinels
  . Enforcers
  . Triremes of Soldiers

*/

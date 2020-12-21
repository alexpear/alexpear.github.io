module.exports = `* output
1 faction

* childrenof faction
populace
specialty
armory
representative
military

* childrenof populace
{wkrieg/species}

* childrenof mind 
{composition}

* childrenof body
{composition}

* childrenof specialty
{topic}

* alias topic
4 spaceFighters
2 cruisers
4 dreadnoughts
4 fortresses
5 infantry
3 weapons
4 armor
4 mecha
4 artillery
4 economics
4 archaeology
4 engineering
4 research
4 knowledge
4 biology
3 psychology
4 stealth
4 espionage
4 politics

* childrenof armory
{wkrieg/carryable}
{wkrieg/carryable}

* childrenof representative
wkrieg/outfit
{repTitle}

* alias repTitle
4 leader 
4 premier
4 president
4 king
4 queen
4 sultan
4 sultana
4 caliph
4 calipha
4 emperor
4 empress
4 primeMinister
4 doctor
4 senator
4 representative
4 governor
8 chief
3 chieftain
4 speaker
4 viscount
4 baron
4 baroness
4 contessa
4 countess
9 lady
9 lord
4 regina
4 rex
4 dux
4 duchess
4 duke
4 conqueror
9 citizen
8 comrade
9 sir
8 madame
9 master
2 mistress
4 dictator
8 consul
8 princess
8 prince
8 emira
8 emir
3 raj
8 elder
8 oracle
8 sylph
5 godtouched
5 starfriend
8 ambassador
7 professor
8 wanderer
7 noman
2 journeyer
4 guildmaster
4 archduke
4 elector
4 chancellor
0 TODO later add a name generated from vowel and conosonant sounds, like fantasy worldName in hobby/

* childrenof military
infantry
reserve

* childrenof infantry
wkrieg/outfit
{infantryName}
{gender}

* alias infantryName
9 regulars
9 irregulars
9 conscripts
3 volunteers
4 guardians
4 ravagers
4 reavers
5 raiders
2 grenadiers
4 dragoons
2 conquistadors
4 myrmidons
4 skirmishers
5 rangers
4 marines
2 soldiers
4 serfs 
4 peasants
8 knights
4 immortals
4 samurai
3 sharpeyes
8 scouts
4 cavaliers
3 chevaliers
4 warriors
3 spotters
2 eradicators
2 vindicators
2 avengers
4 praetorians
4 honorGuard
4 royalGuard
4 civicGuard
4 armyOfThePeople
4 revolutionaries
3 guards
4 clones
2 replicants
3 inheritors
3 torchbearers
3 braves

* alias gender
9 mixedGender
4 exclusivelyFemale
4 exclusivelyMale 
1 exclusivelyPostgender

* childrenof reserve
wkrieg/outfit
{infantryName}
{gender}


* childrenof oldFaction
leadership
personnel
cognition
economy
starships
groundForces

* childrenof leadership
{composition}

* childrenof personnel
{composition}

* childrenof cognition
{composition}

* childrenof economy
{composition}

* childrenof starships
{composition}

* childrenof groundForces
{composition}

* alias composition
4 organic
2 hybrid
3 synthetic

`;

/*
Or a faction could simply have 2 Traits, their most notable aspects
*/

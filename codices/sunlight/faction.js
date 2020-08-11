module.exports = `* output
1 faction2

* childrenof faction
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
4 hybrid
4 synthetic

* childrenof faction2
populace
specialty
armory

* childrenof populace
mind
body

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

`;

/*
Or a faction could simply have 2 Traits, their most notable aspects
*/

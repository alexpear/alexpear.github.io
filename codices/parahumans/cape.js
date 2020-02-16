'use strict';

module.exports = `

* output
1 cape

* childrenof cape
{age}
{gender}
{costume}
power
theme
{allegiance}
mbti

* alias age
1 10YearsOld
1 11YearsOld
1 12YearsOld
1 13YearsOld
2 14YearsOld
3 15YearsOld
3 16YearsOld
3 17YearsOld
3 18YearsOld
3 19YearsOld
3 20YearsOld
3 21YearsOld
3 22YearsOld
3 23YearsOld
3 24YearsOld
2 25YearsOld
2 26YearsOld
2 27YearsOld
2 28YearsOld
2 29YearsOld
2 30YearsOld
1 31YearsOld
1 32YearsOld
1 33YearsOld
1 34YearsOld
1 35YearsOld
1 36YearsOld
1 37YearsOld
1 38YearsOld
1 39YearsOld
1 40YearsOld
 
* alias gender
10 female
9 male
1 nonbinary

* childrenof power
{ratings}

* alias ratings
10 rating
1 rating, rating
0 note that Damsels power has 2 ratings: Mover 3 and Striker 8

* childrenof rating
{class}
{ratingNumber}

* childrenof tinker 
{class}

* alias class
4 mover 
4 shaker
4 brute
4 breaker
4 master
4 tinker
4 blaster
4 thinker
4 striker 
4 changer
4 trump
4 stranger

* alias ratingNumber
1 1
3 2
10 3
30 4
30 5
25 6
20 7
12 8
10 9
1 10
1 11
1 12

* alias costume
4 streetwearCostume
4 amateurishCostume
4 cheapCostume
4 expensiveCostume
4 ruggedizedCostume
4 skintightCostume
4 costumeWithManyPockets
4 uglyCostume
4 tastefulCostume
4 serviceableCostume


* childrenof theme
{topic}

* alias topic
4 {animal}
4 {naturalThing}
4 {artificialThing}

* alias animal
4 bird
4 rodent
4 fish
4 dog
3 cat
4 reptile
2 elephant
1 monkey
3 insect
1 eel 
1 tiger
1 lion
1 eagle

* alias naturalThing
4 lightning
4 darkness
4 sun
4 star
4 air 
4 water
4 fire
4 stone
4 mountain
4 lake
1 cliff
1 chasm
4 tree
4 vine
4 weather

* alias artificialThing
4 hammer
4 sword
4 religion
4 circuitry
1 bonfire
2 furniture
4 business
4 television
4 car
4 aviation
4 space
4 robotics
4 steampunk
4 ageOfSail
4 clothing
4 toy
4 military
4 knight
4 sports
4 comics

* alias allegiance
4 hero
1 rogue
8 villain

`;

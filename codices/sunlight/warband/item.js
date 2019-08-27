module.exports = `

* output
1 gladius

* alias 1kgLoadoutItem
10 gladius
10 pistol
10 fragGrenade
9 smokeGrenade
7 tomahawk
3 handCrossbow
2 club
2 sickle
2 shortbow
2 javelin
1 rapier

* alias 2kgLoadoutItem
10 canteen
10 heavyPistol
6 quarterstaff
5 maul
2 trenchShovel
5 broadsword

* alias 3kgLoadoutItem
10 handShield
10 smg
1 compoundLongbow
8 grenadeLauncher
10 pulseRifle
10 combatShotgun
8 greataxe

* alias 4kgLoadoutItem
4 assaultRifle
4 boltActionRifle
1 halberd

* alias 5kgLoadoutItem
10 longrifle
1 musket
6 blunderbuss
9 sledgehammer


* alias 2kgLoadoutSet
1 {2kgLoadoutItem}
1 {1kgLoadoutItem}, {1kgLoadoutItem}

* alias 3kgLoadoutSet
1 {3kgLoadoutItem}
2 {2kgLoadoutSet}, {1kgLoadoutItem}

* alias 4kgLoadoutSet
1 {4kgLoadoutItem}
1 {3kgLoadoutSet}, {1kgLoadoutItem}
1 {2kgLoadoutSet}, {2kgLoadoutSet}

* alias 5kgLoadoutSet
1 {5kgLoadoutItem}
1 {4kgLoadoutSet}, {1kgLoadoutItem}
1 {3kgLoadoutSet}, {3kgLoadoutSet}


* alias outfit
4 {armor}
2 {clothing}

* alias armor
4 {plasteelArmor}
4 {durafiberArmor}
2 {historicalArmor}
2 {powerArmor}

* alias plasteelArmor
4 plasteelBreastplate
3 plasteelBreastplate, plasteelPauldrons
2 plasteelBreastplate, plasteelPauldrons, plasteelGreaves
2 plasteelBreastplate, plasteelPauldrons, plasteelGreaves, plasteelBracers
4 fullPlasteelArmor

* alias durafiberArmor
4 durafiberJacket
4 durafiberBodysuit

* alias historicalArmor
4 chainShirt
4 ironBreastplate
3 ironBreastplate, leatherArmoredSkirt
4 fullSteelPlate
4 leatherLightArmor

* alias powerArmor
4 poweredAgilityArmor
4 breacherPowerArmor
4 heavyPowerArmor
1 heavyPowerArmor, powerFist

* alias clothing
4 3pieceSuit
3 robes
4 cocktailDress
1 littleBlackDress
5 gi
5 leatherJacket&Jeans
5 tankTop&Shorts
4 bodysuit
3 sari
3 agilityExoskeleton
3 cqbExoskeleton


* alias handwear
6 {gauntlets}
5 armShield
4 weddingRing
4 wristMountedSword
4 wristMountedGrapplingHook
3 wristMountedForcefields
4 fingerlessGloves
4 powerGlove
4 electroGloves

* alias gauntlets
4 plasteelGauntlets
4 steelGauntlets


* alias headwear
4 nothing
4 {hairstyle}
1 circlet
4 hood
4 flowerInHair
4 faceplate
4 voidsuitHelmet

* alias hairstyle
0 TODO: export the following tables to playerTraits.js or similar
4 baldHead
4 hairInPonytail
3 hairInBun
4 shortHaircut
4 spikedHair
4 bobHaircut
3 pompadourHairstyle
4 asymmetricHaircut
4 shoulderLengthHair
4 longHair
4 waistLengthHair
4 frenchBraids

* alias hairColor
10 black
4 darkBrown
3 auburn
3 blond
1 platinumBlond
2 red
1 {color}

* alias color 
4 pink
4 red
4 orange
4 yellow
4 green
4 blue
4 violet
4 white
4 black


`;
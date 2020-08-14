module.exports = `* output
1 outfit

* childrenof outfit
{head}
{base}
{top}
{feet}
armorMaterial
colors
{extra}

* alias head
4 nothing
4 pointedHelm
4 voidproofHelm
4 featherCrestedHelm
4 hood
3 goggles

* alias base
1 loincloth
9 fatigues
9 bodysuit
1 doublet
3 leatherArmor
1 woolShirt, breeches
4 robe
1 doubleBreastedJacket
4 voidsuit
4 {exoskeleton}

* alias exoskeleton
4 agilityExoskeleton
3 enduranceExoskeleton
4 cqcExoskeleton

* alias top
9 nothing
7 breastplate
5 breastplate, bracers
3 breastplate, bracers, greaves
4 breastplate, pauldrons, bracers

* childrenof armorMaterial
{materialType}

* alias materialType
1 wood
4 bone
4 ceramic
3 bronze
4 iron
9 steel
4 plasteel
4 durasteel

* childrenof colors
{color}
{secondaryColor}

* alias color
1 magenta
1 salmon
24 red
5 crimson
1 vermillion
5 scarlet
24 orange
8 yellow
1 lemonYellow
27 green
1 limeGreen
1 lime
1 brightGreen
8 oliveGreen
15 blue
5 skyBlue
1 aquamarine
1 turquoise
27 purple
1 violet
15 white
1 beige
1 lightGrey
7 steel
9 gunmetal
10 gunmetalGrey
4 chrome
13 bronze
30 grey
4 darkGrey
33 black
18 brown
1 tan
1 olive
21 silver
1 opal
12 gold

* alias secondaryColor
1 magenta
1 salmon
1 red
1 crimson
1 vermillion
5 scarlet
1 orange
8 yellow
1 lemonYellow
2 green
1 limeGreen
1 lime
1 brightGreen
8 oliveGreen
3 blue
1 skyBlue
1 aquamarine
1 turquoise
1 purple
1 violet
15 white
2 beige
11 lightGrey
17 steel
9 gunmetal
10 gunmetalGrey
14 chrome
13 bronze
30 grey
14 darkGrey
33 black
18 brown
11 tan
5 olive
21 silver
5 opal
12 gold

* alias feet
3 rocketBoots
3 hoverBoots
2 sandals
1 tennisShoes

* alias extra
9 nothing
3 jetpack
3 cyberwings
9 cape
4 rucksack
3 ammoPouches
3 bandolier

`;

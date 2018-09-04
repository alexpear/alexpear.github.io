'use strict';



class Location {
    constructor (name, neighbors) {
        this.name = name;
        this.neighbors = neighbors || [];
    }

    link (neighbor) {
        // if not already in neighbors, push
    }
}

class CorporealObject {
    constructor () {
        
    }
}

class Creature {
    constructor () {
        
    }
}




function exampleWorldState () {
    var forecastle = new Location('the forecastle');
    var hold = new Location('the hold');
    forecastle.link(hold)
}






"
Paste of various notes:

MRB Waffle
(Yes i know Waffle is a distracting idea)
Locations
each the size of an IF location
.neighbors()
Creatures
.location()
or .in()
There are no giants (multi-location) in this model
.carrying()
or .has()
InanimateObjects
.size()
.in()
returns Location or a carrying Creature
Small / light objects can be carried ('items')

notes
Alternately, CorporealObject could be the superclass of Creature
allows Creatures to be treated like Objects
allows Creatures to carry small Creatures
some weight / physics interactions ?
*shrug* Optional. If it's easy.

Other stuff
toJson()
gen() scenes
render() on an entity
controls for choosing which to render()
could just use node.js repl for now
reroll()
if it's treelike enough as opposed to too graphlike

Other points of view
A grid, like an eco sim, allows better visualization of a living environment 
IF graphs are better for slow, first person exploration
But surely a first-person turn-based roguelike could work? 
Indeed, like my own roguelike project
So maybe it's 1st-person vs objective view 
Note that if the model used a grid, then it could be rendered top-down or IF

More sketching
IF rooms, characters, equipment, as above
Capes / adventurers
Instead of random loadouts, time-simulated loadouts
gen via:
random starting loadout which might be eg a soldier's standard issue equipment
then apply a random series of loadout changes
lost item
damaged item
Found new item
Won new item
Injuries
New skills
Other changes 
maybe even possible for them to become a 'veteran', with lots of cool stuff

Would be fun to have a halo-esque game of choosing equipment, but with more detailed slots than halo's 2 weapon slots. 
Roguelike equipment slots
Head slot
Armor/Clothing slot
Left and Right hand slots
Right hand gets +1
unless lefty or ambidextrous (+1 to both)
1 handed items
2 handed item
Free hand is good for wrestling, typing, spell gestures
(Bracers are ignored in this game ... maybe part of Armor slot)
Feet slot
eg greaves, rocket boots, converses
Back slot
jetpack
cape
extra points!
Holster a 2-handed item
Bag
2 Belt slots
1-handed holster
Consumable items
pouches and pockets
No inventory
holsters
Bags / pouches: items that can hold other items
Going back for items (like in Halo)

Desired Waffle results
I can quickly describe ecologies and simulations
and watch them roll and run
pause, zoom in, rewind or review history
eg, a simulation about 40k factions on a planet having little battles and dramas
Okay if limited to one scale or context at first
I can save them (in some nice format)
I can press run and drop into a procedural IF world
eg, a strange world of ancient tunnels to explore
or a complex ecology
I can run a character around in these worlds like a game
This can be roguelikelike: Short, random
Does not have to be combat focused, but certainly can be dangerous
Maybe i could set up some simple goals, like exploring all the xenocaches
Releasing prose fiction about the Beveled World

some links blocked by work 
http://www.brasslantern.org/writers/iftheory/autonomousnpcs.html
http://www.intfiction.org/forum/viewtopic.php?f=6&t=9891

A Waffle worldtype file should ideally define:
How to generate starting worldstates 
graphs or trees or Entities with coords or whatever
What creatures and objects can exist, with how to make variations
How they behave, or what behavior profiles are available

The generic engine looks at it as:
A worldstate
Set of spaces
grid probably, altho i'm interested in the IF option
could probably model most IF networks onto a grid
especially if there are teleporters
All the objects and creatures
Including which are carrying which, in which boxes, etc
Some form of history tracking
Last-cached-worldstate + Event list = current worldstate
or a Series of worldstates
Each Creature or entity that can cause events has something (pointer to behavior-class function?) that indicates how it chooses what action to output. 
";


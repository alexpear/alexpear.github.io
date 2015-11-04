#!/usr/bin/python

'''
python object based representation of generated worlds
simulation / stepping compatible
for interactive fiction, games, sims, and toys
'waffle' name comes from the novel You by Austin Grossman
'''

import pickle
import random

class Util:
  # Users count 1,2,3 while programmers count 0,1,2
  # Kind of silly but helps me remember
  @staticmethod
  def toUserNumbering(n):
    return n + 1

  @staticmethod
  def fromUserNumbering(n):
    if n == 0:
      print('error: zero passed to fromUserNumbering()')
      return
    return n - 1

# TODO: split out Table into a new file
class Result:
  def __init__(self, text, fileName, lineNum):
    self.text = text
    self.filename = fileName
    self.lineNum = lineNum


class Table:
  def __init__(self, fileName):
    self.results = []
    with open(fileName) as file:
      lines = file.read().splitlines()
      for lineNum, line in enumerate(lines):
        words = line.split()
        if len(words) < 2:
          continue
        text = ' '.join(words[1:])
        tempResult = Result(text, fileName, lineNum)
        weight = int(words[0])
        for i in range(weight):
          self.results.append(tempResult)

  def result(self):
    return choice(self.results)

class Output:
  def fillBlanks(self):
    leftBracket = self.text.find('{')
    if leftBracket > -1:
      rightBracket = self.text.find('}')
      tableName = self.text[leftBracket+1 : rightBracket]
      slotTable = Table(tableName + '.txt')
      self.results.append(slotTable.result())
      # Replace bracket-to-bracket text with Result text (in real output.text)
      self.text = self.text[:leftBracket] + self.results[-1].text + self.text[rightBracket+1 :]
      self.fillBlanks()

  # took out color codes
  # 2013-12-10. Something goes wrong combined with the color code stuff. The code for the esc character is 4 characters but gets shrunk into one and that throws stuff off. Also the color codes contain the '[' character. i added start for this. 
  # Fill in blanks of the format [herself/himself]. Only used for gender for now. You can use either order so long as you're consistent. Parameter 'which' is a 0 or 1 and determines whether you use the left or right pronoun. (0 is left/first). Param 'start' says to only consider characters after that index (this is used to ignore '['s in color codes). 
  def fillSquareBrackets(self, which):
    leftBracket = self.text.find('[')
    if leftBracket > -1:
      slash = self.text.find('/')
      rightBracket = self.text.find(']')
      if which == 0:
        chosen = self.text[leftBracket+1 : slash]
      else:
        chosen = self.text[slash+1 : rightBracket]
      t = self.text
      self.text = t.replace(t[leftBracket : rightBracket+1], chosen)
      self.fillSquareBrackets(which)

  def __init__(self, textIn):
    self.text = textIn
    self.results = []
    self.fillBlanks()
    self.fillSquareBrackets(random.choice([0,1]))


class Entity:
  def __init__(self, name='nameless entity', typeName='entity', parent=None):
    self.name = name
    self.typeName = typeName
    self.in = parent
    self.contents = []

class Region(Entity):
  def __init__(self, name='amorphous region'):
    super(Region, self).__init__(name, 'region')

class PhysicalObject(Entity):
  def __init__(self, name='unnamed object'):
    super(PhysicalObject, self).__init__(name, 'physicalobject')
    # self.weight =   # weight might not be needed; size carries most of it
    # self.size =

class Creature(PhysicalObject):
  def __init__(self, name='unnamed creature'):
    super(Creature, self).__init__(name, 'creature')
    # self.mind =
    # self.body =


class WorldState:
  def __init__(self):
    self.root = Region('Known Space')
    # self.root.contents.append()
    pass


class Universe:
  def __init__(self):
    # history is a list of WorldStates
    self.history = [WorldState()]

'''
notes

newWorld = WorldState()
nextState = WorldState(oldState)
or just
nextState = WorldState.step()

woldstate constructor
self.world = Node('region', 'Our lightless world')
or
self.world = Region('Our lightless world')
loop:
.world.components.append(Floor())
and Floor() creates its own child nodes

Node (or Entity?)
 Location
  Floor
  Room
 Located (altho technically Locations are also 'Located')
  InanimateObject
  Actor
   Humanoid
   Monster

playing around with some other ideas
space opera
Node
 Location
  SpaceRegion
   StarSystem
   Orbit
  CelestialBody
   Star
   Planet
    (technically both Location and Corporeal;
    possibly relevant when talking about
    Death Star planetbusters...)
 Corporeal
  Structure
   SpaceShip
   Building
   Megastructure
  Organism
   Human
 Informational
  Intelligence
   HumanMind

sketch of some nodes
human character. location size weight actions components contents (stomach)
jewelry box. location size weight components contents
ghost. location size weight==0? actions components? contents?
planetary orbit. location size contents/components
trait: phobia. parent components?
secret society. components possessions (+ rules traditions etc)
planet. location size weight components and whatever you call sub-locations
Eclipse Phase ego.
  location (unless cloud) parent filesize actions
  components? contents (ie secrets) shell
office: presidency. parent? president-of-what pointer, holder
xenoexpedition oversight committee. larger organisation, members, subordinate bodies (rules)

(.size fields are 1-dimensional in style of D&D sizes.
Stored in SI length units with 1 sig fig.)
alternately i could have .size be in Liters, but similarly not specify dimensions
(ie not specify whether skinny, squat, boxy, etc).
i could even do a conversion when displaying:
1L == 10cm
1000L == 1m
or perhaps display higher numbers since it's the length of the /longest/
dimension and most objects will be skinnier than boxes.

there's more than one way to order nodes when talking about groups of corporeal and
noncorporeal objects.
Fleet
 Squad
  Sailor x20
  Submarine
vs
Fleet
 Submarine
  Sailor x20
vs
Fleet
 Squad
  Submarine
   Sailor x20
or even link it both ways:
squad.parts == [submarine, sailors x20] etc
submarine.contents == [sailors x20]

side note: i guess i could mark duplication like this
Multiple
 Sailor
where multiple.parts == [sailor] and multiple.quantity == 100, etc.

ie, are the Sailors in the .contents of the Submarine?
is it the physical metal object? or the admiral's concept of a submarine + crew?
better example:
StarSystem
 Star
 Planet
  Orbit
  Surface
   2DRegion
vs
StarSystem
 Star
 Orbit
  Planet
   2DRegion

i like the latter. a Node should refer to the physical object,
not the invisible stuff associated with it.

how about software? or minds.
perhaps the computer (if all in one place) has the software in .contents
Corporeal
 Human
  Mind in .contents

further complications to worry about later: where to put items a human is carrying?

attempt at standardization:
Organization: .obeys, .components/.parts, .parent/.superOrg/.whole, .controls/.subordinates
Location: .location, .parts, .size .contents
Informational: .location/.container, .filesize, .parts
Corporeal: .location, .size, .weight, .parts, .contents?, .whole
Intelligence: .container, .filesize, .parts, .motives
Trait: .whole, .parts?
Spaceship: .location, .parts, .contents, .size, .weight
Durasteel: (sentinel, just material stats)
  (or course, many things are sentinels ie popular pointer recipients)
  perhaps a .weight per 'meter' of size
Unknown: (sentinel, displayed in place of what's really there but not visible)
Ungenerated: (sentinel)

todo: sketch an inheritance hierarchy that captures these overlapping sets
.parts and .whole seem very common
Trait, Material, Ungenerated, and Unknown are pretty minimal
.obeys and .controls might be useful for Organization and Actors
.motives also.
.size is for Location and Corporeal
.weight is for Corporeal
.location is for Location and Corporeal,
  altho it could maybe be replaced with .container? or a rewording of that?
.filesize is just for Informationals and things that will be stored as data.

rewording sketching
.parts and .partOf
.contents and .insideOf

attempt:
Node .whole .parts
 ungenerated sentinel (instance)
 unknown sentinel (instance)
 Trait
 Located .insideOf .contents
  Voluminous .size
   (Location)
  Corporeal .weight
   multiple inheritance: (Spaceship, Body, Jetpack, CelestialBody?)

actually, Corporeal and Voluminous dont have to inherit from Located.

There are some more notes in my screen/tablet, and in my orange notebook.

what wolfram language does is make all names explicit.
i guess i have a set of candidate edge types, and
i have to decide which ones to include.

linear stats
 .size
 .weight
 .filesize

edges/links
 .parts & .partOf
 .contents and .insideOf
 .location, if different from .insideOf
 .obeys and .controls
 .subOrganization and .superOrganization, if different from .parts and .partOf
 .members, if different from .parts
 .motives

alpha sector
tau ceti system
cislunar system of Tau Ceti III
 |
 v
orbit of Tau Ceti III's 2nd moon
 |
 | .insideOf
 v           .insideOf         .insideOf
a dreadnought -> dropship in hold -> power armor warriors in dropship
 ^
 | .memberOf?
 |
36th Fleet
 ^
 |
Her Majesty's Navy

well, for purposes of a game / IF ...
for space battles world, need to know:
 commandable units in faction as tree
 location of each unit
  including which are inside which vehicles
 tree or other system of Locations
 possibly which parts spaceships and mecha are built from.

well, i'm in this spaceship pointer sounds very similar to
i'm on this planet/continent pointer.
call it .insideOf or .location
maybe .location and .contents

okay, so that's the physical tree. do i also have an organizational tree?

types
 commandable unit
 location
 physical unit?

alt
 location
 locationless organizational unit
 located organizational unit
  'models' aka Human, vehicle, etc
   components, equipment, parts

technically, no org has a location, even tho a squad might in practise.
if this is a little more narrativist and less simulationist,
then we can assume that squads are never split up
(we count those that split as casualties).
basically each squad has a location and you can move them around
(space battles simple game/prototype)
you can also give an order to an organizational unit higher up
on the tree and then all squads under that will move there.
or rather all physical / top-level 'models' will move.
ie spaceships, transports, vehicles, whatever is 'in the open'.
so ... what if you didnt track organization units, and just considered squads
to be unitary? and you give commands like 'all my units in this region' or
'all my infantry in this region'.
or ... org units have a .location, but it's set to None when they split up. 
or if the squads of the org are on two separate continents, it's ambiguated?
set to point to the planet?


'''

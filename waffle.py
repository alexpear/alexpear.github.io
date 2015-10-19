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


class Node:
  def __init__(self, name, typeName='entity'):
    self.name = name
    self.typeName = typeName
    self.components = []
    self.contents = []


class WorldState:
  def __init__(self):
    # self.root = Region('Our lightless world')
    # for num in range(4):
    #  self.world.components.append(Floor())
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
alternately i could have .size be in Liters, but similarly not specify dimensions.

attempt at standardization:
Organization: .obeys, .components/.parts, .parent/.superOrg/.whole, .controls/.subordinates
Location: .location, .parts, .size
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

'''

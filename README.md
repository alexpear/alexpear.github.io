This is the README file for the git repo for the personal website [alexpear.github.io](https://alexpear.github.io)

This website include the following prototype projects:
- Tree Navigator - A random generator for text-based fiction and a simple UI for examining the output. Currently set up to generate detailed fleets of scifi starships, but the design is very flexible. WIP.
- Death Planet Fish Tank - A simulated world of endless battle. A top-down view onto this world. WIP.

## How to build:
- clone this repo
- npm start
- go to localhost:8080 in a browser
- Howto test via CLI:
  - npm run test

## To Do:
- Wiederholungskrieg army loadout gen
  - Add carried nonweapon items to carryable.js (and armory node)

- Expand upon weapon test func in ProjectileEvent.js
  - Func for testing and logging a entire engagement between 2 Groups (a la Grid War or Halo Ring).
    - They start at a certain range, and can move closer or further during the engagement
  - Simpler: same but they always move closer.
  - Simpler: same but they dont move

- In codices/sunlight/, abbreviate wiederholungskrieg to 'wkrieg'.

- Make variant AliasTable internal storage format that doesnt use so much memory, but is instead similar to regionTree.js. (Iteratively subtrack each weight from a random roll.)

- Add more files in gridView/images/, and templates mentioning size in individual.js files. 
  - Add images for neutral terrain obstacles. pelicanWreck, warthogWreck, skyscraper, mountain, lake, etc.

- Brainstorm how to make all BEvents compatible with WorldStates of both continuous and grid spatial models. Ideally everything about Coords should call out to the WorldState, so that it can return Coords with appropriate dimensions and values.

- See TODOs in timeline.js

- Func for Parahumans that takes a cape WNode and pretty prints it

- Explore expanding WGenerator to read from yml format.
  - And/or converting existing codex js files into yml format.

- Death Planet Fish Tank
  - Add logic about every creature moving closer to its destination each tick.
  - Maybe increase frame rate. 0.1 seconds per tick.
    - In theory this should not increase the computational needs much, nor the quantity of BEvents
  - Replay functionality
    - Given a timeline, be able to reconstruct the WorldState at each tick
    - Alternatively, cache a WorldState at every tick. Whichever seems more useful in terms of performance.
    - Base Death Planet upon a replay, not a live-running sim
  - Timeline.toJson() and WorldState.toJson(). The former probably calls the latter, not vice versa.
    - In DeathPlanetWorldState.example(), store the json of the timeline as a local variable. Log the length of that string. Write it to a file or to console.
  - Minor bug: flakArmor and dmr WNodes have coords, sometimes with inaccurate values.
  - Minor bug: WNodes are showing up with storage mode partial when i thought it should be 'full detail'/'nonfractal' mode.
    - Also, maybe we could omit that prop in whichever case is more common.

- Halo Ring Bottle
  - Give RingWorldState.example() some ArrivalEvents that instantiate Groups into the .nodes array.

- Waffle Tree fractal mode
  - Scale test result: JS stack limit exceeded. Could test with larger limit.
    - Or could debug whether this large runtime stack is desirable.
  - Implement logic to handle Partial WNodes
    - Typically this will mean generating its child nodes on the fly
    - These children will be generated as status Partial
  - Implement tracking storedNodeCount. All generation and dropping can update a counter.
  - Implement the walk that drops stored nodes until there are only PRUNE_DOWN_TO nodes
    - Dropping a stored node includes marking its parent as a Partial
    - Hmm .. or potentially, instead of dropping the current node, you turn a internal node into a Partial and drop all of its children

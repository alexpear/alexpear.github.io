This is the README file for the git repo for the personal website [alexpear.github.io](https://alexpear.github.io)

This website include the following prototype projects:
- Tree Navigator - A random generator for text-based fiction and a simple UI for examining the output. Currently set up to generate detailed fleets of scifi starships, but the design is very flexible. WIP.
- Death Planet Fish Tank - A simulated world of endless battle. A top-down view onto this world. WIP.

## How to build:
- npm start
- go to localhost:8080 in a browser

## To Do:
- See TODOs in timeline.js
- Death Planet Fish Tank
  - Edit fishTank.js to base its graphics upon a backend consisting of DeathPlanetWorldState.example(), instead of upon its current hacky internal Phaser funcs.
    - First make sure the WorldState instance in that file is a DeathPlanetWorldState
    - In the loop that instantiates 100 Phaser objects, add a ArrivalEvent in that loop.
    - Then refactor the loop such that computeNextInstant -> ArrivalEvent.resolve() -> create Phaser object for that Thing (at that moment or later)
    - Sync Timeline.now() and real time in seconds, shown in Phaser display
    - Then make the Phaser object display representations of what's going on with its Thing 
  - Howto test via CLI:
    - npm run test
  - ProjectileEvent.resolve()
    - Persist all details of what happens into one or more BEvents.
    - Draw up a MRB scheme for what info to persist in ProjectileEvent fields, and whether to use ImpactEvent, DamageEvent, UpdateEvent, etc
  - Add logic about every creature moving closer to its destination each tick.
  - Standardize types in BEvent props
    - I think protagonist and target should point to full objects. .serialize() should output a object that has ids. a load() func can do the reverse.
    - This means you translate when entering and leaving the DB, but not anywhere else. This sounds to me like the scheme that requires translation most rarely. (2019 October 14)
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

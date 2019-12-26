This is the README file for the git repo for the personal website [alexpear.github.io](https://alexpear.github.io)

This website include the following prototype projects:
- Tree Navigator - A random generator for text-based fiction and a simple UI for examining the output. Currently set up to generate detailed fleets of scifi starships, but the design is very flexible. WIP.
- Death Planet Fish Tank - A simulated world of endless battle. A top-down view onto this world. WIP.

## How to build:
- npm start
- go to localhost:8080 in a browser
- Howto test via CLI:
  - npm run test

## To Do:
- See TODOs in timeline.js
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
  - Force/Banner based. Creatures of a faction always move in clumps. Nearby clumps join up.
  - Display with CLI log function that buckets the 1-dimensional space into 30-50 sectors, and lists what is there.
  - All human marines for MRB 1

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

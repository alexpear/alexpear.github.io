This is the README file for the git repo for the personal website [alexpear.github.io](https://alexpear.github.io)

This website include the following prototype projects:
- Tree Navigator - A random generator for text-based fiction and a simple UI for examining the output. Currently set up to generate detailed fleets of scifi starships, but the design is very flexible. WIP.
- Death Planet Fish Tank - A simulated world of endless battle. A top-down view onto this world. WIP.

## To Do:
- See TODOs in timeline.js
- Death Planet Fish Tank
  - Add logic so that, on ActionReady events, creatures initiate their (only) Action.
  - Add logic about every creature moving closer to its destination each tick.
- Waffle Tree fractal mode
  - Implement logic to handle Partial WNodes
    - Typically this will mean generating its child nodes on the fly
    - These children will be generated as status Partial
  - Implement tracking storedNodeCount. All generation and dropping can update a counter.
  - Implement the walk that drops stored nodes until there are only PRUNE_DOWN_TO nodes
    - Dropping a stored node includes marking its parent as a Partial
    - Hmm .. or potentially, instead of dropping the current node, you turn a internal node into a Partial and drop all of its children

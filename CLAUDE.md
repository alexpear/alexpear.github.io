# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Permissions

Do not run any git commands. Only the user runs git.

## Commands

```bash
npm start          # Initial setup: npm i && buildAll
npm run buildAll   # Build all browserified projects
npm run server     # Start http-server at localhost:8080
npm run refresh    # buildAll + server

npm test           # Run Jest unit tests
npm run testAll    # Run all tests including world state tests
npm run lint       # ESLint on TypeScript files
npm run prettier   # Check formatting
npm run prettierwrite  # Auto-format code

# Build individual projects
npm run buildTreeBrowser
npm run buildFishTank
npm run buildGroupGrid
npm run buildTitleGen
npm run buildTextGen
npm run buildVillainverse
npm run buildblockscout   # TypeScript compile
```

## Architecture

This is a multi-project monorepo centered on **procedural generation** and **interactive browser simulations**.

### Procedural Generation Pipeline

1. **Codices** (`/codices/`) — declarative content templates organized by universe (halo/, 40k/, hogwarts/, parahumans/, etc.)
2. **WGenerator** (`/generation/wgenerator.js`) — parses codex DSL using AliasTables (weighted probability) and ChildTables (hierarchy) to produce WNode trees
3. **WNode** (`/wnode/`) — base entity class; subclasses include Creature, Group, Thing, DetailedPerson

### World Simulation Pattern

- **WorldState** (`/bottleWorld/`) — base class tracking entities and timeline
- Specialized implementations: DeathPlanetWorldState, GridWarWorldState, RingWorldState, DndWorldState
- **BEvent** subclasses drive simulation (ArrivalEvent, ProjectileEvent, MoveAllEvent)
- **Timeline** records event history; supports replay

### Module/Build System

- Legacy projects: CommonJS source in `src/`, bundled via **Browserify** to `bundle.js`
- BlockScout (`/games/blockscout/`): TypeScript compiled with `tsc`, webpack not used for this project
- Each project has an `.html` entry point loading its bundle
- TypeScript config: ES2016 target, strict mode (root `tsconfig.json`); BlockScout uses ES2020, non-strict

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `/bottleWorld` | World state implementations, events, timeline |
| `/generation` | WGenerator, alias tables, world generator helpers |
| `/wnode` | Core data structures (WNode, Creature, Group, Thing) |
| `/battle20` | Combat system (BattleGroup, CreatureTemplate, ActionTemplate) |
| `/codices` | Content templates by universe |
| `/games/blockscout` | TypeScript + Leaflet map-based mobile game (see below) |
| `/util` | Shared utilities (coord system, color, timer, box geometry) |

### BlockScout

A mobile web game showing the player's GPS position on a Leaflet/OSM map. Objectives are placed at every 0.01° grid intersection. Open `games/blockscout/blockscout.html` in a browser to play.

- Vanilla TypeScript compiled with `tsc` to `dist/`, no bundler
- Leaflet is loaded via CDN and accessed as a global (`declare const L: any`), not imported
- Uses ES2020, non-strict TypeScript (`games/blockscout/tsconfig.json`)

### Code Style

- 4-space indentation, single quotes, trailing commas (`.prettierrc`)
- TODO/LATER comments used extensively for deferred work
- ESLint configured for TypeScript (`**/*.ts`)
- Never use null when you could use undefined
- Avoid using 'any' because it turns off typechecking

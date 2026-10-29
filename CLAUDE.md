# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Permissions

Do not run any git commands. Only the user runs git.

## Commands

See package.json for the full, current list of npm scripts.

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
- BlockScout (`/games/blockscout/`): TypeScript compiled with `tsc` then bundled with **Browserify** (`npm run buildblockscout`)
- Wots (`/games/wots/`): TypeScript + React, bundled with **webpack + ts-loader** in one step (`npm run buildwots` or `npm run wots`); no separate `tsc` step
- Each project has an `.html` entry point loading its bundle

### Code Style

- TODO/LATER comments used extensively for deferred work
- Never use null when you could use undefined
- Avoid using 'any' because it turns off typechecking

### General Guidance

- When asked to plan a new project, it's generally best to look up documentation and context online.

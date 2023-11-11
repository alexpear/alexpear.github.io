module.exports = `---
# Edit this file to change various values in the Warband game.

Halo:
    name: Halo
    Covenant:
        Creature:
            AAWraith:
                classic: 3
                cost: 31
                damage: 13
                durability: 24
                name: AA Wraith
                preferredRange: 8
                size: 4
                speed: 2
                tags: Ground
                items:
                    - Item.FuelRodCannon
            Banshee:
                durability: 57
                name: Banshee
                speed: 10
                size: 6
                accuracy: 2
                items:
                    - Item.FuelRodCannon
            Banshees:
                classic: 7
                cost: 36
                damage: 11
                durability: 21
                name: Banshees
                preferredRange: 3
                size: 4
                speed: 11
                tags: Air
            BerserkerBrutes:
                classic: 4
                cost: 26
                damage: 24
                durability: 21
                group: Brute
                name: Berserker Brutes
                preferredRange: 0
                size: 2
                speed: 3
                tags: Ground
            Brute:
                accuracy: 2
                durability: 27
                group: Brute
                name: Brute
                speed: 2
                size: 3
                items:
                    - Item.Spiker
            BruteChieftain:
                accuracy: 4
                classic: 7
                cost: 26
                damage: 27
                durability: 44
                gear: Has bodyguard brutes
                group: Brute
                name: Brute Chieftain
                preferredRange: 0
                size: 3
                speed: 2
                tags: Ground
                items:
                    - Item.GravityHammer
            BruteDivision:
                accuracy: 2
                classic: 7
                damage: 8
                durability: 14
                group: Brute
                name: Brute Division
                preferredRange: 4
                scale: Battalion
                size: 2
            BruteStalkersMauler:
                classic: 4
                cost: 32
                damage: 6
                durability: 26
                group: Brute
                name: Brute Stalkers Mauler
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            BrutesSpiker:
                classic: 8
                cost: 28
                damage: 6
                durability: 21
                gear: Spiker
                group: Brute
                name: Brutes Spiker
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            Chopper:
                durability: 50
                group: Brute
                name: Chopper
                speed: 5
                accuracy: 2
                size: 6
                items:
                    - Item.BruteShot
            CommandElitesHeavyWeapons:
                classic: 6
                cost: 40
                damage: 15
                durability: 23
                group: Elite
                name: Command Elites heavy weapons
                preferredRange: 5
                size: 2
                speed: 3
                tags: Ground
            Corvette:
                accuracy: 0
                classic: 3
                cost: 59
                damage: 23
                durability: 27
                name: Corvette
                preferredRange: 25
                size: 6
                speed: 6
                tags: Air
                transport: yes
                items:
                    - Item.WraithMortar
            CovenantArmorDivision:
                accuracy: 3
                classic: 8
                damage: 24
                durability: 25
                name: Covenant Armor division
                preferredRange: 42
                scale: Battalion
                size: 6
                type: Explosive
            CovenantCruiser:
                durability: 71429
                name: Covenant cruiser
            CovenantHeavyInfantryDivision:
                classic: 6
                name: Covenant heavy infantry division
                scale: Battalion
                size: 2
            CovenantLightVehicleDivision:
                accuracy: 1
                classic: 8
                damage: 20
                durability: 20
                name: Covenant light vehicle division
                preferredRange: 5
                scale: Battalion
                type: Fire
            CovenantSpecOpsDivision:
                accuracy: 2
                classic: 8
                damage: 8
                durability: 17
                name: Covenant Spec Ops division
                preferredRange: 3
                scale: Battalion
                size: 2
            CovenantSupercarrier:
                durability: 1428571
                name: Covenant Supercarrier
            Drone:
                durability: 4
                name: Drone
                speed: 5
                size: 2
                accuracy: 1
                items:
                    - Item.PlasmaPistol
            Drones:
                classic: 4
                cost: 21
                damage: 4
                durability: 14
                name: Drones
                preferredRange: 3
                size: 2
                speed: 5
                tags: Air
            Elite:
                accuracy: 3
                durability: 27
                name: Elite
                speed: 3
                size: 3
                items:
                    - Item.PlasmaRifle
            ElitePR:
                accuracy: 1
                classic: 8
                cost: 40
                damage: 4
                durability: 20
                name: Elite PR
                preferredRange: 3
                scale: Individual
                size: 2
                type: Fire
            EliteUltra:
                durability: 30
                name: Elite Ultra
                speed: 3
            ElitesCarbine:
                classic: 8
                cost: 31
                damage: 6
                durability: 21
                gear: Carbine
                group: Elite
                name: Elites carbine
                preferredRange: 5
                size: 2
                speed: 3
                tags: Ground
            Ghost:
                durability: 50
                name: Ghost
                speed: 8
                size: 5
                accuracy: 2
                items:
                    - Item.PlasmaTurret
            Grunt:
                accuracy: 0
                durability: 5
                items:
                    - Item.PlasmaPistol
                name: Grunt
                size: 1.5
                speed: 1.5
            GruntDivision:
                accuracy: 1
                classic: 8
                damage: 4
                durability: 11
                name: Grunt division
                preferredRange: 3
                scale: Battalion
                size: 2
                type: Fire
            GruntLance:
                classic: 10
                cost: 16
                damage: 4
                durability: 12
                group: Grunt
                name: Grunt Lance
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            GruntPP:
                accuracy: 1
                classic: 8
                cost: 8
                damage: 4
                durability: 11
                name: Grunt PP
                preferredRange: 3
                scale: Individual
                size: 2
                type: Fire
            HeavyGruntsFuelRodCannon:
                classic: 5
                cost: 23
                damage: 13
                durability: 12
                group: Grunt
                name: Heavy Grunts fuel rod cannon
                preferredRange: 5
                size: 2
                speed: 2
                tags: Ground
            Hunter:
                accuracy: 2
                classic: 8
                cost: 100
                damage: 12
                durability: 66
                name: Hunter
                preferredRange: 5
                scale: Individual
                size: 4
                speed: 1
                type: Explosive
                tags: Ground
                items:
                    - Item.FuelRodCannon
            Huragok:
                classic: 6
                cost: 2
                name: Huragok
                size: 2
                speed: 2
                tags: Air
            JackalDivision:
                accuracy: 1
                classic: 8
                damage: 4
                durability: 19
                name: Jackal division
                preferredRange: 3
                scale: Battalion
                size: 2
                type: Fire
            JackalFocusRifle:
                accuracy: 2
                classic: 6
                damage: 12
                durability: 11
                name: Jackal focus rifle
                preferredRange: 29
                scale: Individual
                size: 2
                type: Kinetic
            JackalNoShield:
                durability: 9
                name: Jackal no shield
                speed: 2
            JackalShield:
                durability: 21
                name: Jackal shield
                speed: 2
            JackalShieldPP:
                accuracy: 1
                classic: 8
                cost: 15
                damage: 4
                durability: 19
                name: Jackal Shield PP
                preferredRange: 3
                scale: Individual
                size: 2
                type: Fire
            JumppackBrutesCarbine:
                classic: 7
                cost: 35
                damage: 8
                durability: 21
                gear: Carbine
                group: Brute
                name: Jumppack Brutes carbine
                preferredRange: 5
                size: 2
                speed: 5
                tags: Air
            Kraken:
                accuracy: 0
                classic: 3
                cost: 35
                damage: 13
                durability: 26
                name: Kraken
                preferredRange: 8
                size: 6
                speed: 3
                tags: Ground
                transport: yes
                items:
                    - Item.PlasmaTurret
            Lich:
                durability: 2143
                name: Lich
                source: Halo 4
                tags: Air
                speed: 3
                accuracy: 0
                size: 100
                items:
                    - Item.ShadeTurret
            Phantom:
                accuracy: 1
                classic: 7
                damage: 4
                durability: 24
                name: Phantom
                preferredRange: 6
                scale: Individual
                size: 6
                speed: 4
                type: Explosive
                items:
                    - Item.ShadeTurret
            Prowler:
                durability: 57
                group: Brute
                name: Prowler
                speed: 4
            RangerElitesNeedleRifle:
                classic: 6
                cost: 34
                damage: 8
                durability: 21
                group: Elite
                name: Ranger Elites needle rifle
                preferredRange: 5
                size: 2
                speed: 5
                tags: Air
            RangerLancePlasmaWeapons:
                classic: 2
                cost: 23
                damage: 6
                durability: 14
                group: Grunt
                name: Ranger Lance plasma weapons
                preferredRange: 3
                size: 2
                speed: 5
                tags: Air
            Scarab+Crew:
                accuracy: 3
                classic: 8
                cost: 10
                damage: 40
                durability: 25
                name: Scarab + crew
                preferredRange: 42
                scale: Individual
                size: 12
                type: Explosive
            ScarabDivision:
                accuracy: 3
                classic: 9
                damage: 40
                durability: 25
                name: Scarab division
                preferredRange: 42
                scale: Battalion
                size: 12
                type: Explosive
            ShieldJackalsPlasmaPistol:
                classic: 9
                cost: 22
                damage: 4
                durability: 20
                group: Jackal
                name: Shield Jackals plasma pistol
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            SkimmersShockRifle:
                classic: 5
                cost: 22
                damage: 6
                durability: 12
                name: Skimmers shock rifle
                preferredRange: 5
                size: 2
                speed: 3
                tags: Air
            SkirmisherDivision:
                accuracy: 1
                classic: 6
                damage: 4
                durability: 16
                name: Skirmisher division
                preferredRange: 4
                scale: Battalion
                size: 2
            SkirmisherPP:
                accuracy: 1
                classic: 6
                damage: 4
                durability: 15
                name: Skirmisher PP
                preferredRange: 3
                scale: Individual
                size: 2
                type: Fire
            SkirmishersNeedleRifle:
                classic: 6
                cost: 29
                damage: 8
                durability: 15
                gear: Needle Rifle
                group: Jackal
                name: Skirmishers needle rifle
                preferredRange: 5
                size: 2
                speed: 5
                tags: Ground
            SniperJackalsBeamRifle:
                classic: 7
                cost: 45
                damage: 11
                durability: 12
                group: Jackal
                name: Sniper Jackals beam rifle
                preferredRange: 35
                size: 2
                speed: 2
                tags: Ground
            SpecOpsElite:
                durability: 29
                name: Spec Ops Elite
                speed: 3
            SpecOpsGrunt:
                durability: 11
                name: Spec Ops Grunt
                speed: 2
            Spirit:
                accuracy: 1
                classic: 7
                cost: 38
                damage: 8
                durability: 24
                name: Spirit
                preferredRange: 5
                scale: Individual
                size: 6
                speed: 12
                tags: Air
                transport: yes
                type: Explosive
            StealthElite:
                durability: 10
                name: Stealth Elite
                speed: 3
            StealthElitesPlasmaRifle:
                classic: 8
                cost: 29
                damage: 6
                durability: 26
                gear: Plasma Rifle
                group: Elite
                name: Stealth Elites plasma rifle
                preferredRange: 3
                size: 2
                speed: 3
                tags: Ground
            Wraith:
                accuracy: 3
                classic: 8
                cost: 31
                damage: 24
                durability: 300
                name: Wraith
                preferredRange: 8
                speed: 3
                size: 6
                scale: Individual
                tags: Ground
                type: Explosive
                items:
                    - Item.WraithMortar
            ZealotsNeedleRifle:
                classic: 4
                cost: 33
                damage: 8
                durability: 21
                group: Elite
                name: Zealots needle rifle
                preferredRange: 5
                size: 2
                speed: 3
                tags: Ground
        Item:
            BeamRifle:
                aoe: 2
                classic: 7
                cost: 11
                damage: 10
                name: Beam Rifle
                rof: 1
                tags: infantry
                type: Hardlight
                color: blue
            BruteCQC:
                aoe: 1
                classic: 10
                cost: 0
                damage: 9
                group: Brute
                name: Brute CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            BruteShot:
                aoe: 1
                classic: 7
                cost: 9
                damage: 6
                group: Brute
                name: Brute Shot
                preferredRange: 3
                rof: 1
                tags: biginfantry
                type: Impact
            BruteShotCQc(fromBrute):
                aoe: 1
                classic: 7
                cost: 0
                damage: 13
                group: Brute
                name: Brute Shot CQC (from Brute)
                preferredRange: 0
                rof: 1
                tags: infantry
                type: Kinetic
            Carbine:
                aoe: 1
                classic: 8
                cost: 7
                damage: 1
                name: Carbine
                rof: 2
                tags: infantry
                type: Kinetic
            ConcussionRifle:
                aoe: 2
                classic: 3
                cost: 9
                damage: 4
                name: Concussion Rifle
                rof: 1
                tags: infantry
                type: Impact
            EliteCQC:
                aoe: 1
                classic: 9
                cost: 0
                damage: 12
                name: Elite CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            EnergySword:
                aoe: 1
                classic: 6
                cost: 8
                damage: 13
                name: Energy Sword
                preferredRange: 0
                rof: 1
                tags: biginfantry
                type: Fire
            FocusRifle:
                aoe: 1
                classic: 4
                cost: 12
                damage: 4
                name: Focus Rifle
                rof: 1
                tags: infantry
                type: Fire
                accuracy: 10
            FuelRodCannon:
                aoe: 3
                classic: 7
                cost: 12
                damage: 10
                name: Fuel Rod Cannon
                rof: 1
                tags: infantry
                type: Fire
            GravityHammer:
                aoe: 2
                classic: 4
                cost: 8
                damage: 17
                group: Brute
                name: Gravity Hammer
                preferredRange: 0
                rof: 1
                tags: biginfantry
                type: Impact
            GruntCQC:
                aoe: 1
                classic: 10
                cost: 0
                damage: 0
                name: Grunt CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            HunterCQC:
                aoe: 3
                classic: 5
                cost: 0
                damage: 17
                name: Hunter CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            HunterCannon:
                aoe: 2
                classic: 5
                cost: 12
                damage: 8
                name: Hunter Cannon
                rof: 1
                source: Halo 1
                type: Fire
            IncendiaryGrenade:
                accuracy: 1
                aoe: 2
                classic: 3
                damage: 5
                group: Brute
                name: Incendiary Grenade
                preferredRange: 5
                tags: infantry
                type: Fire
            Mauler:
                accuracy: 120
                aoe: 1
                classic: 3
                cost: 5
                damage: 7
                group: Brute
                name: Mauler
                preferredRange: 0
                rof: 1
                tags: infantry
                type: Kinetic
            NeedleRifle:
                aoe: 1
                classic: 4
                cost: 8
                damage: 4
                name: Needle Rifle
                rof: 1
                tags: infantry
                type: Kinetic
                color: pink
            Needler:
                aoe: 2
                classic: 10
                cost: 5
                damage: 2
                name: Needler
                rof: 3
                tags: infantry
                type: Kinetic
                color: pink
            PlasmaCaster:
                aoe: 3
                cost: 11
                damage: 12
                name: Plasma Caster
                rof: 1
                tags: infantry
                type: Fire
                color: blue
            PlasmaGrenade:
                accuracy: 1
                aoe: 3
                classic: 10
                damage: 20
                name: Plasma Grenade
                preferredRange: 5
                tags: infantry
                type: Fire
                color: blue
            PlasmaLauncher:
                aoe: 3
                classic: 3
                cost: 10
                damage: 7
                name: Plasma Launcher
                rof: 0.5
                tags: infantry
                type: Fire
                color: blue
            PlasmaPistol:
                aoe: 1
                classic: 10
                cost: 3
                damage: 1
                name: Plasma Pistol
                rof: 2
                tags: infantry
                type: Fire
                color: lime
            PlasmaPistolCharged:
                aoe: 1
                classic: 9
                damage: 1
                name: Plasma Pistol Charged
                rof: 1
                tags: infantry
                type: Fire
            PlasmaRepeater:
                aoe: 1
                classic: 3
                cost: 4
                damage: 1
                name: Plasma Repeater
                rof: 3
                tags: infantry
                type: Fire
            PlasmaRifle:
                aoe: 1
                classic: 8
                cost: 3
                damage: 1
                name: Plasma Rifle
                rof: 3
                source: Halo 2
                tags: infantry
                type: Fire
                color: blue
            PlasmaTurret:
                aoe: 1
                classic: 6
                cost: 10
                damage: 3
                name: Plasma Turret
                rof: 2
                tags: turret
                type: Fire
                color: blue
            ScarabCannon:
                aoe: 10
                classic: 2
                damage: 133
                name: Scarab Cannon
                rof: 0.1
                type: Fire
                color: green
            ShadeTurret:
                aoe: 3
                classic: 7
                cost: 10
                damage: 1
                name: Shade Turret
                rof: 1
                tags: turret
                type: Fire
                color: purple
            SpikeGrenade:
                accuracy: 1
                aoe: 2
                classic: 9
                damage: 13
                group: Brute
                name: Spike Grenade
                preferredRange: 5
                tags: infantry
                type: Kinetic
                color: orange
            Spiker:
                aoe: 1
                classic: 9
                cost: 4
                damage: 1
                gear: dmg should be higher. More than sailor sp.
                group: Brute
                name: Spiker
                rof: 2
                tags: infantry
                type: Kinetic
                color: orange
            SpikerCQc(fromBrute):
                aoe: 1
                classic: 9
                cost: 0
                damage: 10
                group: Brute
                name: Spiker CQC (from Brute)
                preferredRange: 0
                rof: 1
                tags: infantry
                type: Kinetic
            TartarusGavel:
                aoe: 5
                classic: 1
                cost: 13
                damage: 27
                group: Brute
                name: Tartarus' Gavel
                rof: 1
                tags: biginfantry
                type: Impact
            WraithMortar:
                aoe: 5
                classic: 4
                damage: 53
                name: Wraith Mortar
                rof: 1
                type: Fire
        Squad:
            Banshee:
                creature: Creature.Banshee
                image: banshee.jpeg
                name: Banshee
                quantity: 1
            Brute:
                creature: Creature.Brute
                image: brute.jpg
                name: Brute
                quantity: 3
            BruteChieftain:
                creature: Creature.BruteChieftain
                image: bruteChieftain.png
                name: BruteChieftain
                quantity: 1
            Chopper:
                creature: Creature.Chopper
                image: chopper.jpg
                name: Chopper
                quantity: 1
            Corvette:
                creature: Creature.Corvette
                image: corvette.png
                name: Corvette
                quantity: 1
            Drone:
                creature: Creature.Drone
                image: drone.png
                name: Drone
                quantity: 3
            Elite:
                creature: Creature.Elite
                image: elite.jpg
                name: Elite
                quantity: 3
            Ghost:
                creature: Creature.Ghost
                image: ghost.jpg
                name: Ghost
                quantity: 1
            Grunt:
                creature: Creature.Grunt
                image: grunt.png
                name: Grunt
                quantity: 3
            Hunter:
                creature: Creature.Hunter
                image: hunter.png
                name: Hunter
                quantity: 2
            Kraken:
                creature: Creature.Kraken
                image: kraken.jpg
                name: Kraken
                quantity: 1
            Lich:
                creature: Creature.Lich
                image: lich.png
                name: Lich
                quantity: 1
            Phantom:
                creature: Creature.Phantom
                image: phantom.png
                name: Phantom
                quantity: 1
            Wraith:
                creature: Creature.Wraith
                image: wraith.png
                name: Wraith
                quantity: 1
    Flood:
        Creature:
            CarrierForm:
                accuracy: 0
                classic: 5
                cost: 10
                durability: 2
                name: Carrier Form
                size: 2
                speed: 1
                tags: Ground
                items:
                    - Item.CarrierBlast
            CombatForm:
                classic: 7
                cost: 20
                durability: 15
                name: Combat Forms (Human)
                size: 2
                speed: 3
                tags: Ground
                items:
                    - Item.CombatFormCQC
            CombatHorde(largeBodies):
                accuracy: 1
                classic: 6
                damage: 8
                durability: 14
                name: Combat horde (large bodies)
                preferredRange: 0
                scale: Battalion
                size: 2
                type: Blade
            CombatHorde(smallBodies):
                accuracy: 1
                classic: 9
                damage: 8
                durability: 14
                name: Combat horde (small bodies)
                preferredRange: 0
                scale: Battalion
                size: 2
                type: Blade
            FloodCombatForm(Marine):
                accuracy: 1
                classic: 8
                cost: 15
                damage: 8
                durability: 14
                name: Flood Combat Form (Marine)
                preferredRange: 0
                scale: Individual
                size: 2
                type: Blade
            FloodCombatFormBrute:
                durability: 19
                name: Flood Combat Form Brute
                speed: 2
            FloodCombatFormElite:
                durability: 17
                name: Flood Combat Form Elite
                speed: 3
            FloodCombatFormHuman:
                durability: 14
                name: Flood Combat Form Human
                speed: 2
            FloodInfectionForm:
                accuracy: 0
                classic: 8
                cost: 1
                damage: 4
                durability: 10
                name: Flood Infection Form
                preferredRange: 0
                scale: Individual
                size: 2
                type: Blade
            FloodSpiderForm:
                durability: 14
                name: Flood Spider Form
                source: Halo 3
                speed: 3
            FloodSpinerForm:
                durability: 14
                name: Flood Spiner Form
                source: Halo 3
                speed: 0
            FloodTankForm:
                durability: 50
                name: Flood Tank Form
                source: Halo 3
                speed: 1
            InfectionPods:
                classic: 7
                cost: 14
                damage: 12
                durability: 9
                name: Infection Pods
                preferredRange: 0
                size: 2
                speed: 3
                tags: Ground
            InfectionSwarm:
                accuracy: 0
                classic: 8
                damage: 4
                durability: 10
                name: Infection swarm
                preferredRange: 0
                scale: Battalion
                size: 1
            PureForms:
                classic: 3
                cost: 33
                damage: 4
                durability: 21
                name: Pure Forms
                preferredRange: 5
                size: 2
                speed: 5
                tags: Ground
        Item:
            CarrierBlast:
                accuracy: 2
                aoe: 3
                damage: 16
                rof: 1
                name: Flood Carrier blast
                type: Impact
            CombatFormCQC:
                accuracy: 2
                aoe: 1
                classic: 9
                cost: 0
                damage: 12
                name: Flood Combat Form CQC
                rof: 1
                type: Impact
            FloodPodCQC:
                aoe: 1
                classic: 10
                cost: 0
                damage: 1
                name: Flood Pod CQC
                rof: 1
                type: Kinetic
                color: brown
            FloodSpineMunitions:
                aoe: 1
                classic: 4
                cost: 0
                damage: 1
                name: Flood spine munitions
                rof: 1
                type: Kinetic
        Squad:
            CombatForm:
                creature: Creature.CombatForm
                image: combatForm.png
                name: CombatForm
                quantity: 3

    Forerunner:
        Creature:
            BattlewagonIncinerationCannon:
                classic: 4
                cost: 233
                damage: 15
                durability: 23
                group: Promethean
                name: Battlewagon incineration cannon
                preferredRange: 5
                size: 2
                speed: 149
                tags: Ground
            Crawler:
                accuracy: 0
                durability: 10
                name: Crawler
                size: 2
                source: Halo 5
                group: Promethean
                speed: 3
                items:
                    - Item.Suppressor
            ForerunnerKeyship:
                durability: 2857143
                name: Forerunner Keyship
                source: Halo 5
            Guardian:
                classic: 1
                cost: 47
                damage: 25
                durability: 30
                name: Guardian
                preferredRange: 13
                size: 6
                speed: 3
                tags: Air
            Knight:
                durability: 57
                name: Knight
                source: Halo 5
                speed: 4
                size: 3
                accuracy: 2
                items:
                    - Item.Lightrifle
            KnightsLightrifle:
                classic: 5
                cost: 228
                damage: 8
                durability: 23
                gear: Lightrifle
                group: Promethean
                name: Knights lightrifle
                preferredRange: 5
                size: 2
                speed: 149
                tags: Ground
            Phaeton:
                durability: 200
                name: Phaeton
                speed: 5
            Phaetons:
                classic: 4
                cost: 33
                damage: 10
                durability: 21
                group: Promethean
                name: Phaetons
                preferredRange: 5
                size: 4
                speed: 8
                tags: Air
            PrometheanSoldierSuppressor:
                accuracy: 1
                classic: 3
                damage: 8
                durability: 17
                name: Promethean Soldier suppressor
                preferredRange: 4
                scale: Individual
                size: 2
                type: Kinetic
            Sentinel:
                accuracy: 1
                classic: 9
                cost: 20
                damage: 8
                durability: 17
                name: Sentinel
                preferredRange: 5
                scale: Individual
                size: 2
                source: Reach
                speed: 4
                type: Fire
                items:
                    - Item.SentinelBeam
            SentinelDivision:
                accuracy: 1
                classic: 7
                damage: 8
                durability: 20
                name: Sentinel division
                preferredRange: 5
                scale: Battalion
                size: 2
            SentinelEnforcer:
                accuracy: 3
                classic: 6
                damage: 20
                durability: 55
                name: Sentinel Enforcer
                preferredRange: 8
                scale: Individual
                size: 4
                speed: 1.5
                type: Explosive
            Sentinels:
                classic: 7
                cost: 216
                damage: 4
                durability: 17
                name: Sentinels
                preferredRange: 3
                size: 2
                speed: 149
                tags: Air
            Soldier:
                durability: 14
                name: Soldier
                size: 2
                source: Halo 4
                speed: 4
            SoldierSuppressor:
                classic: 2
                cost: 217
                damage: 4
                durability: 18
                name: Soldier suppressor
                preferredRange: 3
                size: 2
                speed: 149
                tags: Ground
            Warden:
                classic: 3
                cost: 242
                damage: 17
                durability: 24
                group: Promethean
                name: Warden
                preferredRange: 13
                size: 2
                speed: 149
                tags: Ground
            WardenEternal:
                durability: 571
                name: Warden Eternal
                source: Halo 5
                speed: 1
            Watcher:
                durability: 11
                name: Watcher
                size: 2
                source: Halo 5
                speed: 5
            Watchers:
                classic: 5
                cost: 212
                damage: 2
                durability: 12
                group: Promethean
                name: Watchers
                preferredRange: 5
                size: 2
                speed: 149
                tags: Air
        Item:
            BinaryRifle:
                aoe: 2
                classic: 4
                cost: 12
                damage: 13
                name: Binary Rifle
                rof: 1
                source: Halo 5
                tags: infantry
                type: Fire
                color: red
            Boltshot:
                aoe: 1
                classic: 7
                cost: 8
                damage: 2
                name: Boltshot
                rof: 1
                source: Halo 5
                tags: infantry
                type: Fire
                color: orange
            CrawlerCQC:
                aoe: 1
                classic: 9
                cost: 0
                damage: 6
                name: Crawler CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            DuelistsBoltshot:
                aoe: 1
                classic: 7
                cost: 4
                damage: 1
                name: Duelist's Boltshot
                rof: 1
                source: Halo 4
                tags: infantry
                type: Fire
            Heatwave:
                name: Heatwave
                type: Hardlight
                color: pink
                damage: 15
                accuracy: 1
                rof: 2
            IncinerationCannon:
                aoe: 4
                classic: 4
                cost: 10
                damage: 27
                name: Incineration Cannon
                rof: 1
                source: Halo 4
                tags: biginfantry
                type: Fire
            Knightblade:
                aoe: 2
                classic: 5
                damage: 13
                name: Knightblade
                rof: 1
                source: Halo 5
                tags: natural
                type: Fire
            Lightrifle:
                aoe: 1
                classic: 8
                cost: 8
                damage: 3
                name: Lightrifle
                rof: 1
                source: Halo 5
                tags: infantry
                type: Fire
                accuracy: 8
            PulseGrenade:
                aoe: 1
                classic: 8
                damage: 7
                name: Pulse Grenade
                source: Halo 4
                tags: infantry
                type: Fire
            SentinelBeam:
                aoe: 1
                classic: 9
                cost: 8
                damage: 3
                name: Sentinel Beam
                rof: 1
                source: Halo 1
                tags: infantry
                type: Fire
            SplinterGrenade:
                aoe: 2
                classic: 8
                damage: 13
                name: Splinter Grenade
                source: Halo 5
                tags: infantry
                type: Fire
            SplinterTurret:
                aoe: 2
                classic: 4
                cost: 10
                damage: 5
                name: Splinter Turret
                rof: 1
                source: Halo 5
                tags: biginfantry
                type: Fire
            Suppressor:
                aoe: 1
                classic: 9
                cost: 9
                damage: 1
                name: Suppressor
                rof: 4
                source: Halo 5
                tags: infantry
                type: Fire
        Squad:
            Crawler:
                creature: Creature.Crawler
                image: crawler.png
                name: Crawler
                quantity: 3
            Knight:
                creature: Creature.Knight
                image: knight.jpg
                name: Knight
                quantity: 2
            Sentinel:
                creature: Creature.Sentinel
                image: sentinel.jpg
                name: Sentinel
                quantity: 3
    UNSC:
        Creature:
            AaTower:
                classic: 5
                cost: 43
                damage: 13
                durability: 24
                name: AA Tower
                preferredRange: 25
                size: 6
                speed: 0
                tags: Ground
            Base:
                classic: 2
                cost: 18
                durability: 26
                name: Base
                size: 6
                speed: 0
                tags: Ground
                transport: yes
            CrewSidekick:
                classic: 5
                cost: 13
                damage: 2
                durability: 11
                gear: Sidekick
                name: Crew Sidekick
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            Elephant:
                accuracy: 0
                classic: 6
                damage: 20
                durability: 200
                name: Elephant
                preferredRange: 0
                scale: Individual
                size: 8
                type: Crush
            Falcon:
                accuracy: 2
                classic: 3
                damage: 8
                durability: 21
                name: Falcon
                preferredRange: 6
                scale: Individual
                size: 4
                speed: 7
                type: Kinetic
                items:
                    - Item.Chaingun
            FalconChaingun:
                classic: 7
                cost: 34
                damage: 10
                durability: 21
                name: Falcon Chaingun
                preferredRange: 5
                size: 4
                speed: 8
                tags: Air
                transport: yes
                color: yellow
            FalconRPG:
                classic: 1
                cost: 29
                durability: 21
                name: Falcon RPG
                preferredRange: 5
                size: 4
                speed: 8
                tags: Air
                transport: yes
            FortifiedMarineDivision:
                accuracy: 2
                classic: 7
                damage: 8
                durability: 25
                name: Fortified Marine division
                preferredRange: 8
                scale: Battalion
            GaussHog:
                classic: 6
                cost: 27
                durability: 23
                name: Gauss Hog
                preferredRange: 5
                size: 4
                speed: 6
                tags: Ground
            Gungoose:
                classic: 4
                cost: 20
                durability: 14
                name: Gungoose
                size: 4
                speed: 8
                tags: Ground
                transport: yes
            HannibalScorpion:
                classic: 3
                cost: 17
                durability: 23
                name: Hannibal Scorpion
                size: 4
                speed: 2
                tags: Ground
            HannibalWasp:
                classic: 3
                cost: 28
                durability: 21
                name: Hannibal Wasp
                preferredRange: 5
                size: 4
                speed: 8
                tags: Air
            HelljumpersDMRJetpack:
                classic: 6
                cost: 30
                damage: 10
                durability: 14
                group: ODST
                name: Helljumpers DMR jetpack
                preferredRange: 8
                size: 2
                speed: 3
                tags: Air
            Hornet:
                accuracy: 2
                classic: 3
                damage: 12
                durability: 50
                name: Hornet
                preferredRange: 7
                scale: Individual
                size: 4
                speed: 6
                type: Explosive
                items:
                    - Item.GrenadeLauncher
            Hornets:
                classic: 6
                cost: 38
                damage: 13
                durability: 21
                name: Hornets
                preferredRange: 8
                size: 4
                speed: 8
                tags: Air
                transport: yes
            Longsword:
                accuracy: 3
                classic: 2
                damage: 32
                durability: 20
                name: Longsword
                preferredRange: 8
                scale: Individual
                size: 6
                type: Explosive
            Mammoth:
                durability: 1429
                cost: 100
                classic: 5
                name: Mammoth
                source: Halo 5
                speed: 2
                tags: Ground
                transport: yes
                items:
                    - Item.MammothMAC
            Mantis:
                accuracy: 2
                classic: 6
                damage: 20
                durability: 25
                name: Mantis
                preferredRange: 6
                scale: Individual
                size: 4
                speed: 1.5
                type: Explosive
                items:
                    - Item.GrenadeLauncher
            MarathonClassCruiser:
                durability: 12857
                name: Marathon Class Cruiser
            Marine:
                accuracy: 1
                durability: 10
                items:
                    - Item.SMG
                name: Marine
                size: 2
                source: Halo 1
                speed: 1.5
            MarineAR:
                accuracy: 1
                classic: 10
                cost: 10
                damage: 8
                durability: 16
                name: Marine AR
                preferredRange: 3
                scale: Individual
                size: 2
                type: Kinetic
            MarineBR:
                accuracy: 2
                classic: 8
                cost: 20
                damage: 4
                durability: 16
                name: Marine BR
                preferredRange: 7
                scale: Individual
                size: 2
                type: Kinetic
            MarineDMR:
                accuracy: 2
                classic: 7
                cost: 22
                damage: 4
                durability: 16
                name: Marine DMR
                preferredRange: 10
                scale: Individual
                size: 2
                type: Kinetic
            MarineFrags:
                accuracy: 2
                classic: 3
                damage: 12
                durability: 16
                name: Marine Frags
                preferredRange: 2
                scale: Individual
                size: 2
                type: Explosive
            MarineGrenadeLauncher:
                accuracy: 2
                classic: 5
                damage: 16
                durability: 16
                name: Marine Grenade Launcher
                preferredRange: 3
                scale: Individual
                size: 2
                type: Explosive
            MarineGungoose:
                accuracy: 2
                classic: 4
                damage: 12
                durability: 20
                name: Marine Gungoose
                preferredRange: 3
                scale: Individual
                size: 2
                type: Explosive
            MarineHydra:
                accuracy: 3
                classic: 6
                damage: 12
                durability: 16
                name: Marine Hydra
                preferredRange: 8
                scale: Individual
                size: 2
                type: Explosive
            MarineInfantryDivision:
                accuracy: 1
                classic: 7
                damage: 8
                durability: 16
                name: Marine infantry division
                preferredRange: 4
                scale: Battalion
                size: 2
            MarineLaser:
                accuracy: 3
                classic: 6
                damage: 12
                durability: 16
                name: Marine Laser
                preferredRange: 8
                scale: Individual
                size: 2
                type: Fire
            MarineRocketLauncher:
                accuracy: 2
                classic: 6
                damage: 20
                durability: 16
                name: Marine Rocket Launcher
                preferredRange: 3
                scale: Individual
                size: 2
                type: Explosive
            MarineSMG:
                accuracy: 1
                classic: 6
                cost: 9
                damage: 8
                durability: 16
                name: Marine SMG
                preferredRange: 3
                scale: Individual
                size: 2
                type: Kinetic
            MarineShotgun:
                accuracy: 2
                classic: 8
                damage: 8
                durability: 16
                name: Marine Shotgun
                preferredRange: 1
                scale: Individual
                size: 2
                type: Kinetic
            MarineSniper:
                accuracy: 2
                classic: 8
                damage: 12
                durability: 16
                name: Marine Sniper
                preferredRange: 29
                scale: Individual
                size: 2
                type: Kinetic
            MarinesAR:
                classic: 10
                cost: 19
                damage: 6
                durability: 14
                group: Marine
                name: Marines AR
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            MarinesBR:
                classic: 5
                cost: 22
                damage: 10
                durability: 12
                group: Marine
                name: Marines BR
                preferredRange: 5
                size: 2
                speed: 2
                tags: Ground
            MarinesHydra:
                cost: 28
                damage: 11
                durability: 14
                gear: Hydra
                group: 0
                name: Marines Hydra
                preferredRange: 8
                size: 2
                speed: 2
                tags: Ground
            MarinesMongooseSMG:
                accuracy: 1
                classic: 5
                damage: 8
                durability: 18
                name: Marines Mongoose SMG
                preferredRange: 3
                scale: Individual
                size: 2
                type: Kinetic
            MarinesRocketLauncher:
                classic: 5
                cost: 26
                damage: 11
                durability: 12
                group: Marine
                name: Marines rocket launcher
                preferredRange: 8
                size: 2
                speed: 2
                tags: Ground
            MarinesSMG:
                classic: 10
                cost: 18
                damage: 4
                durability: 14
                group: Marine
                name: Marines SMG
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            MarinesShotgun:
                classic: 4
                cost: 14
                damage: 12
                durability: 12
                group: Marine
                name: Marines shotgun
                preferredRange: 0
                size: 2
                speed: 2
                tags: Ground
            MarinesSniperRifle:
                classic: 5
                cost: 50
                damage: 11
                durability: 14
                group: Marine
                name: Marines sniper rifle
                preferredRange: 35
                size: 2
                speed: 2
                tags: Ground
            MissileBunker:
                accuracy: 3
                classic: 6
                damage: 40
                durability: 30
                name: Missile Bunker
                preferredRange: 83333
                scale: Individual
                size: 6
                type: Explosive
            ODST:
                accuracy: 3
                durability: 14
                name: ODST
                size: 2
                source: Halo 3 Recon
                speed: 2
                items:
                    - Item.SilencedSMG
            ODSTDMR:
                classic: 7
                cost: 28
                damage: 6
                durability: 18
                group: ODST
                name: ODST w/ DMR
                preferredRange: 8
                size: 2
                speed: 2
                tags: Ground
            ODSTBR:
                accuracy: 2
                classic: 7
                cost: 30
                damage: 4
                durability: 19
                name: ODST BR
                preferredRange: 7
                scale: Individual
                size: 2
                type: Kinetic
            ODSTFlamethrower:
                accuracy: 2
                classic: 4
                damage: 16
                durability: 19
                name: ODST Flamethrower
                preferredRange: 1
                scale: Individual
                size: 2
                type: Fire
            ODSTRailgun:
                accuracy: 2
                classic: 4
                damage: 12
                durability: 19
                name: ODST Railgun
                preferredRange: 5
                scale: Individual
                size: 2
                type: Kinetic
            ODSTSAW:
                accuracy: 2
                classic: 6
                damage: 12
                durability: 19
                name: ODST SAW
                preferredRange: 6
                scale: Individual
                size: 2
                type: Kinetic
            ODSTTurret:
                accuracy: 2
                classic: 4
                damage: 16
                durability: 19
                name: ODST Turret
                preferredRange: 6
                scale: Individual
                size: 2
                type: Kinetic
            OfficerHeavyPistol:
                accuracy: 2
                classic: 7
                damage: 8
                durability: 10
                name: Officer Heavy Pistol
                preferredRange: 6
                scale: Individual
                size: 2
                type: Kinetic
            OfficerLightPistol:
                accuracy: 1
                classic: 3
                damage: 4
                durability: 10
                name: Officer Light Pistol
                preferredRange: 3
                scale: Individual
                size: 2
                type: Kinetic
            OfficerMagnum:
                accuracy: 1
                classic: 3
                damage: 4
                durability: 10
                name: Officer Magnum
                preferredRange: 5
                scale: Individual
                size: 2
                type: Kinetic
            OfficersSidekick:
                classic: 3
                cost: 13
                damage: 2
                durability: 11
                gear: Sidekick
                group: Marine
                name: Officers sidekick
                preferredRange: 3
                size: 2
                speed: 2
                tags: Ground
            OfficerUnarmed:
                accuracy: 0
                classic: 3
                damage: 4
                durability: 10
                name: Officerunarmed
                preferredRange: 0
                scale: Individual
                size: 2
                type: Crush
            Pelican:
                accuracy: 2
                classic: 6
                damage: 8
                durability: 21
                name: Pelican
                preferredRange: 6
                scale: Individual
                size: 6
                speed: 6
                type: Kinetic
                items:
                    - Item.Chaingun
            Razorback:
                classic: 4
                cost: 23
                durability: 21
                name: Razorback
                size: 4
                speed: 6
                tags: Ground
                transport: yes
            RocketHog:
                classic: 4
                cost: 27
                durability: 23
                name: Rocket Hog
                preferredRange: 5
                size: 4
                speed: 6
                tags: Ground
            Sailor:
                durability: 2
                gear: Heavy Pistol
                name: Sailor
                size: 2
                source: Halo 1
                speed: 2
            Scorpion:
                accuracy: 4
                classic: 8
                cost: 1
                damage: 32
                durability: 20
                name: Scorpion
                preferredRange: 33
                scale: Individual
                size: 6
                speed: 1.5
                type: Explosive
                items:
                    - Item.ScorpionCannon
            ScorpionDivision:
                accuracy: 4
                classic: 8
                damage: 32
                durability: 20
                name: Scorpion division
                preferredRange: 25
                scale: Battalion
                size: 6
                type: Explosive
            Spartan-III:
                accuracy: 1
                classic: 7
                damage: 4
                durability: 21
                gear: AssaultRifle
                name: Spartan- III
                preferredRange: 3
                scale: Individual
                size: 2
                type: Kinetic
            SpartanArmored:
                durability: 26
                gear: SAW
                name: Spartan Armored
                size: 3
                source: Halo 1
                speed: 2
            SpartanBR:
                accuracy: 5
                classic: 10
                cost: 55
                durability: 21
                group: Spartan
                name: Spartan BR
                size: 2.5
                speed: 3
                tags: Ground
                items:
                    - Item.BattleRifle
            SpartanChaingun:
                classic: 3
                cost: 34
                damage: 11
                durability: 21
                group: Spartan
                name: Spartan chaingun
                preferredRange: 5
                size: 2
                speed: 2
                tags: Ground
            SpartanSPI:
                durability: 13
                name: Spartan SPI
                speed: 2
            SpartanShotgun:
                classic: 2
                cost: 27
                damage: 27
                durability: 21
                group: Spartan
                name: Spartan shotgun
                preferredRange: 0
                size: 2
                speed: 3
                tags: Ground
            SpartanSniperRifle:
                classic: 4
                cost: 62
                damage: 11
                durability: 21
                group: Spartan
                name: Spartan sniper rifle
                preferredRange: 38
                size: 2
                speed: 3
                tags: Ground
            SpartanUnarmored:
                durability: 11
                name: Spartan Unarmored
                size: 3
                speed: 2
            TacticalMAC:
                accuracy: 3
                classic: 4
                cost: 66
                damage: 40
                durability: 21
                name: Tactical MAC
                preferredRange: 833
                scale: Individual
                size: 6
                speed: 0
                tags: Ground
                type: Explosive
            UNSCCapturedScarab:
                accuracy: 3
                classic: 6
                damage: 40
                durability: 25
                name: UNSC captured Scarab
                preferredRange: 42
                scale: Battalion
                size: 12
                type: Explosive
            UNSCInfinity:
                durability: 142857
                name: UNSC Infinity
            Warthog:
                accuracy: 2
                classic: 9
                cost: 200
                damage: 8
                durability: 20
                name: Warthog
                preferredRange: 6
                scale: Individual
                size: 4
                speed: 4
                type: Kinetic
                items:
                    - Item.Chaingun
            Wasp:
                accuracy: 2
                classic: 6
                damage: 8
                durability: 20
                name: Wasp
                preferredRange: 7
                scale: Individual
                size: 4
                speed: 8
                type: Kinetic
                items:
                    - Item.GrenadeLauncher
        Item:
            AssaultRifle:
                accuracy: 2
                aoe: 1
                classic: 9
                cost: 7
                damage: 1
                name: Assault Rifle
                preferredRange: 2
                rof: 5
                source: Reach
                tags: infantry
                type: Kinetic
                color: yellow
            BattleRifle:
                accuracy: 4
                aoe: 1
                classic: 8
                cost: 8
                damage: 1
                name: Battle Rifle
                preferredRange: 5
                rof: 2
                tags: infantry
                type: Kinetic
                color: yellow
            Bulldog:
                name: Bulldog
                type: Kinetic
                color: yellow
                rof: 2
                accuracy: 0
                damage: 12
            Chaingun:
                accuracy: 3
                aoe: 1
                classic: 8
                cost: 10
                damage: 5
                name: Chaingun
                preferredRange: 3
                rof: 3
                tags: turret
                type: Kinetic
                color: yellow
            Commando:
                name: Commando
                type: Kinetic
                color: yellow
                rof: 3
                damage: 4
                accuracy: 5
            DMR:
                accuracy: 27
                aoe: 1
                classic: 7
                cost: 10
                damage: 3
                name: DMR
                preferredRange: 15
                rof: 1
                tags: infantry
                type: Kinetic
                color: yellow
            Endgame:
                aoe: 1
                cost: 13
                damage: 20
                name: Endgame
                rof: 1
                tags: infantry
                type: Fire
                color: red
            Flamethrower:
                aoe: 2
                classic: 4
                cost: 8
                damage: 6
                name: Flamethrower
                rof: 3
                tags: infantry
                type: Fire
            FragGrenade:
                accuracy: 1
                aoe: 3
                classic: 9
                damage: 10
                name: Frag Grenade
                preferredRange: 5
                tags: infantry
                type: Kinetic
            GaussCannon:
                aoe: 1
                classic: 4
                cost: 13
                damage: 33
                name: Gauss Cannon
                rof: 1
                tags: turret
                type: Impact
                color: blue
            GrenadeLauncher:
                aoe: 3
                classic: 6
                cost: 11
                damage: 13
                name: Grenade Launcher
                rof: 1
                source: Reach
                tags: infantry
                type: Explosive
            HannibalCannon:
                aoe: 5
                damage: 67
                gear: Hannibal Scorpion
                name: Hannibal Cannon
                preferredRange: 50
                rof: 1
                type: Fire
                color: blue
            HannibalIonLauncher:
                aoe: 4
                classic: 1
                damage: 10
                gear: Hannibal Wasp
                name: Hannibal Ion Launcher
                rof: 0.5
                type: Fire
                color: blue
            HannibalPulseLasers:
                aoe: 1
                damage: 4
                gear: Hannibal Wasp
                name: Hannibal Pulse Lasers
                rof: 1
                type: Fire
                color: blue
            HeavyChaingun:
                aoe: 1
                classic: 2
                cost: 11
                damage: 3
                gear: ONI Warthog
                name: Heavy Chaingun
                rof: 2
                tags: turret
                type: Explosive
                color: yellow
            HeavyPistol:
                accuracy: 4
                aoe: 1
                classic: 4
                cost: 8
                damage: 4
                name: Heavy Pistol
                preferredRange: 5
                rof: 1
                source: Halo 1
                tags: infantry
                type: Kinetic
                color: yellow
            HeavySAW:
                aoe: 1
                classic: 1
                cost: 13
                damage: 5
                gear: The Answer
                name: Heavy SAW
                rof: 3
                source: Halo 5
                tags: biginfantry
                type: Explosive
                color: yellow
            Hydra:
                aoe: 1
                cost: 10
                damage: 8
                name: Hydra
                rof: 2
                tags: infantry
                type: Explosive
                color: orange
                accuracy: 7
            LightPistol:
                accuracy: 0
                aoe: 1
                classic: 9
                cost: 4
                damage: 1
                name: Light Pistol
                preferredRange: 1
                rof: 2
                source: Halo 2
                tags: infantry
                type: Kinetic
                color: yellow
            MammothMAC:
                classic: 5
                cost: 63
                damage: 23
                accuracy: 7
                name: Mammoth MAC
                preferredRange: 40
                size: 6
                speed: 2
                color: red
            MarathonMAC:
                aoe: 100
                damage: 667
                name: Marathon MAC
                rof: 0.1
                type: Impact
                color: yellow
            MarineCQC:
                aoe: 1
                classic: 10
                cost: 0
                damage: 0
                name: Marine CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            MissilePod:
                aoe: 2
                classic: 3
                cost: 13
                damage: 7
                name: Missile Pod
                rof: 1
                tags: turret
                type: Impact
            NeedleChaingun:
                aoe: 1
                classic: 1
                cost: 11
                damage: 2
                gear: Needle Warthog
                name: Needle Chaingun
                rof: 2
                tags: turret
                type: Kinetic
            Pistol:
                aoe: 1
                classic: 10
                cost: 5
                damage: 2
                name: Pistol
                rof: 1
                source: Halo 3
                tags: infantry
                type: Kinetic
                color: yellow
            Railgun:
                aoe: 1
                classic: 4
                cost: 10
                damage: 13
                name: Railgun
                rof: 1
                tags: infantry
                type: Kinetic
                color: blue
            RocketLauncher:
                aoe: 3
                classic: 6
                cost: 10
                damage: 27
                name: Rocket Launcher
                preferredRange: 8
                rof: 1
                source: Halo 2
                tags: infantry
                type: Impact
            SAW:
                accuracy: 3
                aoe: 1
                classic: 5
                cost: 10
                damage: 3
                name: SAW
                preferredRange: 3
                rof: 3
                tags: biginfantry
                type: Kinetic
                color: yellow
            SMG:
                accuracy: 1
                aoe: 1
                classic: 9
                color: yellow
                cost: 6
                damage: 1
                name: SMG
                preferredRange: 1
                rof: 4
                tags: infantry
                type: Kinetic
            ScopedPistol:
                accuracy: 3
                aoe: 1
                classic: 10
                cost: 6
                damage: 3
                name: Scoped Pistol
                preferredRange: 4
                rof: 1
                source: Reach
                tags: infantry
                type: Kinetic
                color: yellow
            ScorpionCannon:
                aoe: 4
                classic: 6
                damage: 47
                accuracy: 8
                name: Scorpion Cannon
                preferredRange: 150
                rof: 0.5
                type: Explosive
                color: grey
            SelenesLance:
                aoe: 2
                cost: 13
                damage: 53
                name: Selene's Lance
                rof: 0.5
                tags: infantry
                type: Fire
            Shotgun:
                accuracy: 140
                aoe: 1
                classic: 6
                cost: 8
                damage: 6
                name: Shotgun
                preferredRange: 0
                rof: 1
                tags: infantry
                type: Kinetic
                color: yellow
            SilencedPistol:
                aoe: 1
                classic: 2
                cost: 6
                damage: 1
                name: Silenced Pistol
                rof: 2
                tags: infantry
                type: Kinetic
            SilencedSMG:
                aoe: 1
                classic: 2
                cost: 6
                damage: 1
                name: Silenced SMG
                rof: 5
                tags: infantry
                type: Kinetic
            SniperRifle:
                accuracy: 30
                aoe: 1
                classic: 6
                cost: 13
                damage: 10
                gear: Speed includes reloading and a little aiming
                name: Sniper Rifle
                preferredRange: 40
                rof: 1
                tags: infantry
                type: Kinetic
                color: lightgrey
            SpartanCQC:
                aoe: 1
                classic: 1
                cost: 0
                damage: 5
                name: Spartan CQC
                preferredRange: 0
                rof: 1
                tags: natural
                type: Impact
            SpartanLaser:
                aoe: 1
                classic: 2
                cost: 13
                damage: 27
                name: Spartan Laser
                rof: 1
                tags: infantry
                type: Fire
            StickyGrenadeLauncher:
                aoe: 2
                classic: 3
                cost: 11
                damage: 17
                gear: Sticky Detonator
                name: Sticky Grenade Launcher
                rof: 1
                source: Halo 4
                tags: infantry
                type: Impact
            TacticalMACCannon:
                aoe: 10
                classic: 2
                damage: 200
                name: Tactical MAC Cannon
                rof: 0.1
                type: Impact
            VespinRocketTurret:
                aoe: 1
                classic: 1
                cost: 12
                damage: 13
                gear: Vespin Warthog
                name: Vespin Rocket Turret
                rof: 1
                tags: turret
                type: Impact
        Squad:
            Falcon:
                creature: Creature.Falcon
                image: falcon.png
                name: Falcon
                quantity: 1
            Hornet:
                creature: Creature.Hornet
                image: hornet.png
                name: Hornet
                quantity: 1
            Mammoth:
                creature: Creature.Mammoth
                image: mammoth.png
                name: Mammoth
                quantity: 1
            Mantis:
                creature: Creature.Mantis
                image: mantis.png
                name: Mantis
                quantity: 1
            Marine:
                creature: Creature.Marine
                image: marine.png
                name: Marine
                quantity: 3
            ODST:
                creature: Creature.ODST
                image: odst.jpg
                name: ODST
                quantity: 3
            Pelican:
                creature: Creature.Pelican
                image: pelican.png
                name: Pelican
                quantity: 1
            Scorpion:
                creature: Creature.Scorpion
                image: scorpion.png
                name: Scorpion
                quantity: 1
            Spartan:
                creature: Creature.SpartanBR
                image: spartan.png
                name: Spartan
                quantity: 3
            Warthog:
                creature: Creature.Warthog
                image: warthog.jpg
                name: Warthog
                quantity: 1
            Wasp:
                creature: Creature.Wasp
                image: wasp.png
                name: Wasp
                quantity: 1
`;
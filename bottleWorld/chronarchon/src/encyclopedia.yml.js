module.exports = { yamlString: `

scifi:
    alignments:
        radiant: radiant
        shadow: shadow

    impliedTags:
        human: animal infantry
        animal: organic
        spaceship: vehicle
        vehicle: synthetic crewed

    creatures:
        # farmer:
        #    tags: animal human
        #    alignment: radiant
        #    combat: 0
        #    durability: 10
        #    weight: 10
        # exclude from chargen for now.

        soldier:
            tags: human
            alignment: law
            combat: 5
            durability: 10
            weight: 10

        starfighter:
            tags: spaceship
            slots:
                vehicle: 1
            durability: 50
            has: machineGun

        frigate:
            tags: spaceship
            slots:
                warship: 1
            durability: 100
            has: machineGun

        dreadnought:
            tags: spaceship
            slots:
                warship: 2
            durability: 1000


    items:
        # Primary Weapons
        sword:
            tags: weapon primary
            combat: 2
            weight: 2
            price: 10
            hands: 1
            range: 0
            reach: 1
            damageType: blade

        armBlade:
            tags: weapon primary
            price: 20
            weight: 1
            damage: 10
            hands: 0
            range: 0
            reach: 0
            damageType: blade

        forearmGun:
            tags: weapon primary gun
            price: 20
            weight: 1
            damage: 5
            range: 1
            hands: 0
            damageType: bullet

        throwingKnife:
            tags: weapon primary thrown
            price: 1
            weight: 1
            damage: 3
            range: 1
            ammo: 1
            damageType: blade

        zapGlove:
            tags: weapon primary
            price: 15
            weight: 0
            damage: 9
            range: 0
            reach: 0
            hands: 1
            damageType: electric

        whip:
            tags: weapon primary
            price: 5
            weight: 1
            damage: 4
            range: 0
            reach: 3
            hands: 1
            damageType: blade

        pistol:
            tags: weapon primary gun
            price: 15
            weight: 2
            damage: 10
            range: 1
            hands: 1
            damageType: bullet

        knife:
            tags: weapon primary
            price: 2
            weight: 1
            damage: 4
            range: 0
            reach: 0
            hands: 1
            damageType: blade
        
        axe:
            tags: weapon primary
            price: 8
            weight: 3
            damage: 8
            range: 0
            reach: 1
            hands: 2
            damageType: blade

        javelin:
            tags: weapon primary thrown
            price: 5
            weight: 2
            damage: 6
            range: 1
            reach: 2
            hands: 1
            ammo: 1
            damageType: blade
            # LATER: unlimited melee or 1 use thrown 

        baton:
            tags: weapon primary
            price: 3
            weight: 1
            damage: 3
            range: 0
            reach: 1
            hands: 1
            damageType: blunt

        SMG:
            tags: weapon primary gun
            price: 25
            weight: 5
            damage: 20
            range: 1
            hands: 1
            damageType: bullet

        bola:
            tags: weapon primary thrown
            price: 25
            weight: 3
            damage: 0
            range: 1
            hands: 1
            hitEffect:
                status: immobilized
                duration: 10

        bow:
            tags: weapon primary
            price: 15
            weight: 1
            damage: 8
            range: 2
            hands: 2
            damageType: bullet

        greatsword:
            tags: weapon primary
            price: 30
            weight: 9
            damage: 20
            range: 0
            reach: 2
            hands: 2
            damageType: blade

        hammer:
            tags: weapon primary
            price: 10
            weight: 10
            damage: 20
            range: 0
            reach: 2
            hands: 2
            damageType: blunt

        crossbow:
            tags: weapon primary
            price: 20
            weight: 6
            damage: 12
            range: 3
            hands: 2
            damageType: bullet

        spear:
            tags: weapon primary
            price: 6
            weight: 3
            damage: 7
            range: 0
            reach: 3
            hands: 2
            damageType: blade

        glaive:
            tags: weapon primary
            price: 12
            weight: 5
            damage: 10
            range: 0
            reach: 3
            hands: 2
            damageType: blade

        greataxe:
            tags: weapon primary
            price: 15
            weight: 8
            damage: 18
            range: 0
            reach: 2
            hands: 2
            damageType: blade

        rifle:
            tags: weapon primary gun
            price: 20
            weight: 6
            damage: 15
            range: 5
            hands: 2
            damageType: bullet

        assaultRifle:
            tags: weapon primary gun
            price: 30
            weight: 7
            damage: 20
            range: 3
            hands: 2
            damageType: bullet

        cannon:
            tags: weapon primary gun
            price: 50
            weight: 20
            damage: 50
            range: 5
            hands: 2
            damageType: blast

        machineGun:
            tags: weapon primary gun
            price: 40
            weight: 15
            damage: 25
            range: 4
            hands: 2
            damageType: bullet

        grenadeLauncher:
            tags: weapon primary gun
            price: 35
            weight: 10
            damage: 30
            range: 3
            hands: 2
            damageType: blast

        shotgun:
            tags: weapon primary gun
            price: 25
            weight: 8
            damage: 18
            range: 1
            hands: 2
            damageType: bullet

        netgun:
            tags: weapon primary gun
            price: 15
            weight: 5
            damage: 0
            range: 2
            hands: 2
            hitEffect:
                status: immobilized
                duration: 10

        # Secondary Weapons
        shovel:
            tags: weapon
            price: 1
            weight: 2
            damage: 2
            range: 0
            hands: 2
            reach: 2
            upgradeable: false

        grenade:
            tags: weapon thrown
            price: 3
            weight: 1
            damage: 10
            damageType: blast
            range: 1
            ammo: 1

        # Armor
        armShield:
            tags: armor
            durability: 5
            weight: 4
            price: 2
            hands: 0
            description: Iron shield strapped to the forearm

        towerShield:
            tags: armor
            durability: 10
            weight: 7
            price: 3
            hands: 1
            # TODO make image

        helmet:
            tags: armor
            durability: 3
            weight: 1
            price: 2
            slot: head

        # Mobility
        wings:
            tags: mobility worn
            slot: back
            price: 10
            weight: 2
            speed: 30

        jetPack:
            tags: mobility worn
            slot: back
            price: 8
            weight: 3
            speed: 20

        grapplingHook:
            tags: mobility
            price: 1
            weight: 1

        # Other Worn Items
        intelEyepiece:
            tags: worn
            slot: head
            price: 4
            weight: 0

        quickdrawHolster:
            tags: worn
            slot: waist
            price: 4
            weight: 0

        trenchCoat:
            tags: worn
            slot: back
            price: 2
            weight: 2
            durability: 1

        featheredCap:
            tags: worn
            slot: head
            price: 4
            weight: 0
            accuracy: 3
 
        sunglasses:
            tags: worn
            slot: head
            price: 4
            weight: 0
            accuracy: 1
            zeal: 10

        bandana:
            tags: worn
            slot: head
            price: 4
            weight: 0
            zeal: 5
 
        longHair:
            tags: worn
            slot: head
            price: 4
            weight: 0
            accuracy: 3
            zeal: 2

        shadowcloak:
            tags: worn
            slot: back
            price: 9
            weight: 1
            stealth: 5
            description: The patterns on this dark grey cloak shift to imitate the terrain underfoot.

        # Upgrades
        electroPack:
            tags: upgrade
            price: 5
            weight: 1
            damage: 1
            damageType: electric

        highEx:
            tags: upgrade
            price: 5
            weight: 1
            damage: 5
            damageType: blast

        precision:
            tags: upgrade
            price: 3
            weight: 0
            rangeBonus: 1
            
        rapidFire:
            tags: upgrade
            price: 5
            weight: 1
            shots: 2
            requiredTags: gun # LATER

        incendiary:
            tags: upgrade
            price: 4
            weight: 1
            damage: 5
            damageType: thermal

        tracker:
            tags: upgrade
            price: 1
            weight: 0
            description: Targets hit by tracker weapons will can be tracked by the shooter for days afterwards.
            # LATER: only compatible with range 1+ weapons
            minRange: 1
            # Laser tracker guns don't make much sense but are kindof thematically like target designators.

        laser:
            tags: upgrade
            price: 3
            weight: 1
            damage: 1
            damageType: thermal

        plasma:
            tags: upgrade
            price: 4
            weight: 2
            damage: 2
            damageType: thermal

        timeslow:
            tags: upgrade
            price: 8
            weight: 1
            hitEffect:
                status: slowed
                duration: 1

        cheap:
            tags: upgrade
            price: -1
            damage: -1
            description: This weapon is not sturdy, but it is cheap.
            # LATER: don't allow negative prices when buying/selling.

        magnet:
            tags: upgrade
            price: 10
            weight: 1
            accuracy: 2
            description: Magnets pull each attack toward the target.

        # Vehicle Upgrades
        missileLauncher:
            tags: weapon
            attachTo: vehicle

        laserTurret:
            tags: weapon
            attachTo: vehicle

        # Warship Upgrades
        heavyArmor:
            tags: upgrade
            attachTo: warship

        defenseLasers:
            tags: weapon
            attachTo: warship

        railgun:
            tags: weapon
            attachTo: warship

        missileBattery:
            tags: weapon
            attachTo: warship

        warpDrive:
            tags: upgrade
            attachTo: warship

        warpBeacon:
            tags: upgrade
            attachTo: vehicle warship
        
        cloakProjector:
            tags: upgrade
            attachTo: warship

        transportBay:
            tags: upgrade
            attachTo: warship

    places:
        flat:
            displayName: meadow

    # traits:

fantasy:
    alignments:
        radiant: radiant
        shadow: shadow

    creatures:
        farmer:
            tags: animal human
            alignment: radiant
            combat: 0
            durability: 10
            weight: 10

        soldier:
            tags: animal human
            alignment: radiant
            combat: 5
            durability: 10
            weight: 10

    items:
        shortsword:
            tags: weapon blade
            combat: 2
            weight: 2
            price: 10

    # places:

    # traits:

` };

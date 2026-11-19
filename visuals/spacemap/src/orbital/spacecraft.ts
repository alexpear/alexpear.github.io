// Active spacecraft (as of 2026): everything about them except their
// trajectories, which come from JPL Horizons via spacecraftData.ts (see
// scripts/fetchSpacecraft.mjs). Each one's name, slugified, must match its
// id in that script. A spacecraft is only on the map (and in search) at
// dates its trajectory covers.

import type { ThingOptions } from './thing';
import { Resident } from './types';

export type SpacecraftOptions = Omit<
    ThingOptions,
    'colorHex' | 'kind' | 'phases'
>;

const NASA = 'NASA';
const ESA = 'ESA';

// Ordered roughly outward from Sol, then by what they orbit.
export const SPACECRAFT: SpacecraftOptions[] = [
    {
        name: 'Parker Solar Probe',
        aliases: ['PSP'],
        agency: NASA,
        launchYear: 2018,
        description:
            'Dives closer to Sol than any other spacecraft: about 6 million km from its surface at each perihelion.',
    },
    {
        name: 'Solar Orbiter',
        aliases: ['SolO'],
        agency: `${ESA} & ${NASA}`,
        launchYear: 2020,
        description:
            "Photographs Sol from up close, on an orbit that Venus flybys tilt ever further out of the ecliptic, to see Sol's poles.",
    },
    {
        name: 'STEREO-A',
        aliases: ['STEREO Ahead'],
        agency: NASA,
        launchYear: 2006,
        description:
            "Watches Sol from an orbit just inside Earth's, slowly lapping Earth, to see solar storms from the side.",
    },
    {
        name: 'BepiColombo',
        aliases: ['MPO', 'Mio', 'Mercury Planetary Orbiter'],
        agency: `${ESA} & JAXA`,
        launchYear: 2018,
        description:
            "A pair of orbiters, ESA's MPO and JAXA's Mio, arriving at Mercury in late 2026 after 9 flybys of Earth, Venus and Mercury.",
    },
    {
        name: 'JUICE',
        aliases: ['Jupiter Icy Moons Explorer'],
        agency: ESA,
        launchYear: 2023,
        description:
            'En route to Jupiter, arriving 2031, to study its icy moons Ganymede, Callisto and Europa. Gravity assists from Earth and Venus build up its speed along the way.',
    },
    {
        name: 'Europa Clipper',
        agency: NASA,
        launchYear: 2024,
        description:
            'En route to Jupiter, arriving 2030, to fly past Europa ~50 times and find out whether its buried ocean could support life.',
    },
    {
        name: 'Lucy',
        agency: NASA,
        launchYear: 2021,
        description:
            "Touring the Trojan asteroids, which share Jupiter's orbit around Sol. Its first Trojan flyby is in 2027.",
    },
    {
        name: 'Psyche',
        agency: NASA,
        launchYear: 2023,
        description:
            'En route to the metal-rich asteroid 16 Psyche, arriving 2029, steadily pushed by its ion engines.',
    },
    {
        name: 'Hera',
        agency: ESA,
        launchYear: 2024,
        description:
            'Arriving at the asteroid Didymos and its moon Dimorphos, to survey the crater left when NASA crashed DART into Dimorphos in 2022.',
    },
    {
        name: 'Hayabusa2',
        aliases: ['Hayabusa 2'],
        agency: 'JAXA',
        launchYear: 2014,
        description:
            'Brought samples of asteroid Ryugu back to Earth in 2020; now on an extended mission to the small, fast-spinning asteroid 1998 KY26, arriving 2031.',
    },
    {
        name: 'OSIRIS-APEX',
        aliases: ['OSIRIS-REx'],
        agency: NASA,
        launchYear: 2016,
        description:
            "As OSIRIS-REx, brought samples of asteroid Bennu back to Earth in 2023. Now heading for asteroid Apophis, arriving soon after Apophis's close pass by Earth in 2029.",
    },
    {
        name: 'ESCAPADE',
        aliases: ['ESCAPADE Blue', 'ESCAPADE Gold'],
        agency: NASA,
        launchYear: 2025,
        description:
            "Twin spacecraft, Blue and Gold, flying together to Mars (arriving 2027) to study how the solar wind strips away Mars' atmosphere.",
    },
    {
        name: 'MMX',
        aliases: ['Martian Moons eXploration'],
        agency: 'JAXA',
        launchYear: 2026,
        description:
            'Martian Moons eXploration: en route to Mars, to land on Phobos and bring a sample of it back to Earth.',
    },
    {
        name: 'Voyager 1',
        agency: NASA,
        launchYear: 1977,
        description:
            'The most distant human-made object. After flying past Jupiter and Saturn, it crossed into interstellar space in 2012.',
    },
    {
        name: 'Voyager 2',
        agency: NASA,
        launchYear: 1977,
        description:
            'The only spacecraft to have visited Uranus and Neptune. Crossed into interstellar space in 2018.',
    },
    {
        name: 'New Horizons',
        agency: NASA,
        launchYear: 2006,
        description:
            'Flew past Pluto in 2015 and the Kuiper belt object Arrokoth in 2019; now heading out of the solar system.',
    },

    // Orbiting a planet or moon. The shape and size of each orbit are
    // accurate, but where along it each is drawn is only illustrative -
    // their orbits take hours, and drift too fast to predict well.
    {
        name: 'ISS',
        aliases: ['International Space Station'],
        agency: 'NASA, Roscosmos, ESA, JAXA & CSA',
        launchYear: 1998,
        description:
            'Crewed continuously since 2000, about 400 km up, circling Earth every 93 minutes.',
    },
    {
        name: 'Tiangong',
        aliases: ['Chinese Space Station', 'CSS', 'Tiangong Space Station'],
        agency: 'CMSA',
        launchYear: 2021,
        description:
            "China's crewed space station, about 390 km up, circling Earth every 92 minutes.",
    },
    {
        name: 'Hubble',
        aliases: ['Hubble Space Telescope', 'HST'],
        agency: `${NASA} & ${ESA}`,
        launchYear: 1990,
        description:
            'Space telescope about 530 km up, observing in visible, ultraviolet and near-infrared light since 1990.',
    },
    {
        name: 'LRO',
        aliases: ['Lunar Reconnaissance Orbiter'],
        agency: NASA,
        launchYear: 2009,
        description:
            "Has mapped Luna from a low polar orbit since 2009, including the Apollo landing sites and the permanently shadowed craters near Luna's poles.",
    },
    {
        name: 'Danuri',
        aliases: ['KPLO', 'Korea Pathfinder Lunar Orbiter'],
        agency: 'KARI',
        launchYear: 2022,
        description:
            "South Korea's first lunar orbiter, mapping Luna's surface and resources since 2022.",
    },
    {
        name: 'Chandrayaan-2',
        aliases: ['Chandrayaan 2'],
        agency: 'ISRO',
        launchYear: 2019,
        description:
            "India's lunar orbiter, mapping Luna since 2019. It also relayed for Chandrayaan-3's lander, which touched down near Luna's south pole in 2023.",
    },
    {
        name: 'MRO',
        aliases: ['Mars Reconnaissance Orbiter'],
        agency: NASA,
        launchYear: 2005,
        description:
            'Has photographed Mars in fine detail since 2006, and relays data from the rovers on its surface.',
    },
    {
        name: 'Mars Odyssey',
        aliases: ['2001 Mars Odyssey'],
        agency: NASA,
        launchYear: 2001,
        description:
            'The longest-serving spacecraft at Mars, orbiting it since 2001.',
    },
    {
        name: 'Mars Express',
        aliases: ['MEX'],
        agency: ESA,
        launchYear: 2003,
        description:
            "ESA's first mission to another planet, orbiting Mars since 2003.",
    },
    {
        name: 'TGO',
        aliases: ['ExoMars Trace Gas Orbiter', 'ExoMars'],
        agency: `${ESA} & Roscosmos`,
        launchYear: 2016,
        description:
            "ExoMars Trace Gas Orbiter: sniffs Mars' atmosphere for methane and other trace gases, and relays data from the rovers.",
    },
    {
        name: 'Hope',
        aliases: ['Emirates Mars Mission', 'EMM', 'Al Amal'],
        agency: 'UAE Space Agency',
        launchYear: 2020,
        description:
            "The Arab world's first planetary mission, studying Mars' weather from a high orbit since 2021.",
    },
    {
        name: 'Juno',
        agency: NASA,
        launchYear: 2011,
        description:
            'Has orbited Jupiter since 2016, swooping low over its poles every ~33 days to probe beneath its clouds.',
    },
];

// Spacecraft and landers listed in a Thing's info menu instead of drawn,
// by that Thing's id. Lagrange points: their halo orbits are crowded
// together, and too small to tell apart at most zooms. Landers: they sit on
// the surface, so drawn they'd just be another dot on the planet.
export const RESIDENTS: Record<string, Resident[]> = {
    'sol-earth-l1': [
        {
            name: 'SOHO',
            aliases: ['Solar and Heliospheric Observatory'],
            note: 'Solar observatory, here since 1996',
            since: '1996-02-14',
        },
        {
            name: 'ACE',
            aliases: ['Advanced Composition Explorer'],
            note: 'Solar wind monitor, here since 1997',
            since: '1997-12-12',
        },
        {
            name: 'Wind',
            note: 'Solar wind monitor, here since 2004',
            since: '2004-05-01',
        },
        {
            name: 'DSCOVR',
            aliases: ['Deep Space Climate Observatory'],
            note: 'Space weather monitor and Earth camera, here since 2015',
            since: '2015-06-08',
        },
        {
            name: 'Aditya-L1',
            note: 'Indian solar observatory, here since 2024',
            since: '2024-01-06',
        },
        {
            name: 'IMAP',
            aliases: ['Interstellar Mapping and Acceleration Probe'],
            note: "Maps the edge of Sol's heliosphere; launched 2025",
            since: '2025-09-24',
        },
        {
            name: 'SWFO-L1',
            aliases: ['Space Weather Follow On'],
            note: 'Space weather monitor; launched 2025',
            since: '2025-09-24',
        },
        {
            name: 'Carruthers',
            aliases: ['Carruthers Geocorona Observatory'],
            note: "Studies Earth's outermost atmosphere; launched 2025",
            since: '2025-09-24',
        },
    ],
    'sol-earth-l2': [
        {
            name: 'JWST',
            aliases: ['James Webb Space Telescope', 'Webb'],
            note: 'Infrared space telescope, here since 2022',
            since: '2022-01-24',
        },
        {
            name: 'Euclid',
            note: 'Space telescope mapping dark matter, here since 2023',
            since: '2023-08-01',
        },
        {
            name: 'Roman',
            aliases: [
                'Nancy Grace Roman Space Telescope',
                'Roman Space Telescope',
            ],
            note: 'Wide-field infrared space telescope; launched 2026',
            since: '2026-08-30',
        },
    ],
    mars: [
        {
            name: 'Perseverance',
            aliases: ['Mars 2020', 'Percy'],
            note: 'Rover in Jezero Crater, landed 2021',
            since: '2021-02-18',
        },
        {
            name: 'Curiosity',
            aliases: ['MSL', 'Mars Science Laboratory'],
            note: 'Rover in Gale Crater, landed 2012',
            since: '2012-08-06',
        },
    ],
};

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
const CNSA = 'CNSA';
const NOAA_NASA = 'NOAA & NASA';

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
        name: 'Tianwen-2',
        aliases: ['Tianwen 2', 'ZhengHe'],
        agency: CNSA,
        launchYear: 2025,
        description:
            "At the small near-Earth asteroid Kamoʻoalewa (possibly a chip of Luna) from Jul 2026, to grab a sample and bring it to Earth, then visit comet 311P. Drawn on Kamoʻoalewa's orbit, since its own trajectory isn't public.",
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
        name: 'Chandra',
        aliases: ['Chandra X-ray Observatory', 'CXO'],
        agency: NASA,
        launchYear: 1999,
        description:
            'X-ray telescope on a long, stretched orbit reaching a third of the way to Luna, mostly far above the belts of radiation around Earth.',
    },
    {
        name: 'XMM-Newton',
        aliases: ['XMM', 'X-ray Multi-Mirror Mission'],
        agency: ESA,
        launchYear: 1999,
        description:
            "ESA's X-ray telescope, on a stretched orbit that takes 2 days and reaches about 90,000 km up.",
    },
    {
        name: 'TESS',
        aliases: ['Transiting Exoplanet Survey Satellite'],
        agency: NASA,
        launchYear: 2018,
        description:
            'Hunts planets around nearby stars, from a stretched orbit timed to Luna: it circles Earth exactly twice for each time Luna does.',
    },
    {
        name: 'SDO',
        aliases: ['Solar Dynamics Observatory'],
        agency: NASA,
        launchYear: 2010,
        description:
            'Films Sol nonstop in many wavelengths, from a geosynchronous orbit 36,000 km up.',
    },
    {
        name: 'Fermi',
        aliases: ['Fermi Gamma-ray Space Telescope', 'GLAST'],
        agency: NASA,
        launchYear: 2008,
        description:
            'Gamma-ray telescope about 500 km up, scanning the whole sky every 3 hours for black holes, pulsars and gamma-ray bursts.',
    },
    {
        name: 'Landsat 9',
        aliases: ['Landsat'],
        agency: `${NASA} & USGS`,
        launchYear: 2021,
        description:
            "Photographs all of Earth's land every 16 days from 705 km up, continuing a record that goes back to 1972.",
    },
    {
        name: 'Aqua',
        aliases: ['EOS PM-1'],
        agency: NASA,
        launchYear: 2002,
        description:
            "Earth science satellite tracking Earth's water cycle: clouds, rain, sea ice, snow and ocean temperatures.",
    },
    {
        name: 'ICESat-2',
        aliases: ['ICESat 2', 'Ice, Cloud and land Elevation Satellite'],
        agency: NASA,
        launchYear: 2018,
        description:
            "Measures the height of Earth's ice sheets, sea ice and forests by timing laser pulses bounced off the surface.",
    },
    {
        name: 'NISAR',
        aliases: ['NASA-ISRO Synthetic Aperture Radar'],
        agency: `${NASA} & ISRO`,
        launchYear: 2025,
        description:
            "Radar satellite mapping how Earth's surface moves - earthquakes, volcanoes, landslides, melting ice - every 12 days.",
    },
    {
        name: 'GOES-19',
        aliases: ['GOES East', 'GOES-U', 'GOES'],
        agency: NOAA_NASA,
        launchYear: 2024,
        description:
            'Weather satellite watching the Americas and the Atlantic, as GOES East, from geostationary orbit over 75° W.',
    },
    {
        name: 'GOES-18',
        aliases: ['GOES West', 'GOES-T', 'GOES'],
        agency: NOAA_NASA,
        launchYear: 2022,
        description:
            'Weather satellite watching the Americas and the Pacific, as GOES West, from geostationary orbit over 137° W.',
    },
    {
        name: 'GOES-16',
        aliases: ['GOES-R', 'GOES'],
        agency: NOAA_NASA,
        launchYear: 2016,
        description:
            'Weather satellite, GOES East until 2025; now the standby spare, in geostationary orbit over about 105° W.',
    },
    {
        name: 'GOES-17',
        aliases: ['GOES-S', 'GOES'],
        agency: NOAA_NASA,
        launchYear: 2018,
        description:
            'Weather satellite, GOES West until 2023; now a spare in storage in geostationary orbit.',
    },
    {
        name: 'Himawari-9',
        aliases: ['Himawari 9', 'Himawari'],
        agency: 'JMA',
        launchYear: 2016,
        description:
            "Japan's weather satellite watching East Asia and the western Pacific, from geostationary orbit over 140.7° E.",
    },
    {
        name: 'LAGEOS-1',
        aliases: ['LAGEOS', 'Laser Geodynamics Satellite'],
        agency: NASA,
        launchYear: 1976,
        description:
            "A 60 cm brass and aluminum ball covered in mirrors, 5,900 km up. Lasers bounced off it from the ground measure Earth's shape and the drift of continents.",
    },
    {
        name: 'AMSAT-OSCAR 7',
        aliases: ['AO-7', 'OSCAR 7'],
        agency: 'AMSAT',
        launchYear: 1974,
        description:
            'Amateur radio satellite, 1,450 km up. Its batteries failed in 1981, but in 2002 it came back to life, and it still relays radio hams whenever its solar panels are in sunlight.',
    },
    {
        name: 'X-37B OTV-8',
        aliases: ['X-37B', 'OTV-8', 'Orbital Test Vehicle'],
        agency: 'US Space Force',
        launchYear: 2025,
        description:
            "Robotic spaceplane on its 8th secret test mission. Its orbit isn't published: drawn about 330 km up, per amateur trackers.",
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
        name: 'THEMIS-B',
        aliases: ['ARTEMIS-P1', 'ARTEMIS P1', 'THEMIS'],
        agency: NASA,
        launchYear: 2007,
        description:
            "One of 5 THEMIS craft launched to study Earth's auroras; in 2011 it and THEMIS-C were moved to long, stretched orbits around Luna, as ARTEMIS, to measure the solar wind hitting Luna.",
    },
    {
        name: 'THEMIS-C',
        aliases: ['ARTEMIS-P2', 'ARTEMIS P2', 'THEMIS'],
        agency: NASA,
        launchYear: 2007,
        description:
            "One of 5 THEMIS craft launched to study Earth's auroras; in 2011 it and THEMIS-B were moved to long, stretched orbits around Luna, as ARTEMIS, to measure the solar wind hitting Luna.",
    },
    {
        name: 'Queqiao-2',
        aliases: ['Queqiao 2', 'Magpie Bridge 2'],
        agency: CNSA,
        launchYear: 2024,
        description:
            "Relays radio between Earth and Chang'e landers on Luna's far side and south pole, from a stretched orbit reaching about 17,000 km above Luna. Orbit approximate: China doesn't publish it.",
    },
    {
        name: "Chang'e-5 orbiter",
        aliases: ["Chang'e 5", 'Change-5', 'CE-5'],
        agency: CNSA,
        launchYear: 2020,
        description:
            'Brought Luna samples back to Earth in 2020, then tested a distant retrograde orbit (DRO) around Luna in 2022 - its last reported orbit. A DRO is a stable loop about 70,000 km from Luna; drawn here as a circle, only roughly.',
    },
    {
        name: 'DRO-A',
        agency: 'CAS',
        launchYear: 2024,
        description:
            "Chinese test satellite in a distant retrograde orbit (DRO): a stable loop about 70,000 km from Luna. Drawn here as a circle, only roughly - China doesn't publish its orbit.",
    },
    {
        name: 'DRO-B',
        agency: 'CAS',
        launchYear: 2024,
        description:
            "DRO-A's partner, testing navigation and communications with it around Luna. Drawn in the same distant retrograde orbit (DRO), only roughly - China doesn't publish its orbit, and it may since have moved.",
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
        name: 'Tianwen-1',
        aliases: ['Tianwen 1'],
        agency: CNSA,
        launchYear: 2020,
        description:
            "China's first Mars mission: this orbiter delivered the Zhurong rover in 2021, and has mapped Mars since. Orbit approximate: China doesn't publish it.",
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
        {
            name: 'Spektr-RG',
            aliases: ['SRG', 'eROSITA', 'ART-XC'],
            note: 'Russian-German X-ray observatory, here since 2019',
            since: '2019-10-21',
        },
        {
            name: "Chang'e-6 orbiter",
            aliases: ["Chang'e 6", 'Change-6', 'CE-6'],
            note: 'Brought far-side Luna samples to Earth in 2024; here since',
            since: '2024-09-09',
        },
    ],
    'earth-luna-l2': [
        {
            name: 'Queqiao',
            aliases: ['Queqiao-1', 'Queqiao 1', 'Magpie Bridge'],
            note: "Relay for Chang'e-4 on Luna's far side, here since 2018",
            since: '2018-06-14',
        },
    ],
    luna: [
        {
            name: "Chang'e-3 lander",
            aliases: ["Chang'e 3", 'Change-3', 'CE-3'],
            note: 'Lander in Mare Imbrium, landed 2013',
            since: '2013-12-14',
        },
        {
            name: "Chang'e-4 lander",
            aliases: ["Chang'e 4", 'Change-4', 'CE-4'],
            note: "Lander in Von Kármán crater, on Luna's far side, landed 2019",
            since: '2019-01-03',
        },
        {
            name: 'Yutu-2',
            aliases: ['Yutu 2', 'Jade Rabbit 2'],
            note: "Chang'e-4's rover, on Luna's far side, landed 2019",
            since: '2019-01-03',
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

'use strict';

module.exports = `

* output
1 cape

* childrenof cape
{age}
{gender}
{costume}
power
theme
{allegiance}
mbti

* alias age
1 10YearsOld
1 11YearsOld
1 12YearsOld
1 13YearsOld
2 14YearsOld
3 15YearsOld
3 16YearsOld
3 17YearsOld
3 18YearsOld
3 19YearsOld
3 20YearsOld
3 21YearsOld
3 22YearsOld
3 23YearsOld
3 24YearsOld
2 25YearsOld
2 26YearsOld
2 27YearsOld
2 28YearsOld
2 29YearsOld
2 30YearsOld
1 31YearsOld
1 32YearsOld
1 33YearsOld
1 34YearsOld
1 35YearsOld
1 36YearsOld
1 37YearsOld
1 38YearsOld
1 39YearsOld
1 40YearsOld
 
* alias gender
10 genderFemale
9 genderMale
1 genderNonbinary

* childrenof power
{ratings}

* alias ratings
10 rating
1 rating, rating
0 note that Damsels power has 2 ratings: Mover 3 and Striker 8

* childrenof rating
{class}
{ratingNumber}

* childrenof tinker 
{class}

* alias class
4 mover 
4 shaker
4 brute
4 breaker
4 master
4 tinker
4 blaster
4 thinker
4 striker 
4 changer
4 trump
4 stranger

* alias ratingNumber
1 1
3 2
10 3
30 4
30 5
25 6
20 7
12 8
10 9
1 10
1 11
1 12

* alias costume
4 streetwearCostume
4 amateurishCostume
4 cheapCostume
4 expensiveCostume
4 ruggedizedCostume
4 skintightCostume
4 costumeWithManyPockets
4 uglyCostume
4 tastefulCostume
4 serviceableCostume


* childrenof theme
{topic}

* alias topic
2 {animal}
3 {naturalThing}
2 {artificialThing}
15 {generalTopic}

* alias animal
4 bird
4 rodent
4 fish
4 dog
3 cat
4 reptile
2 elephant
1 monkey
3 insect
1 eel 
1 tiger
1 lion
1 eagle

* alias naturalThing
4 lightning
4 darkness
4 sun
4 star
4 air 
4 water
4 fire
2 stone
4 mountain
1 lake
1 cliff
1 chasm
4 tree
1 vine
3 weather

* alias artificialThing
2 hammer
2 sword
4 religion
3 circuitry
1 bonfire
2 furniture
2 business
2 television
2 car
4 aviation
4 space
4 robotics
4 steampunk
1 ageOfSail
1 clothing
4 toy
4 military
4 knight
3 sports
1 comics

* alias generalTopic
4 Sargon of Akkad
4 Hammurabi
4 Hatshepsut
4 Ramesses II
4 Cyrus the Great
4 Alexander the Great
4 Ashoka
4 Qin Shi Huang
4 Julius Caesar
4 Augustus
4 Charlemagne
4 Genghis Khan
4 Joan of Arc
4 Suleiman the Magnificent
4 Elizabeth I
4 Catherine the Great
4 George Washington
4 Napoleon
4 Simón Bolívar
4 Abraham Lincoln
4 Mahatma Gandhi
4 Vladimir Lenin
4 Winston Churchill
4 Joseph Stalin
4 Adolf Hitler
4 Mao Zedong
4 Nelson Mandela
4 Abraham
4 Moses
4 Laozi
4 Gautama Buddha
4 Jesus
4 Paul the Apostle
4 Muhammad
4 Adi Shankara
4 Martin Luther
4 Marco Polo
4 Ibn Battuta
4 Zheng He
4 Christopher Columbus
4 Vasco da Gama
4 Ferdinand Magellan
4 James Cook
4 Roald Amundsen
4 Confucius
4 Herodotus
4 Socrates
4 Plato
4 Aristotle
4 Avicenna
4 Thomas Aquinas
4 Ibn Khaldun
4 René Descartes
4 John Locke
4 Adam Smith
4 Immanuel Kant
4 Mary Wollstonecraft
4 Karl Marx
4 Friedrich Nietzsche
4 Sigmund Freud
4 Homer
4 Sappho
4 Sophocles
4 Virgil
4 Li Bai
4 Abu Nuwas
4 Murasaki Shikibu
4 Dante Alighieri
4 Miguel de Cervantes
4 William Shakespeare
4 Voltaire
4 Johann Wolfgang von Goethe
4 Jane Austen
4 Charles Dickens
4 Fyodor Dostoevsky
4 Leo Tolstoy
4 Mark Twain
4 Rabindranath Tagore
4 James Joyce
4 Franz Kafka
4 Johann Sebastian Bach
4 Wolfgang Amadeus Mozart
4 Ludwig van Beethoven
4 Richard Wagner
4 Louis Armstrong
4 Elvis Presley
4 The Beatles
4 Hippocrates
4 Jabir ibn Hayyan
4 Shen Kuo
4 Johannes Gutenberg
4 Nicolaus Copernicus
4 Galileo Galilei
4 Isaac Newton
4 Benjamin Franklin
4 Carl Linnaeus
4 Antoine Lavoisier
4 Michael Faraday
4 Charles Darwin
4 Louis Pasteur
4 James Clerk Maxwell
4 Dmitri Mendeleev
4 Thomas Edison
4 Nikola Tesla
4 Marie Curie
4 Albert Einstein
4 Niels Bohr
4 Archimedes
4 Euclid
4 Muhammad ibn Musa al-Khwarizmi
4 Leonhard Euler
4 Pierre-Simon Laplace
4 Carl Friedrich Gauss
4 Emmy Noether
4 Kurt Gödel
4 Alan Turing
4 Leonardo da Vinci
4 Michelangelo
4 Rembrandt
4 Hokusai
4 Claude Monet
4 Vincent van Gogh
4 Pablo Picasso
4 Frida Kahlo
4 Charlie Chaplin
4 Walt Disney
4 Henry Ford
4 History
4 Human history
4 Civilization
4 Archaeology
4 History of Africa
4 History of Asia
4 History of East Asia
4 History of India
4 History of the Middle East
4 History of Europe
4 History of North America
4 History of Oceania
4 History of South America
4 History of art
4 History of science
4 History of agriculture
4 History of architecture
4 History of film
4 History of literature
4 History of mathematics
4 History of medicine
4 History of music
4 History of technology
4 Military history
4 Prehistory
4 Stone Age
4 Early human migrations
4 Neolithic Revolution
4 Ancient history
4 Bronze Age
4 Ancient Egypt
4 Indus Valley Civilisation
4 Mesopotamia
4 Sumer
4 Assyria
4 Iron Age
4 Ancient Greece
4 Ancient Rome
4 Achaemenid Empire
4 Gupta Empire
4 Han dynasty
4 Silk Road
4 Pre-Columbian era
4 Andean civilizations
4 Mesoamerica
4 Maya civilization
4 Post-classical history
4 Aztecs
4 Inca Empire
4 Islamic Golden Age
4 Middle Ages
4 Black Death
4 Byzantine Empire
4 Crusades
4 Holy Roman Empire
4 Viking Age
4 Mongol Empire
4 Ottoman Empire
4 Tang dynasty
4 Early modern period
4 Renaissance
4 Age of Discovery
4 European colonization of the Americas
4 Reformation
4 Mughal Empire
4 Scientific Revolution
4 Age of Enlightenment
4 Late modern period
4 Industrial Revolution
4 French Revolution
4 Abolitionism
4 Scramble for Africa
4 British Empire
4 Decolonization
4 World War I
4 Soviet Union
4 Great Depression
4 World War II
4 Cold War
4 Space Race
4 Geography
4 Continent
4 Africa
4 Antarctica
4 Asia
4 Europe
4 North America
4 South America
4 Arctic
4 Middle East
4 Oceania
4 City
4 Beijing
4 Cairo
4 Delhi
4 Hong Kong
4 Istanbul
4 Jakarta
4 Jerusalem
4 Lagos
4 London
4 Mecca
4 Mexico City
4 Moscow
4 Mumbai
4 New York City
4 Paris
4 Rome
4 São Paulo
4 Singapore
4 Tokyo
4 Country
4 Argentina
4 Australia
4 Bangladesh
4 Brazil
4 Canada
4 China
4 Colombia
4 Democratic Republic of the Congo
4 Egypt
4 Ethiopia
4 France
4 Germany
4 India
4 Indonesia
4 Iran
4 Israel
4 Italy
4 Japan
4 Kenya
4 Mexico
4 Myanmar
4 Nigeria
4 Pakistan
4 Philippines
4 Poland
4 Russia
4 Saudi Arabia
4 South Africa
4 South Korea
4 Spain
4 Taiwan
4 Tanzania
4 Thailand
4 Turkey
4 United Kingdom
4 United States
4 Vietnam
4 Sea
4 Arctic Ocean
4 Atlantic Ocean
4 Mediterranean Sea
4 Indian Ocean
4 Pacific Ocean
4 Great Barrier Reef
4 Lake
4 Caspian Sea
4 Great Lakes
4 Lake Victoria
4 River
4 Amazon River
4 Ganges
4 Mississippi River
4 Nile
4 Yangtze
4 Land
4 Desert
4 Sahara
4 Forest
4 Amazon rainforest
4 Glacier
4 Grassland
4 Island
4 Mountain
4 Alps
4 Andes
4 Himalayas
4 Rocky Mountains
4 Grand Canyon
4 The arts
4 Art
4 Prehistoric art
4 Museum
4 Abstract art
4 Modernism
4 Realism (arts)
4 Romanticism
4 Architecture
4 Great Pyramid of Giza
4 Great Wall of China
4 Literature
4 English literature
4 Fiction
4 Novel
4 Short story
4 Fairy tale
4 Poetry
4 Epic poetry
4 Music
4 Musical instrument
4 Singing
4 Classical music
4 Folk music
4 Jazz
4 Pop music
4 Rock music
4 Performing arts
4 Dance
4 Opera
4 Orchestra
4 Theatre
4 Visual arts
4 Film
4 Animation
4 Calligraphy
4 Comics
4 Design
4 Drawing
4 Painting
4 Photography
4 Pottery
4 Sculpture
4 Philosophy
4 Philosophy of science
4 Aesthetics
4 Epistemology
4 Knowledge
4 Belief
4 Reason
4 Truth
4 Ethics
4 Good and evil
4 Logic
4 Metaphysics
4 Free will
4 Ontology
4 Eastern philosophy
4 Confucianism
4 Western philosophy
4 Ancient Greek philosophy
4 Contemporary philosophy
4 Religion
4 Afterlife
4 Deity
4 God
4 Meditation
4 Myth
4 New religious movement
4 Prayer
4 Ritual
4 Shamanism
4 Soul
4 Spirituality
4 Western esotericism
4 Secularism
4 Atheism
4 Buddhism
4 Mahayana
4 Theravada
4 Christianity
4 Bible
4 Catholic Church
4 Eastern Orthodox Church
4 Protestantism
4 Hinduism
4 Vedas
4 Bhagavad Gita
4 Islam
4 Shia Islam
4 Sunni Islam
4 Quran
4 Jainism
4 Judaism
4 Talmud
4 Shinto
4 Sikhism
4 Taoism
4 Clothing
4 Home
4 Furniture
4 Jewellery
4 Ethnic group
4 Family
4 Adult
4 Old age
4 Adolescence
4 Child
4 Infant
4 Marriage
4 Parenting
4 Friendship
4 Human sexuality
4 Sexual orientation
4 Gender
4 Man
4 Woman
4 Cooking
4 Food
4 Bread
4 Cereal
4 Wheat
4 Maize
4 Rice
4 Cheese
4 Fruit
4 Nut (fruit)
4 Meat
4 Salt
4 Spice
4 Sugar
4 Vegetable
4 Potato
4 Soybean
4 Drink
4 Alcoholic drink
4 Coffee
4 Drinking water
4 Milk
4 Tea
4 Entertainment
4 Play (activity)
4 Game
4 Board game
4 Card game
4 Gambling
4 Video game
4 Sport
4 Association football
4 Sport of athletics
4 Olympic Games
4 Toy
4 Martial arts
4 Swimming
4 Tourism
4 Culture
4 Folklore
4 Festival
4 Oral tradition
4 Popular culture
4 Society
4 Community
4 Power (social and political)
4 Social class
4 Communication
4 Social science
4 Anthropology
4 Sociology
4 Politics
4 Political party
4 Political science
4 Colonialism
4 Imperialism
4 Government
4 Democracy
4 Dictatorship
4 Monarchy
4 Theocracy
4 Ideology
4 Anarchism
4 Capitalism
4 Communism
4 Conservatism
4 Fascism
4 Liberalism
4 Nationalism
4 Socialism
4 State (polity)
4 Diplomacy
4 Military
4 European Union
4 International Red Cross and Red Crescent Movement
4 NATO
4 United Nations
4 International Monetary Fund
4 World Health Organization
4 World Trade Organization
4 Genocide
4 Peace
4 Terrorism
4 War
4 Education
4 School
4 Library
4 Business
4 Corporation
4 Management
4 Marketing
4 Retail
4 Trade union
4 Economics
4 Trade
4 Employment
4 Finance
4 Bank
4 Money
4 Market (economics)
4 Supply and demand
4 Tax
4 Economy
4 Agriculture
4 Manufacturing
4 Construction
4 Fishing
4 Hunting
4 Mining
4 Abortion
4 Disability
4 Discrimination
4 Racism
4 Sexism
4 Environmentalism
4 Pollution
4 Famine
4 Feminism
4 Women's suffrage
4 Globalization
4 Human migration
4 Human rights
4 Liberty
4 Privacy
4 Slavery
4 Social equality
4 Indigenous peoples
4 Poverty
4 Welfare
4 Law
4 Crime
4 Constitution
4 Justice
4 Police
4 Property
4 Psychology
4 Emotion
4 Anger
4 Fear
4 Happiness
4 Humour
4 Love
4 Mind
4 Consciousness
4 Dream
4 Memory
4 Thought
4 Human behavior
4 Intelligence
4 Learning
4 Personality
4 Language
4 Arabic
4 Indo-European languages
4 Bengali language
4 English language
4 French language
4 German language
4 Greek language
4 Hindustani language
4 Latin
4 Portuguese language
4 Russian language
4 Spanish language
4 Chinese language
4 Japanese language
4 Linguistics
4 Grammar
4 Word
4 Personal name
4 Speech
4 Writing
4 Alphabet
4 Arabic alphabet
4 Brahmic scripts
4 Cyrillic script
4 Greek alphabet
4 Latin script
4 Chinese characters
4 Mass media
4 Broadcasting
4 Journalism
4 News
4 Publishing
4 Disease
4 Allergy
4 Asthma
4 Cancer
4 Cardiovascular disease
4 Stroke
4 Diabetes
4 Gastroenteritis
4 Infection
4 Common cold
4 Influenza
4 Malaria
4 Pneumonia
4 Sexually transmitted infection
4 HIV-AIDS
4 Smallpox
4 Tuberculosis
4 Mental disorder
4 Injury
4 Medicine
4 Dentistry
4 Hospital
4 Surgery
4 Ageing
4 Exercise
4 Health
4 Hygiene
4 Sanitation
4 Nutrition
4 Obesity
4 Drug
4 Medication
4 Anesthesia
4 Antibiotic
4 Birth control
4 Vaccine
4 Addiction
4 Alcoholism
4 Smoking
4 Science
4 Scientific method
4 Measurement
4 International System of Units
4 Nature
4 Astronomy
4 Universe
4 Solar System
4 Sun
4 Mercury (planet)
4 Venus
4 Earth
4 Moon
4 Mars
4 Jupiter
4 Saturn
4 Uranus
4 Neptune
4 Asteroid
4 Big Bang
4 Black hole
4 Comet
4 Galaxy
4 Milky Way
4 Natural satellite
4 Orbit
4 Outer space
4 Physical cosmology
4 Planet
4 Star
4 Supernova
4 Physics
4 Energy
4 Time
4 Day
4 Year
4 Classical mechanics
4 Mass
4 Momentum
4 Motion
4 Newton's laws of motion
4 Force
4 Electromagnetism
4 Gravity
4 Strong interaction
4 Weak interaction
4 Magnetism
4 Matter
4 State of matter
4 Particle physics
4 Standard Model
4 Subatomic particle
4 Electron
4 Neutron
4 Photon
4 Proton
4 Quantum mechanics
4 Radioactive decay
4 Space
4 Vacuum
4 Thermodynamics
4 Heat
4 Temperature
4 Theory of relativity
4 Wave
4 Electromagnetic radiation
4 Light
4 Color
4 Optics
4 Speed of light
4 Sound
4 Biology
4 Life
4 Cell (biology)
4 Death
4 Suicide
4 Abiogenesis
4 Evolution
4 Human evolution
4 Natural selection
4 Organism
4 Animal
4 Zoology
4 Amphibian
4 Arthropod
4 Insect
4 Bird
4 Fish
4 Mammal
4 Cat
4 Cattle
4 Dog
4 Horse
4 Primate
4 Human
4 Rodent
4 Reptile
4 Dinosaur
4 Plant
4 Botany
4 Flower
4 Seed
4 Tree
4 Algae
4 Archaea
4 Bacteria
4 Eukaryote
4 Fungus
4 Virus
4 Anatomy
4 Human body
4 Circulatory system
4 Blood
4 Heart
4 Lung
4 Digestion
4 Liver
4 Immune system
4 Skin
4 Muscle
4 Nervous system
4 Brain
4 Ear
4 Eye
4 Sense
4 Skeleton
4 Ecology
4 Biodiversity
4 Ecosystem
4 Extinction
4 Genetics
4 DNA
4 Gene
4 Heredity
4 RNA
4 Metabolism
4 Molecular biology
4 Protein
4 Paleontology
4 Photosynthesis
4 Reproduction
4 Sex
4 Pregnancy
4 Sleep
4 Taxonomy (biology)
4 Species
4 Chemistry
4 Biochemistry
4 Inorganic chemistry
4 Organic chemistry
4 Physical chemistry
4 Chemical element
4 Atom
4 Periodic table
4 Aluminium
4 Carbon
4 Copper
4 Gold
4 Hydrogen
4 Iron
4 Nitrogen
4 Oxygen
4 Silicon
4 Silver
4 Chemical compound
4 Water
4 Carbon dioxide
4 Chemical bond
4 Molecule
4 Chemical reaction
4 Acid-base reaction
4 Catalysis
4 Redox
4 Metal
4 Alloy
4 Bronze
4 Steel
4 Earth science
4 History of Earth
4 Atmosphere
4 Magma
4 Season
4 Flood
4 Climate
4 Climate change
4 Weather
4 Cloud
4 Rain
4 Snow
4 Tornado
4 Tropical cyclone
4 Wind
4 Geology
4 Earthquake
4 Erosion
4 Mineral
4 Plate tectonics
4 Rock (geology)
4 Soil
4 Volcano
4 Technology
4 Engineering
4 Civil engineering
4 Mechanical engineering
4 Electricity
4 Electric battery
4 Fire
4 Explosive
4 Gunpowder
4 Fossil fuel
4 Coal
4 Natural gas
4 Petroleum
4 Gasoline
4 Nuclear power
4 Renewable energy
4 Hydropower
4 Solar energy
4 Wind power
4 Animal husbandry
4 Domestication
4 Biotechnology
4 Genetic engineering
4 Fertilizer
4 Food preservation
4 Garden
4 Medical imaging
4 Refrigeration
4 Stove
4 Weapon
4 Armour
4 Bow and arrow
4 Firearm
4 Knife
4 Nuclear weapon
4 Tool
4 Simple machine
4 Wheel
4 Engine
4 Electric motor
4 Internal combustion engine
4 Jet engine
4 Steam engine
4 Robotics
4 Printing
4 Book
4 Mail
4 Telecommunication
4 Internet
4 Radio
4 Telephone
4 Mobile phone
4 Video
4 Television
4 Computer science
4 Computer
4 Artificial intelligence
4 Cryptography
4 Electronics
4 Electric light
4 Integrated circuit
4 Semiconductor device
4 Rocket
4 Satellite
4 Space exploration
4 Spaceflight
4 Space station
4 Transport
4 Aircraft
4 Bicycle
4 Car
4 Rail transport
4 Ship
4 Navigation
4 Compass
4 Map
4 Radar
4 Calendar
4 Clock
4 Fortification
4 Infrastructure
4 Bridge
4 Canal
4 Dam
4 Road
4 Concrete
4 Glass
4 Masonry
4 Metallurgy
4 Natural rubber
4 Paper
4 Plastic
4 Textile
4 Wood
4 Camera
4 Laser
4 Lens
4 Microscope
4 Telescope
4 Mathematics
4 Algorithm
4 Mathematical proof
4 Set (mathematics)
4 Function (mathematics)
4 Combinatorics
4 Number
4 Real number
4 E (mathematical constant)
4 Pi
4 Fraction
4 Integer 
4 0
4 Natural number
4 Complex number
4 Number theory
4 Prime number
4 Algebra
4 Equation
4 Variable (mathematics)
4 Linear algebra
4 Mathematical analysis
4 Calculus
4 Infinity
4 Limit (mathematics)
4 Series (mathematics)
4 Arithmetic
4 Addition
4 Subtraction
4 Multiplication
4 Division (mathematics)
4 Exponentiation
4 Logarithm
4 Nth root
4 Geometry
4 Angle
4 Trigonometry
4 Area
4 Volume
4 Dimension
4 Line (geometry)
4 Plane (geometry)
4 Shape
4 Conic section
4 Circle
4 Polygon
4 Triangle
4 Polyhedron
4 Sphere
4 Topology
4 Probability
4 Statistics

* alias allegiance
4 hero
1 rogue
8 villain

`;

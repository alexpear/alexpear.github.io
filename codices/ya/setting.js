module.exports = `
* output
1 setting

* childrenof setting
{context}
{deviations}

* alias context
4 {historicalContext}
4 modernDay
4 future
2 alternateHistoryContext
4 secondaryWorld
1 magicalRealismContext

* alias historicalContext
4 antiquity
4 medieval
3 nineteenthCentury
2 twentiethCentury

* alias deviations
4 nothing
4 {genreDeviations}
2 {genreDeviations}, {genreDeviations}

* alias genreDeviations
4 {stylizations}
4 {supernaturalDeviations}
4 {scifiDeviations}

* alias stylizations
4 {stylization}
1 {stylization}, {stylization}

* alias stylization
4 adultsAreUseless
4 hypercompetence
4 noPolice

* alias supernaturalDeviations
4 {supernaturalDev}
4 {supernaturalDev}, {supernaturalDev}
3 {supernaturalDev}, {supernaturalDev}, {supernaturalDev}

* alias supernaturalDev
4 mageBloodlines
4 magicalCreature
3 spirits

* alias scifiDeviations
4 {scifiDev}
3 {scifiDev}, {scifiDev}
1 {scifiDev}, {scifiDev}, {scifiDev}
0 TODO possibly should not include scifi tropes in historical settings

* alias scifiDev
6 robots
6 spaceTravel
3 cyborgs
4 machineMinds
3 aliens
1 predictionTech
2 timeTravel


`;

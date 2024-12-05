// Class for the list of matches displayed on the html page.

const Util = require('../../util/util.js');

class MatchList {


    load () {
        const headers = new Headers();
        headers.append('x-rapidapi-key', 'c6509d543cfb780c5add10527ba958eb');
        // NOTE - this api key should be considered exposed & only useful for free testing.

        // https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures
        return fetch(
            'https://v3.football.api-sports.io/fixtures?league=254&last=1',
            {
                headers,
                redirect: 'follow',
            },
        )
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(
            error => console.log('error', error)
        );
    }

    static exampleResponse () {
        return `{
    "get": "fixtures",
    "parameters": {
        "league": "254",
        "last": "1"
    },
    "errors": [],
    "results": 1,
    "paging": {
        "current": 1,
        "total": 1
    },
    "response": [
        {
            "fixture": {
                "id": 1168600,
                "referee": "G. Dopka",
                "timezone": "UTC",
                "date": "2024-08-26T02:09:00+00:00",
                "timestamp": 1724638140,
                "periods": {
                    "first": 1724638140,
                    "second": 1724641740
                },
                "venue": {
                    "id": 11534,
                    "name": "Lumen Field",
                    "city": "Seattle, Washington"
                },
                "status": {
                    "long": "Match Finished",
                    "short": "FT",
                    "elapsed": 90
                }
            },
            "league": {
                "id": 254,
                "name": "NWSL Women",
                "country": "USA",
                "logo": "https://media.api-sports.io/football/leagues/254.png",
                "flag": "https://media.api-sports.io/flags/us.svg",
                "season": 2024,
                "round": "Regular Season - 12"
            },
            "teams": {
                "home": {
                    "id": 3002,
                    "name": "Seattle Reign FC",
                    "logo": "https://media.api-sports.io/football/teams/3002.png",
                    "winner": true
                },
                "away": {
                    "id": 2999,
                    "name": "North Carolina Courage W",
                    "logo": "https://media.api-sports.io/football/teams/2999.png",
                    "winner": false
                }
            },
            "goals": {
                "home": 1,
                "away": 0
            },
            "score": {
                "halftime": {
                    "home": 0,
                    "away": 0
                },
                "fulltime": {
                    "home": 1,
                    "away": 0
                },
                "extratime": {
                    "home": null,
                    "away": null
                },
                "penalty": {
                    "home": null,
                    "away": null
                }
            }
        }
    ]
}`;
    }

    static demo () {
        // return new MatchList().load();

        Util.logDebug(
            JSON.parse(
                MatchList.exampleResponse()
            )
        );
    }
}

module.exports = MatchList;

MatchList.demo();

'use strict';

const TitleGen = require('../titleGen.js');

const Masto = require('masto');

// Posts titles online via a specific Mastodon bot account.

// Usage: node post.js

class Poster {
    static async run () {
        const gen = new TitleGen();

        const title = gen.next();

        console.log(title);

        return; // TEMP

        gen.client = Masto.createRestAPIClient({
            url: 'https://mastodon.bot',
            accessToken: process.env.TITLE_BOT_TOKEN,
        });

        const response = await gen.client.v1.statuses.create({
            status: title,
        });

        console.log(response.url);

        // LATER will need to make sure Util funcs are available to the server running this.
    }
}

module.exports = Poster;

Poster.run();

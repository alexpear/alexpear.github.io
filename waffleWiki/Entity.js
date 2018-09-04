'use strict';

// Entity.js
// Waffle Wiki
// This module is the data model for entities and objects in generated wikis
// In theory, every Entity can be a wiki page.

module.exports = class Entity {
    constructor () {
        this.description = '';
        this.links = [];
    }

    toHtml () {
        return '<div></div>';

        function renderLink (link) {
            return 'link goes here';
        }
    }

    fillOut () {

    }

    becomeExample () {
        var linkCat = {
            category: 'equipment'
            
        }
    }
}



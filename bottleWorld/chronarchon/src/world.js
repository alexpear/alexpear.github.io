// Game state of a bottle world.

class World {
    constructor () {
        this.events = [];
        this.t = 0;
        this.id = Util.uuid();
    }

    static toYml () {
        return Yaml.dump(
            this,
            // LATER, rather than 'this', maybe just a subset of relevant fields. Also write objs as ids.
            {
                sortKeys: true,
                indent: 4,
            },
        );
    }

    static fromFile (path) {
        const worldObj = Yaml.load(
            require(path),
            { json: true } 
            // BTW: json: true means duplicate keys in a mapping will override values rather than throwing an error.
        );

        return Object.assign(new World(), worldObj);
    }

    static example () {
        const world = new World();

        

        return world;
    }
}

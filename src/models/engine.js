

const { loadConfig } = require("../utils/configUtils");

class Engine {
    constructor(conifgFile = "../config/standardConfig.json") {
        
        this._config = loadConfig(conifgFile);
        

        this._books = [];


        this._accounts = [];

        // TODO
    }

    // TODO
}

module.exports = Engine;

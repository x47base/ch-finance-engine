const fs = require("fs");
const path = require("path");

/**
 * Loads and parses a JSON config file.
 * @param {string} configPath
 * @returns {object}
 */
function loadConfig(configPath) {
    let absolutePath;
    if (configPath === "../config/standardConfig.json") {
        absolutePath = path.resolve(
        __dirname,
        "..",
        "config",
        "standardConfig.json"
        );
    } else {
        absolutePath = path.resolve(__dirname, configPath);
    }
    const rawData = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(rawData);
}

module.exports = { loadConfig };

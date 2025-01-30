const fs = require("fs");
const path = require("path");

const standardConfig = {
    defaultCurrency: "CHF",
    exchangeRates: {
        CHF: 1.0,
        USD: 0.92,
        EUR: 1.03,
    },
    allowedBookingTypes: [
        "Buchung",
        "Sammelbuchung",
        "Splitsammelbuchung",
        "Rückbuchung",
    ],
    allowedAccountTypes: ["Aktiv", "Passiv", "Aufwand", "Ertrag"],
    transactionSideTypes: ["Soll", "Haben"],
};

/**
 * Loads and parses a JSON config file.
 * @param {string} configPath
 * @returns {object}
 */
function loadConfig(configPath = "standard-config") {
    let absolutePath;
    if (configPath === "standard-config") {
        return standardConfig;
    } else {
        absolutePath = path.resolve(__dirname, configPath);
    }
    const rawData = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(rawData);
}

module.exports = { loadConfig };

const {
    loadConfig
} = require("../utils/configUtils");
const Book = require("./book");
const Account = require("./account");
const Transaction = require("./transaction");

/**
 * Manages Books, Accounts, Transactions, and currency conversion.
 */
class Engine {
    /**
     * @param {string} [configFile="../config/standardConfig.json"]
     */
    constructor(configFile = "standard-config") {
        this._config = loadConfig(configFile);
        this._books = [];
        this._accounts = [];
        this._transactions = [];
    }

    /**
     * @returns {Object}
     */
    get config() {
        return this._config;
    }

    /**
     * @returns {Book[]}
     */
    get books() {
        return this._books;
    }

    /**
     * @returns {Account[]}
     */
    get accounts() {
        return this._accounts;
    }

    /**
     * @returns {Transaction[]}
     */
    get transactions() {
        return this._transactions;
    }

    /**
     * @param {number} year
     * @returns {Book}
     */
    createBook(year) {
        const book = new Book(year);
        this._books.push(book);
        return book;
    }

    /**
     * @param {Book} book
     */
    addBook(book) {
        this._books.push(book);
    }

    /**
     * @param {string} type
     * @param {number} code
     * @param {string} name
     * @param {Array<string>} aliases
     * @param {number} balance
     * @returns {Account}
     */
    createAccount(type, code, name, aliases = [], balance = 0.0) {
        const account = new Account(type, code, name, aliases, balance);
        this._accounts.push(account);
        return account;
    }

    /**
     * @param {number} code
     * @returns {Account|undefined}
     */
    getAccountByCode(code) {
        return this._accounts.find(a => a.code === code);
    }

    /**
     * @param {number} id
     * @param {"Soll"|"Haben"} side
     * @param {number} accountCode
     * @param {string} description
     * @param {number} amount
     * @param {string} [currency="CHF"]
     * @param {string} [bookingType="Buchung"]
     * @returns {Transaction}
     */
    createTransaction(id, side, accountCode, description, amount, currency = "CHF", bookingType = "Buchung") {
        const tx = new Transaction(
            id,
            side,
            accountCode,
            description,
            amount,
            currency,
            bookingType
        );
        this._transactions.push(tx);
        return tx;
    }

    /**
     * @param {number} transactionId
     * @returns {Transaction}
     */
    bookTransaction(transactionId) {
        const tx = this._transactions.find(t => t.id === transactionId);
        if (!tx) {
            throw new Error(`Transaction with ID ${transactionId} not found.`);
        }
        if (tx.status === "canceled") {
            throw new Error("Cannot book a canceled transaction.");
        }
        tx.book();
        const account = this.getAccountByCode(tx.accountCode);
        if (!account) {
            throw new Error(`Account code ${tx.accountCode} not found.`);
        }
        const defaultCurrency = this._config.defaultCurrency || "CHF";
        const rateMap = this._config.exchangeRates || {};
        let exchangeRate = 1.0;
        if (tx.currency !== defaultCurrency) {
            if (!rateMap[tx.currency]) {
                throw new Error(`No exchange rate found in config for currency ${tx.currency}`);
            }
            exchangeRate = rateMap[tx.currency];
        }
        account.addTransaction(tx, exchangeRate);
        return tx;
    }

    /**
     * @param {number} transactionId
     * @returns {Transaction}
     */
    cancelTransaction(transactionId) {
        const tx = this._transactions.find(t => t.id === transactionId);
        if (!tx) {
            throw new Error(`Transaction with ID ${transactionId} not found.`);
        }
        tx.cancel();
        return tx;
    }

    /**
     * @param {number} transactionId
     * @returns {string}
     */
    getTransactionStatus(transactionId) {
        const tx = this._transactions.find(t => t.id === transactionId);
        if (!tx) {
            throw new Error(`Transaction with ID ${transactionId} not found.`);
        }
        return tx.status;
    }

    /**
     * Creates two transactions (Soll/Haben) for a standard Buchung.
     *
     * @param {number} txIdBase
     * @param {number} accountSoll
     * @param {number} accountHaben
     * @param {number} amount
     * @param {string} currency
     * @param {string} [description=""]
     * @returns {Transaction[]}
     */
    performBuchung(txIdBase, accountSoll, accountHaben, amount, currency, description = "") {
        const txSoll = this.createTransaction(
            txIdBase,
            "Soll",
            accountSoll,
            description,
            amount,
            currency,
            "Buchung"
        );
        const txHaben = this.createTransaction(
            txIdBase + 1,
            "Haben",
            accountHaben,
            description,
            amount,
            currency,
            "Buchung"
        );
        this.bookTransaction(txSoll.id);
        this.bookTransaction(txHaben.id);
        return [txSoll, txHaben];
    }

    toJSON() {
        return {
            config: this._config,
            books: this._books.map(b => b.toJSON()),
            accounts: this._accounts.map(a => a.toJSON()),
            transactions: this._transactions.map(t => t.toJSON())
        };
    }
}

module.exports = Engine;
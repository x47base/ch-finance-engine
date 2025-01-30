const accountTypes = require("../config/accountTypes");

/**
 * Represents a ledger account.
 */
class Account {
    /**
     * @param {string} type - Account type ("Aktiv", "Passiv", "Aufwand", "Ertrag").
     * @param {number} code - Integer code (1 to 9999).
     * @param {string} name - Descriptive name.
     * @param {Array<string>} aliases - Alternate names.
     * @param {number} balance - Initial balance.
     */
    constructor(type, code, name, aliases = [], balance = 0.0) {
        if (!accountTypes.includes(type)) {
            throw new Error("Invalid account type");
        }
        this._type = type;

        const parsedCode = Number(code);
        if (!Number.isInteger(parsedCode) || parsedCode < 1 || parsedCode > 9999) {
            throw new Error("Invalid account code. Must be an integer between 1 and 9999.");
        }
        this._code = parsedCode;

        if (typeof name !== "string") {
            throw new Error("Invalid account name. Must be a string.");
        }
        this._name = name;

        if (!Array.isArray(aliases) || !aliases.every(alias => typeof alias === "string")) {
            throw new Error("Aliases must be an array of strings.");
        }
        this._aliases = aliases;

        const numericBalance = Number(balance) || 0.0;
        if (Number.isNaN(numericBalance)) {
            throw new Error("Balance must be a valid number.");
        }
        this._balance = numericBalance;

        this._transactionLog = [];
        this._closed = false;
        this._fullyBookedForYear = false;
    }

    /**
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * @returns {number}
     */
    get code() {
        return this._code;
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @type {Array<string>}
     */
    get aliases() {
        return this._aliases;
    }
    set aliases(aliases) {
        if (!Array.isArray(aliases) || !aliases.every(a => typeof a === "string")) {
            throw new Error("Aliases must be an array of strings.");
        }
        this._aliases = aliases;
    }

    /**
     * @returns {number}
     */
    get balance() {
        return this._balance;
    }

    /**
     * @returns {boolean}
     */
    get isClosed() {
        return this._closed;
    }

    close() {
        this._closed = true;
    }

    reopen() {
        this._closed = false;
    }

    /**
     * @returns {boolean}
     */
    get isFullyBookedForYear() {
        return this._fullyBookedForYear;
    }

    markFullyBookedForYear() {
        this._fullyBookedForYear = true;
    }

    /**
     * @param {number} [amount=1]
     */
    increment(amount = 1) {
        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount)) {
            throw new Error("Increment amount must be a valid number.");
        }
        this._balance += numericAmount;
    }

    /**
     * @param {Transaction} transaction
     * @param {number} [exchangeRate=1]
     */
    addTransaction(transaction, exchangeRate = 1) {
        if (this._closed) {
            throw new Error(`Cannot add a transaction to a closed account (code ${this._code}).`);
        }
        if (transaction.status === "canceled") {
            throw new Error("Cannot add a canceled transaction to an account.");
        }
        const convertedAmount = transaction.amount * exchangeRate;
        if (transaction.transactionSide === "Soll") {
            this._balance += convertedAmount;
        } else if (transaction.transactionSide === "Haben") {
            this._balance -= convertedAmount;
        }
        this._transactionLog.push({
            transactionId: transaction.id,
            transactionSide: transaction.transactionSide,
            convertedAmount,
            originalAmount: transaction.amount,
            originalCurrency: transaction.currency,
            transactionStatus: transaction.status
        });
    }

    /**
     * @returns {Array<Object>}
     */
    get transactionLog() {
        return this._transactionLog;
    }

    toJSON() {
        return {
            type: this._type,
            code: this._code,
            name: this._name,
            aliases: this._aliases,
            balance: this._balance,
            closed: this._closed,
            fullyBookedForYear: this._fullyBookedForYear,
            transactionLog: this._transactionLog
        };
    }
}

module.exports = Account;
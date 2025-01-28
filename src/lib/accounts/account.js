/*
    Note: A lot of comments have been generate by ChatGPT model o1.
*/

import accountTypes from "../types/accounts";

class Account {
    /**
     * @param {string} type - The account's type ("Aktiv", "Passiv", "Aufwand", or "Ertrag").
     * @param {number} code - The account's code number (integer between 1 and 9999).
     * @param {string} name - The account's full name.
     * @param {Array<string>} aliases - A list of short name aliases for the account.
     * @param {number} balance - The initial balance of the account.
     */
    constructor(type, code, name, aliases = [], balance = 0.0) {
        /**
         * The account's type ("Aktiv", "Passiv", "Aufwand", or "Ertrag").
         * (Read-only)
         * @type {string}
         */
        if (!accountTypes.includes(type)) {
            throw new Error("Invalid account type");
        }
        this._type = type;

        /**
         * The account's code number.
         * Must be an integer between 1 and 9999.
         * (Read-only)
         * @type {number}
         */
        const parsedCode = Number(code);
        if (!Number.isInteger(parsedCode) || parsedCode < 1 || parsedCode > 9999) {
            throw new Error("Invalid account code. Must be an integer between 1 and 9999.");
        }
        this._code = parsedCode;

        /**
         * The account's full name.
         * (Read-only)
         * @type {string}
         */
        if (typeof name !== "string") {
            throw new Error("Invalid account name. Must be a string.");
        }
        this._name = name;

        /**
         * The account's list of short name aliases.
         * @type {Array<string>}
         */
        if (!Array.isArray(aliases)) {
            throw new Error("Aliases must be an array of strings.");
        } else if (!aliases.every(alias => typeof alias === 'string')) {
            throw new Error("Each alias must be a string.");
        }
        this._aliases = aliases;

        /**
         * The account's balance.
         * @type {number}
         */
        const numericBalance = Number(balance) || 0.0;
        if (Number.isNaN(numericBalance)) {
            throw new Error("Balance must be a valid number.");
        }
        this._balance = numericBalance;

        /**
         * A log of transactions made to this account.
         * Each entry has a `type` ("Soll" or "Haben") and an `amount`.
         * @type {Array<{ type: 'Soll' | 'Haben', amount: number }>}
         */
        this._transactionLog = [];
    }


    /**
     * Returns the account's type (read-only).
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * Returns the account's code (read-only).
     * @returns {number}
     */
    get code() {
        return this._code;
    }

    /**
     * Returns the account's name (read-only).
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Get or set the list of short name aliases.
     */
    get aliases() {
        return this._aliases;
    }

    set aliases(newAliases) {
        if (!Array.isArray(newAliases)) {
            throw new Error("Aliases must be an array of strings.");
        } else if (!newAliases.every(alias => typeof alias === 'string')) {
            throw new Error("Each alias must be a string.");
        }
        this._aliases = newAliases;
    }

    /**
     * Gets the current balance of the account.
     * @returns {number}
     */
    get balance() {
        return this._balance;
    }

    /**
     * Increments the account's balance by a specified amount (default = 1).
     * @param {number} [amount=1] - The amount to add.
     */
    increment(amount = 1) {
        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount)) {
            throw new Error("Increment amount must be a valid number.");
        }
        this._balance += numericAmount;
    }

    /**
     * Adds a new transaction to the account. 
     * "Soll" increases the balance, "Haben" decreases the balance.
     *
     * @param {'Soll'|'Haben'} transactionType - Type of transaction.
     * @param {number} amount - The transaction amount.
     */
    addTransaction(transactionType, amount) {
        if (transactionType !== 'Soll' && transactionType !== 'Haben') {
            throw new Error('Transaction type must be "Soll" or "Haben".');
        }
        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount)) {
            throw new Error("Transaction amount must be a valid number.");
        }

        // Update balance based on transaction type
        if (transactionType === 'Soll') {
            this._balance += numericAmount;
        } else {
            this._balance -= numericAmount;
        }

        // Log the transaction
        this._transactionLog.push({
            type: transactionType,
            amount: numericAmount
        });
    }

    /**
     * Returns the transaction log array.
     * @returns {Array<{ type: 'Soll'|'Haben', amount: number }>}
     */
    get transactionLog() {
        return this._transactionLog;
    }
}

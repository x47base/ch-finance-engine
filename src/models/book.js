/**
 * Represents an accounting year.
 */
class Book {
    /**
     * @param {number} year - Accounting year.
     */
    constructor(year) {
        if (!Number.isInteger(year) || year < 0) {
            throw new Error("Invalid year for Book.");
        }
        this._year = year;
        this._accounts = [];
        this._closed = false;
    }

    /**
     * @returns {number}
     */
    get year() {
        return this._year;
    }

    /**
     * @returns {boolean}
     */
    get isClosed() {
        return this._closed;
    }

    closeBook() {
        this._closed = true;
        for (const acc of this._accounts) {
            acc.markFullyBookedForYear();
        }
    }

    reopenBook() {
        this._closed = false;
    }

    /**
     * @param {Account} account
     */
    addAccount(account) {
        this._accounts.push(account);
    }

    /**
     * @returns {Array<Account>}
     */
    get accounts() {
        return this._accounts;
    }

    toJSON() {
        return {
            year: this._year,
            closed: this._closed,
            accounts: this._accounts.map(acc => acc.toJSON())
        };
    }
}

module.exports = Book;
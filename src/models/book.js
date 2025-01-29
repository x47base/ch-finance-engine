
class Book {
    /**
     * @param {number} year - The year for which the accounting book is.
     */
    constructor(year) {
        /**
         * The account's accounting book year.
         * @type {number}
         */
        this._year = year;

        // TODO
    }

    /**
     * Returns the account's accounting year (read-only).
     * @returns {number}
     */
    get year() {
        return this._year;
    }

    // TODO
}

module.exports = Book;

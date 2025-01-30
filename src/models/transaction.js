const TransactionSideTypes = require("../config/transactionSideTypes");

const ALLOWED_BOOKING_TYPES = [
    "Buchung",
    "Sammelbuchung",
    "Splitsammelbuchung",
    "Rückbuchung"
];

/**
 * Represents one side of a booking.
 */
class Transaction {
    /**
     * @param {number} id
     * @param {"Soll"|"Haben"} transactionSide
     * @param {number} accountCode
     * @param {string} [description=""]
     * @param {number} amount
     * @param {string} [currency="CHF"]
     * @param {string} [bookingType="Buchung"]
     */
    constructor(id, transactionSide, accountCode, description = "", amount, currency = "CHF", bookingType = "Buchung") {
        this._id = Number(id);
        if (Number.isNaN(this._id)) {
            throw new Error("Transaction ID must be a valid number.");
        }
        if (!TransactionSideTypes.includes(transactionSide)) {
            throw new Error("Invalid Transaction Side. Must be 'Soll' or 'Haben'.");
        }
        this._transactionSide = transactionSide;

        this._accountCode = Number(accountCode);
        if (Number.isNaN(this._accountCode)) {
            throw new Error("Invalid account code for Transaction. Must be a number.");
        }

        this._description = description || "";

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount)) {
            throw new Error("Transaction amount must be a valid number.");
        }
        this._amount = numericAmount;

        this._currency = currency;

        if (!ALLOWED_BOOKING_TYPES.includes(bookingType)) {
            throw new Error(`Invalid bookingType '${bookingType}'. Must be one of ${ALLOWED_BOOKING_TYPES.join(", ")}.`);
        }
        this._bookingType = bookingType;

        this._status = "booked";
    }

    /**
     * @returns {number}
     */
    get id() {
        return this._id;
    }

    /**
     * @returns {"Soll"|"Haben"}
     */
    get transactionSide() {
        return this._transactionSide;
    }

    /**
     * @returns {number}
     */
    get accountCode() {
        return this._accountCode;
    }

    /**
     * @returns {string}
     */
    get description() {
        return this._description;
    }

    /**
     * @returns {number}
     */
    get amount() {
        return this._amount;
    }

    /**
     * @returns {string}
     */
    get currency() {
        return this._currency;
    }

    /**
     * @returns {string}
     */
    get bookingType() {
        return this._bookingType;
    }

    /**
     * @returns {"booked"|"canceled"}
     */
    get status() {
        return this._status;
    }

    book() {
        this._status = "booked";
    }

    cancel() {
        this._status = "canceled";
    }

    toJSON() {
        return {
            id: this._id,
            transactionSide: this._transactionSide,
            accountCode: this._accountCode,
            description: this._description,
            amount: this._amount,
            currency: this._currency,
            bookingType: this._bookingType,
            status: this._status
        };
    }
}

module.exports = Transaction;
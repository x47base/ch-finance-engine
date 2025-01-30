const Transaction = require("../src/models/transaction");

describe("Transaction class", () => {
    test("creates a Transaction with valid data", () => {
        const tx = new Transaction(
            1,
            "Soll",
            1000,
            "Test Trans",
            500,
            "CHF",
            "Buchung"
        );
        expect(tx.id).toBe(1);
        expect(tx.transactionSide).toBe("Soll");
        expect(tx.accountCode).toBe(1000);
        expect(tx.description).toBe("Test Trans");
        expect(tx.amount).toBe(500);
        expect(tx.currency).toBe("CHF");
        expect(tx.bookingType).toBe("Buchung");
        expect(tx.status).toBe("booked");
    });

    test("throws an error for invalid transaction side", () => {
        expect(() => {
            new Transaction(2, "InvalidSide", 1000, "Invalid", 100, "CHF", "Buchung");
        }).toThrow("Invalid Transaction Side. Must be 'Soll' or 'Haben'.");
    });

    test("throws an error for invalid bookingType", () => {
        expect(() => {
            new Transaction(3, "Soll", 1000, "Description", 200, "CHF", "InvalidBookingType");
        }).toThrow(/Invalid bookingType/);
    });

    test("cancels a Transaction", () => {
        const tx = new Transaction(4, "Soll", 1000, "Description", 300, "CHF", "Buchung");
        expect(tx.status).toBe("booked");
        tx.cancel();
        expect(tx.status).toBe("canceled");
    });

    test("books a canceled transaction again if logic allows", () => {
        const tx = new Transaction(5, "Haben", 1000, "Description", 400, "CHF", "Buchung");
        tx.cancel();
        expect(tx.status).toBe("canceled");
        tx.book();
        expect(tx.status).toBe("booked");
    });
});
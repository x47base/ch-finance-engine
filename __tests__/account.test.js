const Account = require("../src/models/account");
const Transaction = require("../src/models/transaction");

describe("Account class", () => {
    test("creates an Account with valid data", () => {
        const account = new Account("Aktiv", 1000, "Bank", ["BankKonto"], 5000.0);
        expect(account.type).toBe("Aktiv");
        expect(account.code).toBe(1000);
        expect(account.name).toBe("Bank");
        expect(account.aliases).toContain("BankKonto");
        expect(account.balance).toBe(5000);
        expect(account.isClosed).toBe(false);
        expect(account.isFullyBookedForYear).toBe(false);
        expect(account.transactionLog).toHaveLength(0);
    });

    test("throws an error for an invalid account type", () => {
        expect(() => {
            new Account("Unbekannt", 1001, "InvalidTypeAccount");
        }).toThrow("Invalid account type");
    });

    test("throws an error for an invalid account code", () => {
        expect(() => {
            new Account("Aktiv", 100000, "CodeOutOfRange");
        }).toThrow("Invalid account code. Must be an integer between 1 and 9999.");
    });

    test("closes and reopens an Account", () => {
        const account = new Account("Aktiv", 1100, "Immobilien");
        expect(account.isClosed).toBe(false);
        account.close();
        expect(account.isClosed).toBe(true);
        account.reopen();
        expect(account.isClosed).toBe(false);
    });

    test("marks an Account fully booked for the year", () => {
        const account = new Account("Passiv", 2000, "Verbindlichkeiten L+L");
        expect(account.isFullyBookedForYear).toBe(false);
        account.markFullyBookedForYear();
        expect(account.isFullyBookedForYear).toBe(true);
    });

    test("adds a transaction without currency conversion", () => {
        const account = new Account("Aktiv", 1000, "Bank", [], 5000);
        const tx = new Transaction(1, "Soll", 1000, "Einzahlung", 500, "CHF", "Buchung");
        account.addTransaction(tx, 1);
        expect(account.balance).toBe(5500);
        expect(account.transactionLog).toHaveLength(1);
        expect(account.transactionLog[0].transactionId).toBe(1);
    });

    test("adds a transaction with currency conversion", () => {
        const account = new Account("Aktiv", 1000, "Bank", [], 5000);
        const tx = new Transaction(2, "Haben", 1000, "Withdrawal in USD", 100, "USD", "Buchung");
        account.addTransaction(tx, 0.90);
        expect(account.balance).toBe(4910);
        expect(account.transactionLog).toHaveLength(1);
    });

    test("prevents adding a transaction to a closed account", () => {
        const account = new Account("Aktiv", 1000, "Bank", [], 5000);
        account.close();
        const tx = new Transaction(3, "Soll", 1000, "Test", 100, "CHF", "Buchung");
        expect(() => {
            account.addTransaction(tx, 1);
        }).toThrow(/Cannot add a transaction to a closed account/);
    });
});
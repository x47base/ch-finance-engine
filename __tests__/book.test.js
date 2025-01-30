const Book = require("../src/models/book");
const Account = require("../src/models/account");

describe("Book class", () => {
    test("should create a Book with a valid year", () => {
        const book = new Book(2025);
        expect(book.year).toBe(2025);
        expect(book.isClosed).toBe(false);
        expect(book.accounts).toHaveLength(0);
    });

    test("should throw error for invalid year", () => {
        expect(() => {
            new Book(-1);
        }).toThrow("Invalid year for Book.");
        expect(() => {
            new Book(2025.5);
        }).toThrow("Invalid year for Book.");
    });

    test("should add an Account to a Book", () => {
        const book = new Book(2025);
        const account = new Account("Aktiv", 1000, "Bank");
        book.addAccount(account);
        expect(book.accounts).toHaveLength(1);
        expect(book.accounts[0]).toBe(account);
    });

    test("should close a Book (and mark all its accounts fully booked)", () => {
        const book = new Book(2025);
        const acc1 = new Account("Aktiv", 1000, "Bank");
        const acc2 = new Account("Passiv", 2000, "Verbindlichkeiten");
        book.addAccount(acc1);
        book.addAccount(acc2);

        book.closeBook();
        expect(book.isClosed).toBe(true);
        // Check if the accounts are also marked fully booked
        expect(acc1.isFullyBookedForYear).toBe(true);
        expect(acc2.isFullyBookedForYear).toBe(true);
    });

    test("should reopen a Book", () => {
        const book = new Book(2025);
        book.closeBook();
        expect(book.isClosed).toBe(true);
        book.reopenBook();
        expect(book.isClosed).toBe(false);
    });
});
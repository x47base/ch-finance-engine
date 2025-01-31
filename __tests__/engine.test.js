const Engine = require("../src/models/engine");
const Account = require("../src/models/account");
const Transaction = require("../src/models/transaction");

describe("Engine class", () => {
    let engine;

    beforeAll(() => {
        engine = new Engine("standard-config");
    });

    test("creates a new Book and Accounts, then performs standard Buchung", () => {
        const book2025 = engine.createBook(2025);
        expect(book2025.year).toBe(2025);

        const bankAccount = engine.createAccount("Aktiv", 1000, "Bank", ["BankKonto"], 5000.0);
        const liabilities = engine.createAccount("Passiv", 2000, "Verbindlichkeiten L+L", ["Kreditoren"], 0.0);
        const realEstate = engine.createAccount("Aktiv", 1100, "Immobilien", [], 200000.0);
        const extraordinaryExpense = engine.createAccount("Aufwand", 8000, "A.o. Aufwand", [], 0.0);

        book2025.addAccount(bankAccount);
        book2025.addAccount(liabilities);
        book2025.addAccount(realEstate);
        book2025.addAccount(extraordinaryExpense);

        engine.performBuchung(
            1,
            realEstate.code,
            liabilities.code,
            1000,
            "CHF",
            "Kauf Immobilien (Teil 1)"
        );

        engine.performBuchung(
            3,
            liabilities.code,
            bankAccount.code,
            1010,
            "CHF",
            "Bezahlung via Bank"
        );

        engine.performBuchung(
            5,
            extraordinaryExpense.code,
            bankAccount.code,
            10,
            "CHF",
            "Kursverlust"
        );

        const bankAcc = engine.accounts.find(a => a.code === 1000);
        const liabilitiesAcc = engine.accounts.find(a => a.code === 2000);
        const realEstateAcc = engine.accounts.find(a => a.code === 1100);
        const expenseAcc = engine.accounts.find(a => a.code === 8000);

        expect(bankAcc.balance).toBe(3980);
        expect(realEstateAcc.balance).toBe(201000);
        expect(liabilitiesAcc.balance).toBe(10);
        expect(expenseAcc.balance).toBe(10);

        console.log(JSON.stringify(engine.toJSON(), null, 2));
    });

    test("creates a Sammelbuchung", () => {
        const accounts = {
            sales: engine.createAccount("Ertrag", 3000, "SalesRevenue", [], 0),
            customerReceivable: engine.createAccount("Aktiv", 1200, "Debitoren", ["FLL"], 0),
            bank: engine.getAccountByCode(1000)
        };

        const baseId = 10;
        const tx1 = engine.createTransaction(baseId, "Soll", accounts.customerReceivable.code, "Sale #1", 300, "CHF", "Sammelbuchung");
        const tx2 = engine.createTransaction(baseId + 1, "Soll", accounts.customerReceivable.code, "Sale #2", 200, "CHF", "Sammelbuchung");
        const tx3 = engine.createTransaction(baseId + 2, "Haben", accounts.sales.code, "Revenue from Sales", 500, "CHF", "Sammelbuchung");

        engine.bookTransaction(tx1.id);
        engine.bookTransaction(tx2.id);
        engine.bookTransaction(tx3.id);

        expect(accounts.customerReceivable.balance).toBe(500);
        expect(accounts.sales.balance).toBe(-500);
    });

    test("creates a Splitsammelbuchung that must sum to a final total", () => {
        const baseId = 20;
        const debitoren = engine.getAccountByCode(1200);
        const ertrag = engine.getAccountByCode(3000);

        const txA = engine.createTransaction(baseId, "Soll", debitoren.code, "Splitsale part1", 500, "CHF", "Splitsammelbuchung");
        const txB = engine.createTransaction(baseId + 1, "Soll", debitoren.code, "Splitsale part2", 300, "CHF", "Splitsammelbuchung");
        const txC = engine.createTransaction(baseId + 2, "Haben", ertrag.code, "CombinedSale 800", 800, "CHF", "Splitsammelbuchung");

        engine.bookTransaction(txA.id);
        engine.bookTransaction(txB.id);
        engine.bookTransaction(txC.id);

        expect(debitoren.balance).toBe(500 + 300 + 500);
        expect(ertrag.balance).toBe(-500 - 800);
    });

    test("handles Rückbuchung with a reversing transaction", () => {
        const txToReverseId = 22;
        const txToReverse = engine.transactions.find(t => t.id === txToReverseId);
        if (!txToReverse) throw new Error("Transaction to reverse not found!");

        const reversingTxId = 30;
        const reversingTxSide = (txToReverse.transactionSide === "Soll") ? "Haben" : "Soll";

        const reversingTx = engine.createTransaction(
            reversingTxId,
            reversingTxSide,
            txToReverse.accountCode,
            `Reverse of Tx ${txToReverseId}`,
            txToReverse.amount,
            txToReverse.currency,
            "Rückbuchung"
        );

        engine.bookTransaction(reversingTxId);

        const accountReversed = engine.getAccountByCode(txToReverse.accountCode);
        const lastLogEntry = accountReversed.transactionLog[accountReversed.transactionLog.length - 1];
        expect(lastLogEntry.transactionId).toBe(reversingTxId);
        expect(lastLogEntry.transactionSide).toBe(reversingTxSide);
        expect(reversingTx.status).toBe("booked");
    });

    test("handles currency exchange from USD to CHF", () => {
        const txUsdId = 40;
        const txUsd = engine.createTransaction(
            txUsdId,
            "Soll",
            1000,
            "Deposit in USD",
            100,
            "USD",
            "Buchung"
        );

        engine.bookTransaction(txUsdId);

        const bank = engine.getAccountByCode(1000);
        const lastLogEntry = bank.transactionLog[bank.transactionLog.length - 1];
        expect(lastLogEntry.originalCurrency).toBe("USD");
        expect(lastLogEntry.convertedAmount).toBeCloseTo(92.0, 2);
    });

    test("throws an error when creating an account with an existing code", () => {
        engine.createAccount("Aktiv", 1001, "Cash", ["Kasse"], 1000.0);
        expect(() => {
            engine.createAccount("Aktiv", 1001, "Duplicate Cash", ["Kasse"], 2000.0);
        }).toThrow("Account with code 1001 already exists.");
    });

    test("loads template accounts", () => {
        engine = new Engine("standard-config");
        engine.loadTemplateAccounts();
        const templateAccount = engine.getAccountByCode(1000);
        expect(templateAccount).toBeDefined();
        expect(templateAccount.name).toBe("Kasse");
    });
});
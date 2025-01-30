
<div align="center">
  <img src="https://github.com/user-attachments/assets/79d49fcd-7447-4eee-8291-93e5663f6874" width="60%" alt="DeepSeek-V3" />
</div>

<hr/>

<div align="center" style="line-height: 1;">
  <a href="https://github.com/x47base/ch-finance-engine/blob/main/LICENSE" style="margin: 2px;">
    <img alt="Code License" src="https://img.shields.io/badge/Code_License-modified_MIT_License-blue" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

## Table of Contents
1. [Introduction](#introduction)  
2. [Architecture](#architecture)  
3. [Features](#features)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Testing](#testing)  
7. [File Overview](#file-overview)  
8. [License](#license)  

---

## Introduction

**ch-finance-engine** is a Node.js package designed to simulate Swiss-style accounting and finance operations. It aims to help learners and educators with double-entry bookkeeping, currency conversions, yearly accounting closures, and more.

---

## Architecture

- **Models** (in `./src/models`):
  - **Account**: Ledger account (e.g., Bank, Verbindlichkeiten).  
  - **Book**: Represents a fiscal year.  
  - **Engine**: Central manager for books, accounts, transactions, and exchange rates.  
  - **Transaction**: One side of a booking (“Soll” or “Haben”).  

- **Config** (in `./src/config`):
  - **`standardConfig.json`**: Default currency, exchange rates, and allowed booking types.  
  - **`accountTypes.js`**: Lists valid account categories (“Aktiv”, “Passiv”, “Aufwand”, “Ertrag”).  
  - **`transactionSideTypes.js`**: Defines valid sides for transactions (“Soll”, “Haben”).  

- **Utils** (in `./src/utils`):
  - **`configUtils.js`**: Loads JSON configurations.

- **Tests** (in `./__tests__`):  
  - **`account.test.js`**, **`book.test.js`**, **`engine.test.js`**, **`transaction.test.js`**.

---

## Features

- **Swiss-style double-entry bookkeeping** (Soll/Haben).  
- **Multiple booking types**: Buchung, Sammelbuchung, Splitsammelbuchung, Rückbuchung.  
- **Currency conversion** via configuration.  
- **Year-end closure** of Books and marking Accounts fully booked.  
- **Extensive unit tests** (Jest) for all major components.

---

## Installation

1. Clone this repository or add it to your project.  
2. Run `npm install` to install dependencies.  
3. Ensure you have Node.js 14+.

---

## Usage

**Basic Example**:

```js
// index.js or main script
const Engine = require("./src/models/engine");

function demo() {
  const engine = new Engine("./src/config/standardConfig.json");
  
  // Create a Book for 2025
  const book2025 = engine.createBook(2025);

  // Create Accounts
  const bankAccount = engine.createAccount("Aktiv", 1000, "Bank", ["BankKonto"], 5000.0);
  const liabilities = engine.createAccount("Passiv", 2000, "Verbindlichkeiten L+L", ["Kreditoren"], 0.0);
  
  // Add to Book
  book2025.addAccount(bankAccount);
  book2025.addAccount(liabilities);

  // Perform a double-entry posting (Buchung): 500 CHF from Bank (Soll) to Liabilities (Haben)
  engine.performBuchung(1, bankAccount.code, liabilities.code, 500, "CHF", "Initial Payment");

  console.log(JSON.stringify(engine.toJSON(), null, 2));
}

demo();
```

---

## Description of Tests

The project includes a comprehensive Jest test suite located in the `__tests__` folder. These tests verify the functionality of each core model and demonstrate various accounting operations:

- **`account.test.js`**  
  Tests creating and managing `Account` instances, including balance modifications, closing/reopening, marking fully booked, and handling transactions with/without currency conversion.

- **`book.test.js`**  
  Validates `Book` creation for specific years, adding accounts, closing the Book (and marking accounts fully booked), and reopening.

- **`engine.test.js`**  
  Examines the `Engine` class’s orchestration of `Book`s, `Account`s, and `Transaction`s.  
  Demonstrates:
  - Multiple transaction types (Buchung, Sammelbuchung, Splitsammelbuchung, Rückbuchung).
  - Currency exchange scenarios (e.g., USD to CHF).
  - Double-entry postings (`performBuchung`) and reversing transactions.

- **`transaction.test.js`**  
  Focuses on the `Transaction` model:  
  - Valid “Soll” / “Haben” sides.  
  - Valid booking types (“Buchung”, “Sammelbuchung”, “Splitsammelbuchung”, “Rückbuchung”).  
  - Transition between “booked” and “canceled” statuses.  

You can run all tests using:

```bash
npm test
```

---

## File Overview

### `__tests__`
- **`account.test.js`**  
  Tests `Account` creation, validity checks, transactions, closing, and reopening.
- **`book.test.js`**  
  Covers `Book` creation, account additions, and closing/reopening behavior.
- **`engine.test.js`**  
  Demonstrates the main engine’s orchestration (Book creation, currency exchange, Rückbuchung, Sammelbuchung, etc.).
- **`transaction.test.js`**  
  Validates `Transaction` creation, booking types, sides, and status changes.

### `src/config`
- **`accountTypes.js`**  
  Defines valid account categories: `"Aktiv"`, `"Passiv"`, `"Aufwand"`, `"Ertrag"`.
- **`transactionSideTypes.js`**  
  Defines valid transaction sides: `"Soll"`, `"Haben"`.
- **`standardConfig.json`**  
  Default currency settings, exchange rates, and allowable booking types.

### `src/models`
- **`account.js`**  
  `Account` class with balance tracking, transaction posting, and closure flags.
- **`book.js`**  
  `Book` class representing a fiscal year, storing `Account` references, and handling closures.
- **`engine.js`**  
  Orchestrates Books, Accounts, Transactions, and currency conversion logic.
- **`transaction.js`**  
  One side of a double-entry, with status (“booked”/“canceled”) and booking type (“Buchung”, “Sammelbuchung”, etc.).

### `src/utils`
- **`configUtils.js`**  
  Loads JSON files for configuration (e.g., `standardConfig.json`).

### `README.md`
This documentation file.

### `package.json`
Defines package metadata, scripts, and dependencies.

---

# License Notice

**Note**: This repository operates under a [modified MIT license](LICENSE). The author retains the right to change the license terms at any time, including any future version release.

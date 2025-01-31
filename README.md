<div align="center">
  <img src="https://github.com/user-attachments/assets/79d49fcd-7447-4eee-8291-93e5663f6874" width="95%" alt="ch-finance-engine" />
</div>

<hr/>

<div align="center" style="line-height: 1;">
  <a href="https://github.com/x47base/ch-finance-engine/" style="margin: 2px;">
    <img alt="Code License" src="https://img.shields.io/badge/Release_Version-V1.0.1-green" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://github.com/x47base/ch-finance-engine/blob/main/LICENSE" style="margin: 2px;">
    <img alt="Code License" src="https://img.shields.io/badge/Code_License-modified_MIT_License-blue" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

---

# ch-finance-engine

## Table of Contents
1. [Introduction](#introduction)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [Documentation](#documentation)  
5. [License](#license)  

---

## Introduction

**ch-finance-engine** is a Node.js package designed for Swiss-style accounting and finance operations. It enables double-entry bookkeeping, currency conversions, and transaction management while maintaining compliance with Swiss accounting standards.

### Features
- Double-entry bookkeeping (Soll/Haben)
- Multi-currency support with configurable exchange rates
- Year-end closure of books and account management
- Supports multiple transaction types: Buchung, Sammelbuchung, Splitsammelbuchung, Rückbuchung
- Extensive unit tests for reliability

---

## Installation

To install the latest version, run:
```sh
npm install @x47base/ch-finance-engine@1.0.1-alpha
```

---

## Usage

### Basic Example

```js
const { Engine } = require("@x47base/ch-finance-engine");

function demo() {
  const engine = new Engine("standard-config");
  
  // Create a Book for 2025
  const book2025 = engine.createBook(2025);

  // Create Accounts
  const bankAccount = engine.createAccount("Aktiv", 1000, "Bank", ["BankKonto"], 5000.0);
  const liabilities = engine.createAccount("Passiv", 2000, "Verbindlichkeiten L+L", ["Kreditoren"], 0.0);
  
  // Add to Book
  book2025.addAccount(bankAccount);
  book2025.addAccount(liabilities);

  // Perform a double-entry posting (Buchung)
  engine.performBuchung(1, bankAccount.code, liabilities.code, 500, "CHF", "Initial Payment");

  console.log(JSON.stringify(engine.toJSON(), null, 2));
}

demo();
```

---

## Documentation

### Engine Class

#### `new Engine(configFile: string = "standard-config")`
Creates an engine instance using the specified configuration file.

#### `createBook(year: number)`
Creates a new accounting book for the specified year.

#### `createAccount(type: "Aktiv"|"Passiv"|"Aufwand"|"Ertrag", code: number, name: string, aliases: Array<string>, balance: number)`
Creates an account with the given parameters.

#### `performBuchung(id: number, accountSoll: number, accountHaben: number, amount: number, currency: string, description: string)`
Performs a double-entry transaction between two accounts.

#### `toJSON()`
Returns the entire engine state as a JSON object.

---

## License

This project is licensed under a [modified MIT license](LICENSE). The author retains the right to modify the license terms in future versions.

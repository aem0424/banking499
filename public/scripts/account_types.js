class BankAccount {
  constructor(accountName, accountNumber, routingNumber, balance) {
    this.accountName = accountName;
    this.accountNumber = accountNumber; // Can be 8 to 12 digits long
    this.routingNumber = routingNumber; // 9 digits long
    this.balance = balance;
  }
  accountType = "DefaultType"; // this should always be replaced
  history = null; // will turn this into a list
  transferable = false;

  // GET FUNCTIONS
  getAccountName() {
    return this.accountName;
  }

  getAccountType() { // This is defined in each subclass; should not be used with BankAccount class
    return this.accountType;
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  getRoutingNumber() {
    return this.routingNumber;
  }

  getBalance() {
    return this.balance;
  }

  getHistory() {
    return this.history;
  }
}

class CheckingAccount extends BankAccount {
  accountType = "Checking";
  transferable = true;
}

class SavingsAccount extends BankAccount  {
  accountType = "Savings";
  transferable = true;
}

class MoneyMarketAccount extends BankAccount  { // money market interest should be higher than savings interest
  accountType = "MoneyMarket";
  transferable = true;
}

class HomeMortgageAccount extends BankAccount {
  accountType = "HomeMortgage";
  transferable = false;
}

class CreditCardAccount extends BankAccount {
  accountType = "CreditCard";
  transferable = false;
}

const obj = new CheckingAccount("My Checking Account", 12345678, 5418, 255.68);
let thing = obj.getBalance();
const aweTe = document.querySelector("h2"); // replace whatever's in h2
aweTe.textContent = "The " + obj.getAccountType() + " account with account #" + obj.getAccountNumber() + " has $" + thing + " in their account.";
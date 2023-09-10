class BankAccount {
  constructor(accountName, accountNumber, routingNumber, balance) {
    this.accountName = accountName;
    this.accountNumber = accountNumber; // Can be 8 to 12 digits long
    this.routingNumber = routingNumber; // 9 digits long
    this.balance = balance;
  }
  accountType = "DefaultType"; // this should always be replaced
  history = []; // will turn this into a list
  transferable = false;

  addToHistory(input) {
    this.history.push(input);
  }

  // GET FUNCTIONS
  getAccountName() {
    return this.accountName;
  }

  getAccountType() { // This is defined in each subclass
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

  getHistory(input) { // Get a transaction record from this input
    return this.history[input];
  }
}

class CheckingAccount extends BankAccount {
  accountType = "Checking";
  transferable = true;
  history = [];
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
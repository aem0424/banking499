class BaseTransaction {
    constructor(amount, fromAccount) {
        this.amount = amount;
        this.fromAccount = fromAccount;
    }
}

class AccountTransfer extends BaseTransaction {
    constructor(amount, fromAccount, toAccountRouting) {
        super(amount, fromAccount)
        this.toAccountRouting = toAccountRouting; // We should only need the routing number, AFAIK
    }
}

class BillPay extends BaseTransaction {
    constructor(amount, fromAccount, toAddress, toName) {
        super(amount, fromAccount)
        this.toAddress = toAddress;
        this.toName = toName;
    }
}
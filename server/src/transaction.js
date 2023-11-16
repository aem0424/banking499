const express = require('express');
const router = express.Router();
const database = require('./database.js');

// Basing calcs on a Simple interest formula where the assumption is that all %interest rates
// are given in APR format. Note: This in function works as compounding interest since we add it in monthly
// looking into writing a compound projection if we have time

// $1,000 Balance x 12% APR (.12) x .083 (1 Year / 12 Months = .083) = 9.96

// Compounded: Yearly = 1
//             Monthly = .083
//             Daily   = .0027



// ------------------------ Transaction -------------------------------

// GET: Get a Transaction by TransactionID
// Params: TransactionID
// Return: Entire Transaction row data
router.get('/transactions', async (req, res) => {
    const transactionID = req.body.TransactionID;
    if (!transactionID) {
      return res.status(401).json({ error: "Transaction ID is missing from the request body" });
    }

    let [transactionData, error] = await database.getTransaction(transactionID);

    if (error) {
      return res.status(500).json({ error: "Failed to retrieve transaction data", message: error.message });
    }

    return res.status(200).json(transactionData);
});

  
// GET: Get Transactions by AccountID
// Params: AccountID
// Return: Entire Transaction row data
router.get('/transactions/account', async (req, res) => {
    const accountID = String(req.body.AccountID);
    console.log(accountID);
    if (!accountID) {
      return res.status(400).json({ error: "AccountID is missing from the request body" });
    }

    let [transactionData, error] = await database.getTransactionFromAccountID(accountID);

    if (error) {
      return res.status(500).json({ error: "Failed to retrieve transactions for the account", message: error.message });
    }

    return res.status(200).json(transactionData);
});

// GET: Get Deposit Transactions by AccountID
// Params: AccountID
// Return: Entire Transaction row data
router.get('/transactions/deposits', async (req, res) => {
    const accountID = String(req.body.AccountID);
    if (!accountID) {
      return res.status(400).json({ error: "AccountID is missing from the request body" });
    }

    let [depositData, error] = await database.getTransactionDeposit(accountID);

    if (error) {
      return res.status(404).json({ error: "Failed to retrieve deposit transactions for the account", message: error.message });
    }

    return res.status(200).json(depositData);
});

  


// GET: Get Withdrawal Transaction by AccountID
// Params: AccountID
// Return: Entire Withdrawal Transaction row data
router.get('/transactions/withdrawals', async (req, res) => {
    const accountID = String(req.body.AccountID);
    if (!accountID) {
      return res.status(400).json({ error: "AccountID is missing from the request body" });
    }

    let [withdrawalData, error] = await database.getTransactionWithdrawal(accountID);

    if (error) {
        return res.status(404).json({ error: "Failed to retrieve withdrawal transaction data", message: error.message });
    }

    return res.status(200).json(withdrawalData);
});

// GET: Get Transfer Transaction by AccountID
// Params: AccountID
// Return: Entire Transfer Transaction row data
router.get('/transactions/transfers', async (req, res) => {
    const accountID = String(req.body.AccountID);
    if (!accountID) {
      return res.status(400).json({ error: "AccountID is missing from the request body" });
    }

    let [transferData, error] = await database.getTransactionTransfer(accountID);

    if (error) {
        return res.status(404).json({ error: "Failed to retrieve transfer transaction data", message: error.message });
    }

    return res.status(200).json(transferData);
});



// POST: Insert a Transaction
// Params: Transaction { TransactionType, FromAccountID, ToAccountID, Amount }
// Return: Transaction { TransactionType, FromAccountID, ToAccountID, Amount, Timestamp } (Confirmation)
  router.post('/transactions', async (req, res) => {
    try {
      const transaction = req.body; // Assuming the transaction data is sent in the request body
  
      // Validate the 'transaction' here
  
      // Perform the insertion of the transaction
      let [insertedTransaction, error] = await database.insertTransaction(transaction);
  
      if (error) {
        return res.status(500).json({ error: "Failed to insert the transaction", message: error.message });
      }
  
      return res.status(201).json({ message: "Transaction inserted successfully", data: insertedTransaction });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  });




// ------------------------ BillPay -------------------------------

// GET: Get All BillPay Accounts w/ UserID
// Params: None (UserID passed by Session)
// Return: Data {BillPayID, Name, Address, Amount, PayFromAccount, UserID, DueDate}
router.get('/billpay/accounts', async (req, res) => {
  // Check If the User is Logged In
  let userID = req.session.user?.UserID;

  console.log(`Getting User ${userID}'s BillPay Account(s)`);

  // Query User Information
  let [userData, err_userData] = await database.getBillPayAccounts(userID);
  if (err_userData) {
      return res.status(404).json({ error: `User ${userID} Has No BillPay Accounts`, message: err_userData.message });
  }

  // Parse Data
  return res.status(200).json(userData);
});


// GET: Get Single BillPay Account by BillPayID
// Params: BillPayID
// Return: Whole Row from BillPayment table associated
router.get('/billpay/account', async (req, res) => {
  // Check If the User is Logged In

  const billpayID = req.body.BillPayID;

  console.log(`Getting User ${billpayID}'s BillPay Account(s)`);

  // Query User Information
  let [userData, err_userData] = await database.getBillPayAccount(billpayID);
  if (err_userData) {
      return res.status(404).json({ error: `No Account with ${billpayID}`, message: err_userData.message });
  }

  // Parse Data
  return res.status(200).json(userData[0]);
});

// POST: Insert BillPay Account
// Params: BillPay{ Name, Address, Amount, PayFromAccount, DueDate } * UserID set by session
// Return: BillPay{BillPayID, UserID, Name, Address, Amount, PayFromAccount, DueDate } (Confirmation)
router.post('/billpay/account', async (req, res) => {
  
  // Check if the user is logged in
  const userID = req.session.user?.UserID;
  if (!userID) return res.status(401).json({ error: "User Is Not Logged" });

  // Extract BillPay data from request body
  const { Name, Address, Amount, PayFromAccount, DueDate } = req.body;

  // Create BillPay object
  const billpay = {
      UserID: userID,
      Name: Name,
      Address: Address,
      Amount: Amount,
      PayFromAccount: PayFromAccount,
      DueDate: DueDate, // format: 'YYYY-MM-DD'
      BillType: 'Bill Pay'
  };

  // Insert BillPay Account
  let [insertedData, error] = await database.insertBillPay(billpay);

  if (error) {
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }

  // Return the inserted data as confirmation
  return res.status(201).json(insertedData[0]);
});


router.get('/transaction/generateInterest', async (req, res) => {
  let userRole = req.session.user?.Role;
  if (userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });
  try {
    const result = await database.generateInterest();
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error generating interest:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});



//export this router to use in our server.js
module.exports = router;
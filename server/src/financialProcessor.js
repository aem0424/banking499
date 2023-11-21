// File Responsible for handling system functions related to finance.
// Ex: Generating Interest on Accounts, Servicing Accounts, Generating Bills, etc
// These endpoints should only be accessed from backend, debugging, or admin panel for presentation


// Basing calcs on a Simple interest formula where the assumption is that all %interest rates
// are given in APR format. Note: This in function works as compounding interest since we add it in monthly
// looking into writing a compound projection if we have time

// $1,000 Balance x 12% APR (.12) x .083 (1 Year / 12 Months = .083) = 9.96

// Compounded: Yearly = 1
//             Monthly = .083
//             Daily   = .0027
// ========================================================================================================
const express = require('express');
const router = express.Router();
const database = require('./database.js');
const transactionTest = require('./transaction.js');


function calculateLoanPayment(interestRate, years, baseCost) {
  // Convert interest rate to decimal
  const rate = interestRate / 100;
  
  // Compounded monthly
  const n = 12;

  // Calculate compound interest
  const compoundInterest = baseCost * Math.pow(1 + rate / n, n * years);

  // Calculate total cost
  const totalCost = compoundInterest.toFixed(2); // Round to 2 decimal places

  return parseFloat(totalCost);
}



// System function to generate interest on All Accounts based on InterestAmount
// Params: None
// Return: None
router.get('/system/generateInterest', async (req, res) => {
    let userRole = req.session.user?.Role;
    // if (userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });
    try {
      const result = await generateInterest();
      res.json({ success: true, result });
    } catch (error) {
      console.error('Error generating interest:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.get('/system/credit', async (req, res) => {
  let userRole = req.session.user?.Role;
  // if (userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });
  try {
    const result = await serviceCreditCard();
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error generating interest:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// System function to generate interest on All Accounts based on InterestAmount
// Params: None
// Return: None
async function generateInterest() {
  try {
      // Fetch all records from the 'Account' table
      const [data, error] = await database.getAccounts();

      if (error) {
          throw error;
      }

      // Calculate interest and insert transactions
      const transactions = await Promise.all(
          data.map(async (account) => {
              const interestAmount = parseFloat((account.Balance * (account.InterestRate * 0.01 * 0.083)).toFixed(2));

              const transaction = {
                  TransactionType: 'Interest',
                  FromAccountID: '19',
                  ToAccountID: account.AccountID,
                  Amount: interestAmount,
              };

              // Insert the transaction
              if (account.AccountType === "Checking" ||
                  account.AccountType === "Savings" ||
                  account.AccountType === "Money Market") {
                  // Add Interest
                  const [transactionResult, transactionError] = await transactionTest.insertTransferTransaction(transaction);
                  if (transactionError) {
                      console.error(`Error inserting transaction for AccountID ${account.AccountID}:`, transactionError.message);
                      return null;
                  }
              } 
          })
      );

      return transactions.filter(Boolean); // Filter out null transactions
  } catch (error) {
      throw error;
  }
}

// System function to generate interest on All Accounts based on InterestAmount
// Params: None
// Return: None
async function serviceCreditCard() {
  try {
    const [data, error] = await database.getOverdueCreditCardPayments();

    if (error) {
      throw error;
    }

    const transactions = await Promise.all(
      data.map(async (billAccount) => {
        console.log(billAccount)
        const transaction = {
          TransactionType: 'Interest',
          AccountID: billAccount.AccountReference,
          Amount: billAccount.Amount
        };
        const [transactionResult, transactionError] = await transactionTest.insertCreditTransaction(transaction);
        if (transactionError) {
          console.error(`Error inserting transaction for AccountID ${billAccount.AccountReference}:`, transactionError.message);
          return null;
        }
        let account = await database.getAccount_(billAccount.AccountReference);
        account = account[0];
        account = account[0];
        let interestAmount = parseFloat((account.Balance * (account.InterestRate * 0.01 * 0.083)).toFixed(2));
        console.log(billAccount);
        console.log(billAccount.BillPayID);
        let newBillResult = await database.updateBillPaymentAmount(billAccount.BillPayID, interestAmount);
        let newDueDate = await database.updateDueDate(billAccount.BillPayID);

      })
    );

    return transactions.filter(Boolean); // Filter out null transactions
  } catch (error) {
    throw error;
  }
}



module.exports = {
  router: router,
  generateInterest: generateInterest,
  serviceCreditCard: serviceCreditCard
};


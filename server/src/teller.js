const express = require('express');
const router = express.Router();
const database = require('./database.js');

// ------------------------ Teller -----------------------------------

// GET: Get Teller Information (Login Required)
// Params: None
// Return: Teller:{ Role, Email, Password, FirstName, LastName, PhoneNumber}
router.get('/teller', async (req, res) => {
    let userID = req.session.user?.UserID;
    let userEmail = req.session.user?.Email;
    console.log(`Getting Teller ${userID}'s Information`);
    if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });

    // Query User Information
    let [userData, err_userData] = await database.getUser(userEmail);
    if (err_userData) return res.status(500).json({ error: "Failed to query Teller information", message: err_userData.message });
    
    userData = userData[0];
    return res.status(200).json(userData);
});

// POST: Update Teller Information
// params: User{ UserID, Email*, FirstName, LastName, SSN, PhoneNumber, DOB, Address, Address2, City, State, ZIP }
// return: Confirmation Message
router.post('/teller/update', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });
    console.log(`Updating the Teller Information`);

    // Check the user body
    let teller = req.body;

    // Insert user information
    let [userData, err_userData] = await database.updateUser(teller);
    if (err_userData) return res.status(500).json({ error: "Database Insertion Failed", message: err_userData.message });

    userData = userData[0];
    return res.status(200).json({ message: `Teller Information Updated Successfully as UserID: ${userData.UserID}`, data: userData });
});



// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
router.get('/teller/customers', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    console.log(`Getting All Customer Information`);

    // Query User Information
    let [userData, err_userData] = await database.getUsers("Customer");
    if (err_userData) return res.status(500).json({ error: "Failed to query Customers", message: err_userData.message });

    return res.status(200).json(userData);
});

// GET: Search Customers by their names
// Params: { Name String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/teller/customers/search', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let userText = user.body.Name

    console.log("Searching for Customers");
    let [userData, err_userData] = await database.searchCustomers(userText);

    if (err_userData) return res.status(500).json({ error: "Failed to search customers with the name", message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: {UserID} (CustomerID)
// Return: Customer:{ UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB } ***
router.get('/teller/customer', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    console.log(`Getting Customer ${customerID}'s Information`);
    // Query User Information
    let [userData, err_userData] = await database.getCustomer(customerID);
    if (err_userData) return res.status(500).json({ error: "Failed to query Teller information", message: err_userData.message });
    
    userData = userData[0];
    return res.status(200).json(userData);
});

// GET: Get Customer Accounts (Login Required)
// Params: UserID (CustomerID)
// Return: List of Tellers
router.get('/teller/customer/accounts', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    console.log(`Getting Teller ${tellerID}'s Information`);

    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;

    // Query Customer Accounts
    let [userData, err_userData] = await database.getAllUserAccounts(customerID);
    if (err_userData) return res.status(500).json({ error: "Failed to query Teller information", message: err_userData.message });

    return res.status(200).json(userData);
});


// GET: Search Accounts of a Customer based on the AccountName 
// Params: { UserID, AccountName }
// Return: List of Customers
router.get('/teller/customer/accounts/search', async (req, res) => {
    console.log("Searching for all Banking Accounts belong to a Customer based on the AccountName");
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    let userText = req.body.AccountName;

    let [accountData, err_accountData] = await database.searchAccounts(customerID, userText);
    if (err_accountData) return res.status(500).json({ error: `Failed to search the Customer ${customerID}'s Accounts`, message: err_accountData.message });

    return res.status(200).json(accountData);
});

// GET: Get a Customer Banking Account
// Params: { UserID, AccountID }
// Return: Account {AccountID, UserID, AccountName, Balance, ... }
router.get('/teller/customer/account', async (req, res) => {
    console.log("Getting A Customer's Banking Account Information");
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });
  
    let customerID = req.body.UserID;
    let accountID = req.body.AccountID;
  
    let [accountData, err_accountData] = await database.getAccout(customerID, accountID);
    if (err_accountData) return res.status(500).json({ error: "Failed to get the Customer's Banking Account Information", message: err_accountData.message });

    accountData = accountData[0];
    return res.status(200).json(accountData);
  });

// PUT: Create a new Customer Account (Login Required)
// Params: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate}
// Return: confirmation message
router.put('/teller/customer/account/create', async (req, res) => {
    console.log(`Creating a new Account for Customer`);
    
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    // Get Body Paremeter as an Account
    let account = req.body;

    // Insert the Account
    let [accountData, err_accountData] = await database.insertAccount(account);
    if (err_accountData) return res.status(500).json({ error: `Failed to Insert the Account Data`, message: err_accountData.message });
    
    accountData = accountData[0];
    return res.status(200).json({ message: "Account Creation Completed", data: accountData });
});


// POST: Request to update a Customer Account (Login Required)
// Params: Account{UserID* (Customer UserID), AccountID*, AccountName, ...}
// Return: confirmation message
router.post('/teller/customer/account/update', async (req, res) => {
    console.log(`Updating a Banking Account Information of a Customer`);

    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    try {
        let account = req.body;

        // Insert the Account
        let [accountData, err_accountData] = await database.updateAccount(account);
        if (err_accountData) return res.status(500).json({ error: `Failed to Update User ${account.UserID}'s Account ${account.accountName}`, message: err_accountData.message });

        accountData = accountData[0];
        return res.status(200).json({ message: "Account Update Completed Successfully", data: accountData });

    } catch (error) {
        console.log("You did not include UserID and AccountID in the body parameter");
        return res.status(401).json({ error: "Incomplete Body Parameter", message: "Please include Customer's UserID and AccountID." })
    }
});

// DELETE: Delete a Customer Account
// Params: { UserID, AccountID }
// Return: Confirmation Message
router.delete('/teller/customer/account/delete', async (req, res) => {
    console.log(`Deleting an Account for a Customer`);
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;


    if (!userID || userRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As A Teller" });


    // Check if the Account Already Exists
    let customerID = req.body.UserID;
    let accountID = req.body.AccountName;

    let [accountData, err_accountData] = await database.getAccount(customerID, accountID);
    if (err_account) return res.status(500).json({ error: `Failed to query the Account ${accountID} for Customer ${customerID}`, message: err_accountData.message, data: { TellerID: userID, AccountID: accountID, CustomerID: customerID } });
    // Parse Data
    
    accountData = accountData[0];
    return res.status(200).json({ message: "Account Deletion Completed", data: accountData });
});



//export this router to use in our index.js
module.exports = router;
const express = require('express');
const router = express.Router();
const database = require('./database.js');


// ------------------ Customer -----------------------
// GET: Get Customer Information (Login Required)
// Params: None
// Return: User{UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
router.get('/customer', async (req, res) => {
    // Check If the User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Getting User ${userID}'s Information`);

    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });


    // Query User Information
    let [userData, err_userData] = await database.getUser(userID);
    if (err_userData) {
        return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message });
    }

    // Parse Data
    userData = userData[0];
    return res.status(200).json(userData);
});

// PUT: Register a Customer (include {withCredentials:true})
// params: User:{FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
// return: Confirmation Message
router.put('/customer/register', async (req, res) => {

    // Get Parameter
    let user = req.body;
    console.log(`Registering ${user.FirstName} ${user.LastName}`);

    // Check the user body
    if (!user) {
        return res.status(401).json({ error: "Empty json passed in body" });
    }

    // Check if the email already exists in the database
    let [userData, err_userData] = await database.getUserNameFromEmail(user.Email);
    if (err_userData) {
        return res.status(401).json({ error: 'Failed to query User name', message: err_userData.message });
    }
    userData = userData[0];
    if (userData) {
        return res.status(401).json({ error: `The email is already in use by ${userData.FirstName} ${userData.LastName}` });
    }

    // Insert user information
    let [customerData, err_customerData] = await database.insertCustomer(user);
    if (err_userData) {
        return res.status(401).json({ error: "Failed to add the Customer", message: err_customerData.message });
    }
    customerData = customerData[0];
    return res.status(200).json({ message: `Registration successful as UserID: ${customerData.UserID}` });
});

// POST: Update a Customer Information (include {withCredentials:true})
// params: User:{ Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, DOB }
// return: Confirmation Message
router.post('/customer/update', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    console.log(userID);
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });


    let customer = req.body;
    console.log(`Updating Customer Information of ${userID}`);

    // Check the user body
    if (!customer) return res.status(400).json({ error: "Empty json passed in body", data: customer });

    // Insert user information
    let [userData, err_userData] = await database.updateCustomer(userID, customer);
    if (err_userData) return res.status(500).json({ error: "Database Insertion Failed", message: err_userData.message });
    userData = userData[0];
    return res.status(200).json({ message: `Customer Information Update Successful as UserID: ${userData.FirstName} ${userData.LastName}  ${userData.UserID}`, data: userData});
});

// DELETE: Delete a Customer (include {withCredentials:true})
// params: UserID
// return: { message: <message> }
router.delete('/customer/delete', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Deleting the User ${userID}`)

    // Check the user body
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    let customerID = req.body.UserID;

    // Insert user information
    let [deletionData, err_deletionData] = await database.deleteCustomer(customerID);
    if (err_deletionData) return res.status(500).json({ error: "Customer Deletion Failed", message: err_deletionData.message });


    deletionData = deletionData[0];
    return res.status(200).json({ message: `Customer ${userID} is successful deleted from the database:`, data: deletionData });
});

// GET: Get a Customer Account (include {withCredentials:true})
// Params: AccountID
// Return: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate}
router.get('/customer/account', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Not Logged In As Customer" });

    let accountID = req.query.AccountID;
    console.log(`Getting Account ${accountID} Information for User ${userID}`);
    let [accountData, err_accountData] = await database.getAccount(userID, accountID);
    if (err_accountData) return res.status(500).json({ error: `Failed to query an Account for User ${userID}`, message: err_accountData.message });
    
    // Parse Data
    accountData = accountData[0];
    return res.status(200).json(accountData);
});

// GET: Get a List of Customer Accounts (include {withCredentials:true})
// Params: None
// Return: [ Account1 {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}, Account2{...}, ... ]
router.get('/customer/accounts', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    console.log(`Getting Bank Accounts List for User ${userID}`);

    let [accountList, err_accountList] = await database.getUserAccounts(userID);
    if (err_accountList) return res.status(500).json({ error: 'Failed to query Customer Accounts', message: err_accountList.message });

    return res.status(200).json(accountList);
});

// GET: Search Customer Account By AccountName
// Params: { AccountName }
// Return: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate}
router.get('/customer/accounts/search', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    console.log(`Getting Bank Accounts List for User ${userID}`);

    // Check If a session exsits for the user

    let accountName = req.query.AccountName

    let [accountList, err_accountList] = await database.searchAccounts(userID, accountName);
    if (err_accountList) return res.status(500).json({ error: 'Failed to query Customer Accounts', message: err_accountList.message });

    return res.status(200).json(accountList);
});

// POST: Update an Account Name (Login Required)
// Params: { AccountID*, AccountName }
// Return: confirmation message
router.post('/customer/account/name/update', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });
    
    console.log(`Updating an Account for Customer ${userID}`);

    // Check if the Account Already Exists
    let account = { AccountID:req.body.AccountID, AccountName:req.body.AccountName }

    // Insert the Account
    let [accountData, err_accountData] = await database.updateAccount(account);
    if (err_accountData) return res.status(500).json({ error: `Failed to Update User ${userID}'s Account ${accountName}`, message: err_accountData.message });

    accountData = accountData[0];
    return res.status(200).json({ message: "Account Update Completed Successfully", data: accountData });
});




  
  // ------------------------------------------------------






//export this router to use in our server.js
module.exports = router;
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

// GET: Get All Customer Information (Login Required)
// Params: None
// Return: User{UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
router.get('/customer/all', async (req, res) => {
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
    let userID = req.session.user?.Email;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });


    let customer = req.body;
    console.log(`Updating Customer Information of ${Email}`);

    // Check the user body
    if (!customer) return res.status(401).json({ error: "Empty json passed in body", data: customer });

    // Insert user information
    let [userData, err_userData] = await database.updateCustomer(userID, customer);
    if (err_userData) return res.status(401).json({ error: "Database Insertion Failed", message: err_userData.message });
    userData = userData[0];
    if (!userData) return res.status(404).json({ error: "Confirmation Data Not Found", data: userData });
    console.log(userData);
    return res.status(200).json({ message: `Customer Information Update Successful as UserID: ${userData.FirstName} ${userData.LastName}  ${userData.UserID}` });
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

    // Check if the email already exists in the database
    let [customer, err_customer] = await database.getUser(userID);
    if (err_customer) {
        return res.status(401).json({ error: 'Failed to query User name', message: err_customer.message });
    }
    if (!customer[0]) {
        return res.status(404).json({ error: `User with the UserID ${userID} does not exist` });
    }

    // Insert user information
    let [deletionData, err_deletionData] = await database.deleteCustomer(userID);
    if (err_deletionData) {
        return res.status(401).json({ error: "Customer Deletion Failed", message: err_deletionData.message });
    }

    return res.status(200).json({ message: `Customer ${userID} is successful deleted from the database:`, data: deletionData });
});

// GET: Get a List of Customer Accounts (include {withCredentials:true})
// Params: None
// Return: [ Account1 {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}, Account2{...}, ... ]
router.get('/customer/accounts', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Getting Bank Accounts List for User ${userID}`);

    // Check If a session exsits for the user
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    let [accountList, err_accountList] = await database.getUserAccounts(userID);
    if (err_accountList) return res.status(404).json({ error: 'Failed to query Customer Accounts', message: err_accountList.message });
    return res.status(200).json(accountList);
});

// GET: Get a Customer Account (include {withCredentials:true})
// Params: AccountID
// Return: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}
router.get('/customer/account', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Not Logged In As Customer" });

    let accountID = req.body.AccountID;
    console.log(`Getting Account ${accountID} Information for User ${userID}`);
    let [accountData, err_accountData] = await database.getAccount(userID, accountID);

    if (err_accountData) return res.status(404).json({ error: `Failed to query an Account for User ${userID}`, message: err_accountData.message });
    // Parse Data
    accountData = accountData[0];
    return res.status(200).json(accountData);
});

// PUT: Request to create a new Customer Account (Login Required)
// Params: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}
// Return: confirmation message
router.put('/customer/account/create', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Creating a new Account for Customer ${userID}`);

    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    // Check if the Account Already Exists
    let account = req.body;
    let [accounts, err_accounts] = await database.getUserAccounts(userID);
    if (err_accounts) return res.status(404).json({ error: `Failed to query all Accounts for User ${userID}`, message: err_accounts.message });
    let duplicateFlag = accounts.some(item => item.AccountName == account.AccountName); // is True if the AccountName already exists for the Customer
    if (duplicateFlag) return res.status(404).json({ error: `The AccountName '${account.AccountName}' already exists. Please change it.` });


    // Insert the Account
    let [accountData, err_accountData] = await database.insertAccount(userID, account);
    if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message });

    // Send the Tellers a notification for the request to activate the Account
    let [notificationData, err_notificationData] = await database.insertNotification(userID, accountData.AccountID, null, account.Type,
        `Customer ${userID} has requested to activated Account ${accountData.AccountID}`);

    if (err_notificationData) return res.status(403).json({ error: `Failed to insert a notification for account creation request`, message: err_notificationData.message });

    if (!notificationData) return res.status(500).json({ error: `The server returned empty notification data`, data: notificationData })
    return res.status(200).json({ message: "Account Creation Request Submitted Successfully", data: accountData });
});

// POST: Request to update a Customer Account (Login Required)
// Params: Account{AccountID*, AccountName, ...}
// Return: confirmation message
router.post('/customer/account/update', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Updating an Account for Customer ${userID}`);

    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });

    // Check if the Account Already Exists
    let account = req.body;

    // Insert the Account
    let [accountData, err_accountData] = await database.updateAccount(userID, account);
    if (err_accountData) return res.status(402).json({ error: `Failed to Update User ${userID}'s Account ${accountName}`, message: err_accountData.message });

    return res.status(200).json({ message: "Account Update Completed Successfully", data: accountData });
});

// DELETE: Request to delete a Customer Account
// Params: AccountName
// Return: Confirmation Message
router.delete('/customer/account/delete', async (req, res) => {
    // Check If User is Logged In
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;

    console.log(`Deleting an Account for Customer ${userID}`);

    if (!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer" });


    // Check if the Account Already Exists
    let accountID = req.body.AccountName;
    let [account, err_account] = await database.getAccount(userID, accountID);
    if (err_account) return res.status(404).json({ error: `Failed to query the Account ${accountID} for Customer ${userID}`, message: err_account.message, data: { UserId: userID, AccountID: accountID } });
    // Parse Data
    account = account[0];
    if (!account) return res.status(404).json({ error: `An Account with the AccountID ${accountID} does not exist` });


    // Deactivate the Account
    let [accountData, err_accountData] = await database.updateAccountActivated(accountID, false);
    if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message });

    // TODO: Flag the Teller for the request to deactivate the Account
    let [notificationData, err_notificationData] = await database.insertNotification(userID, accountID, null, "Deactivate Account", `User ${userID} requests to deactivate Account ${accountID}`);
    if (err_notificationData) return res.status(402).json({ error: `Failed to insert an Account Deactivation Notification`, message: err_notificationData.message });

    return res.status(200).json({ message: "Account Deletion Request Submitted Successfully", data: accountData, notification: notificationData });
});

//export this router to use in our index.js
module.exports = router;
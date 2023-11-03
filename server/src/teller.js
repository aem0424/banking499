const express = require('express');
const router = express.Router();
const database = require('./database.js');

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// ------------------------ Teller -----------------------------------

// GET: Get Teller Information (Login Required)
// Params: None
// Return: Teller:{ Role, Email, Password, FirstName, LastName, PhoneNumber}
router.get('/teller', async (req, res) => {
    let userID = req.session.UserID;
    console.log(`Getting Teller ${userID}'s Information`);
    if (!userID) {
        return res.status(401).json({ error: "User Is Not Logged In" });
    }

    // Query User Information
    let [userData, err_userData] = await database.getUserShorthand(userID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    userData = userData[0];
    if (!userData) return res.status(404).json({ error: `Teller ${userID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});



// POST: Update a Teller
// params: User:{ FirstName, LastName, PhoneNumber }
// return: Confirmation Message
router.post('/teller/update', async (req, res) => {
    // Check If it is the Administrator making this request
    console.log(`Updating a Teller Information`);
    if (!req.session.UserID || !req.session.UserRole) {
        return res.status(401).json({ error: "Invalid Access Level to perfom the task: Updating a Teller account" });
    }


    // Check the user body
    let teller = req.body;
    if (!teller) return res.status(401).json({ error: "Empty json passed in body" });


    // Insert user information
    let [tellerData, err_tellerData] = await database.updateTeller(teller);
    if (err_tellerData) return res.status(401).json({ error: "Database Insertion Failed", message: err_tellerData.message });

    return res.status(200).json({ message: `Teller Information Updated Successfully as UserID: ${tellerData.UserID}` });
});

// DELETE: Delete a Teller
// params: UserID
// return: { message: <message> }
router.delete('/teller/delete', async (req, res) => {
    // Check If it is the Administrator making this request
    let adminID = req.session.UserID;
    console.log(`Deleting a Teller`);
    if (!adminID || adminID != ADMIN_ID) return res.status(401).json({ error: "Invalid Access Level to perfom the task: Creating a Teller account" });

    // Check the user body
    let tellerID = req.body.UserID;
    if (!tellerID) return res.status(401).json({ error: "Empty value passed in body. Make sure it looks like the example", example: { tellerID: "10" } });


    // Check if the email already exists in the database
    let [teller, err_teller] = await database.getUser(tellerID);
    if (err_teller) {
        return res.status(401).json({ error: 'Failed to query User name', message: err_teller.message });
    }
    if (!teller[0]) {
        return res.status(404).json({ error: `User with the UserID ${tellerID} does not exist` });
    }

    // Insert user information
    let [deletionData, err_deletionData] = await database.deleteCustomer(tellerID);
    if (err_deletionData) {
        return res.status(401).json({ error: "Customer Deletion Failed", message: err_deletionData.message });
    }

    return res.status(200).json({ message: `Customer ${tellerID} is successful deleted from the database:`, data: deletionData });
});

// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
router.get('/teller/customers', async (req, res) => {
    let tellerID = req.session.UserID;
    let tellerRole = req.session.UserRole;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    console.log(`Getting All Customer Information`);

    // Query User Information
    let [userData, err_userData] = await database.getCustomers(userID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    if (!userData) return res.status(404).json({ error: `Teller ${userID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});

// GET: Search Customers
// Params: { Text String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/teller/customer/search', async (req, res) => {
    let tellerID = req.session.UserID;
    let tellerRole = req.session.UserRole;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let userText = user.body.Text

    console.log("Searching for Customer");
    let [userData, err_userData] = await database.searchCustomer(userText);

    if (err_userData) return res.status(401).json({ error: "Failed to search customers with the name", message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: {UserID} (CustomerID)
// Return: Customer:{ UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB } ***
router.get('/teller/customer', async (req, res) => {
    let tellerID = req.session.UserID;
    let tellerRole = req.session.UserRole;
    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    console.log(`Getting Customer ${customerID}'s Information`);
    // Query User Information
    let [userData, err_userData] = await database.getCustomer(customerID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    if (!userData) return res.status(404).json({ error: `Customer ${customerID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Customer Accounts (Login Required)
// Params: UserID (CustomerID)
// Return: List of Tellers
router.get('/teller/customer/accounts', async (req, res) => {
    let tellerID = req.session.UserID;
    let tellerRole = req.session.UserRole;
    console.log(`Getting Teller ${tellerID}'s Information`);

    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;

    // Query Customer Accounts
    let [userData, err_userData] = await database.getAllUserAccounts(customerID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    if (!userData) return res.status(404).json({ error: `Teller ${customerID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});

// POST: Activate Customer Accounts (Login Required)
// Params: UserID (CustomerID), AccountID
// Return: Confirmation Message
router.get('/teller/customer/account/activate', async (req, res) => {
    let tellerID = req.session.UserID;
    let tellerRole = req.session.UserRole;
    console.log(`Getting Teller ${tellerID}'s Information`);

    if (!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    let accountID = req.body.AccountID;

    // Query Customer Accounts
    let [activationData, err_activationData] = await database.updateAccountActivated(accountID, true);
    if (err_activationData) return res.status(404).json({ error: "Failed to query Teller information", message: err_activationData.message });
    if (!activationData) return res.status(404).json({ error: `Confirmation Data Not Queried for Account Activation`, data: activationData });

    return res.status(200).json({ message: `Customer ${customerID}'s Account ${accountID} Activated Successfully`, data: activationData });
});




// GET: Get Teller Notifications (Login Required)
// Params: None
// Return: Confirmation Message
router.get('/teller/notifications', async (req, res) => {
    let userID = req.session.UserID;
    let userRole = req.session.UserRole;
    console.log(`Getting All Notification`);
    if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });
    if (!userRole) return res.status(401).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole });

    // Query User Information
    let [userData, err_userData] = await database.getNotifications();
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    if (!userData) return res.status(404).json({ error: `Teller ${userID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Teller Notifications (Login Required)
// Params: None
// Return: Confirmation Message
router.get('/teller/notifications/all', async (req, res) => {
    let userID = req.session.UserID;
    let userRole = req.session.UserRole;
    console.log(`Getting All Notification`);
    if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });
    if (!userRole) return res.status(401).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole });

    // Query User Information
    let [userData, err_userData] = await database.getNotificationsAll();
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    if (!userData) return res.status(404).json({ error: `Teller ${userID} IS Not Found`, message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Teller Notification (Login Required)
// Params: None
// Return: Confirmation Message
router.get('/teller/notifications', async (req, res) => {
    if (!req.session.UserID) {
        return res.status(403).json({ error: "Unauthorized User Access" });
    }
    console.log("Getting Teller Notifications");
    let tellerID = req.session.UserID;
    let [tellerData, err_tellerData] = await database.getNotifications(tellerID);
    if (err_tellerData) {
        return res.status(401).json({ error: "Failed to get teller notifications", message: err_tellerData });
    }
    return res.status(200).json(tellerData);
});




//export this router to use in our index.js
module.exports = router;
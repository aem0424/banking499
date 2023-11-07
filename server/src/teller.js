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
    if (!userID) return res.status(403).json({ error: "User Is Not Logged In" });

    // Query User Information
    let [userData, err_userData] = await database.getUserShorthand(userEmail);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });
    userData = userData[0];

    return res.status(200).json(userData);
});



// POST: Update a Teller
// params: User{ Email*, FirstName, LastName, SSN, PhoneNumber, DOB, Address, Address2, City, State, ZIP }
// return: Confirmation Message
router.post('/teller/update', async (req, res) => {
    // Check If it is the Administrator making this request
    console.log(`Updating a Teller Information`);
    if (!req.session.UserID || !req.session.user?.Role) {
        return res.status(403).json({ error: "Invalid Access Level to perfom the task: Updating a Teller account" });
    }

    // Check the user body
    let teller = req.body;
    if (!teller) return res.status(401).json({ error: "Empty json passed in body" });
    teller.Email = req.session.user?.Email;

    // Insert user information
    let [tellerData, err_tellerData] = await database.updateTeller(teller);
    if (err_tellerData) return res.status(404).json({ error: "Database Insertion Failed", message: err_tellerData.message });

    return res.status(200).json({ message: `Teller Information Updated Successfully as UserID: ${tellerData.UserID}` });
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
    let [userData, err_userData] = await database.getCustomers(userID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });

    return res.status(200).json(userData);
});

// GET: Search Customers
// Params: { Text String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/teller/customer/search', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(403).json({ error: "User Is Not Logged In As Teller" });

    let userText = user.body.Text

    console.log("Searching for Customer");
    let [userData, err_userData] = await database.searchCustomers(userText);

    if (err_userData) return res.status(401).json({ error: "Failed to search customers with the name", message: err_userData });

    return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: {UserID} (CustomerID)
// Return: Customer:{ UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB } ***
router.get('/teller/customer', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    if (!tellerID || tellerRole != "Teller") return res.status(403).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    console.log(`Getting Customer ${customerID}'s Information`);
    // Query User Information
    let [userData, err_userData] = await database.getCustomer(customerID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });

    return res.status(200).json(userData);
});

// GET: Get Customer Accounts (Login Required)
// Params: UserID (CustomerID)
// Return: List of Tellers
router.get('/teller/customer/accounts', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    console.log(`Getting Teller ${tellerID}'s Information`);

    if (!tellerID || tellerRole != "Teller") return res.status(403).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;

    // Query Customer Accounts
    let [userData, err_userData] = await database.getAllUserAccounts(customerID);
    if (err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message });

    return res.status(200).json(userData);
});

// POST: Activate Customer Accounts
// Params: UserID (CustomerID), AccountID
// Return: Confirmation Message
router.get('/teller/customer/account/activate', async (req, res) => {
    let tellerID = req.session.user?.UserID;
    let tellerRole = req.session.user?.Role;
    console.log(`Getting Teller ${tellerID}'s Information`);

    if (!tellerID || tellerRole != "Teller") return res.status(403).json({ error: "User Is Not Logged In As Teller" });

    let customerID = req.body.UserID;
    let accountID = req.body.AccountID;

    // Query Customer Accounts
    let [activationData, err_activationData] = await database.updateAccountActivated(accountID, true);
    if (err_activationData) return res.status(404).json({ error: "Failed to query Teller information", message: err_activationData.message });

    return res.status(200).json({ message: `Customer ${customerID}'s Account ${accountID} Activated Successfully`, data: activationData });
});




// GET: Get Teller Notifications (Only the unresolved requests)
// Params: None
// Return: [TellerInbox1{InboxID, Type, Message, User{FirstName, LastName}, Account{AccountName}, TimeStamp}, TellerInbox2{...}, ...]
router.get('/teller/notifications', async (req, res) => {
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    console.log(`Getting All Notification`);
    if (!userID) return res.status(403).json({ error: "User Is Not Logged In" });
    if (!userRole) return res.status(403).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole });

    // Query User Information
    let [notificationData, err_notificationData] = await database.getNotifications();
    if (err_notificationData) return res.status(404).json({ error: "Failed to query Teller information", message: err_notificationData.message });

    return res.status(200).json(notificationData);
});

// GET: Get All Teller Notifications (Even the resolved requests)
// Params: None
// Return: [TellerInbox1{InboxID, Type, Message, User{FirstName, LastName}, Account{AccountName}, TimeStamp}, TellerInbox2{...}, ...]
router.get('/teller/notifications/all', async (req, res) => {
    let userID = req.session.user?.UserID;
    let userRole = req.session.user?.Role;
    console.log(`Getting All Notification`);
    if (!userID) return res.status(403).json({ error: "User Is Not Logged In" });
    if (!userRole) return res.status(403).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole });

    // Query User Information
    let [notificationData, err_notificationData] = await database.getNotificationsAll();
    if (err_notificationData) return res.status(404).json({ error: "Failed to query Teller information", message: err_notificationData.message });
    return res.status(200).json(notificationData);
});

// GET: Get Teller Notification
// Params: InboxID
// Return: TellerInbox{InboxID, Type, Message, User{FirstName, LastName}, Account{AccountName}, TimeStamp}
router.get('/teller/notification', async (req, res) => {
    if (!req.session.user?.UserID || req.session.user?.Role != "Teller") {
        return res.status(403).json({ error: "Unauthorized User Access" });
    }
    console.log("Getting Teller Notifications");

    let inboxID = req.body.InboxID;
    let [notificationData, err_notificationData] = await database.getNotification(inboxID);
    if (err_tellerData) return res.status(401).json({ error: "Failed to get teller notification", message: err_notificationData });
    notificationData = notificationData[0];
    
    return res.status(200).json(notificationData);
});




//export this router to use in our index.js
module.exports = router;
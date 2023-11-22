const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('./database.js');

// ------------------------ Admininstrator -------------------------------
// GET: Get a List of Tellers
// Params: None
// Return: List of Tellers
router.get('/admin/tellers', async (req, res) => {
  console.log("Getting a Tellers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });


  let [tellerList, err_tellerList] = await database.getTellers();
  if (err_tellerList) return res.status(500).json({ error: "Failed to query Tellers List", message: err_tellerList.message });

  return res.status(200).json(tellerList);
});

// GET: Search Tellers by their name
// Params: { Name String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/admin/tellers/search', async (req, res) => {
  console.log("Searching for User");

  if (!req.session.user?.UserID || req.session.user?.Role != "Administrator")
    return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let userText = req.query.Name

  let [userData, err_userData] = await database.searchTellers(userText);
  if (err_userData) return res.status(500).json({ error: "Failed to search this teller", message: err_userData });

  return res.status(200).json(userData);
});

// PUT: Register a new Teller (include {withCredentials:true})
// Params: Teller
// Return: Confirmation Message
router.put('/admin/teller/register', async (req, res) => {
  console.log("Adding a new Teller");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let teller = req.body;

  // Check if the email already exists in the database
  let [userData, err_userData] = await database.getUserNameFromEmail(teller.Email);
  if (err_userData) return res.status(500).json({ error: 'Failed to query User name', message: err_userData.message });
  userData = userData[0];

  if (userData) return res.status(404).json({ error: `Unable to Create a new Teller`, message: `The email is already in use by ${userData.FirstName} ${userData.LastName} ${userData.UserID}` });

  // Add a New Teller
  let [tellerData, err_tellerData] = await database.insertTeller(teller);
  if (err_tellerData) return res.status(500).json({ error: "Failed to create this teller", message: err_tellerData });

  tellerData = tellerData[0];
  return res.status(200).json({ message: "Successfully Created a new Teller Account", data: tellerData });
});

// POST: Update a Teller's Information (include {withCredentials:true})
// Params: User{ UserID*, Email, FirstName, LastName, SSN, PhoneNumber, DOB, Address, Address2, City, State, ZIP }
// Return: Confirmation Message
router.post('/admin/teller/update', async (req, res) => {
  console.log("Updating the Teller Information");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let teller = req.body;
  if (teller.FirstName || teller.LastName) {
    let [nameData, err_nameData] = await database.getUserName(teller.UserID);
    if (err_nameData) return res.status(500).json({ error: "Failed to query teller name", message: "Error occurred while getting user name", data: { UserID: teller.UserID } });
    nameData = nameData[0];
    console.log(nameData);
    teller.FullName = (teller.FirstName ? teller.FirstName : nameData.FirstName) + " " + (teller.LastName ? teller.LastName : nameData.LastName)
  }

  if (teller.Password) {
    try {
      teller.PasswordOriginal = teller.Password;
      let salt = await bcrypt.genSalt(10);
      let peper = process.env.PASSWORD_PEPPER;

      let hashedPassword = await bcrypt.hash(teller.Password, salt) + peper;
      teller.Password = hashedPassword;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to encrypt password" });
    }
  }


  let [tellerData, err_tellerData] = await database.updateUser(teller);
  if (err_tellerData) return res.status(500).json({ error: "Failed to update this teller", message: err_tellerData });

  tellerData = tellerData[0];
  return res.status(200).json({ message: "Successfully Updated the Teller Information", data: tellerData });
});

// DELETE: Delete a Teller (include {withCredentials:true})
// Params: { UserID }
// Return: Confirmation Message
router.delete('/admin/teller/delete', async (req, res) => {
  console.log("Deleting a Teller");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let tellerID = req.body.UserID;

  // Check if the Teller Exists in the database
  let [userData, err_userData] = await database.getTeller(tellerID);
  if (err_userData) return res.status(500).json({ error: `Failed to find Teller ${tellerID}`, message: err_userData });
  userData = userData[0];
  if (!userData) return res.status(404).json({ error: `Teller ${tellerID} Does Not Exist`, message: err_userData });

  // Delete the Teller
  let [tellerData, err_tellerData] = await database.deleteUser(tellerID);
  if (err_tellerData) return res.status(500).json({ error: "Failed to delete this teller", message: err_tellerData });

  tellerData = tellerData[0];
  return res.status(200).json({ message: "Successfully Deleted the Teller Information", data: tellerData });
});


// GET: Get a List of Customers
// Params: None
// Return: List of Customers
router.get('/admin/customers', async (req, res) => {
  console.log("Getting a Customers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });


  let [customerList, err_customerList] = await database.getCustomers();
  if (err_customerList) return res.status(500).json({ error: "Failed to query Customers List", message: err_customerList.message });

  return res.status(200).json(customerList);
});

// GET: Search Customers by their names
// Params: { Name String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/admin/customers/search', async (req, res) => {
  console.log("Searching for User");

  if (!req.session.user?.UserID || req.session.user?.Role != "Administrator")
    return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let userText = req.query.Name;

  let [userData, err_userData] = await database.searchCustomers(userText);

  if (err_userData) return res.status(500).json({ error: "Failed to search this customer", message: err_userData });

  return res.status(200).json(userData);
});


// GET: Get a Customer
// Params: { UserID }
// Return: Customer
router.get('/admin/customer', async (req, res) => {
  console.log("Getting a Customers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customerID = req.query.UserID;

  let [customerData, err_customerData] = await database.getUser(customerID);
  if (err_customerData) {
    return res.status(500).json({ error: "Failed to get Customer Data", message: err_customerData.message });
  }

  customerData = customerData[0];
  return res.status(200).json(customerData);
});

// POST: Update a Customer Information
// Params: User{ UserID*, Email, FirstName, LastName, ... }
// Return: Confirmation Message
router.post('/admin/customer/update', async (req, res) => {
  console.log("Getting a Customers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customer = req.body;

  if (customer.FirstName || customer.LastName) {
    let [nameData, err_nameData] = await database.getUserName(customer.UserID);
    if (err_nameData) return res.status(500).json({ error: "Failed to query customer name", message: "Error occurred while getting user name", data: { UserID: customer.UserID } });
    nameData = nameData[0];
    console.log(nameData);
    customer.FullName = (customer.FirstName ? customer.FirstName : nameData.FirstName) + " " + (customer.LastName ? customer.LastName : nameData.LastName)
  }

  if (customer.Password) {
    try {
      customer.PasswordOriginal = customer.Password;
      let salt = await bcrypt.genSalt(10);
      let peper = process.env.PASSWORD_PEPPER;

      let hashedPassword = await bcrypt.hash(customer.Password, salt) + peper;
      customer.Password = hashedPassword;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to encrypt password" });
    }
  }

  let [customerData, err_customerData] = await database.updateUser(customer);
  if (err_customerData) {
    return res.status(500).json({ error: "Failed to update Customer Data", message: err_customerData.message });
  }

  customerData = customerData[0];
  return res.status(200).json({ message: "Updated the customer information successfully", data: customerData });
});

// DELETE: Delete a Customer (include {withCredentials:true})
// Params: UserID
// Return: Confirmation Message
router.delete('/admin/customer/delete', async (req, res) => {
  console.log("Deleting a Teller");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customerID = req.body.UserID;

  let [userData, err_userData] = await database.getTeller(customerID);
  if (err_userData) return res.status(500).json({ error: `Failed to find Teller ${customerID}`, message: err_userData });
  userData = userData[0];
  if (!userData) return res.status(404).json({ error: `Customer ${customerID} Does Not Exist`, message: err_userData });

  let [customerData, err_customerData] = await database.deleteUser(customerID);
  if (err_customerData) return res.status(500).json({ error: "Failed to delete this customer", message: err_customerData });

  customerData = customerData[0];
  return res.status(200).json({ message: "Successfully Deleted the Customer User Account", data: customerData });
});


// GET: Get all Banking Accounts of a Customer
// Params: { UserID }
// Return: List of Customers
router.get('/admin/customer/accounts', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customerID = req.query.UserID;

  let [accountData, err_accountData] = await database.getUserAccounts(customerID);
  if (err_accountData) {
    console.error('Database Error:', err_accountData);
    return res.status(500).json({ error: "Failed to get the Customer's Accounts", message: err_accountData.message });
  }
  return res.status(200).json(accountData);
});

// GET: Search Accounts of a Customer based on the AccountName 
// Params: { UserID, AccountName }
// Return: List of Customers
router.get('/admin/customer/accounts/search', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customerID = req.query.UserID;
  let userText = req.query.AccountName;

  let [accountData, err_accountData] = await database.searchAccounts(customerID, userText);
  if (err_accountData) return res.status(500).json({ error: `Failed to search the Customer ${customerID}'s Accounts`, message: err_accountData.message });

  return res.status(200).json(accountData);
});

// GET: Get a Customer Banking Account
// Params: { UserID, AccountID }
// Return: Account {AccountID, UserID, AccountName, Balance, ... }
router.get('/admin/customer/account', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let customerID = req.query.UserID;
  let accountID = req.query.AccountID;

  let [accountData, err_accountData] = await database.getAccout(customerID, accountID);
  if (err_accountData) return res.status(500).json({ error: "Failed to get the Customer's Banking Account Information", message: err_accountData.message });

  accountData = accountData[0];
  return res.status(200).json(accountData);
});

// PUT: Create a Customer Banking Account
// Params: Account { UserID, AccountName, AccountType, Balance, InterestRate }
// Return: Confirmation Message
router.put('/admin/customer/account/create', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let account = req.body;

  let [accountData, err_accountData] = await database.insertAccount(account);
  if (err_accountData) return res.status(500).json({ error: "Failed to add the Customer's Banking Account Information", message: err_accountData.message });

  accountData = accountData[0];
  return res.status(200).json({ message: "Created the Customer's Account Information Successfully", data: accountData });
});


// POST: Update a Customer Banking Account Information
// Params: Account { AccountID*, UserID*, AccountName, ... }
// Return: Confirmation Message
router.post('/admin/customer/account/update', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let account = req.body;

  let [accountData, err_accountData] = await database.updateAccount(account);
  if (err_accountData) return res.status(500).json({ error: "Failed to update the Customer's Banking Account Information", message: err_accountData.message });

  accountData = accountData[0];
  return res.status(200).json({ message: "Updated the Customer's Account Information Successfully", data: accountData });
});

// Delete: Delete a Customer Banking Account Information
// Params: { AccountID*, UserID* }
// Return: Confirmation Message
router.delete('/admin/customer/account/delete', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "User Is Not Logged In As Admin" });

  let accountID = req.body.AccountID;
  let customerID = req.body.UserID;

  // Check if the account balance is 0
  let [accountData, err_accountData] = await database.getAccount(customerID, accountID);

  if (err_accountData) return res.status(500).json({ error: `Failed to query the Account ${accountID} for Customer ${customerID}`, message: err_accountData.message, data: accountData });

  if (accountData.Balance != 0) {
    return res.status(400).json({ error: `Account Balance Is Not $0`, message: `The Account ${accountID}'s balance is ${accountData.Balance}. The account balance must be $0 in order to delete the account`, data: accountData });
  }

  let [deletionData, err_deletionData] = await database.deleteAccount(accountID, customerID);
  if (err_deletionData) return res.status(500).json({ error: "Failed to delete the Customer's Banking Account Information", message: err_deletionData.message, userData: req.body });

  deletionData = deletionData[0];
  return res.status(200).json({ message: "Deleted the Customer's Account Information Successfully", data: deletionData });
});



//export this router to use in our index.js
module.exports = router;

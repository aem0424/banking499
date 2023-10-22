const express = require('express');
const session = require('express-session');
const cors = require('cors');
const database = require('./database.js');
const encryption = require('./encryption.js');

const app = express();
const PORT = 4000;

const ADMIN_ID = 0;

const debugging = true;

// ----------------------- Middleware ---------------------------
app.use(express.json());
app.use(cors());

// Authentication
app.use(session({
  secret: 'group2', // secret key
  resave: false,
  saveUninitialized: true,
}));


app.get('/', (req, res) => {
  res.send('Home Route');
});

// -------------------- User ----------------------------
// Get User's Information (Login Required)
// Params: UserID
// Return: User data
app.get('/user', async (req, res) => {
  userID = req.session.UserID
  console.log(`Getting User ${req.session.UserID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getUser(userID);
  if(err_userData) {
    return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message});
  }

  return res.status(200).json(userData);
});

// POST: Log in
// Params: JSON{ "email": "<email>", "password": "<password>"}
// Return: Message
app.post('/user/login', async (req, res) => {
  // Check parameters
  let email = req.body.email;
  let password = req.body.password;

  if(!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password"});
  }
  // Query UserID
  let [ userID, err_userID ] = await database.getUserIDFromLogin(email, password);
  if (err_userID) {
    return res.status(401).json({ error: "Failed to query UserID", message: err_userID.message});
  }
  // Parse UserID
  userID = userID[0].UserID;

  // Verify Data
  if (!userID) {
    return res.status(404).json({ error: "No UserID found for the email and password"});
  }
  else if(req.session.UserID == userID) {
    return res.status(200).json({message: `The User ${userID} was already logged in`});
  }

  // Set a new Session
  req.session.UserID = userID;
  return res.status(200).json({message: `Login successful as UserID: ${userID}`});
});

// POST: Log Out
// Params: None
// Return: Message
app.post('/user/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed'});
    } else {
      return res.status(200).json({ message: 'Logout successful'});
    }
  });
});

// POST: Register a Customer
// params: user:{FirstName: <firstName>, LastName: <lastName>, Street: <street>, "City": <city>, "State": <state>, "ZIP": <zip>, PhoneNumber: <phoneNumber>, SSN: <ssn>, DOB: <dob>'}
// return: { message: <message> }
app.put('/user/customer/register', async (req, res) => {
  let user = req.body;
  console.log(`Registering ${user}`);

  // Check the user body
  if(!user) {
    return res.status(401).json({ error: "Empty json passed in body" });
  }

  // Check if the email already exists in the database
  let [ name, err_name ] = await database.getUserNameFromEmail(user.Email);
  if(err_name) {
    return res.status(401).json({ error: 'Failed to query User name', message: err_name.message});
  }
  name = name[0];
  if (name) {
    return res.status(401).json({ error: `The email is already in use by ${name.FirstName} ${name.LastName}`});
  }

  // Insert user information
  let [ userData, err_userData ] = await database.insertCustomer(user);
  if (err_userData) {
    return res.status(401).json({ error: "Database Insertion Failed", message: err_userData.message});
  }

  return res.status(200).json({message: `Registration successful as UserID: ${userData.UserID}`});
});

// DELETE: Delete a Customer
// params: UserID
// return: { message: <message> }
app.delete('/user/delete', async (req, res) => {
  let userID = req.body.UserID;

  // Check the user body
  if(!userID) {
    return res.status(401).json({ error: "Empty value passed in body. Make sure it looks like the example", example: { UserID: "10"} });
  }

  // Check if the email already exists in the database
  let [ customer, err_customer ] = await database.getUser(userID);
  if(err_customer) {
    return res.status(401).json({ error: 'Failed to query User name', message: err_customer.message});
  }
  if (!customer[0]) {
    return res.status(404).json({ error: `User with the UserID ${userID} does not exist`});
  }
  
  // Insert user information
  let [ deletionData, err_deletionData ] = await database.deleteCustomer(userID);
  if (err_deletionData) {
    return res.status(401).json({ error: "Customer Deletion Failed", message: err_deletionData.message});
  }

  return res.status(200).json({message: `Customer ${userID} is successful deleted from the database:`, data: deletionData });
});

// POST: Register a Teller
// params: user:{FirstName: <firstName>, LastName: <lastName>, PhoneNumber: <phoneNumber>}
// return: { message: <message> }
app.put('/user/teller/register', async (req, res) => {
  // Check If it is the Administrator making this request
  let adminID = req.session.UserID;
  console.log(`Registering a new Teller`);
  if(!adminID || adminID != ADMIN_ID) {
    return res.status(401).json({ error: "Invalid Access Level to perfom the task: Creating a Teller account"});
  }
  
  // Check the user body
  let teller = req.body;
  if(!teller) {
    return res.status(401).json({ error: "Empty json passed in body" });
  }

  // Check if the email already exists in the database
  let [ name, err_name ] = await database.getUserNameFromEmail(teller.Email);
  if(err_name) return res.status(401).json({ error: 'Failed to query User name', message: err_name.message});
  name = name[0];
  if (name) return res.status(401).json({ error: `The email is already in use by ${name.FirstName} ${name.LastName}`});

  // Insert user information
  let [ tellerData, err_tellerData ] = await database.insertTeller(teller);
  if (err_tellerData) {
    return res.status(401).json({ error: "Database Insertion Failed", message: err_tellerData.message});
  }

  return res.status(200).json({message: `Registration successful as UserID: ${tellerData.UserID}`});
});

// DELETE: Delete a Customer
// params: UserID
// return: { message: <message> }
app.delete('/user/teller/delete', async (req, res) => {
  // Check If it is the Administrator making this request
  let adminID = req.session.UserID;
  console.log(`Deleting a Teller`);
  if(!adminID || adminID != ADMIN_ID) {
    return res.status(401).json({ error: "Invalid Access Level to perfom the task: Creating a Teller account"});
  }
  
  // Check the user body
  let tellerID = req.body.UserID;
  if(!tellerID) {
    return res.status(401).json({ error: "Empty value passed in body. Make sure it looks like the example", example: { tellerID: "10"} });
  }

  // Check if the email already exists in the database
  let [ teller, err_teller ] = await database.getUser(tellerID);
  if(err_teller) {
    return res.status(401).json({ error: 'Failed to query User name', message: err_teller.message});
  }
  if (!teller[0]) {
    return res.status(404).json({ error: `User with the UserID ${tellerID} does not exist`});
  }
  
  // Insert user information
  let [ deletionData, err_deletionData ] = await database.deleteCustomer(tellerID);
  if (err_deletionData) {
    return res.status(401).json({ error: "Customer Deletion Failed", message: err_deletionData.message});
  }

  return res.status(200).json({message: `Customer ${tellerID} is successful deleted from the database:`, data: deletionData });
});


// ------------------ Customer -----------------------

// GET: Get Customer Information (Login Required)
// Params: None
// Return: User (1)
app.get('/customer', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting User ${userID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getUser(userID);
  if(err_userData) {
    return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message});
  }
  // Parse Data
  userData = userData[0];
  return res.status(200).json(userData);
});

// GET: Get a List of Customer Accounts (Login Required)
// Params: UserID
// Return: Account (0..N)
app.get('/customer/accounts', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting Bank Accounts List for User ${userID}`);
  // Check If a session exsits for the user
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  let [ accountList, err_accountList ] = await database.getAccountsFromUserID(userID);
  if(err_accountList) {
    return res.status(404).json({ error: 'Failed to query Customer Accounts', message: err_accountList.message});
  }
  return res.status(200).json(accountList);
});

// GET: Get a Customer Account (Login Required)
// Params: AccountID
// Return: Account (1)
app.get('/customer/accounts/account', async (req, res) => {
  // Check If a session exsits for the user
  let userID = req.session.UserID;
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  let accountID = req.body.AccountID;
  console.log(`Getting Account ${accountID} Information for User ${userID}`);
  let [ accountData, err_accountData ] = await database.getAccount(userID, accountID);

  if (err_accountData) {
    return res.status(404).json({ error: `Failed to query an Account for User ${userID}`, message: err_accountData.message});
  }
  // Parse Data
  accountData = accountData[0];
  return res.status(200).json(accountData);
});

// PUT: Request to create a new Customer Account
// Params: Account
// Return: message
app.put('/customer/accounts/create', async (req, res) => {
  // Check If a session exsits for the user
  let userID = req.session.UserID;
  console.log(`Creating a new Account for Customer ${userID}`);
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  // Check if the Account Already Exists
  let account = req.body;
  let [ accounts, err_accounts ] = await database.getAccountsFromUserID(userID);
  if (err_accounts) return res.status(404).json({ error: `Failed to query all Accounts for User ${userID}`, message: err_accounts.message});
  let duplicateFlag = accounts.some(item => item.AccountName == account.AccountName);
  if (duplicateFlag) return res.status(404).json({ error: `The AccountName '${account.AccountName}' already exists. Please change it.`});


  // Insert the Account
  let [ accountData, err_accountData ] = await database.insertAccount(userID, account);
  if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message});

  // TODO: Flag the Teller for the request to activate the Account
  // 
  return res.status(200).json({ message: "Account Creation Request Submitted Successfully", data: accountData});
});

// PUT: Request to delete a Customer Account
// Params: AccountID
// Return: message
app.put('/customer/accounts/delete', async (req, res) => {
  // Check If a session exsits for the user
  let userID = req.session.UserID;
  console.log(`Creating a new Account for Customer ${userID}`);
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  // Check if the Account Already Exists
  let accountID = req.body.AccountID;
  let [ account, err_account ] = await database.getAccount(accountID);
  if (err_account) return res.status(404).json({ error: `Failed to query all Accounts for User ${userID}`, message: err_account.message});
  // Parse Data
  account = account[0];
  if (!account) return res.status(404).json({error: `An Account with the AccountID ${accountID} does not exist`});


  // Insert the Account
  let [ accountData, err_accountData ] = await database.deleteAccount(userID, accountID);
  if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message});

  // TODO: Flag the Teller for the request to activate the Account
  return res.status(200).json({ message: "Account Creation Request Submitted Successfully", data: accountData});
});



// ------------------------ Teller -----------------------------------

// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
app.get('/teller', async (req, res) => {
  let userID = req.session.UserID
  console.log(`Getting Teller ${userID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getUser(userID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  userData = userData[0];
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
app.get('/teller/customers', async (req, res) => {
  let userID = req.session.UserID
  console.log(`Getting Teller ${userID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getCustomers(userID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
app.get('/teller/customers/customer', async (req, res) => {
  let userID = req.session.UserID
  console.log(`Getting Teller ${userID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }


  // Query User Information
  let [ userData, err_userData ] = await database.getCustomers(userID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});



// ------------------------ Admininstrator -------------------------------
// GET: Get a List of Tellers
// Params: None
// Return: List of Tellers
app.get('/admin/tellers', async (req, res) => {
  if(!req.session.UserID && !debugging) {
    return res.status(401).json({ error: "User Not Logged In"});
  }
  if(req.session.UserID != ADMIN_ID) {
    return res.status(403).json({ error: "Unauthorized User Access. Admin Access Required"});
  }

  console.log("Getting a Tellers List");
  let [ tellerList, err_tellerList ] = await database.getTellerList();
  if (err_tellerList) {
    return res.status(404).json({ error: "Failed to query Tellers List", message: err_tellerList.message});
  }
  return res.status(200).json(tellerList);
});

// PUT: Add a new Teller
// Params: Teller
// Return: message
app.put('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let teller = req.body;
  let [ tellerData,  err_tellerData ] = await database.addTeller(teller);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to create this teller", message: err_tellerData});
  }
  return res.status(200).json({message:"Successfully Created a new Teller Account", data: tellerData});
});

// POST: Update a Teller's Information
// Params: Teller
// Return: message
app.post('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let teller = req.body;
  let [ tellerData,  err_tellerData ] = await database.updateTeller(teller);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to update this teller", message: err_tellerData});
  }
  return res.status(200).json({message:"Successfully Update the Teller Information", data: tellerData});
});

// DELETE: Delete a Teller
// Params: UserID
// Return: message
app.delete('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let tellerID = req.body.UserID;
  let [ tellerData,  err_tellerData ] = await database.deleteTeller(tellerID);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to delete this teller", message: err_tellerData});
  }
  return res.status(200).json({message:"Successfully Deleted the Teller Information", data: tellerData});
});

// ------------------------------------------------------




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



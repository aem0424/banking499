const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./database.js');
const encryption = require('../encryption.js');
const customerRoute = require('./customer.js');

const app = express();
const PORT = 4000;

const ADMIN_ID = 1;

const debugging = true;

// ----------------------- Middleware ---------------------------
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(customerRoute);

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
// GET: Get User's Information (Login Required)
// Params: UserID
// Return: User{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, Street2, City, State, ZIP }
app.get('/user', async (req, res) => {
  let userID = req.body.UserID
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

// GET: Get User All Users Based on their Role
// Params: body.{ Role: [Customer | Teller | Administrator] }
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users', async (req, res) => {
  let role = req.body.Role
  console.log(`Getting All ${role}s`);
  if (role != "Customer" && role != "Teller" && role != "Administrator")
    return res.status(401).json({ error: `${role} is not a valid User Role. It must be Customer, Teller, or Administrator`});

  // Query User Information
  let [ userData, err_userData ] = await database.getUsers(role);
  if(err_userData) {
    return res.status(404).json({ error: `Failed to Query Users Based on their Role ${role}`, message: err_userData.message});
  }

  return res.status(200).json(userData);
});

// GET: Get User All Customers
// Params: None
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users/customer', async (req, res) => {
  console.log(`Getting All Customers`);

  // Query User Information
  let [ userData, err_userData ] = await database.getUsers("Customer");
  if(err_userData) return res.status(404).json({ error: `Failed to Query Customers`, message: err_userData.message});
  return res.status(200).json(userData);
});

// GET: Get User All Tellers
// Params: None
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users/teller', async (req, res) => {
  console.log(`Getting All Tellers`);

  // Query User Information
  let [ userData, err_userData ] = await database.getUsers("Teller");
  if(err_userData) return res.status(404).json({ error: `Failed to Query Tellers`, message: err_userData.message});
  return res.status(200).json(userData);
});

// GET: Get User All Users Based on their Role (Login Required)
// Params: None 
// Return: User{ Role }
app.get('/user/role', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting User ${req.session.UserID}'s Role`);
  if(!userID) return res.status(401).json({ error: "User Is Not Logged In"});

  // Query User Information
  let [ userData, err_userData ] = await database.getUserRole(userID);
  if(err_userData) return res.status(404).json({ error: `Failed to Query User ${userID}'s Role`, message: err_userData.message});

  let role = userData[0];

  if(!role) return res.status(404).json({ error: `User ${userID}'s Role Not Found`})

  return res.status(200).json(role);
});

// GET: Get a User's Address Information (Login Required)
// Params: None 
// Return: User{ Street, City, State, ZIP }
app.get('/user/address', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting User ${req.session.UserID}'s Role`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getUserAddress(userID);
  if(err_userData) {
    return res.status(404).json({ error: `Failed to Query User ${userID}'s Address`, message: err_userData.message});
  }
  let role = userData[0];
  if(!role)
    return res.status(404).json({ error: `User ${userID}'s Address Not Found`})

  return res.status(200).json(role);
});


// POST: Log in
// Params: body.{ "email": "<email>", "password": "<password>"}
// Return: Confirmation Message
app.post('/user/login', async (req, res) => {
  // Check parameters
  let email = req.body.email;
  let password = req.body.password;

  if(!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password"});
  }

  // Query UserID
  let [ userData, err_userData ] = await database.getUserIDFromLogin(email, password);
  if (err_userData) {
    return res.status(401).json({ error: "Failed to query UserID and Role", message: err_userData.message});
  }
  // Parse UserID
  userID = userData[0]?.UserID;
  userRole = userData[0]?.Role;

  // Verify Data
  if (!userID && userID != 0) {
    return res.status(404).json({ error: "No UserID found for the email and password"});
  }
  else if(req.session.UserID == userID) {
    return res.status(200).json({message: `The User ${userID} was already logged in`});
  }

  // Set a new Session
  req.session.UserID = userID;
  req.session.UserRole = userRole;
  req.session.UserEmail = email;
  return res.status(200).json({message: `Login successful as UserID: ${userID}    Role: ${userRole}`});
});

// POST: Log Out
// Params: None
// Return: Confirmation Message
app.post('/user/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed'});
    } else {
      return res.status(200).json({ message: 'Logout successful'});
    }
  });
});

// GET: Get Customer Information
// params: None
// return: User:{FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
app.get('/user/customer', async (req, res) => {
  let userID = req.session.UserID;
  let userRole = req.session.UserRole;
  console.log(`Getting User ${userID}'s Information`);
  if(!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer"});

  // Query User Information
  let [ userData, err_userData ] = await database.getUser(userID);
  if(err_userData) {
    return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message});
  }
  // Parse Data
  userData = userData[0];
  return res.status(200).json(userData);
});

// PUT: Register a Customer
// params: User:{FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
// return: Confirmation Message
app.put('/user/customer/register', async (req, res) => {
  let user = req.body;
  console.log(`Registering ${user.FirstName} ${user.LastName}`);

  // Check the user body
  if(!user) {
    return res.status(401).json({ error: "Empty json passed in body" });
  }

  // Check if the email already exists in the database
  let [ userData, err_userData ] = await database.getUserFromEmail(user.Email);
  if(err_userData) {
    return res.status(401).json({ error: 'Failed to query User name', message: err_userData.message});
  }
  userData = userData[0];
  if (userData) {
    return res.status(401).json({ error: `The email is already in use by ${userData.FirstName} ${userData.LastName}`});
  }

  // Insert user information
  let [ customerData, err_customerData ] = await database.insertCustomer(user);
  if (err_userData) {
    return res.status(401).json({ error: "Failed to add the Customer", message: err_customerData.message});
  }
  customerData = customerData[0];
  return res.status(200).json({message: `Registration successful as UserID: ${customerData.UserID}`});
});

// POST: Update a Customer Information
// params: User:{ Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, DOB }
// return: Confirmation Message
app.post('/user/customer/update', async (req, res) => {
  let userID = req.session.UserID;
  if(!userID) return res.status(401).json({ error: "User Not Logged In"});


  let customer = req.body;
  console.log(`Updating Customer Information of ${userID}`);

  // Check the user body
  if(!customer) return res.status(401).json({ error: "Empty json passed in body", data: customer });

  // Insert user information
  let [ userData, err_userData ] = await database.updateCustomer(userID, customer);
  if (err_userData) return res.status(401).json({ error: "Database Insertion Failed", message: err_userData.message});
  userData = userData[0];
  if (!userData)  return res.status(404).json({ error: "Confirmation Data Not Found", data: userData});
  console.log(userData);
  return res.status(200).json({message: `Customer Information Update Successful as UserID: ${userData.FirstName} ${userData.LastName}  ${userData.UserID}`});
});

// DELETE: Delete a Customer
// params: UserID
// return: { message: <message> }
app.delete('/user/customer/delete', async (req, res) => {
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

// PUT: Register a Teller
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
  let [ userData, err_userData ] = await database.getUserFromEmail(teller.Email);
  if(err_userData) return res.status(401).json({ error: 'Failed to query User name', message: err_name.message});
  userData = userData[0];
  if (userData) return res.status(401).json({ error: `The email is already in use by ${userData.FirstName} ${userData.LastName} UserID ${userData.UserID}`});

  // Insert user information
  let [ tellerData, err_tellerData ] = await database.insertTeller(teller);
  if (err_tellerData) {
    return res.status(401).json({ error: "Database Insertion Failed", message: err_tellerData.message});
  }

  return res.status(200).json({message: `Registration successful as UserID: ${tellerData.UserID}`});
});

// POST: Update a Teller
// params: User:{ FirstName, LastName, PhoneNumber }
// return: Confirmation Message
app.post('/user/teller/update', async (req, res) => {
  // Check If it is the Administrator making this request
  let adminID = req.session.UserID;
  console.log(`Updating a Teller Information`);
  if(!adminID || adminID != ADMIN_ID) {
    return res.status(401).json({ error: "Invalid Access Level to perfom the task: Creating a Teller account"});
  }

  
  // Check the user body
  let teller = req.body;
  if(!teller)  return res.status(401).json({ error: "Empty json passed in body" });

  // Check if the email already exists in the database
  let [ name, err_name ] = await database.getUserNameFromEmail(teller.Email);
  if(err_name) return res.status(401).json({ error: 'Failed to query User name', message: err_name.message});
  name = name[0];
  if (!name) return res.status(401).json({ error: `The email is already in use by ${name.FirstName} ${name.LastName}`});

  // Insert user information
  let [ tellerData, err_tellerData ] = await database.updateTeller(teller);
  if (err_tellerData) return res.status(401).json({ error: "Database Insertion Failed", message: err_tellerData.message});

  return res.status(200).json({message: `Registration successful as UserID: ${tellerData.UserID}`});
});

// DELETE: Delete a Teller
// params: UserID
// return: { message: <message> }
app.delete('/user/teller/delete', async (req, res) => {
  // Check If it is the Administrator making this request
  let adminID = req.session.UserID;
  console.log(`Deleting a Teller`);
  if(!adminID || adminID != ADMIN_ID) return res.status(401).json({ error: "Invalid Access Level to perfom the task: Creating a Teller account"});
  
  // Check the user body
  let tellerID = req.body.UserID;
  if(!tellerID) return res.status(401).json({ error: "Empty value passed in body. Make sure it looks like the example", example: { tellerID: "10"} });


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

app.get('/user/role', async (req, res) => {

});

// ------------------ Customer -----------------------

// GET: Get Customer Information (Login Required)
// Params: None
// Return: User{UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB}
app.get('/customer', async (req, res) => {
  let userID = req.session.UserID;
  let userRole = req.session.UserRole;
  console.log(`Getting User ${userID}'s Information`);
  if(!userID || userRole != "Customer") return res.status(401).json({ error: "User Is Not Logged In As Customer"});

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
// Params: None
// Return: [ Account1 {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}, Account2{...}, ... ]
app.get('/customer/accounts', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting Bank Accounts List for User ${userID}`);
  
  // Check If a session exsits for the user
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  let [ accountList, err_accountList ] = await database.getUserAccounts(userID);
  if(err_accountList) {
    return res.status(404).json({ error: 'Failed to query Customer Accounts', message: err_accountList.message});
  }
  return res.status(200).json(accountList);
});

// GET: Get a Customer Account (Login Required)
// Params: AccountID
// Return: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}
app.get('/customer/account', async (req, res) => {
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

// PUT: Request to create a new Customer Account (Login Required)
// Params: Account {AccountID, UserID, AccountName, AccountType, Balance, InterestRate, Activated, Deleted}
// Return: confirmation message
app.put('/customer/account/create', async (req, res) => {
  // Check If a session exsits for the user
  let userID = req.session.UserID;
  console.log(`Creating a new Account for Customer ${userID}`);
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  // Check if the Account Already Exists
  let account = req.body;
  let [ accounts, err_accounts ] = await database.getUserAccounts(userID);
  if (err_accounts) return res.status(404).json({ error: `Failed to query all Accounts for User ${userID}`, message: err_accounts.message});
  let duplicateFlag = accounts.some(item => item.AccountName == account.AccountName); // is True if the AccountName already exists for the Customer
  if (duplicateFlag) return res.status(404).json({ error: `The AccountName '${account.AccountName}' already exists. Please change it.`});


  // Insert the Account
  let [ accountData, err_accountData ] = await database.insertAccount(userID, account);
  if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message});

  // Send the Tellers a notification for the request to activate the Account
  let [ notificationData, err_notificationData ] = await database.insertNotification(userID, accountData.AccountID, null, account.Type,
    `Customer ${userID} has requested to activated Account ${accountData.AccountID}`);

  if (err_notificationData) return res.status(403).json({ error: `Failed to insert a notification for account creation request`, message: err_notificationData.message});

  if (!notificationData) return res.status(500).json({error: `The server returned empty notification data`, data: notificationData})
  return res.status(200).json({ message: "Account Creation Request Submitted Successfully", data: accountData});
});

// DELETE: Request to delete a Customer Account
// Params: AccountID
// Return: Confirmation Message
app.delete('/customer/account/delete', async (req, res) => {
  // Check If a session exsits for the user
  let userID = req.session.UserID;
  console.log(`Deleting an Account for Customer ${userID}`);
  if(!userID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }

  // Check if the Account Already Exists
  let accountID = req.body.AccountID;
  let [ account, err_account ] = await database.getAccount(userID, accountID);
  if (err_account) return res.status(404).json({ error: `Failed to query the Account ${accountID} for Customer ${userID}`, message: err_account.message, data: {UserId: userID, AccountID: accountID}});
  // Parse Data
  account = account[0];
  if (!account) return res.status(404).json({error: `An Account with the AccountID ${accountID} does not exist`});


  // Deactivate the Account
  let [ accountData, err_accountData ] = await database.updateAccountActivated(accountID, false);
  if (err_accountData) return res.status(402).json({ error: `Invalid request`, message: err_accountData.message});

  // TODO: Flag the Teller for the request to deactivate the Account
  let [ notificationData, err_notificationData ] = await database.insertNotification(userID, accountID, null, "Deactivate Account", `User ${userID} requests to deactivate Account ${accountID}`);
  if (err_notificationData) return res.status(402).json({ error: `Failed to insert an Account Deactivation Notification`, message: err_notificationData.message});

  return res.status(200).json({ message: "Account Deletion Request Submitted Successfully", data: accountData});
});

// ------------------------ Teller -----------------------------------

// GET: Get Teller Information (Login Required)
// Params: None
// Return: Teller:{ Role, Email, Password, FirstName, LastName, PhoneNumber}
app.get('/teller', async (req, res) => {
  let userID = req.session.UserID
  console.log(`Getting Teller ${userID}'s Information`);
  if(!userID) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let [ userData, err_userData ] = await database.getUserShorthand(userID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  userData = userData[0];
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: None
// Return: List of Tellers
app.get('/teller/customers', async (req, res) => {
  let tellerID = req.session.UserID;
  let tellerRole = req.session.UserRole;
  if(!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller"});

  console.log(`Getting All Customer Information`);

  // Query User Information
  let [ userData, err_userData ] = await database.getCustomers(userID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Teller Information (Login Required)
// Params: {UserID} (CustomerID)
// Return: Customer:{ UserID, Email, Password, FirstName, LastName, Street, Street2, City, State, ZIP, PhoneNumber, SSN, DOB } ***
app.get('/teller/customer', async (req, res) => {
  let tellerID = req.session.UserID;
  let tellerRole = req.session.UserRole;
  if(!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller"});

  let customerID = req.body.UserID;
  console.log(`Getting Customer ${customerID}'s Information`);
  // Query User Information
  let [ userData, err_userData ] = await database.getCustomer(customerID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Customer ${customerID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Customer Accounts (Login Required)
// Params: UserID (CustomerID)
// Return: List of Tellers
app.get('/teller/customer/accounts', async (req, res) => {
  let tellerID = req.session.UserID;
  let tellerRole = req.session.UserRole;
  console.log(`Getting Teller ${tellerID}'s Information`);

  if(!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller"});
  
  let customerID = req.body.UserID;

  // Query Customer Accounts
  let [ userData, err_userData ] = await database.getAllUserAccounts(customerID);
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${customerID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// POST: Activate Customer Accounts (Login Required)
// Params: UserID (CustomerID), AccountID
// Return: Confirmation Message
app.get('/teller/customer/account/activate', async (req, res) => {
  let tellerID = req.session.UserID;
  let tellerRole = req.session.UserRole;
  console.log(`Getting Teller ${tellerID}'s Information`);

  if(!tellerID || tellerRole != "Teller") return res.status(401).json({ error: "User Is Not Logged In As Teller"});
  
  let customerID = req.body.UserID;
  let accountID = req.body.AccountID;

  // Query Customer Accounts
  let [ activationData, err_activationData ] = await database.updateAccountActivated(accountID, true);
  if(err_activationData) return res.status(404).json({ error: "Failed to query Teller information", message: err_activationData.message});
  if (!activationData) return res.status(404).json({error: `Confirmation Data Not Queried for Account Activation`, data: activationData});

  return res.status(200).json({ message: `Customer ${customerID}'s Account ${accountID} Activated Successfully`, data: activationData});
});




// GET: Get Teller Notifications (Login Required)
// Params: None
// Return: Confirmation Message
app.get('/teller/notifications', async (req, res) => {
  let userID = req.session.UserID
  let userRole = req.session.UserRole
  console.log(`Getting All Notification`);
  if(!userID) return res.status(401).json({ error: "User Is Not Logged In"});
  if(!userRole) return res.status(401).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole});

  // Query User Information
  let [ userData, err_userData ] = await database.getNotifications();
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});

// GET: Get Teller Notifications (Login Required)
// Params: None
// Return: Confirmation Message
app.get('/teller/notifications/all', async (req, res) => {
  let userID = req.session.UserID
  let userRole = req.session.UserRole
  console.log(`Getting All Notification`);
  if(!userID) return res.status(401).json({ error: "User Is Not Logged In"});
  if(!userRole) return res.status(401).json({ error: "Invalid Access Detected: User is not logged in as Teller", data: userRole});

  // Query User Information
  let [ userData, err_userData ] = await database.getNotificationsAll();
  if(err_userData) return res.status(404).json({ error: "Failed to query Teller information", message: err_userData.message});
  if (!userData) return res.status(404).json({error: `Teller ${userID} IS Not Found`, message: err_userData});

  return res.status(200).json(userData);
});


// ------------------------ Admininstrator -------------------------------
// GET: Get a List of Tellers
// Params: None
// Return: List of Tellers
app.get('/admin/tellers', async (req, res) => {
  if(!req.session.UserID) {
    return res.status(401).json({ error: "User Not Logged In"});
  }
  if(req.session.UserID != ADMIN_ID) {
    return res.status(403).json({ error: "Unauthorized User Access. Admin Access Required"});
  }

  console.log("Getting a Tellers List");
  let [ tellerList, err_tellerList ] = await database.getTellers();
  if (err_tellerList) {
    return res.status(404).json({ error: "Failed to query Tellers List", message: err_tellerList.message});
  }
  return res.status(200).json(tellerList);
});

// PUT: Register a new Teller
// Params: Teller
// Return: Confirmation Message
app.put('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let teller = req.body;

  // Check if the email already exists in the database
  let [ name, err_name ] = await database.getUserNameFromEmail(teller.Email);
  if(err_name) {
    return res.status(401).json({ error: 'Failed to query User name', message: err_name.message});
  }
  name = name[0];
  if (name) {
    return res.status(401).json({ error: `The email is already in use by ${name.FirstName} ${name.LastName}`});
  }
  
  let [ tellerData,  err_tellerData ] = await database.insertTeller(teller);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to create this teller", message: err_tellerData});
  }
  return res.status(200).json({message:"Successfully Created a new Teller Account", data: tellerData});
});

// POST: Update a Teller's Information
// Params: Teller{}
// Return: Confirmation Message
app.post('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID) {
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
// Return: Confirmation Message
app.delete('/admin/tellers/teller', async (req, res) => {
  if(!req.session.UserID || req.session.UserID != ADMIN_ID) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Deleting a Teller");
  let tellerID = req.body.UserID;
  let [ tellerData,  err_tellerData ] = await database.deleteTeller(tellerID);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to delete this teller", message: err_tellerData});
  }
  return res.status(200).json({message:"Successfully Deleted the Teller Information", data: tellerData});
});



// ------------------------------------------------------

// GET: Get Teller Notification (Login Required)
// Params: None
// Return: Confirmation Message
app.get('/teller/notifications', async (req, res) => {
  if(!req.session.UserID) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Getting Teller Notifications");
  let tellerID = req.session.UserID;
  let [ tellerData,  err_tellerData ] = await database.getNotifications(tellerID);
  if (err_tellerData) {
    return res.status(401).json({ error: "Failed to get teller notifications", message: err_tellerData});
  }
  return res.status(200).json(tellerData);
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



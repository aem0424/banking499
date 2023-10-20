const express = require('express');
const session = require('express-session');
const cors = require('cors');
const database = require('./database.js');
const encryption = require('./encryption.js');

const app = express();
const PORT = 4000;

const adminID = 0;

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
// Get User Information
app.get('/user', async (req, res) => {
  console.log(`Getting User ${req.session.userID}'s Information`);
  if(!req.session.userID && !debugging) {
    return res.status(401).json({ error: "User Is Not Logged In"});
  }

  // Query User Information
  let userInfo = await database.getUserInformation(req.session.userID);

  if(!userInfo) {
    return res.status(404).json({ error: `User ${req.session.userID} Not Found`});
  }
  else {
    return res.status(200).json(userInfo);
  }
});

// Log in
// params: JSON{ "email": "<email>", "password": "<password>"}
// returns JSON{ "UserID":"<userID>"}
app.post('/user/login', async (req, res) => {
  // Check parameters
  let email = req.body.email;
  let password = req.body.password;

  if(!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password"});
  }

  // Query UserID
  let queriedUserID = await database.getUserID(email, password);
  let userID = queriedUserID[0].UserID.toString();
  
  
  // Set authentication
  if (!userID) {
    return res.status(404).json({ error: "No UserID found for the email and password"})
  }
  else if(req.session.userID == userID) {
    return res.status(200).json({message: `The User ${userID} was already logged in`})
  }
  else {
    req.session.userID = userID;
    return res.status(200).json({message: `Login successful as UserID: ${userID}`});
  }
});

// Log out
app.post('/user/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed'});
    } else {
      return res.status(200).json({ message: 'Logout successful'});
    }
  });
});

// Register a Customer
// params: user:{'Role: <role>,FirstName: <firstName>, LastName: <lastName>, Address: <address>, PhoneNumber: <phoneNumber>, SSN: <ssn>, DOB: <dob>'}
// return: { message: <message> }
app.post('/user/register', async (req, res) => {
  let user = req.body;

  // Check the user body
  if(!user) {
    return res.status(401).json({ error: "Empty json passed in body" });
  }

  // Insert user information
  let {userID, error} = await database.insertCustomer(user.email, user.password);

  if (error) {
    return res.status(401).json({ error: "Database Insertion Failed", message: error.message});
  }
  else if (userID) {
    return res.status(401).json({ error: "The email is already in use"});
  }
  else {
    res.status(200).json({message: `Registration successful as UserID: ${userID}`});
  }
});





// ------------------ Account -----------------------

// Get Customer Accounts

app.get('/customer/accounts', async (req, res) => {
  console.log(`Getting Bank Accounts List for User ${req.session.userID}`);
  if(!req.session.userID && !debugging) {
    return res.status(401).json({ error: "User Not Logged In"});
  }
  let accountList = await database.getAccountsList(req.session.userID);
  if(!accountList) {
    return res.status(404).json({ error: `User`})
  }
  res.status(200).json(accountList);
});

// Get Customer Account Information
app.get('/customer/accounts/account', async (req, res) => {
  if(!req.session.userID && !debugging) {
    return res.status(401).json({ error: "User Not Logged In"});
  }
  let accountID = req.body.accountID;
  console.log(`Getting Account ${accountID} Information for User ${req.session.userID}`);
  let accountInfo = await database.getAccountInformation(req.session.userID, accountID);
  if (!accountInfo) {
    return res.status(402).json({ error: `Invalid accountID for User ${req.session.userID}`})
  }
  res.status(200).json(accountInfo);
});

// ------------------------ Admininstrator -------------------------------
// Get Teller List
app.get('/admin/tellers', async (req, res) => {
  if(!req.session.userID && !debugging) {
    return res.status(401).json({ error: "User Not Logged In"});
  }
  if(req.session.userID != adminID) {
    return res.status(403).json({ error: "Unauthorized User Access. Admin Access Required"});
  }
  console.log("Getting a Tellers List");
  let tellersList = await database.getTellersList();
  res.status(200).json(tellersList);
});

// Add a Teller
app.put('/admin/tellers/teller', async (req, res) => {
  if(!req.session.userID || req.session.userID != adminID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let tellerInfo = req.body;
  let response = await database.addTeller(tellerInfo.email, tellerInfo.password, tellerInfo.firstName, tellerInfo.lastName);
  res.status(200).json(response);
});

// Update a Teller's Information
app.post('/admin/tellers/teller', async (req, res) => {
  if(!req.session.userID || req.session.userID != adminID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let tellerInfo = req.body;
  let response = await database.updateTeller(tellerInfo.email, tellerInfo.password, tellerInfo.firstName, tellerInfo.lastName);
  res.status(200).json(response);
});

// Delete a Teller
app.delete('/admin/tellers/teller', async (req, res) => {
  if(!req.session.userID || req.session.userID != adminID && !debugging) {
    return res.status(403).json({ error: "Unauthorized User Access"});
  }
  console.log("Adding a new Teller");
  let tellerInfo = req.body;
  let response = await database.updateTeller(tellerInfo.email, tellerInfo.password, tellerInfo.firstName, tellerInfo.lastName);
  res.status(200).json(response);
});

// ------------------------------------------------------




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



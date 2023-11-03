const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./database.js');
const encryption = require('../encryption.js');
const customerRoute = require('./customer.js');
const tellerRoute = require('./teller.js');
const adminRoute = require('./admin.js');

const app = express();
const PORT = 4000;



// ----------------------- Middleware ---------------------------
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// Authentication
let sessionMiddleware = session({
  secret: 'group2', // secret key
  resave: true,
  saveUninitialized: true,
})
app.use(sessionMiddleware);

app.use(customerRoute, sessionMiddleware);
app.use(tellerRoute, sessionMiddleware);
app.use(adminRoute, sessionMiddleware);

app.get('/', (req, res) => {
  res.send('Home Route');
});

// -------------------- User ----------------------------
// GET: Get User's Information
// Params: UserID
// Return: User{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, Street2, City, State, ZIP }
app.get('/user', async (req, res) => {
  let userID = req.body.UserID
  console.log(`Getting User ${req.body.UserID}'s Information`);

  // Query User Information
  let [userData, err_userData] = await database.getUser(userID);
  if (err_userData) {
    return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message });
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
    return res.status(401).json({ error: `${role} is not a valid User Role. It must be Customer, Teller, or Administrator` });

  // Query User Information
  let [userData, err_userData] = await database.getUsers(role);
  if (err_userData) {
    return res.status(404).json({ error: `Failed to Query Users Based on their Role ${role}`, message: err_userData.message });
  }

  return res.status(200).json(userData);
});

// GET: Get User All Customers
// Params: None
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users/customer', async (req, res) => {
  console.log(`Getting All Customers`);

  // Query User Information
  let [userData, err_userData] = await database.getUsers("Customer");
  if (err_userData) return res.status(404).json({ error: `Failed to Query Customers`, message: err_userData.message });
  return res.status(200).json(userData);
});

// GET: Get User All Tellers
// Params: None
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users/teller', async (req, res) => {
  console.log(`Getting All Tellers`);

  // Query User Information
  let [userData, err_userData] = await database.getUsers("Teller");
  if (err_userData) return res.status(404).json({ error: `Failed to Query Tellers`, message: err_userData.message });
  return res.status(200).json(userData);
});

// GET: Get User All Users Based on their Role (Login Required)
// Params: None 
// Return: User{ Role }
app.get('/user/role', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting User ${req.session.UserID}'s Role`);
  if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });

  // Query User Information
  let [userData, err_userData] = await database.getUserRole(userID);
  if (err_userData) return res.status(404).json({ error: `Failed to Query User ${userID}'s Role`, message: err_userData.message });

  let role = userData[0];

  if (!role) return res.status(404).json({ error: `User ${userID}'s Role Not Found` })

  return res.status(200).json(role);
});

// GET: Get a User's Address Information (Login Required)
// Params: None 
// Return: User{ Street, City, State, ZIP }
app.get('/user/address', async (req, res) => {
  let userID = req.session.UserID;
  console.log(`Getting User ${req.session.UserID}'s Role`);
  if (!userID) {
    return res.status(401).json({ error: "User Is Not Logged In" });
  }

  // Query User Information
  let [userData, err_userData] = await database.getUserAddress(userID);
  if (err_userData) {
    return res.status(404).json({ error: `Failed to Query User ${userID}'s Address`, message: err_userData.message });
  }
  let role = userData[0];
  if (!role)
    return res.status(404).json({ error: `User ${userID}'s Address Not Found` })

  return res.status(200).json(role);
});


// POST: Log in
// Params: body.{ "email": "<email>", "password": "<password>"}
// Return: Confirmation Message
app.post('/user/login', async (req, res) => {
  // Check parameters
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password" });
  }

  // Query UserID
  let [userData, err_userData] = await database.getUserIDFromLogin(email, password);
  if (err_userData) {
    return res.status(401).json({ error: "Failed to query UserID and Role", message: err_userData.message });
  }
  // Parse UserID
  userID = userData[0]?.UserID;
  userRole = userData[0]?.Role;

  // Verify Data
  if (!userID && userID != 0) {
    return res.status(404).json({ error: "No UserID found for the email and password" });
  }
  else if (req.session.UserID == userID) {
    return res.status(200).json({ message: `The User ${userID} was already logged in` });
  }

  // Set a new Session
  req.session.UserID = userID;
  req.session.UserRole = userRole;
  req.session.UserEmail = email;
  return res.status(200).json({ message: `Login successful as UserID: ${userID}    Role: ${userRole}` });
});

// POST: Log Out
// Params: None
// Return: Confirmation Message
app.post('/user/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    } else {
      return res.status(200).json({ message: 'Logout successful' });
    }
  });
});




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



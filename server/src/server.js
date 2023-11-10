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

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware setup
let sessionMiddleware = session({
  secret: 'group2', // secret key
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

// Route setup
app.use(customerRoute, sessionMiddleware);
app.use(tellerRoute, sessionMiddleware);
app.use(adminRoute, sessionMiddleware);

app.get('/', (req, res) => {
  res.send('Home Route');
});






// -------------------- User ----------------------------
// GET: Get User's Information (Login Require)
// Params: UserID
// Return: User{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, Street2, City, State, ZIP }
app.get('/user', async (req, res) => {
  let userID = req.session.user?.UserID;

  if (!userID) return res.status(401).json({ error: "User Not Logged In", message: `${userID}` });
  console.log(`Getting User ${userID}'s Information`);

  // Query User Information
  let [userData, err_userData] = await database.getUser(userID);
  if (err_userData) return res.status(404).json({ error: `Failed to query User with UserID ${userID}`, message: err_userData.message });

  userData = userData[0];
  if (!userData) return res.status(404).json({ error: `User ${userID} Not Found`, message: err_userData.message });


  return res.status(200).json(userData);
});


// GET: Get Current User's UserID (Login Required)
// Params: None 
// Return: String (UserID)
app.get('/user/userID', async (req, res) => {
  console.log(`Getting Current User's UserID`);

  let userID = req.session.user?.UserID;;
  if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });

  return res.status(200).json(userID);
});

// GET: Get Current User's Role (Login Required)
// Params: None 
// Return: String (Role)
app.get('/user/role', async (req, res) => {
  console.log(`Getting Current User's Role`);

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });
  console.log(userRole);
  return res.status(200).json(userRole);
});

// GET: Get Current User's Email (Login Required)
// Params: None 
// Return: String (Email)
app.get('/user/email', async (req, res) => {
  console.log(`Getting Current User's Email`);

  let userID = req.session.user?.UserID;
  let email = req.session.user?.Email;
  if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });

  return res.status(200).json(email);
});

// GET: Get the Current User's Address Information
// Params: { UserID }
// Return: User{ Street, Street2, City, State, ZIP }
app.get('/user/address', async (req, res) => {

  let userID = req.body.UserID
  // Query User Information
  let [userData, err_userData] = await database.getUserAddress(userID);
  if (err_userData) {
    return res.status(500).json({ error: `Failed to Query User ${userID}'s Address`, message: err_userData.message });
  }
  let role = userData[0];
  if (!role)
    return res.status(404).json({ error: `User ${userID}'s Address Not Found` })

  return res.status(200).json(role);
});

// PUT: Register a User
// Params: { Role*, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }
// Return: Confirmation Message
app.put('/user/create', async (req, res) => {
  console.log("Registering a New User");
  let user = req.body;

  // Check if the Role is set correctly
  const allowedRoles = ['Customer', 'Teller', 'Administrator'];
  if (!user.role || !allowedRoles.includes(user.role)) {
    return res.status(400).json({ error: `${user.role} is not a valid User Role. It must be Customer, Teller, or Administrator` });
  }
  
  // Query User Information
  let [userData, err_userData] = await database.insertUser(user);
  if (err_userData) return res.status(500).json({ error: `Failed to Add the User Based on their Role ${user.role}`, message: err_userData.message });

  userData = userData[0];
  return res.status(200).json({ message: `User ${userData} Regiestered Successfully`, data: userData});
});

// POST: Log in
// Params: body.{ "Email": "<email>", "Password": "<password>"}
// Return: Confirmation Message
app.post('/user/login', async (req, res) => {
  // Check parameters
  let email = req.body.Email;
  let password = req.body.Password;

  if (!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password" });
  }

  // Query UserID
  let [userData, err_userData] = await database.getUserIDFromLogin(email, password);
  if (err_userData) {
    return res.status(401).json({ error: "Failed to get User Login Information", message: err_userData.message });
  }
  // Parse UserID
  userID = userData[0]?.UserID;
  userRole = userData[0]?.Role;

  // Verify Data
  if (!userID) {
    return res.status(404).json({ error: "No UserID found for the email and password" });
  }

  // Set a new Session
  req.session.user = {
    UserID: userID,
    Role: userRole,
    Email: email,
    Token: 'Token',
  };

  console.log(req.session.user);
  return res.status(200).json({ message: `Login successful as UserID: ${userID}    Role: ${userRole}`, token: req.session.user?.Token });
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

// GET: Get the Current User's Password (Login Required)
// Params: None
// Return: String (Password)
app.get('/user/password', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userEmail = req.session.user?.Email;
  console.log(`Getting User ${userID}'s Role`);
  if (!userID) return res.status(401).json({ error: "User Is Not Logged In" });

  // Query User Information
  let [userPassword, err_userPassword] = await database.getUserPassword(userEmail);
  if (err_userPassword) return res.status(500).json({ error: `Failed to Query User ${userID}'s Address`, message: err_userData.message });


  let password = userPassword[0];
  return res.status(200).json(password);
});

// POST: Forgot Password
// Params: body.{ Email, Question1, Question2, Answer1, Answer2 }
// Return: Confirmation Message
app.post('/user/password/reset', async (req, res) => {
  // Check parameters
  let body = req.body

  if (!body.Email || !body.Question1 || !body.Question2 || !body.Answer1 || !body.Answer2)
    return res.status(403).json({ error: "Empty values passed in for answers or question", param: body });

  // Query User Security Questions and Answers
  let [userQA, err_userQA] = await database.getUserQuestionsAnswers(body.Email);
  if (err_userQA) return res.status(500).json({ error: "Failed to query UserID and Role", message: err_userQA.message, param: body });
  userQA = userQA[0];
  if (!userQA) return res.status(404).json({ error: `Security Questions/Answers Not Found For User Email ${body.Email}`, userQA: userQA })

  // Verify Questions
  if ((body.Question1 != userQA.Question1 || body.Question1 != userQA.Question2) &&
      (body.Question2 != userQA.Question1 || body.Question2 != userQA.Question2)) {
    return res.status(400).json({ error: 'Unmatching Security Questions', type: 'Question', message: 'The selected user questions do not match', param: body, userQA: userQA});
  }
  // Verify Answers
  if ((body.Answer1 != userQA.Answer1 || body.Answer1 != userQA.Answer2) &&
      (body.Answer2 != userQA.Answer1 || body.Answer2 != userQA.Answer1)) {
    return res.status(400).json({ error: 'Unmatching Security Answers', type: 'Answer', message: 'The entered user answers do not match', param: body, userQA: userQA});
  }

  // Reset Password
  let [userData, err_userData] = await database.updateCustomerPassword(email, password);
  if (err_userData) return res.status(500).json({ error: "Failed to query UserID and Role", message: err_userData.message, param: body, userQA: userQA });
  
  userData = userData[0];
  return res.status(200).json({ message: "Password Reset Successful", data: userData});
});



// GET: Get User All Users Based on their Role
// Params: { Role }  <= [Customer | Teller | Administrator]
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users', async (req, res) => {
  let role = req.body.Role
  console.log(`Getting All ${role}s`);
  const allowedRoles = ['Customer', 'Teller', 'Administrator'];
  if (!allowedRoles.includes(role)) {
    return res.status(401).json({ error: `${role} is not a valid User Role. It must be Customer, Teller, or Administrator` });
  }
  
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
  if (err_userData) return res.status(500).json({ error: `Failed to Query Tellers`, message: err_userData.message });
  return res.status(200).json(userData);
});

// GET: Search Users by their names
// Params: { NameText } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
app.get('/users/search', async (req, res) => {
  console.log("Searching for User");

  let userText = req.body.NameText

  let [userData, err_userData] = await database.searchUsers(userText);

  if (err_userData) return res.status(500).json({ error: `Failed to search a User based on the name text ${userText}`, message: err_userData });

  return res.status(200).json(userData);
});

// GET: Search Users in the selected Role by their names 
// Params: { Role, NameText } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
app.get('/users/search/role', async (req, res) => {
  console.log("Searching for User");

  let userRole = req.body.Role;
  let userText = req.body.NameText;

  let [userData, err_userData] = await database.searchUsersWithRole(userText, userRole);

  if (err_userData) return res.status(500).json({ error: `Failed to search this ${userRole}`, message: err_userData });

  return res.status(200).json(userData);
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
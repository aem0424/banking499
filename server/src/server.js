const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cron = require('node-cron');
require('dotenv').config(); // Load environment variables from .env file



const database = require('./database.js');
const customerRoute = require('./customer.js');
const tellerRoute = require('./teller.js');
const adminRoute = require('./admin.js');
const transactionRoute = require('./transaction.js');
const financialProcessorRoute = require('./financialProcessor.js');
const taxFormRoute = require('./taxForm.js');

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
app.use(taxFormRoute, sessionMiddleware);
app.use(transactionRoute.router, sessionMiddleware); // Exporting function + api endpoints, .router was a fix / why its different ~RM
app.use(financialProcessorRoute.router, sessionMiddleware);


// Automated Interest Geneartion -- Based in UTC time ('Minute Hour Day')
cron.schedule('0 6 28 * *', () => {
  financialProcessorRoute.generateInterest();
  console.log('Automated Interest Generation');
});

// Automated Credit Card Servicing -- Based in UTC ('Minute)

// Automated Interest Geneartion -- Based in UTC time ('Hour Day')
cron.schedule('0 6 * * *', () => {
  financialProcessorRoute.serviceCreditCard();
  console.log('Automated Credit Card Servicing');
});

app.get('/', (req, res) => {
  res.send('Home Route');
});




// -------------------- User ----------------------------
// GET: Get User's Information (Login Require)
// Params: None
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

// GET: Get the Current User's Address Information (Login Required)
// Params: None 
// Return: User{ Street, Street2, City, State, ZIP }
app.get('/user/address', async (req, res) => {

  let userID = req.session.user?.UserID;
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

  console.log(`User Logging in with Email: ${email}, Password: ${password}`)

  if (!email || !password) {
    return res.status(401).json({ error: "Empty values passed in for email or password" });
  }

  // Query UserID
  let [userData, err_userData] = await database.getUserPassword(email);
  if (err_userData) {
    return res.status(500).json({ error: "Failed to get User Login Information", message: err_userData.message });
  }
  userData = userData[0];

  // Verify Hashed Password
  // Remove Pepper
  let pepper = process.env.PASSWORD_PEPPER;
  userData.Password = userData.Password.slice(0, -pepper.length);

  if (!await bcrypt.compare(password, userData.Password)) {
    return res.status(400).json({ error: "Incorrect Password", message: "Incorrect Password was entered.", data: req.body, password: userData.Password});
  }

  // Parse UserID
  userID = userData.UserID;
  userRole = userData.Role;

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

// GET: Get the User's Security Questions and Answers
// Params: { Email, Email2 }
// Return: String (Password)
app.get('/user/qa', async (req, res) => {
  // Check parameters
  let email = req.query.Email;
  let email2 = req.query.Email2;

  if (!email || !email2) return res.status(400).json({ error: "Empty values passed in for answers or question", param: req.body });

  if (email != email2) return res.status(400).json({ error: "The Email and Confirmation Email do not match", param: req.body1})

  // Query User Security Questions and Answers
  let [userQA, err_userQA] = await database.getUserQuestionsAnswers(email);
  if (err_userQA) return res.status(500).json({ error: "Failed to query UserID and Role", message: err_userQA.message, param: req.body });

  userQA = userQA[0];
  if (!userQA) return res.status(404).json({ error: `Security Questions/Answers Not Found For User Email ${email}`, Questions: userQA })
  return res.status(200).json( userQA );
});

// POST: Reset Password
// Params: { Email, Answer1, Answer2, Password }
// Return: Confirmation Message
app.post('/user/password/reset', async (req, res) => {
  // Check parameters
  let body = req.body

  if (!body.Email || !body.Answer1 || !body.Answer2)
    return res.status(403).json({ error: "Empty values passed in for email or answers", param: body });

  // Query User Security Questions and Answers
  let [userQA, err_userQA] = await database.getUserQuestionsAnswers(body.Email);
  if (err_userQA) return res.status(500).json({ error: "Failed to query UserID and Role", message: err_userQA.message, param: body });
  userQA = userQA[0];
  if (!userQA) return res.status(404).json({ error: `Security Questions/Answers Not Found For User Email ${body.Email}`, userQA: userQA })

  // Verify Answers
  if ((body.Question2 == userQA.Question1 && body.Answer2 != userQA.Answer1) ||
      (body.Question2 == userQA.Question2 && body.Answer2 != userQA.Answer2)) {
    return res.status(400).json({ error: 'Unmatching Security Question 2', type: 'Question2', message: 'The selected Question2 does not have a matching answer', param: body, userQA: userQA});
  }

  // Reset Password
    try {
      body.PasswordOriginal = body.Password;
        let salt = await bcrypt.genSalt(10);
        let peper = process.env.PASSWORD_PEPPER;

        let hashedPassword = await bcrypt.hash(body.Password, salt) + peper;
        body.Password = hashedPassword;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to encrypt password" });
    }

  let [userData, err_userData] = await database.updateCustomerPassword(body);
  if (err_userData) return res.status(500).json({ error: "Failed to query UserID and Role", message: err_userData.message, param: body, userQA: userQA });
  
  userData = userData[0];
  return res.status(200).json({ message: "Password Reset Successful", data: userData});
});



// GET: Get User All Users Based on their Role
// Params: { Role }  <= [Customer | Teller | Administrator]
// Return: [User1{ UserID, Role, Email, Password, FirstName, LastName, Phone Number, SSN, DOB, Street, City, State, ZIP }, User2{...}, ...]
app.get('/users', async (req, res) => {
  let role = req.query.Role;
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
// Params: { Name } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
app.get('/users/search', async (req, res) => {
  console.log("Searching for User");

  let userText = req.query.Name

  let [userData, err_userData] = await database.searchUsers(userText);

  if (err_userData) return res.status(500).json({ error: `Failed to search a User based on the name text ${userText}`, message: err_userData });

  return res.status(200).json(userData);
});

// GET: Search Users in the selected Role by their names 
// Params: { Role, Name } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
app.get('/users/search/role', async (req, res) => {
  console.log("Searching for User");

  let userRole = req.query.Role;
  let userText = req.query.Name;

  let [userData, err_userData] = await database.searchUsersWithRole(userText, userRole);

  if (err_userData) return res.status(500).json({ error: `Failed to search this ${userRole}`, message: err_userData });

  return res.status(200).json(userData);
});


// API Call used to encrypt passwords (No longer needed)
// app.post('/users/password/encrypt', async (req, res)=> {
//   console.log("Encrypting All User Passwords");

//   // Get all original passwords
//   let [users, err_users] = await database.getAllUsers();
//   if(err_users) return res.status(500).json({ error: 'Failed to get all user info'});
  
//   // Encrypt Passwords
//   let passwords = [];
//   let salt = await bcrypt.genSalt(10);
//   let pepper = process.env.PASSWORD_PEPPER;
//   for (const user of users) {
//     let hashedPassword = await bcrypt.hash(user.Password, salt);

//     let password = {UserID: user.UserID, PasswordOriginal: user.Password, Password: hashedPassword + pepper};

//     passwords.push(password);
//     let [encryptionData, err_encryptionData] = await database.encryptPassword(password);
//     if(err_encryptionData) return res.status(500).json({ error: 'Failed to encrypt all user passwords', message: err_encryptionData, data: password});
//     console.log(encryptionData);
//   }

//   // console.log(passwords);

//   return res.status(200).json({message:"Encryption Successful", data: encryptionData});
// });

app.get('/pepper', async (req, res) => {
  let pepper = process.env.PASSWORD_PEPPER;
  console.log(pepper);
  return res.status(200).json({pepper: pepper});
});

// app.post('/name/fill', async (req, res) => {
//   let [users, err_users] = await database.getAllUsers();
//     if(err_users) return res.status(500).json({ error: 'Failed to get all users', message: err_users, data: users});
//     console.log(users);
//   for(const user of users) {
//     let name = user.FirstName + " " + user.LastName;
//     let [nameData, err_nameData] = await database.updateUserFullName(user.UserID, name);
//     if(err_nameData) return res.status(500).json({ error: 'Failed to update user name', message: err_nameData, data: nameData});
//     console.log(nameData);
//   }
//   return res.status(200).json(users);
// })


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
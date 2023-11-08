const express = require('express');
const cors = require('cors');
const router = express.Router();
const database = require('./database.js');

// router.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// ------------------------ Admininstrator -------------------------------
// GET: Get a List of Tellers
// Params: None
// Return: List of Tellers
router.get('/admin/tellers', async (req, res) => {
  console.log("Getting a Tellers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

 
  let [tellerList, err_tellerList] = await database.getTellers();
  if (err_tellerList) return res.status(404).json({ error: "Failed to query Tellers List", message: err_tellerList.message });
  return res.status(200).json(tellerList);
});

// PUT: Register a new Teller (include {withCredentials:true})
// Params: Teller
// Return: Confirmation Message
router.put('/admin/teller/register', async (req, res) => {
  console.log("Adding a new Teller");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

  
  let teller = req.body;

  // Check if the email already exists in the database
  let [userData, err_userData] = await database.getUserFromEmail(teller.Email);
  if (err_userData) {
    return res.status(404).json({ error: 'Failed to query User name', message: err_userData.message });
  }
  userData = userData[0];
  if (userData) return res.status(403).json({ error: `The email is already in use by ${userData.FirstName} ${userData.LastName} ${userData.UserID}` });

  let [tellerData, err_tellerData] = await database.insertTeller(teller);
  if (err_tellerData) return res.status(500).json({ error: "Failed to create this teller", message: err_tellerData });

  return res.status(200).json({ message: "Successfully Created a new Teller Account", data: tellerData });
});

// POST: Update a Teller's Information (include {withCredentials:true})
// Params: User{ Email*, FirstName, LastName, SSN, PhoneNumber, DOB, Address, Address2, City, State, ZIP } (Must include Email)
// Return: Confirmation Message
router.post('/admin/teller/update', async (req, res) => {
  console.log("Updating the Teller Information");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

  let teller = req.body;

  console.log(teller);
  let [tellerData, err_tellerData] = await database.updateTeller(teller);
  if (err_tellerData) return res.status(500).json({ error: "Failed to update this teller", message: err_tellerData });

  return res.status(200).json({ message: "Successfully Updated the Teller Information", data: tellerData });
});

// DELETE: Delete a Teller (include {withCredentials:true})
// Params: UserID
// Return: Confirmation Message
router.delete('/admin/teller/delete', async (req, res) => {
  console.log("Deleting a Teller");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

  let tellerID = req.body.UserID;

  let [userData, err_userData] = await database.getTeller(tellerID);
  if (err_userData) return res.status(500).json({ error: `Failed to find Teller ${tellerID}`, message: err_userData });
  userData = userData[0];
  if (!userData) return res.status(404).json({ error: `Teller ${tellerID} Does Not Exist`, message: err_userData });

  let [tellerData, err_tellerData] = await database.deleteTeller(tellerID);
  if (err_tellerData) return res.status(401).json({ error: "Failed to delete this teller", message: err_tellerData });
  return res.status(200).json({ message: "Successfully Deleted the Teller Information", data: tellerData });
});

// GET: Search Customers
// Params: { Text String } (First Name and/or Last Name)
// Return: Users:[User1{...}, User2{...}, ...]
router.get('/admin/teller/search', async (req, res) => {
  console.log("Searching for User");

  if (!req.session.user?.UserID || req.session.user?.Role != "Administrator")
    return res.status(401).json({ error: "Unauthorized User Access" });
  let userText = req.body.Text

  let [userData, err_userData] = await database.searchTellers(userText);

  if (err_userData) return res.status(500).json({ error: "Failed to search this teller", message: err_userData });

  return res.status(200).json(userData);
});

// GET: Get a List of Customers
// Params: None
// Return: List of Customers
router.get('/admin/customers', async (req, res) => {
  console.log("Getting a Customers List");

  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

 
  let [customerList, err_customerList] = await database.getCustomers();
  if (err_customerList) {
    return res.status(404).json({ error: "Failed to query Customers List", message: err_customerList.message });
  }
  return res.status(200).json(customerList);
});

router.get('/admin/customer/accounts', async (req, res) => {
  let userID = req.session.user?.UserID;
  let userRole = req.session.user?.Role;
  if (!userID || userRole != "Administrator") return res.status(401).json({ error: "Unauthorized User Access" });

  let [userData, err_userData] = await database.getAllUserAccounts();
  if (err_userData) return res.status(404).json({ error: "Failed to query Admin information", message: err_userData.message });

  return res.status(200).json(userData);
});

//export this router to use in our index.js
module.exports = router;

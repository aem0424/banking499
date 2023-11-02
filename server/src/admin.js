const express = require('express');
const router = express.Router();
const database = require('./database.js');


const ADMIN_ID = 1;

// ------------------------ Admininstrator -------------------------------
// GET: Get a List of Tellers
// Params: None
// Return: List of Tellers
router.get('/admin/tellers', async (req, res) => {
    if (!req.session.UserID) {
      return res.status(401).json({ error: "User Not Logged In" });
    }
    if (req.session.UserID != ADMIN_ID) {
      return res.status(403).json({ error: "Unauthorized User Access. Admin Access Required" });
    }
  
    console.log("Getting a Tellers List");
    let [tellerList, err_tellerList] = await database.getTellers();
    if (err_tellerList) {
      return res.status(404).json({ error: "Failed to query Tellers List", message: err_tellerList.message });
    }
    return res.status(200).json(tellerList);
  });
  
  // PUT: Register a new Teller
  // Params: Teller
  // Return: Confirmation Message
  router.put('/admin/teller/register', async (req, res) => {
    if (!req.session.UserID || req.session.UserID != ADMIN_ID) {
      return res.status(403).json({ error: "Unauthorized User Access" });
    }
    console.log("Adding a new Teller");
    let teller = req.body;
  
    // Check if the email already exists in the database
    let [userData, err_userData] = await database.getUserFromEmail(teller.Email);
    if (err_userData) {
      return res.status(401).json({ error: 'Failed to query User name', message: err_userData.message });
    }
    userData = userData[0];
    if (userData)   return res.status(401).json({ error: `The email is already in use by ${userData.FirstName} ${userData.LastName} ${userData.UserID}` });
  
    let [tellerData, err_tellerData] = await database.insertTeller(teller);
    if (err_tellerData)    return res.status(401).json({ error: "Failed to create this teller", message: err_tellerData });

    return res.status(200).json({ message: "Successfully Created a new Teller Account", data: tellerData });
  });
  
  // POST: Update a Teller's Information
  // Params: Teller{}
  // Return: Confirmation Message
  router.post('/admin/teller/update', async (req, res) => {
    if (!req.session.UserID || req.session.UserID != ADMIN_ID) {
      return res.status(403).json({ error: "Unauthorized User Access" });
    }
    console.log("Adding a new Teller");
    let teller = req.body;
    let [tellerData, err_tellerData] = await database.updateTeller(teller);
    if (err_tellerData) {
      return res.status(401).json({ error: "Failed to update this teller", message: err_tellerData });
    }
    return res.status(200).json({ message: "Successfully Updated the Teller Information", data: tellerData });
  });
  
  // DELETE: Delete a Teller
  // Params: UserID
  // Return: Confirmation Message
  router.delete('/admin/teller/delete', async (req, res) => {
    if (!req.session.UserID || req.session.UserID != ADMIN_ID) {
      return res.status(403).json({ error: "Unauthorized User Access" });
    }
    console.log("Deleting a Teller");
    let tellerID = req.body.UserID;

    let [userData, err_userData] = await database.getTeller(tellerID);
    if (err_userData) return res.status(401).json({ error: "Failed to delete this teller", message: err_userData });
    if (!userData) return res.status(404).json({ error: `Teller ${tellerID} Does Not Exist`, message: err_userData });

    let [tellerData, err_tellerData] = await database.deleteTeller(tellerID);
    if (err_tellerData) return res.status(401).json({ error: "Failed to delete this teller", message: err_tellerData });
    return res.status(200).json({ message: "Successfully Deleted the Teller Information", data: tellerData });
  });

  // GET: Search Customers
  // Params: { Text String } (First Name and/or Last Name)
  // Return: Users:[User1{...}, User2{...}, ...]
  router.get('/admin/teller/search', async (req, res) => {
    if (!req.session.UserID || req.session.UserID != ADMIN_ID) {
      return res.status(403).json({ error: "Unauthorized User Access" });
    }
    let userText = req.body.Text

    console.log("Searching for User");
    let [userData, err_userData] = await database.searchTeller(userText);
    
    if (err_userData) return res.status(401).json({ error: "Failed to delete this teller", message: err_userData });
    
    return res.status(200).json(userData);
  });

//export this router to use in our index.js
module.exports = router;
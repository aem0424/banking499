const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file


// Create a single Supabase client for interacting with your database
const dbUrl = process.env.SUPABASE_PROJECT_URL; // Setting db URL
const dbKey = process.env.SUPABASE_PUBLIC_API_KEY; // Setting db API key
const supabase = createClient(dbUrl, dbKey);


const debugging = true;


async function getUserTable() {
    const { data, error } = await supabase
    .from('User')
    .select('*')
    if (error) {
        throw error;
    }

    // logActivity("User", "NULL", "GET UserID", "", true)
    return data;
}


// ---------------- User Table -------------
async function getUserNameFromEmail(email) {
    const { data, error } = await supabase
    .from('User')
    .select('FirstName, LastName')
    .eq('Email', email)
    if (error) {
        throw error;
    }

    // logActivity("User", "NULL", "GET UserID", "", true)
    return data[0];
}

// request for UserID
async function getUserID(email, password) {
    const { data, error } = await supabase
    .from('User')
    .select('UserID')
    .eq('Email', email)
    .eq('Password', password);

    if (error) {
        throw error;
    }

    // logActivity("User", "NULL", "GET UserID", "", true)
    return data[0].UserID;
}

// Get User Login
// Params: UserID
// Return: Email and Password
async function getUserLogin(userID) {
    const { data, error } = await supabase
    .from('User')
    .select('Email, Password')
    .eq('UserID', userID);

    if (error) {
        throw error;
    }

    // logActivity("User", "NULL", "GET UserID", "", true)
    return data[0];
}

// Get User Information
// Params: UserID
// Return: the user's personal information
async function getUserInformation(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('Role, FirstName, LastName, Address, PhoneNumber, SSN, DOB')
        .eq('Email', email);
        
    return { data, error };
}

// Get User Account Information
// Params: UserID
// Return: Account
async function getAccountInformation(userID) {
    let { data, error } = await supabase.from('Account').select('*').eq("UserID", userID);

    return { data, error };
}

async function insertCustomer(user) {
    const { data, error } = await supabase
    .from('User')
    .insert([{"Role": 'Customer', "Email": user.Email, "Password": user.Password,
    "FirstName": user.FirstName, "LastName": user.LastName, "PhoneNumber": user.PhoneNumber,
    "Street": user.Street, "City": user.City, "State": user.State, "ZIP": user.ZIP,
    "SSN": user.SSN, "DOB": user.DOB}])
    .select()
    
    console.log(data);
    return { data, error };
}


// --------------------------- Account Table -----------------------
// Get Accounts List
// Params: UserID
// Return: { AccountType: "Checking" | "Savings" | "Money Market" | "Home Mortgage Loan" | "Credit Card" } 
async function getAccountNames(userID) {
    let { data, error } = await supabase
    .from('Account')
    .select('AccountType, AccountName')
    .eq('UserID', userID);

    return { data, error };
}

// --------------------------------- Log -----------------------------------
async function addLog(userID, activityType, activityDetail) {
    const { data, error } = await supabase
        .from('Log')
        .insert([
        {
            UserID: userID,
            ActivityType: activityType,
            ActivityDetail: activityDetail,
            Timestamp: new Date().toISOString(), // Use 'created_at' for the timestamp
        },
    ]);
    
    if (error) {
      throw error;
    }
  
    return data;
  }

module.exports = {
    getUserTable,
    getUserID,
    getUserLogin,
    getUserInformation,
    getUserNameFromEmail,
    insertCustomer,
    getAccountInformation,
    getAccountNames,
    addLog
}
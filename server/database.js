const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file


// Create a single Supabase client for interacting with your database
const dbUrl = process.env.SUPABASE_PROJECT_URL; // Setting db URL
const dbKey = process.env.SUPABASE_PUBLIC_API_KEY; // Setting db API key
const supabase = createClient(dbUrl, dbKey);


// ---------------- Get ---------------------
// 
async function getData() {
    const { data, error } = await supabase.from('User').select('*');

    return { data, error };

};

async function getUserInformation(email) {
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

// Get Customer Account Types
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
    getData,
    getUserInformation,
    getAccountInformation,
    getAccountNames,
    addLog
}
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
    return data;
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
    return data;
}

// Get User Information
// Params: UserID
// Return: the user's personal information
async function getUserInformation(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('Role, FirstName, LastName, Address, PhoneNumber, SSN, DOB')
        .eq('UserID', userID);
    
    if (error) {
        throw error;
    }

    return data;
}

async function insertCustomer(user) {
    const { data, error } = await supabase
        .from('User')
        .insert([{Role: 'Customer', Email: user.email, Password: user.password,
                    FirstName: user.firstName, LastName: user.lastName, PhoneNumber: user.phoneNumber,
                    Street: user.street, City: user.city, State: user.state, ZIP: user.zip,
                    SSN: user.ssn, DOB: user.dob}])
        .select('UserID, Role, FirstName, LastName, Address, PhoneNumber, SSN, DOB')

    return { data, error };
}


// --------------------------- Account Table -----------------------
// Get Accounts List
// Params: UserID
// Return: list of all accounts the customer has 
async function getAccountsList(userID) {
    let { data, error } = await supabase
    .from('Account')
    .select('AccountType, AccountName')
    .eq('UserID', userID);

    if (error) {
        throw error;
    }

    return data;
}

// Get User Account Information
// Params: UserID, AccountID
// Return: the account's information
async function getAccountInformation(userID, accountID) {
    let { data, error } = await supabase
    .from('Account')
    .select('*')
    .eq('UserID', userID)
    .eq('AccountID', accountID);

    if (error) {
        throw error;
    }

    return data;
}



// -------------------------------- Administrator ----------------------------

// Get Tellers List
// params: None
// return: a list of tellers {Email, FirstName, LastName}
async function getTellersList() {
    const { data, error } = await supabase
    .from('User')
    .select('Email, FirstName, LastName')
    .eq('Role', 'Teller');

    if (error) {
        throw error;
    }

    return data;
}

// Get Teller Information
async function getTellerInformation(userID) {
    const { data, error } = await supabase
    .from('User')
    .select('Email, FirstName, LastName')
    .eq('UserID', userID);

    if (error) {
        throw error;
    }

    return data;
}

// Add a Teller
// params: email, password, firstName, lastName
// return: a list of tellers {Email, FirstName, LastName}
async function addTeller(email, password, firstName, lastName) {
    const { data, error } = await supabase
    .from('User')
    .insert([
        { 'Role': "Teller", 'Email': email, 'Password': password, 'FirstName': firstName, 'LastName': lastName
     }
    ])
    .select();
    
    if (error) {
        console.log(error);
        throw error;
    }
    
    return data;
}

async function updateTeller(email, password, firstName, lastName) {
    const { data, error } = await supabase
    .from('User')
    .update([
        { 'Role': "Teller", 'Email': email, 'Password': password, 'FirstName': firstName, 'LastName': lastName
     }
    ])
    .select();
    
    if (error) {
        console.log(error);
        throw error;
    }
    
    return data;
}

async function deleteUser(userID) {
    const { data, error } = await supabase
    .from('User')
    .delete()
    .eq('UserID', userID);
    
    if (error) {
        console.log(error);
        throw error;
    }
    
    return data;
}


// --------------------------------- Log -----------------------------------
async function logActivity(refTable, refID, activityType, activityDetail, successful) {
    if (debugging) {
        return
    }

    const { data, error } = await supabase
        .from('Log')
        .insert([
        {
            "ReferenceTable": refTable,
            "ReferenceID": refID,
            "ActivityType": activityType,
            "ActivityDetail": activityDetail,
            "Timestamp": new Date().toISOString(), // Use 'created_at' for the timestamp
            "IsSuccessful": successful
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
    deleteUser,
    insertCustomer,
    getAccountsList,
    getAccountInformation,
    getTellersList,
    addTeller,
    updateTeller,
    logActivity
}
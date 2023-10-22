const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file


// Create a single Supabase client for interacting with your database
const dbUrl = process.env.SUPABASE_PROJECT_URL; // Setting db URL
const dbKey = process.env.SUPABASE_PUBLIC_API_KEY; // Setting db API key
const supabase = createClient(dbUrl, dbKey);


const debugging = true;


// ---------------- User Table -------------
// Get User Information
// Params: UserID
// Return: Entire User row data
async function getUser(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('UserID', userID);
        
    return [ data, error ];
}

// Get User Name From Email
// Params: Email
// Return: User's First Name and Last Name
async function getUserNameFromEmail(email) {
    const { data, error } = await supabase
    .from('User')
    .select('FirstName, LastName')
    .eq('Email', email);

    return [ data, error ];
}

// Get UserID From Login
// Params: Email, Password
// Return: User's UserID
async function getUserIDFromLogin(email, password) {
    const { data, error } = await supabase
    .from('User')
    .select('UserID')
    .eq('Email', email)
    .eq('Password', password);
    return [ data, error ];
}

// Get User Login From UserID
// Params: UserID
// Return: Email and Password
async function getUserLoginFromUserID(userID) {
    const { data, error } = await supabase
    .from('User')
    .select('Email, Password')
    .eq('UserID', userID);

    return [ data, error ];
}

// Get Customers
// Params: None
// Return: All Customers
async function getCustomers() {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Customer");
        
    return [ data, error ];
}

// Get Customer
// Params: UserID
// Return: Entire Customer row data
async function getCustomer(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Customer")
        .eq('UserID', userID);
        
    return [ data, error ];
}
 
// Get Customer
// Params: UserID
// Return: Entire Customer row data
async function searchCustomerUsingNames(firstName, lastName) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Customer")
        .textSearch('F')
        
    return [ data, error ];
}

// Get Tellers
// Params: None
// Return: All Tellers
async function getTellers() {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Teller");
        
    return [ data, error ];
}

// Get Teller
// Params: UserID
// Return: Entire Teller row data
async function getTeller(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Teller")
        .eq('UserID', userID);
        
    return [ data, error ];
}

// Insert Customer
// Params: User{Email, Password, FirstName, LastName, PhoneNumber, Street, City, State, ZIP, SSN, DOB}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber, Street, City, State, ZIP, SSN, DOB} (Confirmation)
async function insertCustomer(customer) {
    const { data, error } = await supabase
    .from('User')
    .insert([{"Role": 'Customer', "Email": customer.Email, "Password": customer.Password,
                "FirstName": customer.FirstName, "LastName": customer.LastName, "PhoneNumber": customer.PhoneNumber,
                "Street": customer.Street, "City": customer.City, "State": customer.State, "ZIP": customer.ZIP,
                "SSN": customer.SSN, "DOB": customer.DOB}])
    .select();

    return [ data, error ];
}

// Update Customer
// Params: User{Email, Password, FirstName, LastName, PhoneNumber, Street, City, State, ZIP, SSN, DOB}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber, Street, City, State, ZIP, SSN, DOB} (Confirmation)
async function updateCustomer(customer) {
    const { data, error } = await supabase
    .from('User')
    .update([customer])
    .select();

    return [ data, error ];
}

// Delete Customer
// Params: UserID
// Return: message
async function deleteCustomer(userID) {
    const { data, error } = await supabase
    .from('User')
    .delete()
    .eq('UserID', userID)
    .select();

    return [ data, error ];
}

// Insert Teller
// Params: User{Email, Password, FirstName, LastName, PhoneNumber}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber} (Confirmation)
async function insertTeller(teller) {
    const { data, error } = await supabase
    .from('User')
    .insert([{"Role": 'Teller', "Email": teller.Email, "Password": teller.Password,
                "FirstName": teller.FirstName, "LastName": teller.LastName, "PhoneNumber": teller.PhoneNumber}])
    .select();

    return [ data, error ];
}

// Update Teller
// Params: User{Email, Password, FirstName, LastName, PhoneNumber}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber} (Confirmation)
async function updateTeller(teller) {
    const { data, error } = await supabase
    .from('User')
    .insert([teller])
    .select();

    return [ data, error ];
}

// Delete Teller
// Params: UserID
// Return: message
async function deleteTeller(userID) {
    const { data, error } = await supabase
    .from('User')
    .delete()
    .eq('UserID', userID)
    .select();

    return [ data, error ];
}


// -------------------- Account Table -----------------------
// AccountTypes = { "Checking", "Savings", "Money Market", "Home Mortgage Loan", "Credit Card" } 


// Get User Account
// Params: AccountID
// Return: Entire Account data
async function getAccount(accountID) {
    let { data, error } = await supabase
    .from('Account')
    .select('*')
    .eq("AccountID", accountID);

    return [ data, error ];
}
async function getAccount(userID, accountID) {
    let { data, error } = await supabase
    .from('Account')
    .select('*')
    .eq("UserID", userID)
    .eq("AccountID", accountID);

    return [ data, error ];
}



// Get User Account From UserID
// Params: UserID
// Return: Entire Account data
async function getAccountsFromUserID(userID) {
    let { data, error } = await supabase
    .from('Account')
    .select('*')
    .eq("UserID", userID);
    
    return [ data, error ];
}

// Get Account Summary From UserID
// Params: UserID
// Return: Accounts {AccountID, AccountName, AccountType}
async function getAccountSummaryFromUserID(userID) {
    let { data, error } = await supabase
    .from('Account')
    .select('AccountID, AccountName, AccountType')
    .eq("UserID", userID);

    return [ data, error ];
}

// Get AccountID From UserID
// Params: UserID
// Return: AccountIDs
async function getAccountIDFromUserID(userID) {
    let { data, error } = await supabase
    .from('Account')
    .select('AccountID')
    .eq("UserID", userID);

    return [ data, error ];
}

// Insert Account
// Params: Account { UserID, AccountName, AccountType, Balance, InterestRate }
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function insertAccount(userID, account) {
    const { data, error } = await supabase
    .from('Account')
    .insert([{"UserID": userID,
            "AccountName": account.AccountName,
            "AccountType": account.AccountType,
            "Balance": account.Balance,
            "InterestRate": account.InterestRate,
            "Activated": false}])
    .select();

    return [ data, error ];
}

// Delete Account
// Params: AccountID
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function deleteAccount(accountID) {
    const { data, error } = await supabase
    .from('Account')
    .delete()
    .eq("UserID", accountID)
    .select();

    return [ data, error ];
}

// Activate Account
// Params: {Activated: true}
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function activateAccount(accountID) {
    const { data, error } = await supabase
    .from('Account')
    .update([{"Activated": true}])
    .eq("AccountID", accountID)
    .select();

    return [ data, error ];
}

// Deactivate Account
// Params: {Activated: false}
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function deactivateAccount(accountID) {
    const { data, error } = await supabase
    .from('Account')
    .update([{"Activated": true}])
    .eq("AccountID", accountID)
    .select();

    return [ data, error ];
}


// --------------------------- Transaction Table -----------------------

// Get Transaction
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransaction(transactionID) {
    let { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq("TransactionID", transactionID);

    return [ data, error ];
}

// Get Transaction
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransactionFromAccountID(accountID) {
    let { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq("FromAccountID", accountID);

    return [ data, error ];
}

// Get Transaction Deposit
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransactionDeposit(accountID) {
    let { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq("FromAccountID", accountID)
    .eq("TransactionType", "Deposit");

    return [ data, error ];
}

// Get Transaction Widthdrawal
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransactionWithdrawal(accountID) {
    let { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq("FromAccountID", transactionID)
    .eq("TransactionType", "Withdrawl");

    return [ data, error ];
}

// Get Transaction Transfer
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransactionTransfer(transactionID) {
    let { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq("FromAccountID", transactionID)
    .eq("TransactionType", "Transfer");

    return [ data, error ];
}

// Insert Transaction
// Params: Transaction { UserID, AccountName, AccountType, Balance, InterestRate }
// Return: Transaction { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function insertTransaction(account) {
    const { data, error } = await supabase
    .from('Account')
    .insert([{"TransactionType": account.TransactionType,
            "FromAccountID": user.FromAccountID,
            "ToAccountID": user.ToAccountID,
            "Amount": user.Amount,
            "Timestamp": user.Timestamp}])
    .select();

    return [ data, error ];
}

module.exports = {
    getUser,
    getUserIDFromLogin,
    getUserLoginFromUserID,
    getUserNameFromEmail,

    getCustomers,
    getCustomer,
    searchCustomerUsingNames,
    insertCustomer,
    updateCustomer,
    deleteCustomer,

    getTellers,
    getTeller,
    insertTeller,
    updateTeller,
    deleteTeller,

    getAccount,
    getAccountsFromUserID,
    getAccountSummaryFromUserID,
    getAccountIDFromUserID,
    insertAccount,
    deleteAccount,
    activateAccount,
    deactivateAccount,

    getTransaction,
    getTransactionFromAccountID,
    getTransactionDeposit,
    getTransactionWithdrawal,
    getTransactionTransfer,
    insertTransaction,
    
}
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

    return [data, error];
}


// Get User Name From Email
// Params: Email
// Return: User's First Name and Last Name
async function getUserNameFromEmail(email) {
    const { data, error } = await supabase
        .from('User')
        .select('FirstName, LastName')
        .eq('Email', email);

    return [data, error];
}

// Get UserID From Login
// Params: Email, Password
// Return: User{UserID, Role}
async function getUserIDFromLogin(email, password) {
    const { data, error } = await supabase
        .from('User')
        .select('UserID, Role')
        .eq('Email', email)
        .eq('Password', password);
    return [data, error];
}

// Get User Password From Email
async function getUserPassword(email) {
    const { data, error } = await supabase
        .from('User')
        .select('UserID, Role, Password')
        .eq('Email', email)
    return [data, error];
}

// Get User Login From UserID
// Params: UserID
// Return: Email and Password
async function getUserLoginFromUserID(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('Email, Password')
        .eq('UserID', userID);

    return [data, error];
}

// Get Users
// Params: None
// Return: All Customers
async function getAllUsers() {
    const { data, error } = await supabase
        .from('User')
        .select('*');

    return [data, error];
}

// Get Users
// Params: None
// Return: All Customers
async function getUsers(role) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', role);

    return [data, error];
}

// Get User Role
// Params: Email
// Return: {Role}
async function getUserRole(email) {
    const { data, error } = await supabase
        .from('User')
        .select('Role')
        .eq('Email', email);

    // Error checking
    if (error) {
        return [null, error];
    }

    // Make sure there is a valid Role
    if (data && data.length > 0) {
        const role = data[0].Role;
        return [role, null];
    } else {
        return [null, new Error('Role not found')];
    }
}

// Get User's Security Questions and Answers
// Parms: Email
// Return: { Question1, Answer1, Question2, Answer2 }
async function getUserQuestionsAnswers(email) {
    const { data, error } = await supabase
        .from('User')
        .select('Question1, Answer1, Question2, Answer2')
        .eq('Email', email);

    return [data, error];
}

// Get User's Security Questions and Answers
// Parms: Email
// Return: { Question1, Answer1, Question2, Answer2 }
async function getUserQuestionsAnswers(email) {
    const { data, error } = await supabase
        .from('User')
        .select('Question1, Answer1, Question2, Answer2')
        .eq('Email', email);

    return [data, error];
}

// Get User Address
// Params: UserID
// Return: { Street, Street2, City, State, ZIP }
async function getUserAddress(userID) {
    const { data, error } = await supabase
        .from('User')
        .select('Street, Street2, City, State, ZIP')
        .eq('UserID', userID);

    return [data, error];
}

async function searchUsers(nameText) {
    const { data, error } = await supabase
        .from('User')
        .textSearch('FullName', nameText)
        .select();

    return [data, error];
}

async function searchUsersWithRole(nameText, role) {
    const { data, error } = await supabase
        .from('User')
        .textSearch('FullName', nameText)
        .eq('Role', role)
        .select();

    return [data, error];
}

async function insertUser(user) {
    const { data, error } = await supabase
        .from('User')
        .insert(user)
        .select();

    return [data, error];
}

async function updateUser(user) {
    const { data, error } = await supabase
        .from('User')
        .update(user)
        .eq('UserID', user.UserID)
        .select();

    return [data, error];
}

async function deleteUser(userID) {
    const { data, error } = await supabase
        .from('User')
        .delete()
        .eq('UserID', userID)
        .select();

    return [data, error];
}



// Get Customers
// Params: None
// Return: All Customers
async function getCustomers() {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Customer")
        .order('FirstName');

    return [data, error];
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

    return [data, error];
}

// Search Customers
// Params: text (first and last name)
// Return: Found User data
async function searchCustomers(text) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Customer")
        .textSearch('FullName', text);

    return [data, error];
}

// Get Tellers
// Params: None
// Return: All Tellers
async function getTellers() {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('Role', "Teller");

    return [data, error];
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

    return [data, error];
}

// Insert Customer
// Params: User{ Email, Password, FirstName, LastName, PhoneNumber, Street, Street2, City, State, ZIP, SSN, DOB }
// Return: User{ Email, Password, FirstName, LastName, PhoneNumber, Street, Street2, City, State, ZIP, SSN, DOB } (Confirmation)
async function insertCustomer(customer) {
    const { data, error } = await supabase
        .from('User')
        .insert(customer)
        .select();
    // .insert([{"Role": 'Customer', "Email": customer.Email, "Password": customer.Password,
    //             "FirstName": customer.FirstName, "LastName": customer.LastName, "PhoneNumber": customer.PhoneNumber,
    //             "Street": customer.Street, "City": customer.City, "State": customer.State, "ZIP": customer.ZIP,
    //             "SSN": customer.SSN, "DOB": customer.DOB}])

    return [data, error];
}

// Update Customer
// Params: UserID, User{Password, FirstName, LastName, PhoneNumber, Street, Street2, City, State, ZIP,DOB}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber, Street, Street2, City, State, ZIP, SSN, DOB} (Confirmation)
async function updateCustomer(userID, customer) {
    console.log(customer);
    const { data, error } = await supabase
        .from('User')
        .update(customer)
        .eq('UserID', userID)
        .select();

    console.log(data);
    return [data, error];
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

    return [data, error];
}

// Delete Customer By Email
// Params: Email
// Return: message
async function deleteCustomerByEmail(email) {
    const { data, error } = await supabase
        .from('User')
        .delete()
        .eq('Email', email)
        .select();

    return [data, error];
}

// Update User Password
// Params: Password
// Return: User{Email, Password}
async function updateCustomerPassword(email, password) {
    const { data, error } = await supabase
        .from('User')
        .update({ Password: password })
        .eq('Email', email)
        .select('Email, Password');

    return [data, error];

}

// Insert Teller
// Params: User{Email, Password, FirstName, LastName, PhoneNumber}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber} (Confirmation)
async function insertTeller(teller) {
    const { data, error } = await supabase
        .from('User')
        .insert([{
            "Role": 'Teller', "Email": teller.Email, "Password": teller.Password,
            "FirstName": teller.FirstName, "LastName": teller.LastName, "PhoneNumber": teller.PhoneNumber, "Question1": teller.Question1,
            "Answer1": teller.Answer1, "Question2": teller.Question2, "Answer2": teller.Answer2
        }])
        .select();

    return [data, error];
}

// Update Teller
// Params: User{Email, Password, FirstName, LastName, PhoneNumber}
// Return: User{Email, Password, FirstName, LastName, PhoneNumber} (Confirmation)
async function updateTeller(teller) {
    const { data, error } = await supabase
        .from('User')
        .update(teller)
        .eq("Email", teller.Email)
        .select();

    return [data, error];
}

// Delete Teller
// Params: Email
// Return: User{Email, Password, FirstName, LastName, PhoneNumber} (Confirmation)
async function deleteTeller(email) {
    const { data, error } = await supabase
        .from('User')
        .delete()
        .eq('Email', email)
        .select();

    return [data, error];
}

// Search Teller
// Params: Text
// Return: Users:[User{Email, Password, FirstName, LastName, PhoneNumber}, User2{}, ...]
async function searchTellers(text) {
    const { data, error } = await supabase
        .from('User')
        .select()
        .eq('Role', 'Teller')
        .textSearch('FullName', text);

    return [data, error];
}

// -------------------- SecurityQuestion Table ----------------------
// Get Security Questions
// Params: UserID
// Return: All Customers
async function getSecurityQuestions() {
    const { data, error } = await supabase.from('SecurityQuestion')
        .select('Question1, Question2, Question3');

    return [data, error];
}



// -------------------- Account Table -----------------------
// AccountTypes = { "Checking", "Savings", "Money Market", "Home Mortgage Loan", "Credit Card" } 

// Get User Account
// Params: AccountID
// Return: Entire Account data
async function getAccount_(accountID) {
    console.log(accountID);
    let { data, error } = await supabase
        .from('Account')
        .select('*')
        .eq("AccountID", accountID);

    return [data, error];
}

// Get Account From Account As Customer
// Params: AccountName
// Return: Entire Account data
async function getAccount(userID, accountID) {
    let { data, error } = await supabase
        .from('Account')
        .select('*')
        .eq("UserID", userID)
        .eq("AccountID", accountID);

    return [data, error];
}

// Get Accounts
// Params: UserID
// Return: Entire Account data
async function getAccounts() {
    let { data, error } = await supabase
        .from('Account')
        .select('*');

    return [data, error];
}

// Get User Accounts
// Params: UserID
// Return: Entire Account data
async function getUserAccounts(userID) {
    let { data, error } = await supabase
        .from('Account')
        .select()
        .eq("UserID", userID);

    return [data, error];
}

// Get AccountID From UserID
// Params: UserID
// Return: AccountIDs
async function getAccountIDFromUserID(userID) {
    let { data, error } = await supabase
        .from('Account')
        .select('AccountID')
        .eq("UserID", userID);

    return [data, error];
}

// Search Accounts
// Params: UserID, AccountName
// Return:  Account { UserID, AccountName, AccountType, Balance, InterestRate }
async function searchAccounts(userID, accountName) {
    let { data, error } = await supabase
        .from('Account')
        .select('UserID', userID)
        .textSearch('AccountName', accountName)
        .select();

    return [data, error];
}

// Insert Account
// Params: UserID, Account { UserID, AccountName, AccountType, Balance, InterestRate }
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function insertAccount(account) {
    const { data, error } = await supabase
        .from('Account')
        .insert(account)
        .select();

    return [data, error];
}

// Delete Account
// Params: AccountID, UserID
// Return: Account { UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function deleteAccount(accountID, userID) {
    const { data, error } = await supabase
        .from('Account')
        .update({ Activated: false, Deleted: true })
        .eq("AccountID", accountID)
        .eq("UserID", userID)
        .select();

    return [data, error];
}

// Update Account
// Params: Account{ AccountID*, AccountName,... }
// Return: Account{ AccountID, UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function updateAccount(account) {
    const { data, error } = await supabase
        .from('Account')
        .update(account)
        .eq("AccountID", account.AccountID)
        .select();

    return [data, error];
}

// Update AccountName
// Params: Account{ AccountID*, AccountName }
// Return: Account{ AccountID, UserID, AccountName, AccountType, Balance, InterestRate } (Confirmation)
async function updateAccountName(accountID, accountName) {
    const { data, error } = await supabase
        .from('Account')
        .update({ AccountName: accountName })
        .eq("AccountID", accountID)
        .select();

    return [data, error];
}

// // -------------------------- TellerInbox Table -------------------------------
// async function getNotification(inboxID) {
//     let { data, error } = await supabase
//     .from('TellerInbox')
//     .select("InboxID, Type, Message, User!TellerInbox_CustomerID_fkey(FirstName, LastName), Account!TellerInbox_AccountID_fkey(AccountName), TimeStamp")
//     .eq("InboxID", inboxID)
//     .eq("Resolved", false);

//     return [ data, error ];
// }

// async function getNotifications() {
//     let { data, error } = await supabase
//     .from('TellerInbox')
//     .select("InboxID, Type, Message, User!TellerInbox_CustomerID_fkey(FirstName, LastName), Account!TellerInbox_AccountID_fkey(AccountName), TimeStamp")
//     .eq("Resolved", false);

//     return [ data, error ];
// }

// async function getNotificationsAll() {
//     let { data, error } = await supabase
//     .from('TellerInbox')
//     .select("InboxID, Type, Message, User!TellerInbox_CustomerID_fkey(FirstName, LastName), Account!TellerInbox_AccountID_fkey(AccountName), TimeStamp");

//     return [ data, error ];
// }

// async function updateNotificationResolved(isResolved) {
//     let { data, error } = await supabase
//     .from('TellerInbox')
//     .update({"Resolved": true})
//     .select();

//     return [ data, error ];
// }

// async function insertNotification(userID, accountID, transactionID, type, message) {
//     let { data, error } = await supabase
//     .from('TellerInbox')
//     .insert({
//         "CustomerID": userID,
//         "AccountID": accountID,
//         "TransactionID": transactionID,
//         "Type": type,
//         "Message": message,
//         "Resolved": false})
//     .select();

//     return [ data, error ];
// }



// --------------------------- Transaction Table -----------------------

// Get Transaction
// Params: TransactionID
// Return: Entire Transaction row data
async function getTransaction(transactionID) {
    let { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq("TransactionID", transactionID);

    return [data, error];
}

// Get Transaction
// Params: AccountID
// Return: Entire Transaction row data
async function getTransactionFromAccountID(accountID) {
    let { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq("AccountID", accountID);

    return [data, error];
}

// Get Transaction Deposit
// Params: AccountID
// Return: Entire Transaction row data
async function getTransactionDeposit(accountID) {
    let { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq("AccountID", accountID)
        .eq("TransactionType", "Deposit");

    return [data, error];
}

// Get Transaction Widthdrawal
// Params: AccountID
// Return: Entire Transaction row data
async function getTransactionWithdrawal(accountID) {
    let { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq("AccountID", accountID)
        .eq("TransactionType", "Withdrawl");

    return [data, error];
}

// Get Transaction Transfer
// Params: AccountID
// Return: Entire Transaction row data
async function getTransactionTransfer(accountID) {
    let { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq("AccountID", accountID)
        .eq("TransactionType", "Transfer");

    return [data, error];
}

async function insertTransactionForAccount(
    transactionType,
    accountID,
    amount,
    timestamp
  ) {
    return supabase
      .from('Transaction')
      .upsert(
        [
          {
            TransactionType: transactionType,
            AccountID: accountID,
            Amount: amount,
            Timestamp: timestamp,
          },
        ],
        { onConflict: ['TransactionID'] }
      );
  }
  
async function updateAccountBalance(accountID, amount) {
    const { data: accountData, error: accountError } = await supabase
      .from('Account')
      .select('Balance')
      .eq('AccountID', accountID);
  
    if (accountError) {
      return [null, accountError];
    }
  
    const updatedBalance = accountData[0].Balance + amount;
  
    return supabase
      .from('Account')
      .update({ Balance: updatedBalance })
      .eq('AccountID', accountID);
  }
  


  


module.exports = {
    getUser,
    getAllUsers,
    getUsers,
    getUserRole,
    getUserAddress,
    getSecurityQuestions,
    getUserQuestionsAnswers,
    getUserIDFromLogin,
    getUserLoginFromUserID,
    getUserNameFromEmail,
    getUserPassword,
    searchUsers,
    searchUsersWithRole,
    insertUser,
    updateUser,
    deleteUser,

    getCustomers,
    getCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    deleteCustomerByEmail,
    searchCustomers,
    updateCustomerPassword,

    getTellers,
    getTeller,
    insertTeller,
    updateTeller,
    deleteTeller,
    searchTellers,

    getAccount_,
    getAccount,
    getAccounts,
    getUserAccounts,
    getAccountIDFromUserID,
    searchAccounts,
    insertAccount,
    deleteAccount,
    updateAccount,
    updateAccountName,

    // getNotification,
    // getNotifications,
    // getNotificationsAll,
    // updateNotificationResolved,
    // insertNotification,

    getTransaction,
    getTransactionFromAccountID,
    getTransactionDeposit,
    getTransactionWithdrawal,
    getTransactionTransfer,
    insertTransactionForAccount,
    updateAccountBalance,
    
}
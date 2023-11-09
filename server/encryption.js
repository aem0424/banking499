const bcrypt = require('bcrypt');
const saltRounds = 10; // The cost factor for the bcrypt algorithm

// Password from the user's input
const userPassword = req.body.Password;

// Hash the password
bcrypt.hash(userPassword, saltRounds, (err, hash) => {
    if (err) {
        // Handle the error
    } else {
        // Store the 'hash' in the database
        const hashedPassword = hash;
        // Save 'hashedPassword' in your database
    }
});


module.exports = {

}
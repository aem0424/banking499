const express = require('express');
const fs = require('fs')
const app = express();

const PORT = 8080; // Port can be changed later, random port pulled from tutorial


// Middleware to parse JSON objects from frontend to backend
app.use( express.json() )


app.listen(
    PORT
)

// GET request for JSON OBJECT
// Current info is for demo purposes, in future would need to get info from DB
app.get('/login', (req, res) => {
    res.status(200).send({
        userName: 'myUser',
        userRole: "role"
    })
});


// POST request to write data to backend
// Currently, ID is pulled from URL and name is pulled from JSON object
// Can be customized later
app.post('/login/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(418).send({ message: 'We need a name!' })
    } // if name is left blank in JSON post req

    fs.writeFile('outputtest.txt', `${name}`, (err) => {
        if (err) throw err;
    }) // write to file the name field in the JSON response

    res.send({
        name: `${name}`,
        id: `${id}`
    }); // response after POST




});
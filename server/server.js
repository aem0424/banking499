const express = require('express');
const database = require('./database.js');

const app = express();
const PORT = 4000;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Home Route');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server! Test of backend hotloading (refresh)' });
});

// ------------------ Database -------------------------

// Get User Account Information
// Params: Email
// Return: User { * }
app.get('/customer', async (req, res) => {
  const { data, error } = await database.getUserInformation(req.query["email"]);
      
  res.json(data);
});

// Get User Account Information
// Params: UserID
// Return: Account { * }
app.get('/accounts', async (req, res) => {
  let { data, error } = await database.getAccountInformation(req.query["userID"]);

  if (error) {
      console.error('Error fetching users:', error.message); // Log the error to the console
      return res.status(500).json({ error: 'Error fetching users' });
  }

  res.json(data);
});

app.get('/accounts/name', async (req, res) => {
  let { data, error } = await database.getAccountNames(req.query["userID"]);

  if (error) {
      console.error('Error fetching users:', error.message); // Log the error to the console
      return res.status(500).json({ error: 'Error fetching users' });
  }

  res.json(data);
});

app.get('/log', async (req, res) => {
  let data = await database.addLog("4", "Create User", "User <4> Created");
  res.json(data);
});


// ------------------------------------------------------




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



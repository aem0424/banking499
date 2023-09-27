import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const app = express();
const PORT = 4000;

dotenv.config(); // Load environment variables from .env file

const dbUrl = process.env.SUPABASE_PROJECT_URL; // Setting db URL
const dbKey = process.env.SUPABASE_PUBLIC_API_KEY; // Setting db API key

// Create a single Supabase client for interacting with your database
const supabase = createClient(dbUrl, dbKey);

app.get('/', (req, res) => {
  res.send('Home Route');
});

app.get('/data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('User').select('*');
    if (error) {
      console.error('Error fetching users:', error.message); // Log the error to the console
      return res.status(500).json({ error: 'Error fetching users' });
    }
    console.log(JSON.stringify(data, null, 2)); // Log the data to the console
    res.json(data);
  } catch (err) {
    console.error('An unexpected error occurred:', err); // Log any unexpected errors to the console
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server! Test of backend hotloading (refresh)' });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



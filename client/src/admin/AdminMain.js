import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminMain() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/user')
          .then((response) => {
            if (response.status === 200) {
              setUser(response.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }, []);


    return (
        <div className='container'>
        {user ? (
          <div>
            <h1>Welcome, {user.FirstName} {user.LastName}</h1>
            <p>This is the main admin page.</p>
            <a href="/Admin/Teller">
              <button>Manage Tellers</button>
            </a>
            <a href="/Admin/Customer">
              <button>Manage Customers</button>
            </a>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    );
  }
export default AdminMain;
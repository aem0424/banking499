import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './/css/CustomerMain.css';

function CustomerMain() {
    const location = useLocation();
    const user = location.state.user;

    useEffect(() => {
      if (user) {
        axios.get('http://localhost:4000/user', {

        })
          .then((response) => {
            if (response.status === 200) {
              console.log('User data:', response.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
          });
      }
    }, [user]);

    return (
        <div className='container'>
          {user ? (
            <div>
             <h1>Welcome, {user.FirstName}!</h1>
             <a href="/Customer/PayBill">
              <button>Pay Bill</button><br/>
             </a>
             <a href="/Customer/UserInfo">
              <button>User Information</button><br/>
            </a>
            <a href="/Customer/Transaction">
              <button>Transfer/Deposit</button>
            </a>
           </div> 
          ) : (
            <p>Getting user data...</p>
          )}
          </div>
    )
}
export default CustomerMain;
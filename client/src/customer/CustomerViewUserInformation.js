import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewUserInformation.css';


function CustomerViewUserInformation() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (user) {
        axios.get('/user', {

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
            <p>Name: {user.FirstName} {user.LastName}</p>
            <p>Address:</p>
            <p>Phone Number:</p>
            <p>SSN:</p>
            <p>Date of Birth:</p>
          </div>
        ) : (
          <p>test</p>
        )}     
        </div>

    )
}
export default CustomerViewUserInformation;
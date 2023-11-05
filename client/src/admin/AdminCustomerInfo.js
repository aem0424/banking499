import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCustomerInfo() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const handleLogoutClick = () => {
        axios.post('/user/logout')
          .then((response) => {
            if (response.status === 200) {
              navigate('/Login');
            }
          })
          .catch((error) => {
            setError(error);
          });
      };
    return (
        <div className='container'>
            <p>Name:</p>
            <p>Address:</p>
            <p>Phone Number:</p>
            <p>SSN:</p>
            <p>Date of Birth:</p>
            <a href="Admin/Customer/Info/Edit">             
                <button>Edit Customer Info</button>
            </a>   
            <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
    )
}
export default AdminCustomerInfo;
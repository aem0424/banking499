import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCustomerAccountInfo() {
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
      const handleAdminMainClick = () => {
        navigate('/Admin', { state: { user } });
      };

    return (
        <div className='container'>
            <p>Account Name:</p>
            <p>Account Type:</p>
            <p>Account Owner:</p>
            <p>Interest Rate:</p>
            <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
            <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
    )
}
export default AdminCustomerAccountInfo;
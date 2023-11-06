import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTellerMain() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const handleManageTellersClick = () => {
        navigate('/Admin/Teller/TellerList', { state: { user } });
      };

      const handleNewTellerClick = () => {
        navigate('/Admin/Teller/CreateTeller', { state: { user } });
      };

      const handleAdminMainClick = () => {
        navigate('/Admin', { state: { user } });
      };

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


      useEffect(() => {
        if (user) {
          axios.get('/user', {})
            .then((response) => {
              if (response.status === 200) {
                setUserData(response.data);
                setLoading(false);
              }
            })
            .catch((error) => {
              setError(error);
              setLoading(false);
            });
        }
      }, [user]);

    console.log('User in AdminMain:', user);
    return (
        <div className='container'>
            <h1>Teller Management</h1>
            <button onClick={handleNewTellerClick} className='submit-button'>Add New Teller</button>
            <button onClick={handleManageTellersClick} className='submit-button'>Manage Tellers</button>
            <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
            <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
    )
}
export default AdminTellerMain;
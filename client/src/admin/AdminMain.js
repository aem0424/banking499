import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminMain() {
  const location = useLocation();
  const user = location.state && location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

  const handleManageTellersClick = () => {
    navigate('/Admin/Teller/TellerList', { state: { user } });
  };

  const handleManageCustomersClick = () => {
    navigate('/Admin/Customer', { state: { user } });
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

  return (
    <div className='container'>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching user data: {error.message}</p>
      ) : userData ? (
        <div>
          <h1>Welcome, {userData.FirstName} {userData.LastName}</h1>
          <p>This is the main admin page.</p>
          <button onClick={handleManageTellersClick} className='form-button'>Manage Tellers</button>
          <button onClick={handleManageCustomersClick} className='form-button'>Manage Customers</button>
          <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminMain;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function AdminMain() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleManageTellersClick = () => {
      navigate('/Admin/Teller/TellerList', { state: { user } });
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
    }, [user]);;

    return (
      <div className='container'>
        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p>Error fetching user data: {error.message}</p>
        ) : userData ? (
          <div>
            <h1>Welcome, {userData.FirstName} {userData.LastName}</h1>
            <p>This is the main admin page.</p>
            <button onClick={handleManageTellersClick}>Manage Tellers</button>
            <a href="/Admin/Customer">
              <button>Manage Customers</button>
            </a>
          </div>
        ) : null}
      </div>
    );
  }
export default AdminMain;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTellerList() {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tellers, setTellers] = useState([]);

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
    console.log('User in AdminTellerEdit:', user);
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
  
    axios.get('/admin/tellers')
      .then((response) => {
        if (response.status === 200) {
          setTellers(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tellers:', error);
        setLoading(false);
      });
  }, [user]);

  const handleEditTellersClick = (teller) => {
    navigate('/Admin/Teller/EditTeller/$teller.UserID', { state: { user, tellerData : teller } });
  };

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

    return (
      <div className='container'>
        <h1>Teller List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {tellers.map((teller, index) => (
              <li key={index}>
                <button onClick={() => handleEditTellersClick(teller)}>Edit {teller.FirstName} {teller.LastName}</button>
              </li>
            ))}
          </ul>
        )}
      <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
      <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
      </div>
    );
  }
export default AdminTellerList;
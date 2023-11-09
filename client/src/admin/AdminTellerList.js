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

  const handleNewTellerClick = () => {
    navigate('/Admin/Teller/CreateTeller', { state: { user } });
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

  const handleDeleteTellerClick = (teller) => {
    navigate('/Admin/Teller/Delete', { state: { user, tellerData : teller } });
  };

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

    return (
      <div className='container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
          <h1>Teller List</h1>
          <ul>
            {tellers.map((teller, index) => (
              <li key={index}>
                <button onClick={() => handleEditTellersClick(teller)}>Edit {teller.FirstName} {teller.LastName}</button>
                <button onClick={() => handleDeleteTellerClick(teller)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleNewTellerClick} className='submit-button'>Add New Teller</button>
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
          <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
        )}
      </div>
    );
  }
export default AdminTellerList;
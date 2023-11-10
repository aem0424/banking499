import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTellerDelete() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tellerData = location.state.tellerData;
    const [successMessage, setSuccessMessage] = useState(null);

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

  const handleAdminTellerDeleteClick = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.delete('http://localhost:4000/admin/teller/delete', {withCredentials:true});
  
      if (response.status === 200) {
        console.log('Teller Updated successfully:', response.data);
        setSuccessMessage('Teller deleted successfully');
      } else {
        console.error('Error deleting teller:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

  const handleManageTellersClick = () => {
    navigate('/Admin/Teller/TellerList', { state: { user } });
  };

  console.log('User in AdminMain:', user);
  return (
      <div className='container'>
          <h1>Confirm delete teller: {tellerData.FirstName} {tellerData.LastName} </h1>
        {successMessage && (<p className="success-message">{successMessage}</p>)}
        <button onClick={handleAdminTellerDeleteClick} className='submit-button'> Delete Teller</button>
          <button onClick={handleManageTellersClick} className='form-button'>Manage Tellers</button>
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
          <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
      </div>
  )
}
export default AdminTellerDelete;
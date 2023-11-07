import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCustomerList() {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);

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
  
    axios.get('/admin/customers')
      .then((response) => {
        if (response.status === 200) {
          setCustomers(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  }, [user]);

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

  const handleAdminCustomerClick = (customer) => {
    navigate('/Admin/Customer/Info', { state: { user, customerData : customer } });
  };

    return (
      <div className='container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
          <h1>Customer List</h1>
          <ul>
            {customers.map((customer, index) => (
              <li key={index}>
                <button onClick={() => handleAdminCustomerClick(customer)}>View {customer.FirstName} {customer.LastName}</button>
              </li>
            ))}
          </ul>
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
          <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
        )}
      </div>
    );
  }
export default AdminCustomerList;
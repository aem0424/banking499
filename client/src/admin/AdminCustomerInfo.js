import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import './AdminCustomerInfo.css'
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCustomerInfo() {
    const location = useLocation();
    const user = location.state && location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const customerData = location.state.customerData;

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

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
          axios.get('/user')
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
      
        if (customerData && customerData.UserID) {
          axios.get('/admin/customer/accounts', {
            params: {
              UserID: customerData.UserID
            }
          })
            .then((response) => {
              if (response.status === 200) {
                setAccounts(response.data);
                setLoading(false);
              }
            })
            .catch((error) => {
              console.error('Error fetching accounts:', error);
              setError(error);
              setLoading(false);
            });
        }
      }, [user, customerData]);
    
      const handleAdminMainClick = () => {
        navigate('/Admin', { state: { user } });
      };
    
    return (
        <div className='container'>
          <h2>Customer Info</h2>
          <div className='info'>
            <p><strong>Name:</strong> {customerData.FirstName} {customerData.LastName}</p>
            <p><strong>Address:</strong> {customerData.Street}, {customerData.Street2}, {customerData.City}, {customerData.State}, {customerData.ZIP}</p>         
            <p><strong>Home Phone Number:</strong> {customerData.PhoneNumber} <strong>Cell Phone Number:</strong> {customerData.CellPhoneNumber}</p>
            <p><strong>SSN:</strong> {customerData.SSN} <strong>Date of Birth</strong> {customerData.DOB}</p>
          </div>
            
            <div>
              <h2>Customer Accounts</h2>
              {accounts.length === 0 ? (
                <p style={{color: 'red' }}>No Active Accounts</p>
              ) : (
              <table className='striped-table'>
               <thead>
                <tr>
                  <th>Account Type</th>
                  <th>Account Name</th>
                  <th>Balance</th>
                </tr>
                </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.accountId}>
                  <td>{account.AccountType}</td>
                  <td>{account.AccountName}</td>
                  <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                </tr>
                ))}
              </tbody>
              </table>
              )}
            </div>
            <button onClick={handleManageCustomersClick} className='form-button'>Manage Customers</button>
            <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
            <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
    )
}
export default AdminCustomerInfo;
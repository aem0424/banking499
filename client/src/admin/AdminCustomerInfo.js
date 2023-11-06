import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import './AdminCustomerInfo.css'
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCustomerInfo() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const customerData = location.state.customerData;

    
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
      
        axios.get('/admin/customer/accounts')
          .then((response) => {
            if (response.status === 200) {
              setAccounts(response.data);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching accounts:', error);
            setLoading(false);
          });
      }, [user]);
    
      const handleAdminMainClick = () => {
        navigate('/Admin', { state: { user } });
      };
    
    return (
        <div className='container'>
          <div className='info'>
            <p>Name: {customerData.FirstName} {customerData.LastName}</p>
            <p>Address Line 1: {customerData.Street}</p>
            <p>Address Line 2: {customerData.Street2}</p>
            <p>City: {customerData.City}</p>
            <p>State: {customerData.State}</p>           
            <p>Phone Number: {customerData.PhoneNumber}</p>
            <p>SSN: {customerData.SSN}</p>
            <p>Date of Birth: {customerData.DOB}</p>
          </div>
            
            <div>
              <h2>Customer Accounts</h2>
              <ul>
                {accounts.map((account) => (
                <li key={account.accountId}>
                  Account Type: {account.AccountType}, Account Name: {account.AccountName}, Balance: {account.Balance}
                </li>
                ))}
              </ul>
            </div>
            

            <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
            <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
    )
}
export default AdminCustomerInfo;
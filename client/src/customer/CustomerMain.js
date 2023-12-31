import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerMain.css';

function CustomerMain() {
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

    const handleCustomerBillPayClick = () => {
      navigate('/Customer/PayBill', {state: {user}});
    }

    const handleCustomerViewUserInformationClick = () => {
      navigate('/Customer/UserInfo', {state: {user}});
    }

    const handleCustomerTransactionClick = () => {
      navigate('/Customer/Transaction', {state: {user}});
    }

    const handleCustomerAccountsClick = () => {
      navigate('/Customer/AccountList', {state: {user}})
    }

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
            console.log(error);
            setError('An unexpected error has occurred.');
            setLoading(false);
          });
      }
    }, [user]);

    return (
        <div className='container'>
          {loading ? (
            <p>Loading...</p>
          ): error ? (
            <p>ERROR: {error}</p>
          ) : userData ? (
            <div>
             <h1>Welcome, {userData.FirstName} {userData.LastName}!</h1>
             <button onClick={handleCustomerBillPayClick} className='form-button'>Pay Bill</button><br/>
             <button onClick={handleCustomerViewUserInformationClick} className='form-button'>User Information</button><br/>
             <button onClick={handleCustomerTransactionClick} className='form-button'>Make a Transaction</button><br/>
             <button onClick={handleCustomerAccountsClick} className='form-button'>Accounts</button><br/>
             <button onClick={handleLogoutClick} className='logout-button'>Log Out</button>
           </div> 
          ) : null}
        </div>
    );
}
export default CustomerMain;
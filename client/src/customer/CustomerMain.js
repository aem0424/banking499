import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerMain.css';

function CustomerMain() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCustomerBillPayClick = () => {
      navigate('/Customer/PayBill', {state: {user}});
    }

    const handleCustomerViewUserInformationClick = () => {
      navigate('Customer/UserInfo', {state: {user}});
    }

    const handleCustomerTransactionClick = () => {
      navigate('Customer/Transaction', {state: {user}});
    }

    const handleLogout = async (e) => {
      try {
      const response = await axios.post('/user/logout');
      if(response.status === 200) {
        console.log("Logging out...");
        navigate('');
      }
      else {
        console.error("Could not log out:", response.statusText);
      }
      navigate('');
      } catch (error) {
        console.log("an error has occurred", error)
      }
    }

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
            <p>Loading user data...</p>
          ): error ? (
            <p>ERROR: {error.message}</p>
          ) : userData ? (
            <div>
             <h1>Welcome, {userData.FirstName} {userData.LastName}!</h1>
             <button onClick={handleCustomerBillPayClick}>Pay Bill</button><br/>
             <button onClick={handleCustomerViewUserInformationClick}>User Information</button><br/>
             <button onClick={handleCustomerTransactionClick}>Transfer/Deposit</button><br/>
             <button onClick={handleLogout}>Log Out</button>
           </div> 
          ) : null}
        </div>
    );
}
export default CustomerMain;
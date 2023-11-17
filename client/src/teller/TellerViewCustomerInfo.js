import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function TellerViewCustomerInfo() {
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [customerAccounts, setCustomerAccounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: {user}})
    }

    const handleViewAccountClick = (account) => {
        navigate('/Teller/Customer/Account', {state: {user, account, customer}});
    }

    const handleTransactionClick = () => {
        navigate('/Teller/Transaction', {state: {user, customer}});
    }

    useEffect(() => {
        if(user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    console.log("success")
                    setUserData(response.data);
                }
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
        }

        if(customer) {
            axios.get('/teller/customer', {UserID: customer.UserID})
            .then((response) => {
                if(response.status === 200) {
                    setCustomerData(response.data);
                    setLoading(false);
                } else {              
                    setLoading(false);
                    console.log('error');                    
                }
            })
            .catch ((error) => {
                setError(error);
                console.log('error', error);
            });
        }

        axios.get('/teller/customer/accounts')
        .then((response) => {
            if(response.status === 200) {
                setCustomerAccounts(response.data);
            }
            setLoading(false);
        })
    .catch((error) => {
        console.error('error: ', error);
        setLoading(false);
        })
    }, [user, customer]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ): customerData ? (
                <div>
                  Name: {customerData.FirstName} {customerData.LastName}<br/>
                  Address: {customerData.Street}, {customerData.Street2}<br/>
                  Address: {customerData.City}, {customerData.State} {user.ZIP}<br/>
                  Phone Number: {customerData.PhoneNumber}<br/>
                  SSN: {customerData.SSN}<br/>
                  Date of Birth: {customerData.DOB}<br/>
                  <button onClick={handleTransactionClick}>Make a Transaction</button>
                  <h1>Accounts:</h1>
                  <ul>
                    {customerAccounts.map((account, index) => (
                    <li key={index}>
                        <button onClick={() => handleViewAccountClick(account)}>{account.AccountName}</button><br/>
                    </li>
                    ))}
                  </ul>
                </div>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default TellerViewCustomerInfo;
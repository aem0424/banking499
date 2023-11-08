import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function TellerViewCustomerInfo() {
    const location = useLocation();
    const user = location.state.user;
    const customerData = location.state.customerData;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: {user}})
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

        axios.get('/teller/customer/accounts')
        .then((response) => {
            if(response.status === 200) {
                setAccounts(response.data);
            }
            setLoading(false);
        })
    .catch((error) => {
        console.error('error: ', error);
        setLoading(false);
        })
    }, [user]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ): customerData ? (
                <div>
                  <p>Name: {customerData.FirstName} {customerData.LastName}</p>
                  <p>Address: {customerData.Street}, {customerData.Street2}</p>
                  <p>Address: {customerData.City}, {customerData.State} {user.ZIP}</p>
                  <p>Phone Number: {customerData.PhoneNumber}</p>
                  <p>SSN {customerData.SSN}:</p>
                  <p>Date of Birth: {customerData.DOB}</p>
                  <h1>Accounts:</h1>
                  <ul>
                    {accounts.map((account) => (
                    <li key={account.accountId}>
                        Account Type: {account.AccountType}, Account Name: {account.AccountName};
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
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerViewAccount.css';

function TellerViewAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const customer = location.state.customer;
    const account = location.state.account;
    const [userData, setUserData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: {user, customer}});
    }

    const handleDeleteClick = () => {
        navigate('/Teller/Account/Delete', {state: {user, customer, account}});
    }

    useEffect(() => {
        if (user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    setUserData(response.data);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }      
        if (account) {
            axios.get('/customer/account', {AccountID: account.AccountID}, {withCredentials:true})
            .then((response) => {
                if(response.status === 200) {
                    setAccountData(response.data);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        if (account) {
            axios.get('/transactions/account', {AccountID: account.AccountID})
            .then((response) => {
                if(response.status === 200) {
                    setTransactions(response.data);
                }
                setLoading(false);
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }
        }
    }, [user, account]);    

    return (
        <div className='container'>
            {loading ? (
                <p>Loading account data...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ): accountData ? (
                <div>
                    Account Name: {accountData.AccountName}<br/>
                    Account Type: {accountData.AccountType}<br/>
                    Balance: {accountData.Balance}<br/>
                    Interest Rate: {accountData.InterestRate}<br/>
                    History: tba<br/>
                    <button onClick={handleDeleteClick}>Delete Account</button>                    
                </div>
            ): null }
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}    
export default TellerViewAccount;
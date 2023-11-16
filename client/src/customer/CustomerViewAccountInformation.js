import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerViewAccountInformation.css';

function CustomerViewAccountInformation() {
    const location = useLocation();
    const user = location.state.user;
    const account = location.state.account;
    const [userData, setUserData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBackButtonClick = (info) => {
        navigate('/Customer/AccountList', {state: {user}})
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
            axios.get('/customer/account', {
                params: { AccountID: account.AccountID }, // Use params to include query parameters
                withCredentials: true,
              })
            .then((response) => {
                if(response.status === 200) {
                    setAccountData(response.data);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        if (account) {
            console.log(account);
            axios.get('/transactions/account', {
                params: {AccountID: account.AccountID},
                })
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
                    Balance: {accountData.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}<br/>
                    Interest Rate: {accountData.InterestRate}%<br/>
                    <div>
                        <h2>Transaction History:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Transaction Type</th>
                                    <th>Amount</th>
                                    <th>Date/Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.TransactionID}>
                                        <td>{transaction.TransactionID}</td>
                                        <td>{transaction.TransactionType}</td>
                                        <td>{transaction.Amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td>{transaction.Timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ): null }
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default CustomerViewAccountInformation;
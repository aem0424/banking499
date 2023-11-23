import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerViewAccountInformation.css';

function CustomerViewAccountInformation() {
    const location = useLocation();
    const user = location.state && location.state.user;
    const account = location.state.account;
    const [accountData, setAccountData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleBackButtonClick = (info) => {
        navigate('/Customer/AccountList', {state: {user}})
    }

    useEffect(() => {
        if (user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    console.log('success');
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    const handleLoadMore = () => {
      setCurrentPage(currentPage + 1);
    };
  
    const handleLoadPrevious = () => {
      setCurrentPage(currentPage - 1);
    };
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ): error ? (
                <p>ERROR: {error}</p>
            ): accountData ? (
                <div>
                    <strong>Account Name: </strong>{accountData.AccountName}<br/>
                    <strong>Account Type: </strong>{accountData.AccountType}<br/>
                    <strong>Balance: </strong>{accountData.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}<br/>
                    <strong>Interest Rate: </strong>{accountData.InterestRate}%<br/>
                    <div>
                        <h2>Transaction History</h2>
                        {transactions.length === 0 ? (
                            <p style={{ color: 'red' }}>No Recorded Transactions</p>
                        ) : (
                        <table className='striped-table'>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Transaction Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions
                                    .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
                                    .slice(startIndex,endIndex)
                                    .map((transaction) => (
                                    <tr key={transaction.TransactionID}>
                                        <td>{transaction.TransactionID}</td>
                                        <td>{transaction.TransactionType}</td>
                                        <td>{transaction.Amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td>{new Date(transaction.Timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                        {startIndex > 0 && (
                            <button onClick={handleLoadPrevious} className='form-button'>Load Previous Transactions</button>
                        )}
                        {endIndex < transactions.length && (
                            <button onClick={handleLoadMore} className='form-button'>Load More Transactions</button>
                        )}
                    </div>
                </div>
            ): null }
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>            
        </div>
    )
}
export default CustomerViewAccountInformation;
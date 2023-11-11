import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerViewAccount.css';

function TellerViewAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accountData = location.state.accountData;

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: {user}});
    }

    const handleDeleteClick = () => {
        navigate('/Teller/Customer/Account/Delete', {state: {user, accountData}});
    }

    return (
        <div className='container'>
            <p>Account Name: {accountData.AccountName}</p>
            <p>Account Type: {accountData.AccountType}</p>
            <p>Balance: {accountData.Balance}</p>
            <p>Interest Rate: {accountData.InterestRate}</p>
            <button onClick={handleDeleteClick}>Delete Account</button>
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default TellerViewAccount;
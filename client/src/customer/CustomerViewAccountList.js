import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewAccountList.css';

function CustomerViewAccountList() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const handleBackButtonClick = () => {
        navigate('/Customer', {state: {user}});
    }

    const handleCreateRequestClick = () => {
        navigate('/Customer/CreateAccount', {state : { user }})
    }

    useEffect(() => {
        axios.get('/customer/accounts', {withCredentials:true})
        .then((response) => {
            if (response.status === 200) {
                setUserAccounts(response.data);
            }
        })
        .catch((error) => {
            console.error("error occurred:", error);
        });
    }, []);

    return (
        <div className='container'>
            <h1>Accounts</h1>
            <ul>
                {userAccounts.map((account, index) => (
                    <li key={index}>{account.accountName}</li>
                ))}
            </ul>
            <button onClick={handleBackButtonClick}>Back</button>
            <button onClick={handleCreateRequestClick}>Request a New Account</button>
        </div>
    )
}
export default CustomerViewAccountList;
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

    const handleDeleteRequest = (account) => {
        navigate('/Customer/Account/Delete', {state: {user, accountData : account}})
    }   

    useEffect(() => {
        axios.get('/customer/accounts', {withCredentials:true})
        .then((response) => {
            if (response.status === 200) {
                setUserAccounts(response.data);
            }
            setLoading(false);            
        })
        .catch((error) => {
            console.error("error occurred:", error);
            setError(error);
            setLoading(false);
        });
    }, [user]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : userAccounts > (
                <div>
                    <ul>
                        {userAccounts.map((account, index) => (
                            <li key={index}>
                                {account.accountName}
                                <button onClick={handleDeleteRequest(account)}>Delete Account</button><br/>
                                </li>
                            
                         ))}
                    </ul>
                <button onClick={handleBackButtonClick}>Back</button>
                <button onClick={handleCreateRequestClick}>Request a New Account</button>
                </div>
            )}
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default CustomerViewAccountList;
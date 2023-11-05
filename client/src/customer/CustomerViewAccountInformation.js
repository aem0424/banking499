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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/Customer/AccountList', {state: {user}})
    }

    const handleDeleteRequest = () => {
        navigate('/Customer/Account/Delete', {state: {user, account}})
    }

    useEffect(() => {
        if (userData) {
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
        if (accountData) {
            axios.get('/customer/account', accountData, {withCredentials:true})
            .then((response) => {
                if(response.status === 200) {
                    setAccountData(response.data);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }
    }, [userData, accountData]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading user data...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ): accountData ? (
                <div>
                    <button onClick={handleDeleteRequest}>Delete Account</button><br/>
                </div>
            ): null }
            <button onCLick={handleBack}>Back</button>
        </div>
    )
}
export default CustomerViewAccountInformation;
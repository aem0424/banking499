import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeleteAccount.css';

function TellerDeleteAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const account = location.state.account;
    const customer = location.state.customer;
    const [userData, setUserData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleNoClick = () => {
        navigate('/Teller/Customer', {state: { user }});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete('/teller/customer/account/delete', {UserID: customerData.UserID, AccountID: account.AccountID})
            if(response.status === 200) {
                console.log('success', response.data);
            } else {
                console.error('error: ', error);
            }
        } catch (error) {
            console.log('error:', error);
        }
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
            axios.get('/teller/customer/account', account, {withCredentials:true})
            .then((response) => {
                if(response.status === 200) {
                    setAccountData(response.data);
                    setLoading(false);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }
    }, [user, account]);    
    
    return (
        <div>
            <h1>Are you sure you want to delete this account?</h1>
            <button type='submit'>Yes</button><br/>
            <button onClick={handleNoClick}>No</button>
        </div>
    )
}
export default TellerDeleteAccount;
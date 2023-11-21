import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeleteAccount.css';

function TellerDeleteAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state && location.state.user;
    const customer = location.state.customer;
    const account = location.state.account;
    const [userData, setUserData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleNoClick = () => {
        navigate('/Teller/Customer/UserInfo', {state: { user, customer }});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete('/teller/customer/account/delete', 
            {data: {UserID: customer.UserID, AccountID: account.AccountID}},
        {withCredentials: true})
            if(response.status === 200) {
                console.log('success', response.data);
                setSuccess(true);
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
    }, [user]);    
    
    return (
        <div className='container'>
            { success ? (
                <div>
                    <p>Successfully deleted.</p>
                    <button onClick={handleNoClick}>Back</button>
                </div>
            ) : userData ? (
                <div>
                    <h1>Are you sure you want to delete this account?</h1>
                    <button onClick={handleSubmit} className='submit-button'>Yes</button><br/>
                    <button onClick={handleNoClick} className='logout-button'>No</button> 
                </div>
            ) : null }
        </div>
    )
}
export default TellerDeleteAccount;
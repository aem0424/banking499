import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './/css/CustomerViewAccountList.css';

function CustomerViewAccountList() {
    const [userAccounts, setUserAccounts] = useState([]);
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate('/Customer');
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
                    <li ky={index}>{account.accountName}</li>
                ))}
            </ul>
            <button onCLick={handleBackButton}>Back</button>
        </div>
    )
}
export default CustomerViewAccountList;
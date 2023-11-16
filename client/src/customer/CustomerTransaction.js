import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerTransaction.css';


function CustomerTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;

    const handleCustomerTransferClick = () => {
        navigate('/Customer/Transaction/Transfer', {state: {user}});
    }

    const handleCustomerDepositClick = () => {
        navigate('/Customer/Transaction/Deposit', {state: {user}});
    }
    
    const handleBackButtonClick = () => {
        navigate('/Customer', {state: {user}});
    }

    return (
        <div className='container'>
            <h1>Please select a transaction to perform.</h1>
            <button onClick={handleCustomerTransferClick}>Transfer</button><br/>
            <button onClick={handleCustomerDepositClick}>Deposit</button><br/>
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default CustomerTransaction;
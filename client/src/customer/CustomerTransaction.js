import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerTransaction.css';


function CustomerTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state && location.state.user;

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleCustomerTransferClick = () => {
        navigate('/Customer/Transaction/Transfer', {state: {user}});
    }

    const handleCustomerDepositClick = () => {
        navigate('/Customer/Transaction/Deposit', {state: {user}});
    }

    const handleCustomerWithdrawClick = () => {
        navigate('/Customer/Transaction/Withdraw', {state: {user}})
    }
    
    const handleBackButtonClick = () => {
        navigate('/Customer', {state: {user}});
    }

    return (
        <div className='container'>
            <h1>Please select a transaction to perform.</h1>
            <button onClick={handleCustomerTransferClick} className='form-button'>Transfer</button>
            <button onClick={handleCustomerDepositClick} className='form-button'>Deposit</button>
            <button onClick={handleCustomerWithdrawClick} className='form-button'>Withdraw</button><br/>
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>
        </div>
    )
}
export default CustomerTransaction;
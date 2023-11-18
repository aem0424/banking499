import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransaction.css';


function TellerTransaction() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer;

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleTellerTransfer = () => {
        navigate('/Teller/Transaction/Transfer', { state: { user, customer }});
    }

    const handleTellerDeposit = () => {
        navigate('/Teller/Transaction/Deposit', {state: { user, customer }});
    }

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: { user }})
    }

    return (
        <div className='container'>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <button onClick={handleTellerTransfer}>Transfer</button>
            <button onClick={handleTellerDeposit}>Deposit</button><br/>  
            <button onClick={handleBackButtonClick}>Back</button> 
        </div>
    )
}
export default TellerTransaction;
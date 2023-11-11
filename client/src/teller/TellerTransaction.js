import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransaction.css';


function TellerTransaction() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const customer = location.state.customer;

    const handleTellerTransfer = () => {
        navigate('/Teller/Transaction/Transfer', { state: { user }});
    }

    const handleTellerDeposit = () => {
        navigate('/Teller/Transaction/Deposit', {state: { user }});
    }

    const handleBackButtonClick = () => {
        navigate('/Teller', {state: { user }})
    }

    return (
        <div>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <button onClick={handleTellerTransfer}>Transfer</button>
            <button onClick={handleTellerDeposit}>Deposit</button><br/>  
            <button onClick={handleBackButtonClick}>Back</button> 
        </div>
    )
}
export default TellerTransaction;
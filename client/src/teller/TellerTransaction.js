import React, { useEffect } from 'react'
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

    const handleTellerWithdraw = () => {
        navigate('/Teller/Transaction/Withdraw', {state: {user, customer}});
    }

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', {state: { user, customer }})
    }

    return (
        <div className='container'>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <button onClick={handleTellerTransfer} className='form-button'>Transfer</button>
            <button onClick={handleTellerDeposit} className='form-button'>Deposit</button> 
            <button onClick={handleTellerWithdraw} className='form-button'>Withdraw</button><br/>
            <button onClick={handleBackButtonClick} className='form-button'>Back</button> 
        </div>
    )
}
export default TellerTransaction;
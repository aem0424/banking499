import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransaction.css';


function TellerTransaction() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user();

    const handleTellerTransfer = () => {
        navigate('Teller/Transaction/Transfer', { state: { user }});
    }

    const handleTellerDeposit = () => {
        navigate('Teller/Transaction/Deposit', {state: { user }});
    }

    return (
        <div>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <button onClick={handleTellerTransfer}>Transfer</button>
            <button onClick={handleTellerDeposit}>Deposit</button>   
        </div>
    )
}
export default TellerTransaction;
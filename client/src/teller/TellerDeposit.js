import React from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeposit.css';


function TellerDeposit() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;   
    
    const handleBackButtonClick = () => {
        navigate('/Teller/Transaction', {state: {user}})
    }
    return (
        <div>
            <h1>This is a placeholder for the customer deposit screen. I may try to implement a dropdown that 
                shows all of a customer's accounts instead of requiring them to type it out.</h1>
            <select>
                <option value="test1">TBA</option>
            </select>                
            <form>Amount to Deposit</form>
            <button>Deposit Funds</button>
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default TellerDeposit;
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransfer.css';


function TellerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user; 
    
    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Transaction', {state: {user}})
    }
    return (
        <div className='container'>
            <form>Amount to Transfer</form>
            <button>Transfer Funds</button><br/>
            <button onClick={handleBackButtonClick}>Back</button> 
        </div>
    )
}
export default TellerTransfer;
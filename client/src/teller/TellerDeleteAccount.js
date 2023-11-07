import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeleteAccount.css';

function TellerDeleteAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const customerData = location.state.customerData;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleNoClick = () => {
        navigate('Teller/Customer', {state: { user }});
    }
    
    return (
        <div>
            <h1>Are you sure you want to delete this account?</h1>
            <button type='submit'>Yes</button><br/>
            <button onClick={handleNoClick}>No</button>
        </div>
    )
}
export default TellerDeleteAccount;
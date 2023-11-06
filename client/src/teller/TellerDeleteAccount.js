import React from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeleteAccount.css';

function TellerDeleteAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleNoClick = () => {
        null;
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
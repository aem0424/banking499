import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerEditAccount.css';


function TellerEditAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;  
    const customer = location.state.customer; 
    const account = location.state.account;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const [formData, setFormData] = useState({
        AccountName: account?.AccountName || " ",
        AccountType: account?.AccountType || " ",
    })
    return (
        <div className='container'>
            <h1>placeholder</h1>
        </div>
    )
}
export default TellerEditAccount;
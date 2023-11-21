import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Teller1099Form() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer; 
    const account = location.state.account;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false); //setting to false for now
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', { state : { user, customer }})
      };

    return (
        <div className='container'>
            { success ? (
                <p>Success!</p>
            ) : error ? (
                <p>Error!</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : account ? (
                <p>tba</p>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default Teller1099Form;
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Teller1099Form() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer; 
    const account = location.state.account;
    const [tenForm, setTenForm] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if(user) {
            const getData = async() => {
                const response = await axios.get('/1099form', {params: {AccountID: account.AccountID}})
                if(response) {
                    console.log(response);
                    setTenForm(response.data);
                    setLoading(false);
                }
                else {
                    console.log(error);
                    setError(error);
                    setLoading(false);
                }
            }
            getData().catch(console.log(error));
        }
    })

    return (
        <div className='container'>
            { success ? (
                <p>Success!</p>
            ) : error ? (
                <p>ERROR: {error}</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : tenForm ? (
                <div>
                    <object data={tenForm} type="application/pdf" width = "100%" height = "100%"></object>
                </div>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default Teller1099Form;
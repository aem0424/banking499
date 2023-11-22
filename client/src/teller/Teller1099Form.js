// page will likely be unused, keeping for now

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
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', { state : { user, customer }})
    };

    const handleOpenWindowClick = () => {
        window.open(pdfUrl, '_blank');
    }

    useEffect(() => {
        if(user) {
            const getData = async() => {
                const response = await axios.get('/1099form', {params: {AccountID: account.AccountID}, responseType: 'blob'})
                if(response) {
                    console.log(response);
                    setTenForm(response.data);
                    setPdfUrl(URL.createObjectURL(new Blob([response.data])));
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
            ) : pdfUrl ? (
                <div>
                    <button onClick={handleOpenWindowClick}>Click Here to Generate 1099</button>
                </div>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default Teller1099Form;
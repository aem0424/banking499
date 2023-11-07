import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerMain.css';


function TellerMain() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleTellerTransaction = () => {
        navigate('/Teller/Transaction', { state: { user }})
    }

    const handleTellerCustomer = () => {
        navigate('/Teller/Customer', { state: { user }})
    }

    const handleTellerCreateAccount = () => {
        navigate('/Teller/CreateAccount', { state: { user }})
    }

    const handleLogoutClick = () => {
        axios.post('/user/logout')
        .then((response) => {
          if (response.status === 200) {
            navigate('/Login');
          }
        })
        .catch((error) => {
          setError(error);
        });
    };

    useEffect(() => {
        if(user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    setUserData(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
        }
    }, [user]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : userData ? (
               <div> 
                <h1>Welcome, {userData.FirstName} {userData.LastName}!</h1>
                <p> This is the main teller page.</p>
                <button onClick={handleTellerTransaction}>Show Transactions</button><br/>
                <button onClick={handleTellerCustomer}>Search Customers</button><br/>
                <button onClick={handleTellerCreateAccount}>Customer Account Requests</button><br/>
                <button onClick={handleLogoutClick}>Logout</button>            
               </div>     
            ) : null}
        </div>
    )
}
export default TellerMain;
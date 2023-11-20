import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerMain.css';


function TellerMain() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state && location.state.user;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleTellerCustomer = () => {
        navigate('/Teller/Customer', { state: { user }})
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
                <button onClick={handleTellerCustomer} className='form-button'>View Customers/Accounts</button><br/>
                <button onClick={handleLogoutClick} className='logout-button'>Logout</button>            
               </div>     
            ) : null}
        </div>
    )
}
export default TellerMain;
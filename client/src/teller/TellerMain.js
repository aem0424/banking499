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
        navigate('/Teller/Transaction')
    }

    const handleTellerCustomer = () => {
        navigate('Teller/Customer')
    }

    const handleTellerCreateAccount = () => {
        navigate('Teller/CreateAccount')
    }

    const handleLogout = async (e) => {
        try {
        const response = await axios.post('/user/logout');
        if(response.status === 200) {
          console.log("Logging out...");
          navigate('');
        }
        else {
          console.error("Could not log out:", response.statusText);
        }
        navigate('');
        } catch (error) {
          console.log("an error has occurred", error)
        }
      }    

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
                <h1>This is a placeholder for the main teller page.</h1>
                <button onClick={handleTellerTransaction}>Show Transactions</button><br/>
                <button onClick={handleTellerCustomer}>Search Customers</button><br/>
                <button onClick={handleTellerCreateAccount}>Customer Account Requests</button><br/>
                <button onClick={handleLogout}>Logout</button>            
               </div>     
            ) : null}
        </div>
    )
}
export default TellerMain;
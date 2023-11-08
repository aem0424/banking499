import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerCustomerManage.css';


function TellerCustomerManage() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const [customers, setCustomers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBackButtonClick = () => {
        navigate('/Teller', {state: {user}})
    }

    const handleViewCustomerClick = (customer) => {
        navigate('/Teller/Customer/UserInfo', {state: {user, customerData: customer}})
    }

    useEffect(() => {
        if (user) {
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
      
        axios.get('/teller/customers')
          .then((response) => {
            if (response.status === 200) {
              setCustomers(response.data);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching customers:', error);
            setLoading(false);
          });
      }, [user]);

    return (
        <div className='container'>
            <h1>Customer List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : customers ? (
                <ul>
                    {customers.map((customer, index) => (
                        <li key={index}>
                            <p>{customer.FirstName} {customer.LastName}
                            <button onClick={() => handleViewCustomerClick(customer)}>View</button></p>
                        </li>
                    ))}
                </ul>
            ) : null }
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default TellerCustomerManage;
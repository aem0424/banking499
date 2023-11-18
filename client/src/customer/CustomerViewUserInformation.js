import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewUserInformation.css';


function CustomerViewUserInformation() {
    const location = useLocation();
    const user = location.state && location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!user) {
        navigate('/Login');
      }
    }, [user, navigate]);

    const handleEditClick = (customer) => {
      navigate('/Customer/UserInfo/Edit', {state: {user, customerData: customer}})
    }

    const handleBackButtonClick = () => {
      navigate('/Customer', {state: {user}})
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
    }, [user]);

    return (
        <div className='container'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>ERROR: {error.message}</p>
        ) : userData? (
          <div className='info'>
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {userData.FirstName} {userData.LastName}</p>
            <p><strong>Address Line 1:</strong> {userData.Street}</p>
            <p><strong>Address Line 2:</strong> {userData.Street2}</p>
            <p><strong>City:</strong> {userData.City}</p>
            <p><strong>State:</strong> {userData.State}</p>
            <p><strong>ZIP:</strong> {userData.ZIP}</p>
            <p><strong>Phone Number:</strong> {userData.PhoneNumber}</p>
            <p><strong>SSN:</strong> {userData.SSN}</p>
            <p><strong>Date of Birth:</strong> {userData.DOB}</p>
            <button onClick={() => handleEditClick(userData)} className='form-button'>Edit User Information</button>
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>      
          </div>
        ) : null}
  
        </div>
    )
}
export default CustomerViewUserInformation;
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
        <h2>Customer Info</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>ERROR: {error.message}</p>
        ) : userData? (
          <div>
          
          <div className='info'>
            <p><strong>Name:</strong> {userData.FirstName} {userData.LastName}</p>
            <p><strong>Address:</strong> {userData.Street}, {userData.Street2}, {userData.City}, {userData.State}, {userData.ZIP}</p>         
            <p><strong>Home Phone Number:</strong> {userData.PhoneNumber} <strong>Cell Phone Number:</strong> {userData.CellPhoneNumber}</p>
            <p><strong>SSN:</strong> {userData.SSN} <strong>Date of Birth</strong> {userData.DOB}</p>
          </div>
            
            <button onClick={() => handleEditClick(userData)} className='form-button'>Edit User Information</button>
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>      
          </div>
        ) : null}
  
        </div>
    )
}
export default CustomerViewUserInformation;
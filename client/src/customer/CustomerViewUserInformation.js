import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewUserInformation.css';


function CustomerViewUserInformation() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
          <div>
            Name: {userData.FirstName} {userData.LastName}<br/>
            Address: {userData.Street}, {userData.Street2}<br/>
            Address: {userData.City}, {userData.State} {userData.ZIP}<br/>
            Phone Number: {userData.PhoneNumber}<br/>
            SSN: {userData.SSN}<br/>
            Date of Birth: {userData.DOB}<br/>
            <button onClick={() => handleEditClick(userData)}>Edit User Information</button>
          </div>
        ) : null}
        <button onClick={handleBackButtonClick}>Back</button>        
        </div>
    )
}
export default CustomerViewUserInformation;
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

    const handleEditClick = () => {
      navigate('/Customer/UserInfo/Edit', {state: {user}})
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
            <p>Name: {userData.FirstName} {userData.LastName}</p><br/>
            <p>Address: {userData.Street}, {userData.Street2}</p><br/>
            <p>Address: {userData.City}, {userData.State} {userData.ZIP}</p>
            <p>Phone Number: {userData.PhoneNumber}</p><br/>
            <p>SSN: {userData.SSN}</p><br/>
            <p>Date of Birth: {userData.DOB}</p><br/>
            <button onClick={handleEditClick}>Edit User Information</button>
          </div>
        ) : null}
        </div>
    )
}
export default CustomerViewUserInformation;
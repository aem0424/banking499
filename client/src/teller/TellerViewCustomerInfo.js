import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function TellerViewCustomerInfo() {
    const location = useLocation();
    const user = location.state.user;
    const customerData = location.state.customerData;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // some of the following code is placeholder stuff
    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ): customerData ? (
                <div>
                  <p>Name: {customerData.FirstName} {customerData.LastName}</p><br/>
                  <p>Address: {customerData.Street}, {customerData.Street2}</p><br/>
                  <p>Address: {customerData.City}, {customerData.State} {user.ZIP}</p>
                  <p>Phone Number: {customerData.PhoneNumber}</p><br/>
                  <p>SSN {customerData.SSN}:</p><br/>
                  <p>Date of Birth: {customerData.DOB}</p><br/>
                </div>
            ) : null}
        </div>
    )
}
export default TellerViewCustomerInfo;
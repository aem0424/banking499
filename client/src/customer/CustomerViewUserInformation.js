import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerViewUserInformation() {
    const [user, setUser] = useState({
      UserID: '',
      FirstName: '',
    });
    //const [error, setError] = useState(null);
    useEffect(() => {
      axios.get('http://localhost:4000/customer')
      .then((response) => {
        if(response.status === 200) {
          setUser(response.data);
          console.log(user);
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }, [user]);

    return (
        <div>
            <p>Name:</p> {user.FirstName}
            <p>Address:</p>
            <p>Phone Number:</p>
            <p>SSN:</p>
            <p>Date of Birth:</p>
        </div>
    )
}
export default CustomerViewUserInformation;
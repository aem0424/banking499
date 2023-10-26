import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerViewUserInformation() {
    return (
        <div>
            <p>Name:</p>
            <p>Address:</p>
            <p>Phone Number:</p>
            <p>SSN:</p>
            <p>Date of Birth:</p>
            <button></button>
        </div>
    )
}
export default CustomerViewUserInformation;
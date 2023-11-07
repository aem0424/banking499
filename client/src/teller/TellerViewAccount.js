import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerViewAccount.css';

function TellerViewAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    return (
        <div>
            <p>Account Name:</p>
            <p>Account Type:</p>
            <p>Account Owner:</p>
            <p>Interest Rate:</p>
        </div>
    )
}
export default TellerViewAccount;
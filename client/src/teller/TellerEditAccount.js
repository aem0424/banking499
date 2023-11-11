import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerEditAccount.css';


function TellerEditAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;    
    return (
        <div>
            <h1>placeholder</h1>
        </div>
    )
}
export default TellerEditAccount;
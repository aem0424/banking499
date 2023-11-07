import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransfer.css';


function TellerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;    
    return (
        <div>
            <form>Amount to Transfer</form>
            <button>Transfer Funds</button>
        </div>
    )
}
export default TellerTransfer;
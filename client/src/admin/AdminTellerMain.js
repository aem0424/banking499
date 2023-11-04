import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function AdminTellerMain() {
    const location = useLocation();
    const user = location.state.user;
    const navigate = useNavigate();
    
    const handleManageTellersClick = () => {
        navigate('/Admin/Teller/TellerList', { state: { user } });
      };
    console.log('User in AdminMain:', user);
    return (
        <div className='container'>
            <h1>Teller Management</h1>
            <a href="/Admin/Teller/CreateTeller">
                <button>Create Teller</button>
            </a>
            <button onClick={handleManageTellersClick}>Manage Tellers</button>
        </div>
    )
}
export default AdminTellerMain;
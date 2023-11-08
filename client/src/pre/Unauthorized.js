import React from 'react';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/Login');
      };
      
    <div>
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to access this page.</p>
      <button onClick={handleLoginClick} className='form-button'>Login</button>
    </div>
};

export default Unauthorized;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPass() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  }

  return (
    <div className='container'>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
      <div className="form-links">
      <button onClick={handleRegisterClick} className='form-button'>Register</button>
        <br />
      <button onClick={handleLoginClick} className='form-button'>Login</button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ForgotPass;

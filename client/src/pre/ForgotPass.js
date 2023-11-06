import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPass() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Email: '',
    SSN: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Email, SSN } = formData;
    setError(null); // Clear any previous error messages

    //will change to an update API call to adjust password
    try {
      const response = await axios.post(' http://localhost:4000/user/login', { "Email" : Email, "SSN" : SSN });
      if (response.data) {
        console.log('Connect successful:', response.data);
      } else {
        setError('Login failed. Please check your email and password.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };



  return (
    <div className='container'>
      <h1>Welcome to Summit Financial</h1>
      <h2>Change Passsword</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Email">Email:</label>
          <input
            type="text"
            id="Email"
            name="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="SSN">SSN:</label>
          <input
            type="SSN"
            id="SSN"
            name="SSN"
            value={formData.SSN}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className='submit-button'>Change Password</button>
      </form>
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

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ConfirmForgotPass() {;
    const [formData, setFormData] = useState({
        Email: '',
        //ConfirmEmail: '',
      });
      const [error, setError] = useState(null);
      const [user, setUser] = useState(null);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    //if (formData.Email !== formData.ConfirmEmail) {
      //setError('Emails do not match.');
    //} else {
      {try {
        // Send a GET request to retrieve security questions and answers
        const response = await axios.get('/user/qa', {
          params: { Email: formData.Email },
        });

        if (response.status === 200) {
          // If successful, navigate to the ForgotPass component with userQA data
          navigate('/ForgotPass', { state: { userQA: response.data } });
          setUser(response.data);
        } else {
          console.error('Error retrieving security questions and answers:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <div className='container'>
      <h2>Enter E-mail to change password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Email">Email:</label>
          <input
            type="text"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleInputChange}
            required
          />
        </div>
        {/*<div>
          <label htmlFor="ConfirmEmail">Confirm Email:</label>
          <input
            type="text"
            id="ConfirmEmail"
            name="ConfirmEmail"
            value={formData.ConfirmEmail}
            onChange={handleInputChange}
            required
          />
  </div>*/}
        <button type='submit' className='submit-button'>Update Password</button>
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

export default ConfirmForgotPass;

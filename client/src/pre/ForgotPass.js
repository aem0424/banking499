import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ForgotPass() {;
  const [error, setError] = useState('');
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const {userQA} = location.state;

  const [formData, setFormData] = useState({
    Answer1: userData?.Answer1 || "",
    Answer2: userData?.Answer2 || "",
    Password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (user) {
      axios.get('/user', {})
        .then((response) => {
          if (response.status === 200) {
            setUserData(response.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/password/reset', {
        Email: userData.Email,
        Question1: userQA.Question1,
        Question2: userQA.Question2,
        Answer1: formData.Answer1,
        Answer2: formData.Answer2,
        Password: formData.Password,
      });

      if (response.status === 200) {
        setFormData({ Answer1: '', Answer2: '', Password: '' });
        setError('');
        // Password reset successful, display success message or navigate to another page
        // Example: setSuccessMessage('Password reset successful');
      } else {
        console.error('Error resetting password:', response.statusText);
        // Handle error condition
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error condition
      setError('An error occurred while resetting the password.');
    }
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  }


  return (
    <div className='container'>
      <h2>Forgot Password</h2>
      <p>Name: {userData.FirstName} {userData.LastName}</p>
      <form onSubmit={handleSubmit} className="register-form">
<div className='form-columns'>
  <div className='form-group'>
    <p>Security Question 1: {userQA.Question1}</p>
    <label htmlFor="Answer1" className='form-label'>Answer:</label>
    <input
        type="text"
        id="Answer1"
        name="Answer1"
        value={formData.Answer1}
        onChange={handleInputChange}
        required
        className='form-input'
      />
    </div>
    <div className='form-group'>
    <p>Security Question 2: {userQA.Question2}</p>
    <label htmlFor="Answer2" className='form-label'>Answer:</label>
    <input
        type="text"
        id="Answer2"
        name="Answer2"
        value={formData.Answer2}
        onChange={handleInputChange}
        required
        className='form-input'
      />
    </div>
    <div className='form-group'>
            <label htmlFor="Password" className='form-label'>New Password:</label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
</div>
{successMessage && (<p className="success-message">{successMessage}</p>)}
        <button type='submit' className='submit-button'>Change Password</button>
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

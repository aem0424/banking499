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

  const [formData, setFormData] = useState({
    Answer1: userData?.Answer1 || "",
    Answer2: userData?.Answer2 || "",
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

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    /*try {
      const response = await axios.post('http://localhost:4000/admin/teller/update', formData, {withCredentials:true});
  
      if (response.status === 200) {
        console.log('Teller Updated successfully:', response.data);
        setSuccessMessage('Teller updated successfully');
      } else {
        console.error('Error updating teller:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }*/
    console.log('Hi')
  };

  return (
    <div className='container'>
      <h2>Forgot Password</h2>
      <p>Name: {userData.FirstName} {userData.LastName}</p>
      <form onSubmit={handleSubmit} className="register-form">
<div className='form-columns'>
  <div className='form-group'>
    <p>Security Question 1: {userData.Question1}</p>
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
    <p>Security Question 2: {userData.Question2}</p>
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

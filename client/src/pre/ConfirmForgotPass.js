import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ConfirmForgotPass() {;
  const [formData, setFormData] = useState({
    Email: '',
    Question1: '',
    Answer1: '',
    Question2: '',
    Answer2: '',
    Password: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    Email: '',
    Password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
  
    if (name === 'Password' && value.length < 6) {
      error = 'Must be at least 6 characters.';
    } else if (name === 'Email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid Email.';
    }
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  const allFieldsValid = Object.values(errors).every((error) => error === '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFieldsValid) {
      console.error('Please fill in all fields correctly before submitting.');
      return;
    }

    try {
      // Send a POST request to update the user's password
      const response = await axios.post('/user/password/reset', formData);

      if (response.status === 200) {
        // Password reset successful
        console.log('Password Reset Successful');
        setSuccessMessage('Password updated successfully');
      } else {
        console.error('Error updating password:', response.data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="container">
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
        <label htmlFor="Email" className='form-label'>Email:</label>
            <input
              type="Email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              className={`form-input ${errors.Email ? 'error' : ''}`}
            />
              {errors.Email && <><br /><span className="error-message">{errors.Email}</span></>}
          </div>
        <div className='form-group'>
              <label htmlFor="Question1" className='form-label'>Security Question 1:</label>
             <select
               id="Question1"
                name="Question1"
                value={formData.Question1}
                onChange={handleInputChange}
               required
              >
                <option value="DEFAULT" disabled>Select your security question</option>
               <option value="What is your mother\'s maiden name?">What is your mother's maiden name?</option>
               <option value="What is the name of your first pet?">What is the name of your first pet?</option>
               <option value="In which city were you born?">In which city were you born?</option>
              </select>
            </div>
            <div className='form-group'>
                <label htmlFor="Answer1" className='form-label'>Answer:</label>
              <input
                type="text"
                id="Answer1"
                name="Answer1"
                value={formData.Answer1}
                onChange={handleInputChange}
               required
                className='form-input'
               placeholder="Answer 1"
              />
           </div>

            <div className='form-group'>
             <label htmlFor="Question2" className='form-label'>Security Question 2:</label>
             <select
              id="Question2"
              name="Question2"
              value={formData.Question2}
              onChange={handleInputChange}
              required
             >
               <option value="DEFAULT" disabled>Select your security question</option>
                <option value="What is your mother\'s maiden name?">What is your mother's maiden name?</option>
               <option value="What is the name of your first pet??">What is the name of your first pet?</option>
               <option value="In which city were you born?">In which city were you born?</option>
             </select>
             </div>
              <div className='form-group'>
                <label htmlFor="Answer2" className='form-label'>Answer:</label>
                <input
                type="text"
                id="Answer2"
                name="Answer2"
                value={formData.Answer2}
                onChange={handleInputChange}
               required
                className='form-input'
               placeholder="Answer 2"
              />
           </div>
           <div className='form-group'>
            <label htmlFor="Password" className='form-label'> New Password:</label>
            <input
              type="Password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleInputChange}
              required
              className={`form-input ${errors.Password ? 'error' : ''}`}
            />
              {errors.Password && <><br /><span className="error-message">{errors.Password}</span></>}
          </div>
          
          {successMessage && (<p className="success-message">{successMessage}</p>)}
        <button type="submit" className="submit-button">Update Password</button>
      </form>
      <button onClick={handleLoginClick} className='form-button'>Login</button>
      <button onClick={handleRegisterClick} className='form-button'>Register</button>
    </div>
  );
}

export default ConfirmForgotPass;

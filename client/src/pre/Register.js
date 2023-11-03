import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    FirstName: '',
    LastName: '',
    SSN: '',
    PhoneNumber: '',
    DOB: '',
    Street: '',
    Street2: '',
    City: '',
    State: '',
    ZIP: '',
    // Add more fields as needed for registration (e.g., name, email, etc.)
  });

  const [formErrors, setFormErrors] = useState({
    Email: '',
    Password: '',
    FirstName: '',
    LastName: '',
    SSN: '',
    PhoneNumber: '',
    DOB: '',
    Street: '',
    Street2: '',
    City: '',
    State: '',
    ZIP: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'SSN' && value.length !== 9) {
      error = 'Invalid SSN.';
    }
    if (name === 'PhoneNumber' && value.length !== 10) {
      error = 'Invalid Phone Number.';
    }
  
    setFormErrors({ ...formErrors, [name]: error });
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const isFormValid = () => {
    return (
      !Object.values(formErrors).some((error) => error) && 
      formData.email &&
      formData.password &&
      formData.FirstName &&
      formData.LastName &&
      formData.SSN &&
      formData.PhoneNumber &&
      formData.DOB &&
      formData.Street &&
      formData.City &&
      formData.State &&
      formData.ZIP
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      const response = await axios.put('/customer/register', formData);
  
      if (response.status === 200) {
        console.log('Customer registered successfully:', response.data);
      } else {
        console.error('Error registering customer:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='container'>
      <h1>Welcome to Summit Financial</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-columns">
          <div className='form-group'>
            <label htmlFor="email" className='form-label'>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="password" className='form-label'>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="FirstName" className='form-label'>First Name:</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleInputChange}
              required
              pattern="[A-Za-z]+"
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="LastName" className='form-label'>Last Name:</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={formData.LastName}
              onChange={handleInputChange}
              required
              pattern="[A-Za-z]+"
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="SSN" className='form-label'>SSN:</label>
            <input
              type="text"
              id="SSN"
              name="SSN"
              value={formData.SSN}
              onChange={handleInputChange}
              required
              pattern="\d{3}-\d{2}-\d{4}|\d{9}"
              className='form-input'
            />
            {formErrors.SSN && <p className="error-message">{formErrors.SSN}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="PhoneNumber" className='form-label'>Phone Number:</label>
            <input
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              className='form-input'
            />
          {formErrors.PhoneNumber && <p className="error-message">{formErrors.PhoneNumber}</p>}
          </div>
        </div>
        <div className="form-columns">
          
          <div className='form-group'>
            <label htmlFor="DOB" className='form-label'>Date of Birth:</label>
            <input
              type="date"
              id="DOB"
              name="DOB"
              value={formData.DOB}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="Street" className='form-label'>Address Line 1:</label>
            <input
              type="text"
              id="Street"
              name="Street"
              value={formData.Street}
              onChange={handleInputChange}
              required
              pattern="^[A-Za-z0-9\s]+$"
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="Street2" className='form-label'>Address Line 2:</label>
            <input
              type="text"
              id="Street2"
              name="Street2"
              value={formData.Street2}
              onChange={handleInputChange}
              pattern="^[A-Za-z0-9\s]+$"
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="City" className='form-label'>City:</label>
            <input
              type="text"
              id="City"
              name="City"
              value={formData.City}
              onChange={handleInputChange}
              required
              pattern="[A-Za-z]+"
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="State" className='form-label'>State:</label>
            <select
              id="State"
              name="State"
              value={formData.State}
              onChange={handleInputChange}
              required
            >
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor="ZIP" className='form-label'>Zipcode:</label>
            <input
              type="text"
              id="ZIP"
              name="ZIP"
              value={formData.ZIP}
              onChange={handleInputChange}
              required
              pattern="[0-9]{5}"
              className='form-input'
            />
          </div>
          </div>
        <button type="submit" className='form-button' disabled={!isFormValid()}>Register</button>
      </form>
      <div className="form-links">
        <a href="/Login">Login</a>
        <br />
        <a href="/ForgotPass">Forgot Password</a>
      </div>
    </div>
  );
}

export default Register;

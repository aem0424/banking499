import React, { useState } from 'react';
import './Register.css';
//import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    ssn: '',
    phoneNumber: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipcode: '',
    // Add more fields as needed for registration (e.g., name, email, etc.)
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className='container'>
      <h1>Welcome to Summit Financial</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-columns">
          <div className='form-group'>
            <label htmlFor="username" className='form-label'>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
            <label htmlFor="firstName" className='form-label'>First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="lastName" className='form-label'>Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="ssn" className='form-label'>SSN:</label>
            <input
              type="text"
              id="ssn"
              name="ssn"
              value={formData.ssn}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="phoneNumber" className='form-label'>Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
        </div>
        <div className="form-columns">
          
          <div className='form-group'>
            <label htmlFor="dateOfBirth" className='form-label'>Date of Birth: Change input format</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="addressLine1" className='form-label'>Address Line 1:</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="addressLine2" className='form-label'>Address Line 2:</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="city" className='form-label'>City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label htmlFor="state" className='form-label'>State:</label>
            <select
              id="state"
              name="state"
              value={formData.state}
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
            <label htmlFor="zipcode" className='form-label'>Zipcode:</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              required
              className='form-input'
            />
          </div>
          </div>
        <button type="submit" className='form-button'>Register</button>
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
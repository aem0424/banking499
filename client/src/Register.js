import React, { useState } from 'react';
//import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Register</button>
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
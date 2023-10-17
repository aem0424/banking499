import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const response = await axios.post(' http://localhost:4000/user/login', { "email":email, "password" : password });
      if (response.data) {
        // Login successful, you can redirect the user or perform other actions here.
        console.log('Login successful:', response.data);
      } else {
        // Handle the case where login is unsuccessful (e.g., display an error message).
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any unexpected errors.
    }
  };

  return (
    <div className='container'>
      <h1>Welcome to Summit Financial</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
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
        <button type="submit">Login</button>
      </form>
      <div className="form-links">
        <a href="/Register">Register</a>
        <br />
        <a href="/ForgotPass">Forgot Password</a>
      </div>
    </div>
  );
}

export default Login;

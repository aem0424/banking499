import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError(null); // Clear any previous error messages

    try {
      const response = await axios.post('http://localhost:4000/user/login', { "Email" : email, "Password" : password });;

      if (response.data) {
        console.log('Login successful:', response.data);
        setUser(response.data);
        navigate('/Admin', {state:{user:response.data}});
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Login;
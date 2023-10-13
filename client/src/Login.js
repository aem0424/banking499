import React, { useState } from 'react';
import './Login.css';
import { getUserLogin } from '../server/database';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
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
    const { username, password } = formData;
    // You can perform your login logic here, such as sending a request to a server.
    try {
      const user = await getUserLogin(username, password);

      if (user) {
        // Login successful, you can redirect the user or perform other actions here.
        console.log('Login successful:', user);
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

// frontend/src/components/user/login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/v1/login', { email, password }, { withCredentials: true });
        
        // Store user info or token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Navigate to the user dashboard
        navigate('/dashboard');
    } catch (err) {
        // Handle errors
        if (err.response) {
          setError(err.response.data.message || 'Something went wrong');
        } else if (err.request) {
          setError('No response from server. Check your backend configuration.');
        } else {
          setError('Error occurred during the request: ' + err.message);
        }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

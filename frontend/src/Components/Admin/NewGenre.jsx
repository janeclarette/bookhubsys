// frontend/Admin/NewGenre.jsx
import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const NewGenre = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/genres', { name }); // Updated endpoint
      navigate('/admin/genres'); 
    } catch (error) {
      console.error('Error creating genre:', error);
    }
  };

  return (
    <div>
      <h1>Add New Genre</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Genre Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Add Genre</button>
      </form>
    </div>
  );
};

export default NewGenre;

// frontend/Admin/UpdateGenre.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateGenre = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await axios.get(`/genres/${id}`); // Updated endpoint
        setName(response.data.genre.name);
      } catch (error) {
        console.error('Error fetching genre:', error);
      }
    };
    fetchGenre();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/genres/${id}`, { name }); // Updated endpoint
      navigate('/admin/genres'); 
    } catch (error) {
      console.error('Error updating genre:', error);
    }
  };

  return (
    <div>
      <h1>Update Genre</h1>
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
        <button type="submit">Update Genre</button>
      </form>
    </div>
  );
};

export default UpdateGenre;

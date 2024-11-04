// frontend/Admin/GenreList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const GenreList = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres'); // Updated endpoint
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const deleteGenre = async (id) => {
    try {
      await axios.delete(`/genres/${id}`); // Updated endpoint
      setGenres(genres.filter(genre => genre._id !== id));
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  return (
    <div>
      <h1>Genres List</h1>
      <Link to="/admin/genres/new">Add New Genre</Link>
      <ul>
        {genres.map(genre => (
          <li key={genre._id}>
            <h2>{genre.name}</h2>
            <button onClick={() => deleteGenre(genre._id)}>Delete</button>
            <Link to={`/admin/genres/update/${genre._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;

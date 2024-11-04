// Components/Admin/AuthorList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors'); // Updated endpoint
      setAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await axios.delete(`/authors/${id}`); // Updated endpoint
      setAuthors(authors.filter(author => author._id !== id));
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  return (
    <div>
      <h1>Authors List</h1>
      <Link to="/admin/authors/new">Add New Author</Link> 
      <ul>
        {authors.map(author => (
          <li key={author._id}>
            <h2>{author.name}</h2>
            <p>{author.bio}</p>
            <div>
              {author.imagePath.map((image, index) => (
                <img key={index} src={image} alt={`${author.name} ${index + 1}`} width="100" />
              ))}
            </div>
            <button onClick={() => deleteAuthor(author._id)}>Delete</button>
            <Link to={`/admin/authors/update/${author._id}`}>Edit</Link> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;

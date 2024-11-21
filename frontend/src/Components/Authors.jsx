// Authors.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from '../utils/axiosConfig'; // Axios instance for API calls
import Navbar from './Layout/Navbar';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors');
      setAuthors(response.data.authors);
      setFilteredAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const filterAuthorsByLetter = (letter) => {
    setSelectedLetter(letter);
    const filtered = authors.filter((author) =>
      author.name.charAt(0).toUpperCase() === letter.toUpperCase()
    );
    setFilteredAuthors(filtered);
  };

  const viewAuthorWorks = (authorId) => {
    navigate(`/authorworks/${authorId}`); // Navigate to the AuthorsWorks page
  };

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(65 + i));

  return (
    <div>
      <Navbar />
      <h1>Authors</h1>
      <div style={styles.alphabetList}>
        {alphabet.map((letter) => (
          <button
            key={letter}
            style={styles.letterButton}
            onClick={() => filterAuthorsByLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div style={styles.authorList}>
        {filteredAuthors.length === 0 ? (
          <p>No authors found.</p>
        ) : (
          filteredAuthors.map((author) => (
            <div key={author._id} style={styles.authorCard}>
              <img
                src={author.imagePath[0] || 'default.jpg'}
                alt={author.name}
                style={styles.authorImage}
              />
              <h3>{author.name}</h3>
              <p>{author.bio}</p>
              {/* Add the View Works button */}
              <button
                style={styles.viewWorksButton}
                onClick={() => viewAuthorWorks(author._id)}
              >
                View Works
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  alphabetList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  letterButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  authorList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  authorCard: {
    width: '250px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  authorImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  viewWorksButton: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Authors;

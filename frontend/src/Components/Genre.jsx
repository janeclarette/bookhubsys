import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; // Axios instance for API calls
import Navbar from './Layout/Navbar';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch genres and books data
  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  // Fetch genres from the backend
  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  // Fetch books from the backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle genre checkbox change
  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, genreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    }
  };

  // Filter books based on selected genres
  const filteredBooks = books.filter((book) => 
    selectedGenres.length === 0 || selectedGenres.includes(book.genreId._id)
  );

  return (
    <div>
    <Navbar /> {/* Render the Navbar here */}
      <h1>Genres</h1>

      {/* Genre Checkboxes */}
      <div style={styles.genreCheckboxes}>
        <h3>Filter by Genre:</h3>
        {genres.map((genre) => (
          <label key={genre._id} style={styles.genreCheckbox}>
            <input 
              type="checkbox" 
              value={genre._id} 
              onChange={handleGenreChange} 
            />
            {genre.name}
          </label>
        ))}
      </div>

      {/* Display Books */}
      <h2>Books</h2>
      <div style={styles.bookGrid}>
        {filteredBooks.map((book) => (
          <div key={book._id} style={styles.bookCard}>
            <img src={book.images[0]?.url || 'default.jpg'} alt={book.title} style={styles.bookImage} />
            <h3>{book.title}</h3>
            <p>Author: {book.authorId.name}</p>
            <p>Price: ${book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  genreCheckboxes: {
    marginBottom: '20px',
  },
  genreCheckbox: {
    display: 'block',
    marginBottom: '10px',
  },
  bookGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  bookCard: {
    width: '200px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  bookImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
};

export default Genre;

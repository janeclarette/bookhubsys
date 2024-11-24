import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; // Axios instance for API calls
import Navbar from './Layout/Navbar';
import { Box, Typography, Checkbox, FormControlLabel, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

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
    <Box sx={styles.container}>
      <Navbar /> {/* Render the Navbar here */}
      
      <Typography variant="h4" sx={styles.pageTitle}>Genres</Typography>

      {/* Genre Checkboxes */}
      <Box sx={styles.genreCheckboxes}>
        <Typography variant="body1" sx={styles.filterTitle}>Filter by Genre:</Typography>
        {genres.map((genre) => (
          <FormControlLabel
            key={genre._id}
            control={
              <Checkbox 
                value={genre._id} 
                onChange={handleGenreChange} 
                color="primary" 
              />
            }
            label={genre.name}
            sx={styles.genreLabel}
          />
        ))}
      </Box>

      {/* Display Books */}
      <Typography variant="h5" sx={styles.booksTitle}>Books</Typography>
      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4}>
            <Card sx={styles.bookCard}>
              <CardMedia
                component="img"
                height="200"
                image={book.images[0]?.url || 'default.jpg'}
                alt={book.title}
                sx={styles.bookImage}
              />
              <CardContent>
                <Typography variant="body1" sx={styles.bookTitle}>{book.title}</Typography>
                <Typography variant="body2" sx={styles.bookText}>
                  Author: {book.authorId.name}
                </Typography>
                <Typography variant="body2" sx={styles.bookText}>
                  Price: ${book.price}
                </Typography>
                <Button variant="contained" color="primary" sx={styles.bookButton}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Styles for the component
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: '30px',
       color: '#333',
    fontSize: '26px', // Larger font size
    marginTop: '50px',
  },
  filterTitle: {
    marginBottom: '15px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '17px', // Adjusted font size for the filter title
    
  },
  genreCheckboxes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  genreLabel: {
    fontSize: '14px', // Adjusted font size for genre labels
   
    fontWeight: 'normal',
  },
  booksTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '18px', // Smaller font size for book title
  },
  bookCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  bookImage: {
    objectFit: 'cover',
    borderRadius: '10px',
  },
  bookButton: {
    marginTop: '18px',
    backgroundColor: '#800080',
    '&:hover': {
      backgroundColor: '#6a006a',
    },
  },
  bookTitle: {
    fontSize: '18px', // Smaller font size for book titles
   
    fontWeight: 'bold',
  },
  bookText: {
    fontSize: '15px', // Smaller font size for book details
   
    color: 'textSecondary',
  },
};

export default Genre;

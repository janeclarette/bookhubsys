import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; 
import Navbar from './Layout/Navbar';
import Header from './Layout/Header'; 
import Footer from './Layout/Footer'; 
import { CssBaseline, GlobalStyles, Box, Typography, TextField, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(''); // New state for ratings
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      const reviewsResponse = await axios.get('/v1/reviews');
      const reviews = reviewsResponse.data.reviews;

      const books = response.data.books.map((book) => {
        const bookReviews = reviews.filter(review => review.bookId === book._id);
        const averageRating = bookReviews.length
          ? bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length
          : 0;

        return {
          ...book,
          authorName: book.authorId ? book.authorId.name : 'Unknown Author',
          imageUrl: book.images && book.images.length > 0 ? book.images[0].url : 'https://via.placeholder.com/150',
          averageRating: averageRating.toFixed(1), // Include ratings
        };
      });

      setBooks(books);
      setFilteredBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle Price Range Change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Ratings Filter Change
  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value); 
  };

  // Apply Filters
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.price >= priceRange.min &&
        book.price <= priceRange.max &&
        (selectedRating === '' || Math.round(book.averageRating) === parseInt(selectedRating))
    );
    setFilteredBooks(filtered);
  }, [priceRange, selectedRating, books]);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ddd' }}>★</span>
      );
    }
    return stars;
  };

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Navbar />
      <Header />

      <Typography variant="h4" sx={styles.headerText}>Home - Book Collection</Typography>

      {/* Price Filter */}
      <Box sx={styles.filterContainer}>
        <TextField
          label="Min Price"
          type="number"
          name="min"
          value={priceRange.min}
          onChange={handlePriceChange}
          sx={styles.textField}
        />
        <TextField
          label="Max Price"
          type="number"
          name="max"
          value={priceRange.max}
          onChange={handlePriceChange}
          sx={styles.textField}
        />
      </Box>

      {/* Ratings Filter */}
      <Box sx={styles.filterContainer}>
        <Typography variant="body1">Filter by Rating:</Typography>
        <RadioGroup row value={selectedRating} onChange={handleRatingChange}>
          {[1, 2, 3, 4, 5].map(rating => (
            <FormControlLabel key={rating} value={rating.toString()} control={<Radio />} label={`${rating} Star`} />
          ))}
          <FormControlLabel value="" control={<Radio />} label="All Ratings" />
        </RadioGroup>
      </Box>

      {/* Book Grid */}
      <Box sx={styles.bookGrid}>
        {filteredBooks.map((book) => (
          <Box key={book._id} sx={styles.bookCard}>
            <img src={book.imageUrl} alt={book.title} style={styles.bookImage} />
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">Author: {book.authorName}</Typography>
            <Typography variant="body2">Price: ${book.price}</Typography>
            <Box sx={styles.ratingContainer}>
              {renderStars(book.averageRating)}
            </Box>
            <Box sx={styles.buttonContainer}>
              <IconButton onClick={() => console.log(`Adding book ${book._id} to cart`)} sx={styles.iconButton}>
                <AddShoppingCartIcon sx={styles.icon} />
              </IconButton>
              <IconButton onClick={() => navigate(`/book/${book._id}`)} sx={styles.iconButton}>
                <VisibilityIcon sx={styles.icon} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Footer />
    </Box>
  );
};

const globalStyles = {
  body: {
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: "'Lora', serif",
  },
  '*': {
    boxSizing: 'border-box',
  },
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  headerText: { textAlign: 'center', marginTop: '20px' },
  filterContainer: { display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' },
  textField: { width: '150px' },
  bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', padding: '20px' },
  bookCard: { backgroundColor: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } },
  bookImage: { width: '100%', borderRadius: '4px', marginBottom: '10px' },
  ratingContainer: { margin: '10px 0' },
  buttonContainer: { display: 'flex', justifyContent: 'space-between' },
  iconButton: { color: '#f5a623' },
  icon: { fontSize: '1.5rem' },
};

export default Home;

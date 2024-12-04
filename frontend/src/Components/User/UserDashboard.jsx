import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton, CssBaseline, GlobalStyles, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(''); 
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/me', { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        const reviewsResponse = await axios.get('http://localhost:5000/api/v1/reviews');
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
            averageRating: averageRating.toFixed(1),
          };
        });

        setBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchUserProfile();
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(
      (book) => 
        book.price >= priceRange.min && 
        book.price <= priceRange.max &&
        (selectedRating === '' || Math.round(book.averageRating) === parseInt(selectedRating))
    );
    setFilteredBooks(filtered);
  }, [priceRange, selectedRating, books]);
  

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value); 
  };

  const handleAddToCart = async (book) => {
    try {
      await axios.post('http://localhost:5000/api/v1/cart', {
        bookId: book._id,
        userId: user._id,
      });
      setCart([...cart, { bookId: book._id, bookTitle: book.title }]);
    } catch (error) {
      setError('Failed to add book to cart');
    }
  };

  const viewDetails = (bookId) => {
    console.log(`Viewing details for book with ID ${bookId}`);
  };

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

      {user && (
        <Box sx={styles.userInfo}>
          <Box sx={styles.avatarContainer}>
            <img 
              src={user?.avatar?.url || 'https://via.placeholder.com/50'} 
              alt="User Avatar" 
              style={styles.avatar} 
            />
          </Box>
          <Box sx={styles.userDetails}>
            <Typography variant="h5" sx={styles.userName}>
              Welcome, {user?.name}
            </Typography>
            <Typography variant="body2" sx={styles.userEmail}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      )}


      <Header />
      <Typography variant="h4" sx={styles.headerText}>Home - Book Collection</Typography>


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

      <Box sx={styles.filterContainer}>
        <Typography variant="body1">Filter by Rating:</Typography>
        <RadioGroup row value={selectedRating} onChange={handleRatingChange}>
          {[1, 2, 3, 4, 5].map(rating => (
            <FormControlLabel key={rating} value={rating.toString()} control={<Radio />} label={`${rating} Star`} />
          ))}
          <FormControlLabel value="" control={<Radio />} label="All Ratings" />
        </RadioGroup>
      </Box>

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
              <IconButton onClick={() => handleAddToCart(book)} sx={styles.iconButton}>
                <AddShoppingCartIcon sx={styles.icon} />
              </IconButton>
              <IconButton onClick={() => viewDetails(book._id)} sx={styles.iconButton}>
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    marginBottom: '10px',
    flexDirection: 'row',
    gap: '20px',
    justifyContent: 'left',
    '@media (max-width: 700px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #f5a623',
    marginTop: '20px',
    marginBottom: '-10px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '10px',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#333',
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#777',
  },
  headerText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0',
    gap: '10px',
  },
  textField: {
    width: '150px',
  },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  bookCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  bookImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  ratingContainer: {
    margin: '10px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconButton: {
    color: '#f5a623',
  },
  icon: {
    fontSize: '1.5rem',
  },
};

export default UserDashboard;

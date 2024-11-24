import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton, CssBaseline, GlobalStyles } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header'; // Importing the Header component
import { width } from '@mui/system';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
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
        const books = response.data.books.map((book) => ({
          ...book,
          authorName: book.authorId ? book.authorId.name : 'Unknown Author',
          imageUrl: book.images && book.images.length > 0 ? book.images[0].url : 'https://via.placeholder.com/150',
        }));
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
      (book) => book.price >= priceRange.min && book.price <= priceRange.max
    );
    setFilteredBooks(filtered);
  }, [priceRange, books]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
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

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Navbar />

      {/* User Info */}
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

      {/* Header Component */}
      <Header />

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

      {/* Book Grid */}
      <Box sx={styles.bookGrid}>
        {filteredBooks.map((book) => (
          <Box key={book._id} sx={styles.bookCard}>
            <img src={book.imageUrl} alt={book.title} style={styles.bookImage} />
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">Author: {book.authorName}</Typography>
            <Typography variant="body2">Price: ${book.price}</Typography>
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

// Styles
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
    marginBottom: '20px',
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
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#333',
  },
  userEmail: {
    color: '#777',
    fontSize: '1rem',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  textField: {
    width: '200px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      padding: '0 12px',
    },
  },
  bookGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  bookCard: {
    width: 200,
    padding: 2,
    border: '1px solid #ddd',
    borderRadius: 2,
    textAlign: 'center',
    boxShadow: 2,
    backgroundColor: '#fff',
  },
  bookImage: {
    width: '100%',
    height: 'auto',
    borderRadius: 2,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  iconButton: {
    backgroundColor: '#f5a623',
    borderRadius: '50%',
    padding: '10px',
    '&:hover': {
      backgroundColor: '#f39c12',
    },
  },
  icon: {
    fontSize: '24px',
    color: '#fff',
  },
};

export default UserDashboard;

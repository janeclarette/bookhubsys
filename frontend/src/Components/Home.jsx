// Home.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; 
import Navbar from './Layout/Navbar';
import Header from './Layout/Header'; 
import Footer from './Layout/Footer'; 
import { CssBaseline, GlobalStyles, Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      const books = response.data.books.map((book) => ({
        ...book,
        authorName: book.authorId ? book.authorId.name : 'Unknown Author',
        imageUrl: book.images && book.images.length > 0 ? book.images[0].url : 'https://via.placeholder.com/150',
      }));
      setBooks(books);
      setFilteredBooks(books); // Initially, show all books
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle Price Range Change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Price Filter
  useEffect(() => {
    const filtered = books.filter(
      (book) => book.price >= priceRange.min && book.price <= priceRange.max
    );
    setFilteredBooks(filtered);
  }, [priceRange, books]);

  // Add to Cart Function
  const addToCart = (bookId) => {
    const isLoggedIn = false; // Replace with actual login status check
    if (!isLoggedIn) {
      setShowPopup(true); // Show popup if not logged in
    } else {
      console.log(`Adding book with ID ${bookId} to cart`);
    }
  };

  // View Details Function
  const viewDetails = (bookId) => {
    navigate(`/viewdetails/${bookId}`); // Navigate to ViewDetails page with bookId as a parameter
  };

  // Close Popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <Box sx={styles.container}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            backgroundColor: '#f4f4f4',
            boxSizing: 'border-box',
            fontFamily: "'Lora', serif", // Apply the new font globally
          },
          '*': {
            boxSizing: 'border-box',
          },
        }}
      />
      
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

      {/* Book Grid */}
      <Box sx={styles.bookGrid}>
        {filteredBooks.map((book) => (
          <Box key={book._id} sx={styles.bookCard}>
            <img
              src={book.imageUrl || 'https://via.placeholder.com/150'}
              alt={book.title}
              style={styles.bookImage}
            />
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">Author: {book.authorName}</Typography>
            <Typography variant="body2">Price: ${book.price}</Typography>
            <Box>
              <span>⭐</span>
            </Box>
            <Box sx={styles.buttonContainer}>
              <IconButton onClick={() => addToCart(book._id)} sx={styles.iconButton}>
                <AddShoppingCartIcon sx={styles.icon} />
              </IconButton>
              <IconButton onClick={() => viewDetails(book._id)} sx={styles.iconButton}>
                <VisibilityIcon sx={styles.icon} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Popup Modal */}
      <Dialog open={showPopup} onClose={closePopup}>
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            You need to sign in or register to add items to your cart.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} sx={styles.closeButton}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer /> {/* Include the Footer Component */}
    </Box>
  );
};

const styles = {
  container: {
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure the footer stays at the bottom when content is short
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
    padding: '0 20px',
    flexGrow: 1,
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
    backgroundColor: '#f5a623', // Cute yellow background
    borderRadius: '50%',
    padding: '10px',
    '&:hover': {
      backgroundColor: '#f39c12', // Darker yellow on hover
    },
  },
  icon: {
    fontSize: '24px',
    color: '#fff',
  },
  headerText: {
    marginBottom: '20px',
    fontFamily: "'Lora', serif",
  },
  closeButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
};

export default Home;

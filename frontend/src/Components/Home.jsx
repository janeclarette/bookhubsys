import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig'; // Axios instance for API calls
import Navbar from './Layout/Navbar';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

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
    console.log(`Viewing details for book with ID ${bookId}`);
  };

  // Close Popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Navbar />
      <h1>Home - Book Collection</h1>

      {/* Price Filter */}
      <div style={styles.filterContainer}>
        <label>
          Min Price:
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            style={styles.filterInput}
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            style={styles.filterInput}
          />
        </label>
      </div>

      {/* Book Grid */}
      <div style={styles.bookGrid}>
        {filteredBooks.map((book) => (
          <div key={book._id} style={styles.bookCard}>
            <img
              src={book.imageUrl || 'https://via.placeholder.com/150'}
              alt={book.title}
              style={styles.bookImage}
            />
            <h3>{book.title}</h3>
            <p>Author: {book.authorName}</p>
            <p>Price: ${book.price}</p>
            <div>
              <span>⭐</span>
            </div>
            <button onClick={() => addToCart(book._id)} style={styles.button}>
              Add to Cart
            </button>
            <button onClick={() => viewDetails(book._id)} style={styles.button}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2>Sign In Required</h2>
            <p>You need to sign in or register to add items to your cart.</p>
            <button onClick={closePopup} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for layout and book cards
const styles = {
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  filterInput: {
    marginLeft: '10px',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
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
  button: {
    marginTop: '10px',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
    marginRight: '10px',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Home;




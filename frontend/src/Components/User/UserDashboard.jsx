// frontend/src/components/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar'; // Import the general Navbar component

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]); // State to store fetched books
  const [filteredBooks, setFilteredBooks] = useState([]); // State for filtered books
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 }); // State for price range filter
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // State to store cart items

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
        setFilteredBooks(books); // Initially show all books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchUserProfile();
    fetchBooks(); // Fetch books when the dashboard is loaded
  }, []);

  useEffect(() => {
    const filtered = books.filter(
      (book) => book.price >= priceRange.min && book.price <= priceRange.max
    );
    setFilteredBooks(filtered);
  }, [priceRange, books]);

  const handleAddToCart = async (book) => {
    try {
      // Send the book data to the backend (add to the user's cart)
      await axios.post('http://localhost:5000/api/v1/cart', {
        bookId: book._id,
        userId: user._id,
      });
  
      // Update the local cart state immediately after adding
      setCart([...cart, { bookId: book._id, bookTitle: book.title }]);
  
      console.log('Book added to cart');
  
    } catch (error) {
      console.error('Error adding book to cart:', error);
      setError('Failed to add book to cart');
    }
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Custom Navbar with User Info */}
      <div style={styles.userNavbar}>
        <div style={styles.userInfo}>
          <img src={user?.avatar?.url} alt="User Avatar" style={styles.avatar} />
          <div style={styles.userDetails}>
            <h3 style={styles.userWelcome}>Welcome, {user?.name}</h3>
          </div>
        </div>
        <p style={styles.userEmail}>{user?.email}</p>
      </div>

      {/* General Navbar Component */}
      <Navbar />

      <h2>Your Dashboard</h2>

      {/* Price Filter */}
      <div style={styles.filterContainer}>
        <label>
          Min Price:
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            style={styles.filterInput}
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
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
            <button style={styles.button} onClick={() => handleAddToCart(book)}>Add to Cart</button>
            <button style={styles.button}>View Details</button>
          </div>
        ))}
      </div>

    </div>
  );
};

// Styles for layout and user-specific navbar
const styles = {
  userNavbar: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderBottom: '3px solid #ddd',
    marginBottom: '10px',
    padding: '10px 20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Space between avatar and user details (Welcome, Email)
    width: '100%',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column', // Align the text vertically
    justifyContent: 'center',
  },
  userWelcome: {
    fontSize: '24px', // Font size for welcome text
    fontWeight: '700', // Bold
    color: '#333', // Text color
    margin: '0', // Remove margin
    padding: '0', // Optional: Adjust padding if needed
    textAlign: 'left', // Align to left of the user info block
  },
  userEmail: {
    display: 'flex',
    flexDirection: 'column', // Align the text vertically
    justifyContent: 'center',
    fontSize: '16px',
    color: '#777',
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: '20px',    
  },
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
  cartContainer: {
    marginTop: '30px',
    padding: '10px',
    borderTop: '3px solid #ddd',
    textAlign: 'center',
  },
  cartList: {
    listStyleType: 'none',
    padding: 0,
  },
  cartItem: {
    margin: '5px 0',
    fontSize: '16px',
  },
};

export default UserDashboard;

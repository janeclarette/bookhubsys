// frontend/src/components/Layout/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import { FaShoppingCart, FaSignInAlt, FaUserPlus, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Use the navigate hook

  useEffect(() => {
    // Get user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser); // Set the user if found in localStorage
    }
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage and update state
    localStorage.removeItem('user');
    setUser(null);
    
    // Redirect to Home after logout
    navigate('/');  // Navigate to home page
  };

  const handleCartClick = () => {
    // Navigate to cart only if logged in
    if (!user) {
      // If the user is not logged in, show a modal or alert
      alert('You must log in first!');
    } else {
      navigate('/cart'); // Navigate to cart if user is logged in
    }
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          {/* Conditionally render the "Home" link */}
          <Link to={user ? "/dashboard" : "/"} style={styles.navLink}>
            Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/genres" style={styles.navLink}>Genres</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/authors" style={styles.navLink}>Authors</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/about" style={styles.navLink}>About Us</Link>
        </li>
      </ul>
      <ul style={styles.authList}>
        <li style={styles.navItem}>
          <span 
            style={styles.navLink} 
            onClick={handleCartClick} // Make sure this is clickable
            title={user ? 'Go to Cart' : 'Log in to view cart'}
          >
            <FaShoppingCart /> 
          </span>
        </li>
        {!user ? (
          <>
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/register" style={styles.navLink}>
                <FaUserPlus /> Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li style={styles.navItem}>
              <Link to="/profile" style={styles.navLink}>
                <FaCog />
              </Link>
            </li>
            <li style={styles.navItem}>
            <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
            </button>
            </li>

          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
    navbar: {
        fontFamily: '"Times New Roman", serif',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      background: '#333',
      color: '#fff',
    },
    navList: {
      display: 'flex',
      listStyle: 'none',
    },
    authList: {
      display: 'flex',
      listStyle: 'none',
    },
    navItem: {
      marginRight: '20px',
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    logoutButton: {
      background: 'none', // Remove background
      border: 'none', // Remove border
      color: '#fff', // Keep the text color consistent with other links
      textDecoration: 'none', // Remove any underline
      cursor: 'pointer', // Pointer for clickable appearance
      fontSize: 'inherit', // Match the font size of other nav items
      fontFamily: '"Times New Roman", serif',
    },
  };
  

export default Navbar;

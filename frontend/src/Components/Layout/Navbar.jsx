import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { FaShoppingCart, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Importing icons for login and register
import Modal from 'react-modal'; // Importing react-modal for the popup

// Ensure that you bind modal to your app element for accessibility (this can be done in the App.js or index.js file)
Modal.setAppElement('#root');

const Navbar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control the modal visibility

  // Function to open the modal when cart icon is clicked
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        {/* Left side links */}
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>Home</Link>
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
        <li style={styles.navItem}>
          <Link to="/popular" style={styles.navLink}>Popular</Link>
        </li>
        <li style={styles.navItem}>
          <button onClick={openModal} style={styles.cartButton}>
            <FaShoppingCart style={styles.cartIcon} />
          </button>
        </li>
      </ul>

      {/* Right side links */}
      <ul style={styles.authList}>
        <li style={styles.navItem}>
          <Link to="/login" style={styles.navLink}>
            <FaSignInAlt style={styles.icon} />
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/register" style={styles.navLink}>
            <FaUserPlus style={styles.icon} />
          </Link>
        </li>
      </ul>

      {/* Modal Popup */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login/Register Required"
        style={modalStyles}
      >
        <h2>Please log in or register to access your cart</h2>
        <button onClick={closeModal} style={styles.closeModalButton}>Close</button>
        <div>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <span> or </span>
          <Link to="/register" style={styles.navLink}>Register</Link>
        </div>
      </Modal>
    </nav>
  );
};

// Styles for the navbar
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  authList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginRight: '30px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    background: '#333',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  cartButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  cartIcon: {
    fontSize: '20px',
  },
  icon: {
    marginRight: '8px',
    fontSize: '16px',
  },
  closeModalButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

// Styles for the modal
const modalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBook, FaLayerGroup, FaBox, FaSignOutAlt } from 'react-icons/fa';
import bookhubLogo from '../../assets/img/bookhublogo.png';
import bookhubIcon from '../../assets/img/bookhubIcon.gif';

const Sidebar = ({ onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // To navigate after logout

  const navItemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    marginBottom: '20px',
    padding: '10px 15px',
    borderRadius: '25px',
    textDecoration: 'none',
    backgroundColor: location.pathname === path ? '#9e1c63' : 'transparent',
    color: location.pathname === path ? '#ffffff' : '#262222',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      background: 'linear-gradient(135deg, #9e1c63, #c6a0e5)',
      color: 'white',
    },
  });

  const iconStyle = {
    fontSize: '24px',
    marginRight: '10px',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
  };

  const handleLogout = () => {
    // Clear user authentication (this depends on your authentication setup)
    // For example, you can clear localStorage or a token from a global state
    localStorage.removeItem('authToken'); // Example
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div
      style={{
        userSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: isHovered ? '250px' : '60px',
        height: '95vh',
        backgroundColor: '#f2f4ff',
        color: '#262222',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px 10px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        transition: 'width 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img
            src={bookhubIcon}
            alt="Book Hub Icon"
            style={{ width: '60px', marginLeft: '1px' }}
          />
          <img
            src={bookhubLogo}
            alt="Book Hub Logo"
            style={{
              width: isHovered ? '150px' : '0px',
              transition: 'width 0.3s ease',
              visibility: isHovered ? 'visible' : 'hidden',
            }}
          />
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[ 
              { to: '/admin', icon: <FaTachometerAlt style={iconStyle} />, label: 'Dashboard' },
              { to: '/admin/authors', icon: <FaUser style={iconStyle} />, label: 'Author Management' },
              { to: '/admin/genres', icon: <FaLayerGroup style={iconStyle} />, label: 'Genre Management' },
              { to: '/admin/suppliers', icon: <FaBox style={iconStyle} />, label: 'Supplier Management' },
              { to: '/admin/books', icon: <FaBook style={iconStyle} />, label: 'Book Management' },
            ].map(({ to, icon, label }, index) => (
              <li key={index} style={{ marginBottom: '20px' }}>
                <Link to={to} style={navItemStyle(to)}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <span
                      style={{
                        marginLeft: '10px',
                        opacity: isHovered ? 1 : 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div style={{ marginTop: '0', marginBottom: '0px' }}>
        <Link to="#" style={navItemStyle("#")} onClick={handleLogout}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <FaSignOutAlt style={iconStyle} />
            <span
              style={{
                marginLeft: '0px',
                opacity: isHovered ? 1 : 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transition: 'opacity 0.3s ease',
              }}
            >
              Logout
            </span>
          </span>
        </Link>
      </div>

      <div
        style={{
          marginLeft: '10px',
          opacity: isHovered ? 1 : 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          transition: 'opacity 0.3s ease',
        }}
      >
        <p>Book Hub</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
};

export default Sidebar;

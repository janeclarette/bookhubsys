import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBook, FaLayerGroup, FaBox, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import bookhubLogo from '../../assets/img/bookhublogo.png';
import bookhubIcon from '../../assets/img/bookhubIcon.gif';

const Sidebar = ({ onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [adminName, setAdminName] = useState(""); // State to store admin name
  const location = useLocation();
  const navigate = useNavigate();

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
    localStorage.removeItem('token');
    setAdminName(""); 
    navigate('/login/admin');
    window.location.reload(); // Force a page reload to reset the session
};

  
  
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          console.error("Token not found in localStorage.");
          navigate('/login/admin'); // Redirect to login page if no token
          return;
        }
  
        console.log("Fetching admin details with token:", token); // Debug log for token
  
        // Sending token in Authorization header
        const response = await axios.get("http://localhost:5000/api/v1/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setAdminName(response.data.name); // Set admin name from response
      } catch (error) {
        console.error("Failed to fetch admin details:", error.response ? error.response.data : error);
        // If token is invalid or expired, redirect to login page
        if (error.response && error.response.status === 401) {
          navigate('/login/admin');
        }
      }
    };
  
    fetchAdminName();
  }, []);
  
  

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
          <img src={bookhubIcon} alt="Book Hub Icon" style={{ width: '60px', marginLeft: '1px' }} />
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
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome, {adminName}</p> {/* Display admin name */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[ // Define links for the sidebar
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

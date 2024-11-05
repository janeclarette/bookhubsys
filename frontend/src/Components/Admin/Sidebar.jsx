import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaList, FaUser, FaBox, FaChevronDown, FaSignOutAlt, FaStar } from 'react-icons/fa';
import bookhubLogo from '../../assets/img/bookhublogo.png';
import bookhubIcon from '../../assets/img/bookhubIcon.gif';

const Sidebar = () => {
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const [showSuppliersDropdown, setShowSuppliersDropdown] = useState(false);

  const location = useLocation();

  const toggleOrdersDropdown = () => setShowOrdersDropdown(!showOrdersDropdown);
  const toggleBooksDropdown = () => setShowBooksDropdown(!showBooksDropdown);
  const toggleSuppliersDropdown = () => setShowSuppliersDropdown(!showSuppliersDropdown);

  const navItemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    marginBottom: '20px',
    padding: '10px 15px',
    borderRadius: '8px',
    textDecoration: 'none',
    backgroundColor: location.pathname === path ? '#1b1b3a' : 'transparent',
    color: location.pathname === path ? '#ffffff' : '#262222',
    transition: 'background-color 0.1s ease, color 0.1s ease',
  });

  const hoverStyle = {
    backgroundColor: '#1b1b3a',
    color: '#ffffff',
  };

  return (
    <div style={{
      userSelect:'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '250px',
      height: '95vh',
      backgroundColor: '#f2f4ff',
      color: '#262222',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '30px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
    }}>
      <div>
        {/* Logo and Icon */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img src={bookhubIcon} alt="Book Hub Icon" style={{ width: '60px', marginLeft: '10px' }} />
          <img src={bookhubLogo} alt="Book Hub Logo" style={{ width: '150px' }} />
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* Dashboard */}
            <li style={{ marginBottom: '20px' }}>
              <Link
                to="/"
                style={navItemStyle('/')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = location.pathname === '/' ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = location.pathname === '/' ? '#ffffff' : '#262222';
                }}
              >
                <FaTachometerAlt style={{ marginRight: '10px' }} />
                Dashboard
              </Link>
            </li>

            {/* Orders Management with Dropdown */}
            <li style={{ marginBottom: '20px' }}>
              <div
                onClick={toggleOrdersDropdown}
                style={{ ...navItemStyle('/orders'), cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = showOrdersDropdown || location.pathname.includes('/orders') ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = showOrdersDropdown || location.pathname.includes('/orders') ? '#ffffff' : '#262222';
                }}
              >
                <FaList style={{ marginRight: '10px' }} />
                Orders Management
                <FaChevronDown
                  style={{
                    marginLeft: 'auto',
                    color: showOrdersDropdown || location.pathname.includes('/orders') ? '#ffffff' : '#262222'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = hoverStyle.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = showOrdersDropdown || location.pathname.includes('/orders') ? '#ffffff' : '#262222'}
                />
              </div>
              {showOrdersDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/orders/new" style={navItemStyle('/orders/new')}>New Orders</Link></li>
                  <li><Link to="/orders/history" style={navItemStyle('/orders/history')}>Order History</Link></li>
                </ul>
              )}
            </li>

            {/* Books Management with Dropdown */}
            <li style={{ marginBottom: '20px' }}>
              <div
                onClick={toggleBooksDropdown}
                style={{ ...navItemStyle('/books'), cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = showBooksDropdown || location.pathname.includes('/products') ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = showBooksDropdown || location.pathname.includes('/products') ? '#ffffff' : '#262222';
                }}
              >
                <FaBox style={{ marginRight: '10px' }} />
                Books Management
                <FaChevronDown
                  style={{
                    marginLeft: 'auto',
                    color: showBooksDropdown || location.pathname.includes('/products') ? '#ffffff' : '#262222'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = hoverStyle.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = showBooksDropdown || location.pathname.includes('/products') ? '#ffffff' : '#262222'}
                />
              </div>
              {showBooksDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/products/new" style={navItemStyle('/products/new')}>Add New Book</Link></li>
                  <li><Link to="/products/catalog" style={navItemStyle('/products/catalog')}>Book Catalog</Link></li>
                </ul>
              )}
            </li>

            {/* Supplier Management with Dropdown */}
            <li style={{ marginBottom: '20px' }}>
              <div
                onClick={toggleSuppliersDropdown}
                style={{ ...navItemStyle('/suppliers'), cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = showSuppliersDropdown || location.pathname.includes('/suppliers') ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = showSuppliersDropdown || location.pathname.includes('/suppliers') ? '#ffffff' : '#262222';
                }}
              >
                <FaUser style={{ marginRight: '10px' }} />
                Supplier Management
                <FaChevronDown
                  style={{
                    marginLeft: 'auto',
                    color: showSuppliersDropdown || location.pathname.includes('/suppliers') ? '#ffffff' : '#262222'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = hoverStyle.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = showSuppliersDropdown || location.pathname.includes('/suppliers') ? '#ffffff' : '#262222'}
                />
              </div>
              {showSuppliersDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/suppliers/new" style={navItemStyle('/suppliers/new')}>Add New Supplier</Link></li>
                  <li><Link to="/suppliers/list" style={navItemStyle('/suppliers/list')}>Supplier List</Link></li>
                </ul>
              )}
            </li>

            {/* Reviews */}
            <li style={{ marginBottom: '20px' }}>
              <Link
                to="/reviews"
                style={navItemStyle('/reviews')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = location.pathname === '/reviews' ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = location.pathname === '/reviews' ? '#ffffff' : '#262222';
                }}
              >
                <FaStar style={{ marginRight: '10px' }} />
                Reviews
              </Link>
            </li>

            {/* Logout */}
            <li style={{ marginBottom: '20px' }}>
              <Link
                to="/logout"
                style={navItemStyle('/logout')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = location.pathname === '/logout' ? '#1b1b3a' : 'transparent';
                  e.currentTarget.style.color = location.pathname === '/logout' ? '#ffffff' : '#262222';
                }}
              >
                <FaSignOutAlt style={{ marginRight: '10px' }} />
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ fontSize: '16px', color: '#262222', textAlign: 'center' }}>
        <p>Book Hub</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
};

export default Sidebar;

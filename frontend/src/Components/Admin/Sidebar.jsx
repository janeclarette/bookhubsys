import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaChevronDown, FaUser, FaBook, FaLayerGroup, FaBox } from 'react-icons/fa';
import bookhubLogo from '../../assets/img/bookhublogo.png';
import bookhubIcon from '../../assets/img/bookhubIcon.gif';

const Sidebar = () => {
  const [showAuthorsDropdown, setShowAuthorsDropdown] = useState(false);
  const [showGenresDropdown, setShowGenresDropdown] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const [showSuppliersDropdown, setShowSuppliersDropdown] = useState(false);

  const location = useLocation();

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
      userSelect: 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img src={bookhubIcon} alt="Book Hub Icon" style={{ width: '60px', marginLeft: '10px' }} />
          <img src={bookhubLogo} alt="Book Hub Logo" style={{ width: '150px' }} />
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* Dashboard */}
            <li style={{ marginBottom: '20px' }}>
              <Link to="/admin" style={navItemStyle('/')}> <FaTachometerAlt style={{ marginRight: '10px' }} /> Dashboard </Link>
            </li>

            {/* Authors Management */}
            <li style={{ marginBottom: '20px' }}>
              <div onClick={() => setShowAuthorsDropdown(!showAuthorsDropdown)} style={{ ...navItemStyle('/admin/authors'), cursor: 'pointer' }}>
                <FaUser style={{ marginRight: '10px' }} /> Authors Management <FaChevronDown style={{ marginLeft: 'auto' }} />
              </div>
              {showAuthorsDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/admin/authors/new" style={navItemStyle('/admin/authors/new')}>Add New Author</Link></li>
                  <li><Link to="/admin/authors" style={navItemStyle('/admin/authors')}>Author List</Link></li>
                </ul>
              )}
            </li>

            {/* Genre Management */}
            <li style={{ marginBottom: '20px' }}>
              <div onClick={() => setShowGenresDropdown(!showGenresDropdown)} style={{ ...navItemStyle('/admin/genres'), cursor: 'pointer' }}>
                <FaLayerGroup style={{ marginRight: '10px' }} /> Genre Management <FaChevronDown style={{ marginLeft: 'auto' }} />
              </div>
              {showGenresDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/admin/genres/new" style={navItemStyle('/admin/genres/new')}>Add New Genre</Link></li>
                  <li><Link to="/admin/genres" style={navItemStyle('/admin/genres')}>Genre List</Link></li>
                </ul>
              )}
            </li>

            {/* Supplier Management */}
            <li style={{ marginBottom: '20px' }}>
              <div onClick={() => setShowSuppliersDropdown(!showSuppliersDropdown)} style={{ ...navItemStyle('/admin/suppliers'), cursor: 'pointer' }}>
                <FaBox style={{ marginRight: '10px' }} /> Supplier Management <FaChevronDown style={{ marginLeft: 'auto' }} />
              </div>
              {showSuppliersDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/admin/suppliers/new" style={navItemStyle('/admin/suppliers/new')}>Add New Supplier</Link></li>
                  <li><Link to="/admin/suppliers" style={navItemStyle('/admin/suppliers')}>Supplier List</Link></li>
                </ul>
              )}
            </li>

            {/* Book Management */}
            <li style={{ marginBottom: '20px' }}>
              <div onClick={() => setShowBooksDropdown(!showBooksDropdown)} style={{ ...navItemStyle('/admin/books'), cursor: 'pointer' }}>
                <FaBook style={{ marginRight: '10px' }} /> Book Management <FaChevronDown style={{ marginLeft: 'auto' }} />
              </div>
              {showBooksDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li><Link to="/admin/books/new" style={navItemStyle('/admin/books/new')}>Add New Book</Link></li>
                  <li><Link to="/admin/books" style={navItemStyle('/admin/books')}>Book List</Link></li>
                </ul>
              )}
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

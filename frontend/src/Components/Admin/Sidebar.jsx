import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaList, FaUser, FaTruck, FaBox, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const [showSuppliersDropdown, setShowSuppliersDropdown] = useState(false);

  const toggleOrdersDropdown = () => setShowOrdersDropdown(!showOrdersDropdown);
  const toggleBooksDropdown = () => setShowBooksDropdown(!showBooksDropdown);
  const toggleSuppliersDropdown = () => setShowSuppliersDropdown(!showSuppliersDropdown);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '200px',
      height: '90vh',
      backgroundColor: '#D3407A',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '50px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)'
    }}>
      <div>
        <h2 style={{ marginBottom: '40px', fontSize: '30px' }}>Book Hub</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, marginLeft: '-20px'}}>
            <li style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaTachometerAlt style={{ marginRight: '10px' }} />
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
            </li>

            {/* Orders Management with Dropdown */}
            <li style={{ marginBottom: '30px' }}>
              <div onClick={toggleOrdersDropdown} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '18px' }}>
                <FaList style={{ marginRight: '10px' }} />
                <span style={{ color: '#fff' }}>Orders Management</span>
                <FaChevronDown style={{ marginLeft: 'auto', color: '#fff' }} />
              </div>
              {showOrdersDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/orders/new" style={{color: '#fff', textDecoration: 'none', fontSize: '16px' }}>New Orders</Link></li>
                  <li><Link to="/orders/history" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Order History</Link></li>
                </ul>
              )}
            </li>

            {/* Books Management with Dropdown */}
            <li style={{ marginBottom: '30px' }}>
              <div onClick={toggleBooksDropdown} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '18px' }}>
                <FaBox style={{ marginRight: '10px' }} />
                <span style={{ color: '#fff' }}>Books Management</span>
                <FaChevronDown style={{ marginLeft: 'auto', color: '#fff' }} />
              </div>
              {showBooksDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/products/new" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Add New Book</Link></li>
                  <li><Link to="/products/catalog" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Book Catalog</Link></li>
                </ul>
              )}
            </li>

            {/* Supplier Management with Dropdown */}
            <li style={{ marginBottom: '30px' }}>
              <div onClick={toggleSuppliersDropdown} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '18px' }}>
                <FaUser style={{ marginRight: '10px' }} />
                <span style={{ color: '#fff' }}>Supplier Management</span>
                <FaChevronDown style={{ marginLeft: 'auto', color: '#fff' }} />
              </div>
              {showSuppliersDropdown && (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/suppliers/new" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Add New Supplier</Link></li>
                  <li><Link to="/suppliers/list" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Supplier List</Link></li>
                </ul>
              )}
            </li>

            <li style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaTruck style={{ marginRight: '10px' }} />
              <Link to="/reports" style={{ color: '#fff', textDecoration: 'none' }}>Reports</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ fontSize: '14px', textAlign: 'center' }}>
        <p>Book Hub</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
};

export default Sidebar;

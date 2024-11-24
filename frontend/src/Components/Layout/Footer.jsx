// components/Layout/Footer.jsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { width } from '@mui/system';

const Footer = () => {
  return (
    <Box sx={styles.footer}>
      <Box sx={styles.footerContent}>
        <Typography variant="body2" sx={styles.footerText}>
          &copy; {new Date().getFullYear()} BookHub. All Rights Reserved.
        </Typography>
        <Typography variant="body2" sx={styles.footerText}>
          <Link href="#" sx={styles.footerLink}>Privacy Policy</Link> | 
          <Link href="#" sx={styles.footerLink}>Terms of Service</Link>
        </Typography>
      </Box>
    </Box>
  );
};

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '-60px',
    background: "#1b1b3a",
    boxShadow: "none",
    padding: 0,
    width: "131%",
    marginTop: 10,
    marginLeft: -25,
  },
  footerContent: {
    textAlign: 'center',
  },
  footerText: {
    margin: '5px 0',
  },
  footerLink: {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 10px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default Footer;

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import readingImage from '/src/assets/img/reading2.png'; // Ensure the image is correctly imported

const Header = () => {
  return (
    <Box sx={styles.headerContainer}>
      <Avatar src={readingImage} alt="Reading" sx={styles.headerImage} />
      <Box sx={styles.textContainer}>
        <Typography variant="h4" sx={styles.headerText}>Welcome to BookHub!</Typography>
        <Typography variant="h6" sx={styles.subtitle}>A place to explore and discover amazing books!</Typography>
        <Typography sx={styles.description}>
          BookHub is your go-to platform for finding and reading books. Whether you're looking for the latest bestsellers, hidden gems, or timeless classics, we have something for everyone.
        </Typography>
      </Box>
    </Box>
  );
};

// Styles for Header (using MUI's sx prop)
const styles = {
  headerContainer: {
    display: 'flex', // Use flexbox to align items horizontally
    alignItems: 'center', // Vertically align the content
    padding: '20px 0',
    justifyContent: 'center',
     // Optional: Center the entire container horizontally
  },
  headerImage: {
    width: 550, // Adjust the size as needed
    height: 'auto',
    marginRight: 4,
    marginBottom: 6,
  },
  textContainer: {
    textAlign: 'left', // Align text to the left
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: '5rem', 
    marginTop: '-20px',
    color: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Gradient effect
    background: 'linear-gradient(to right, #303059, #a74482)', // Gradient background for text
    backgroundClip: 'text', // Apply gradient to text only
    WebkitBackgroundClip: 'text', // Ensure gradient effect on text in WebKit browsers
    color: 'transparent', // Make sure text is transparent to show the gradient
    marginBottom: '15px', // Space between header and subtitle
    letterSpacing: '1px', // Slight letter spacing for a cleaner look
    textShadow: '7px 6px 5px rgba(1, 1, 2, 0.5)', // Subtle shadow for depth
  },
  subtitle: {
    color: '#555', // Lighter color for subtitle
    marginBottom: '20px', // Space between subtitle and description
    fontSize: '1.2rem', // Slightly smaller font size for subtitle
  },
  description: {
    color: '#666', // Description color
    fontSize: '1rem', // Regular font size for description
    lineHeight: 1.7, // Increased line height for better readability
    letterSpacing: '0.5px', // Slight letter spacing for better visual flow
  },
};

export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from '../utils/axiosConfig'; // Axios instance for API calls
import Navbar from './Layout/Navbar';
import { Box, Button, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors');
      setAuthors(response.data.authors);
      setFilteredAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const filterAuthorsByLetter = (letter) => {
    setSelectedLetter(letter);
    const filtered = authors.filter((author) =>
      author.name.charAt(0).toUpperCase() === letter.toUpperCase()
    );
    setFilteredAuthors(filtered);
  };

  const viewAuthorWorks = (authorId) => {
    navigate(`/authorworks/${authorId}`); 
  };

  const alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(65 + i));

  return (
    <Box sx={{ padding: '20px' }}>
      <Navbar />
      
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', marginTop: '50px' }}>
        Authors
      </Typography>

      {/* Alphabet Filter */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', marginBottom: 3 }}>
        {alphabet.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? 'contained' : 'outlined'}
            color="p"
            onClick={() => filterAuthorsByLetter(letter)}
            sx={{
              padding: '6px 12px', // Smaller padding
              textTransform: 'uppercase',
              borderRadius: '5px',
              fontSize: '12px',  // Smaller font size for the alphabet filter buttons
            
              backgroundColor: selectedLetter === letter ? '#8e44ad' : 'transparent', // Violet color for selected
              color: selectedLetter === letter ? '#fff' : '#8e44ad', // Violet text for unselected
              '&:hover': {
                backgroundColor: selectedLetter === letter ? '#8e44ad' : '#f0f0f0',
              },
            }}
          >
            {letter}
          </Button>
        ))}
      </Box>

      {/* Authors List */}
      <Grid container spacing={3} justifyContent="center">
        {filteredAuthors.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray', fontSize: '14px' }}>
            No authors found.
          </Typography>
        ) : (
          filteredAuthors.map((author) => (
            <Grid item key={author._id} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={author.imagePath[0] || 'default.jpg'}
                  alt={author.name}
                  sx={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <CardContent>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', }}>
                    {author.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ height: '60px', overflow: 'hidden', fontSize: '12px', }}>
                    {author.bio}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, fontSize: '14px' }}
                    onClick={() => viewAuthorWorks(author._id)}
                  >
                    View Works
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Authors;

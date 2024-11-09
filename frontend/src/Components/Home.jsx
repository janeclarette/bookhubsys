import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import bookHeader from '../assets/img/bookHeader.jpg';

// Styled components using MUI's `styled`
const HeaderContent = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${bookHeader})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '100%',
  height: '90vh',
  color: theme.palette.common.white,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const products = [
  { id: 1, name: "Formal Top", price: "₱450", imgSrc: "path/to/formalTop.jpg" },
  { id: 2, name: "Girl Pants", price: "₱500", imgSrc: "path/to/girlPants.jpg" },
  { id: 3, name: "Polo Shirt", price: "₱550", imgSrc: "path/to/poloShirt.jpg" },
  { id: 4, name: "Blue Shirt", price: "₱400", imgSrc: "path/to/blueShirt.jpg" },
  { id: 5, name: "Casual Dress", price: "₱600", imgSrc: "path/to/casualDress.jpg" },
  { id: 6, name: "Jeans", price: "₱700", imgSrc: "path/to/jeans.jpg" },
  { id: 7, name: "T-Shirt", price: "₱300", imgSrc: "path/to/tshirt.jpg" },
  { id: 8, name: "Skirt", price: "₱350", imgSrc: "path/to/skirt.jpg" },
];

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', overflowY: 'auto' }}>
      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
            BOOKHUB
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, marginRight: '150px' }}>
            {['Home', 'All Books', 'Authors', 'About Us', 'Popular'].map((text) => (
              <Button key={text} color="inherit" sx={{ fontSize: '0.875rem' }}>{text}</Button>
            ))}
          </Box>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Header Content */}
      <HeaderContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Best Collection
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          NEW ARRIVALS
        </Typography>
        <Button variant="contained" color="secondary">
          BUY NOW
        </Button>
      </HeaderContent>

      {/* Product Section */}
      <Box sx={{ padding: '20px', mt: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          New Collection
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ maxWidth: 300, textAlign: 'center' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.imgSrc}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                    {[...Array(5)].map((_, index) => (
                      <StarIcon key={index} color="primary" />
                    ))}
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {product.price}
                  </Typography>
                  <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About Us Section */}
      <Box sx={{ padding: '40px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          About Us
        </Typography>
        <Typography variant="h5" sx={{ color: '#666', mb: 3 }}>
          Welcome to BookHub
        </Typography>
        <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'left' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            A curated space dedicated to celebrating the multifaceted talent and unique style...
          </Typography>
          <Typography variant="body1">
            We believe in the power of self-expression and creativity, just as Nana embodies these qualities...
          </Typography>
        </Box>
      </Box>

      {/* Footer Section */}
      <Footer>
        <Typography variant="body1">
          &copy; 2024 BookHub. All Rights Reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button color="inherit" sx={{ fontSize: '0.875rem' }}>Privacy Policy</Button>
          <Button color="inherit" sx={{ fontSize: '0.875rem' }}>Terms of Service</Button>
        </Box>
      </Footer>
    </Box>
  );
};

export default Home;

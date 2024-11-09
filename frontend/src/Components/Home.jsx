import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge, Grid, Card, CardMedia, CardContent } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import '../Components/Home.css';
import bookHeader from '../assets/img/bookHeader.jpg';

// Product data array with at least 8 items for a 2x4 layout
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
    <Box className="home" sx={{ margin: -1, padding: 0, minHeight: '100vh', overflowY: 'auto' }}>
      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '20px', px: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
            BOOKHUB
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, marginRight: '150px' }}>
            <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>Home</Button>
            <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>All Books</Button>
            <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>Authors</Button>
            <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>About Us</Button>
            <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>Popular</Button>
          </Box>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Header Content */}
      <Box
        className="header-content"
        sx={{
          backgroundImage: `url(${bookHeader})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '90vh',
          color: '#fff',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" component="p" sx={{ mb: 1 }}>
          Best Collection
        </Typography>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          NEW ARRIVALS
        </Typography>
        <Button variant="contained" color="secondary">
          BUY NOW
        </Button>
      </Box>

      {/* Product Section */}
      <Box sx={{ padding: '20px', mt: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          New Collection
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}> {/* Adjusted md to 3 for 4 columns */}
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
            A curated space dedicated to celebrating the multifaceted talent and unique style of one of Japan's most beloved stars. Our mission is to bring fans closer to Nana Komatsu by showcasing her inspiring journey through fashion, film, and culture. Here, you’ll find an exclusive selection of items that reflect Nana's distinctive aesthetic, from trendy apparel to limited-edition merchandise inspired by her roles and style choices.
          </Typography>
          <Typography variant="body1">
            We believe in the power of self-expression and creativity, just as Nana embodies these qualities in her work. Join us as we explore her captivating world, where every piece in the collection tells a story and connects you to the essence of Nana Komatsu.
          </Typography>
        </Box>
      </Box>

      {/* Footer Section (Add your footer content here later) */}
      <Box sx={{ padding: '20px', backgroundColor: '#333', color: '#fff', textAlign: 'center' }}>
        <Typography variant="body1">
          &copy; 2024 BookHub. All Rights Reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>Privacy Policy</Button>
          <Button color="inherit" sx={{ fontSize: '0.875rem', py: 0.5 }}>Terms of Service</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

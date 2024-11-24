import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import {
  Home as HomeIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// Import the GIF
import bookHubIcon from "/src/assets/img/BookhubIcon.gif";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleCartClick = () => {
    if (!user) {
      alert("You must log in first!");
    } else {
      navigate("/cart");
    }
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={Link} to={user ? "/dashboard" : "/"} >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/genres">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Genres" />
        </ListItem>
        <ListItem button component={Link} to="/authors">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Authors" />
        </ListItem>
        <ListItem button component={Link} to="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About Us" />
        </ListItem>
        {user ? (
          <>
            <ListItem button component={Link} to="/profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            minHeight: "100vh",
            backgroundColor: "#f4f4f4",
            boxSizing: "border-box",
            marginTop: -50,
          },
          "*": {
            boxSizing: "border-box",
          },
        }}
      />
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(45deg, #f84aa7, #693668)",
          boxShadow: "none",
          padding: 0,
          width: "131%",
          marginLeft: -25,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
            marginLeft: 20,
          }}
        >
          {/* BookHub Icon and title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={bookHubIcon} // Use the imported GIF
              alt="BookHub Icon"
              style={{ width: 50, height: 70, marginRight: 8 }} // Size and margin for the icon
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Times New Roman", serif',
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              BookHub
            </Typography>
          </Box>

          {/* Navigation links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" }, // Hide on small screens
              justifyContent: "center", // Center-aligns the navigation links
              alignItems: "center",
              flexGrow: 1,
              gap: 4, // Space between navigation buttons
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to={user ? "/dashboard" : "/"}
              sx={{
                "&:hover": {
                  backgroundColor: "#693668", // Highlight color on hover
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/genres"
              sx={{
                "&:hover": {
                  backgroundColor: "#693668", // Highlight color on hover
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              Genres
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/authors"
              sx={{
                "&:hover": {
                  backgroundColor: "#693668", // Highlight color on hover
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              Authors
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{
                "&:hover": {
                  backgroundColor: "#693668", // Highlight color on hover
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              About Us
            </Button>
          </Box>

          {/* Right-side buttons like Profile/Logout */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={handleCartClick}
              sx={{
                "&:hover": {
                  backgroundColor: "#693668", // Highlight color on hover
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#693668", // Highlight color on hover
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  <LoginIcon sx={{ marginRight: 1 }} />
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#693668", // Highlight color on hover
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  <PersonAddIcon sx={{ marginRight: 1 }} />
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;

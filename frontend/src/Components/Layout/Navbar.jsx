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
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("You must log in first!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate("/cart");
    }
  };

  const handleOrderClick = () => {
    if (!user) {
      toast.error("You must log in first!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate("/order");
    }
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={Link} to={user ? "/dashboard" : "/"}>
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
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
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
            marginTop: -75,
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
          width: "133%",
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
              src={bookHubIcon}
              alt="BookHub Icon"
              style={{ width: 50, height: 70, marginRight: 8 }}
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
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              gap: 4,
            }}
          >
            <Button color="inherit" component={Link} to={user ? "/dashboard" : "/"}>
              Home
            </Button>
            <Button color="inherit" component={Link} to="/genres">
              Genres
            </Button>
            <Button color="inherit" component={Link} to="/authors">
              Authors
            </Button>
            <Button color="inherit" onClick={handleOrderClick}>
              Orders
            </Button>
          </Box>

          {/* Right-side buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="inherit" onClick={handleCartClick}>
              <ShoppingCartIcon />
            </IconButton>
            {user ? (
              <>
                <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircleIcon />
                </IconButton>
                <Button color="inherit" onClick={handleLogout}>
                  <ExitToAppIcon sx={{ marginRight: 1 }} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  <LoginIcon sx={{ marginRight: 1 }} />
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
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
      <ToastContainer />
    </>
  );
};

export default Navbar;

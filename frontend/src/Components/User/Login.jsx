import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, TextField, Button, Alert, CssBaseline, GlobalStyles } from "@mui/material";
import { Twitter, Facebook, Google } from "@mui/icons-material"; // Import icons
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup for validation
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import b1Gif from "/src/assets/img/b2.gif"; // Import the GIF

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/login",
          values,
          { withCredentials: true }
        );
        // Store user info or token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } catch (err) {
        if (err.response) {
          // Check if the error indicates account deactivation
          if (err.response.status === 403) {
            toast.error("Your account has been deactivated. Please contact support.", {
              position: "bottom-right",
            });
            setError("Your account has been deactivated. Please contact support.");
          } else {
            toast.error(err.response.data.message || "Something went wrong", {
              position: "bottom-right",
            });
            setError(err.response.data.message || "Something went wrong");
          }
        } else if (err.request) {
          toast.error("No response from server. Check your backend configuration.", {
            position: "bottom-right",
          });
          setError("No response from server. Check your backend configuration.");
        } else {
          toast.error("Error occurred during the request: " + err.message, {
            position: "bottom-right",
          });
          setError("Error occurred during the request: " + err.message);
        }
      }
    },
  });

  return (
    <>
      {/* Global styles to reset margin and padding */}
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { margin: 0, padding: 0, height: "100vh", width: "100vw" },
          body: {
            background: "linear-gradient(#a74482, #f84aa7, #693668)",
            margin: 0,
            marginTop: 70,
            padding: 0,
            height: "90vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "#root": { height: "100%" },
        }}
      />

      {/* Toast container for notifications */}
      <ToastContainer />

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "110%",
          marginTop: -3,
          boxShadow: 6,
          p: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          marginLeft: -5,
        }}
      >
        {/* Left Side Form */}
        <Box sx={{ width: "50%", textAlign: "center" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1b1b3a",
            }}
          >
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Login to your account
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              color: "#9898a5",
            }}
          >
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(to right,#693668, #f84aa7)",
                color: "#fff",
                fontWeight: "bold",
              }}
              fullWidth
            >
              Login
            </Button>
          </form>

          <Typography variant="subtitle2" sx={{ my: 2 }}>
            Or login with:
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1DA1F2",
                color: "#fff",
                textTransform: "none",
              }}
              startIcon={<Twitter />}
            >
              Twitter
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3b5998",
                color: "#fff",
                textTransform: "none",
              }}
              startIcon={<Facebook />}
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#DB4437", // Google color
                color: "#fff",
                textTransform: "none",
              }}
              startIcon={<Google />}
            >
              Google
            </Button>
          </Box>
        </Box>

        {/* Right Side GIF with Background Image */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url('/src/assets/img/sil.png')`, // Set the image as background
            backgroundSize: "cover", // Ensures the image covers the area
            backgroundPosition: "center", // Centers the image
            marginLeft: 4,
          }}
        >
          {/* Displaying the GIF */}
          <img
            src={b1Gif}
            alt="Login Animation"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      </Container>
    </>
  );
};

export default Login;

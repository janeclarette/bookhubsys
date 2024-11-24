import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  InputLabel,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { CloudUpload, Twitter, Facebook, Google } from "@mui/icons-material"; // Icons
import { useFormik } from "formik";
import * as Yup from "yup"; // Yup for validation
import b1Gif from '/src/assets/img/b1.gif';  // Import the GIF

const RegisterUser = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    avatar: Yup.mixed().required("Avatar is required").test("fileSize", "File is too large", (value) => {
      return value && value.size <= 1048576; // 1MB limit
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      avatar: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", values.name);
      formDataToSend.append("email", values.email);
      formDataToSend.append("password", values.password);
      formDataToSend.append("avatar", values.avatar);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/register",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("avatar", e.target.files[0]);
  };

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
            marginTop: 30,
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

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "110%",
          marginTop: -2,
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
            Welcome!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Sign up to continue access
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
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
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
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
              fullWidth
            />
            {/* Styled Upload Image Section */}
            <div>
              <InputLabel htmlFor="avatar" sx={{ fontWeight: "bold" }}>
              </InputLabel>
              <label htmlFor="avatar">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px dashed #9c27b0",
                    padding: "16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "#9c27b0",
                    fontWeight: "bold",
                    marginTop: "2px",
                  }}
                >
                  <CloudUpload sx={{ marginRight: "8px" }} />
                  Upload Image
                </Box>
              </label>
              <input
                id="avatar"
                type="file"
                name="avatar"
                onChange={handleFileChange}
                style={{ display: "none" }}
                required
              />
              {formik.touched.avatar && formik.errors.avatar && (
                <Typography color="error" variant="body2">
                  {formik.errors.avatar}
                </Typography>
              )}
            </div>
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
              Register
            </Button>
          </form>
          <Typography variant="subtitle2" sx={{ my: 2 }}>
            Or register with:
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
            {/* Google Button */}
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
            width: "60%",
            height: "200%",
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
            alt="Register Animation"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      </Container>
    </>
  );
};

export default RegisterUser;

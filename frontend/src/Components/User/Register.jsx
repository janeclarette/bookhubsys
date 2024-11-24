// src/components/auth/RegisterUser.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: null, // file upload state
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            avatar: e.target.files[0], // Set the uploaded file to state
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("avatar", formData.avatar); // Add avatar file to FormData

        try {
            const response = await axios.post(
                "http://localhost:5000/api/v1/register",
                formDataToSend, 
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            localStorage.setItem("token", response.data.token); // Save JWT token
            navigate("/login"); // Redirect after successful registration
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div>
            <h2>User Registration</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Avatar</label>
                    <input type="file" name="avatar" onChange={handleFileChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterUser;

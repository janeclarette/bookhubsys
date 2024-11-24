// src/components/auth/registerAdmin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: null,
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
            avatar: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("email", formData.email);
        formDataObj.append("password", formData.password);
        formDataObj.append("avatar", formData.avatar);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/v1/register/admin",
                formDataObj,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            
            navigate("/login/admin");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div>
            <h2>Register Admin</h2>
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
                    <input
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Register Admin</button>
            </form>
        </div>
    );
};

export default RegisterAdmin;

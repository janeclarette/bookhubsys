import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar

const NewSupplier = () => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const createSupplier = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('contactInfo', contactInfo);
        formData.append('address', address);
        Array.from(images).forEach(image => formData.append('images', image));

        try {
            await axios.post('/suppliers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Supplier created successfully!');
            navigate('/admin/suppliers');
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
    };

    // Layout styles
    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
        },
        content: {
            flex: 1,
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <Sidebar /> {/* Sidebar for navigation */}
            <main style={styles.content}>
                <form onSubmit={createSupplier}>
                    <h1>Add New Supplier</h1>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact Info"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input type="file" multiple onChange={handleFileChange} />
                    <button type="submit">Create Supplier</button>
                </form>
            </main>
        </div>
    );
};

export default NewSupplier;

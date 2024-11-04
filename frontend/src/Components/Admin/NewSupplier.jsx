// src/Components/Admin/NewSupplier.jsx
import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';

const NewSupplier = () => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const createSupplier = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('contactInfo', contactInfo);
        formData.append('address', address);
        if (images) {
            Array.from(images).forEach(image => formData.append('images', image));
        }

        try {
            await axios.post('/suppliers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Supplier created successfully!');
            setName('');
            setContactInfo('');
            setAddress('');
            setImages([]);
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
    };

    return (
        <form onSubmit={createSupplier}>
            <h1>Add New Supplier</h1>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Contact Info:
                <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
            </label>
            <label>
                Address:
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label>
                Images:
                <input type="file" multiple onChange={handleFileChange} />
            </label>
            <button type="submit">Create Supplier</button>
        </form>
    );
};

export default NewSupplier;

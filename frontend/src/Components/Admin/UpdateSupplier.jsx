// src/Components/Admin/UpdateSupplier.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateSupplier = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);

    const fetchSupplier = async () => {
        try {
            const response = await axios.get(`/suppliers/${id}`);
            const supplier = response.data.supplier;
            setName(supplier.name);
            setContactInfo(supplier.contactInfo);
            setAddress(supplier.address);
            setImages(supplier.imagePath || []); // Ensure images are set correctly
        } catch (error) {
            console.error('Error fetching supplier:', error);
        }
    };

    useEffect(() => {
        fetchSupplier();
    }, [id]);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const updateSupplier = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('contactInfo', contactInfo);
        formData.append('address', address);
        if (images) {
            Array.from(images).forEach(image => formData.append('images', image));
        }

        try {
            await axios.put(`/suppliers/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Supplier updated successfully!');
            navigate('/admin/suppliers');
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    return (
        <form onSubmit={updateSupplier}>
            <h1>Update Supplier</h1>
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
            <button type="submit">Update Supplier</button>
        </form>
    );
};

export default UpdateSupplier;

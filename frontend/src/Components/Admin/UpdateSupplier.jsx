// src/Components/Admin/UpdateSupplier.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateSupplier = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(`/suppliers/${id}`);
                const supplier = response.data.supplier;
                setName(supplier.name);
                setContactInfo(supplier.contactInfo);
                setAddress(supplier.address);
            } catch (error) {
                console.error('Error fetching supplier:', error);
            }
        };
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
        Array.from(images).forEach(image => formData.append('images', image));

        try {
            await axios.put(`/suppliers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Supplier updated successfully!');
            navigate('/admin/suppliers');
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    return (
        <form onSubmit={updateSupplier}>
            <h1>Update Supplier</h1>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Contact Info" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Update Supplier</button>
        </form>
    );
};

export default UpdateSupplier;

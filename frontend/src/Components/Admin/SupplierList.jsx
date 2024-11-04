// src/Components/Admin/SupplierList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('/suppliers');
            setSuppliers(response.data.suppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`/suppliers/${id}`);
                fetchSuppliers(); // Refresh supplier list after deletion
                alert('Supplier deleted successfully!');
            } catch (error) {
                console.error('Error deleting supplier:', error);
            }
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <div>
            <h1>Supplier List</h1>
            <Link to="/admin/suppliers/new">Add New Supplier</Link>
            <ul>
                {suppliers.map((supplier) => (
                    <li key={supplier._id}>
                        <h2>{supplier.name}</h2>
                        <p>Contact: {supplier.contactInfo}</p>
                        <p>Address: {supplier.address}</p>
                        <div>
                            {supplier.imagePath && supplier.imagePath.length > 0 ? (
                                supplier.imagePath.map((image, index) => (
                                    <img key={index} src={image} alt={`${supplier.name} Image ${index + 1}`} width="100" />
                                ))
                            ) : (
                                <p>No images available</p>
                            )}
                        </div>
                        <Link to={`/admin/suppliers/update/${supplier._id}`}>Edit</Link>
                        <button onClick={() => handleDelete(supplier._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SupplierList;

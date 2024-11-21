// src/Components/Admin/SupplierList.jsx
import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar'; // Import Sidebar

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedSuppliers.map((id) => axios.delete(`/suppliers/${id}`))
      );
      setSuppliers(suppliers.filter((supplier) => !selectedSuppliers.includes(supplier._id)));
      setSelectedSuppliers([]);
      alert('Selected suppliers deleted successfully!');
    } catch (error) {
      console.error('Error deleting suppliers:', error);
    }
  };

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'contactInfo',
      label: 'Contact Info',
    },
    {
      name: 'address',
      label: 'Address',
    },
    {
      name: 'imagePath',
      label: 'Images',
      options: {
        display: false, // Images shown in expandable row
      },
    },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <Link to={`/admin/suppliers/update/${value}`}>Edit</Link>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map((row) => suppliers[row.dataIndex]._id);
      setSelectedSuppliers(idsToDelete);
      return false; // Prevents default deletion; will handle in `handleBulkDelete`
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const supplier = suppliers[rowMeta.dataIndex];
      return (
        <tr>
          <td colSpan={6}>
            <div style={{ padding: '20px' }}>
              <h4>Images</h4>
              <div>
                {supplier.imagePath && supplier.imagePath.length > 0 ? (
                  supplier.imagePath.map((image, index) => (
                    <img key={index} src={image} alt={`${supplier.name} Image ${index + 1}`} style={{ width: '100px', marginRight: '10px' }} />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    },
  };

  return (
    <div>
      <Sidebar /> {/* Sidebar for navigation */}
      <h1>Supplier List</h1>
      <Link to="/admin/suppliers/new">Add New Supplier</Link>
      <MUIDataTable
        title="Suppliers"
        data={suppliers}
        columns={columns}
        options={options}
      />
      {selectedSuppliers.length > 0 && (
        <button onClick={handleBulkDelete}>Delete Selected</button>
      )}
    </div>
  );
};

export default SupplierList;

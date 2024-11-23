import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import Sidebar from './Sidebar';
import { Box, Button, Typography } from '@mui/material';
import NewSupplier from './NewSupplier';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate(); // Hook to navigate

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

  const deleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`/suppliers/${id}`);
        alert('Supplier deleted successfully!');
        fetchSuppliers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete the supplier.');
      }
    }
  };

  const editSupplier = (id) => {
    navigate(`/admin/suppliers/update/${id}`); // Navigate to the update supplier page with the supplier ID
  };

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'contactInfo', label: 'Contact Info' },
    { name: 'address', label: 'Address' },
    { name: 'imagePath', label: 'Images', options: { display: false } },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <div>
            <Button
              variant="contained"
              onClick={() => editSupplier(value)} // Edit button click handler
              sx={{
                backgroundColor:  '#e91e63', // Green color for edit
                color: 'white',
                padding: '5px 15px',
                textTransform: 'none',
                borderRadius: '5px',
                marginRight: '10px', // Add some space between the buttons
                '&:hover': {
                  backgroundColor: '#d81b60', // Lighter green on hover
                },
              }}
            >
              <FaEdit style={{ marginRight: '5px' }} /> Edit
            </Button>

            <Button
              variant="contained"
              onClick={() => deleteSupplier(value)}
              sx={{
                backgroundColor: '#9e1c63', // Purple color for delete
                color: 'white',
                padding: '5px 15px',
                textTransform: 'none',
                borderRadius: '5px',
                '&:hover': {
                  backgroundColor: '#c6a0e5', // Lighter purple on hover
                },
              }}
            >
              <FaTrash style={{ marginRight: '5px' }} /> Delete
            </Button>
          </div>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
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
                    <img
                      key={index}
                      src={image}
                      alt={`${supplier.name} Image ${index + 1}`}
                      style={{ width: '100px', marginRight: '10px' }}
                    />
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
    <Box display="flex" minHeight="100vh">
      {/* Sidebar component */}
      <Sidebar onHoverChange={setSidebarHovered} />

      {/* Main Content Area */}
      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography
              variant="h4"
              marginRight={20}
              sx={{ fontFamily: 'Fjalla One, sans-serif', fontWeight: 'bold' }}
            >
              Supplier Management
            </Typography>
            <Typography variant="body3" sx={{ color: 'gray', marginTop: 2 }}>
              Add new suppliers, edit details, and manage your supplier inventory effectively.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              background: 'linear-gradient(135deg, #9e1c63, #c6a0e5)',
              color: 'white',
              borderRadius: '25px',
              padding: '10px 20px',
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c6a0e5, #9e1c63)',
              },
            }}
          >
            Add New Supplier
          </Button>
        </Box>

        {/* DataTable */}
        <MUIDataTable title="Supplier List" data={suppliers} columns={columns} options={options} />

        {/* Modal for Adding New Supplier */}
        <NewSupplier
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSupplierCreated={fetchSuppliers}
        />
      </Box>
    </Box>
  );
};

export default SupplierList;

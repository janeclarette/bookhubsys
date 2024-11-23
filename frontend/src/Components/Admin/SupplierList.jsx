import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import Sidebar from './Sidebar';
import { Box, Button, Typography } from '@mui/material';
import NewSupplier from './NewSupplier';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'contactInfo', label: 'Contact Info' },
    { name: 'address', label: 'Address' },
    { name: 'imagePath', label: 'Images', options: { display: false } },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => <div>{/* Action buttons */}</div>,
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

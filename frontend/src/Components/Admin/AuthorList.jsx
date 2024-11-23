import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TableContainer, Paper } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar';
import NewAuthor from './NewAuthor'; // Import NewAuthor modal

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [isSidebarHovered, setSidebarHovered] = useState(false); // Track sidebar hover state

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/authors');
      setAuthors(response.data.authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedAuthors.map((id) => axios.delete(`/authors/${id}`)));
      setAuthors(authors.filter((author) => !selectedAuthors.includes(author._id)));
      setSelectedAuthors([]);
      alert('Selected authors deleted successfully!');
    } catch (error) {
      console.error('Error deleting authors:', error);
    }
  };

  const handleAddAuthor = (newAuthor) => {
    setAuthors([...authors, newAuthor]); // Add new author to the list
  };

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'bio',
      label: 'Bio',
      options: {
        display: false, // Hides bio in the main table, shown in expandable row
      },
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
          <Link to={`/admin/authors/update/${value}`} style={{ textDecoration: 'none', color: '#1976D2' }}>
            Edit
          </Link>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map((row) => authors[row.dataIndex]._id);
      setSelectedAuthors(idsToDelete);
      return false; // Prevents default deletion; will handle it in `handleBulkDelete`
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const author = authors[rowMeta.dataIndex];
      return (
        <tr>
          <td colSpan={6}>
            <Box padding={2}>
              <Typography variant="h6">Bio</Typography>
              <Typography>{author.bio}</Typography>
              <Typography variant="h6" marginTop={2}>
                Images
              </Typography>
              <Box display="flex" gap={2}>
                {author.imagePath.map((img, index) => (
                  <img key={index} src={img} alt="Author" style={{ width: '100px' }} />
                ))}
              </Box>
            </Box>
          </td>
        </tr>
      );
    },
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar component with hover effect handling */}
      <Sidebar onHoverChange={setSidebarHovered} />

      {/* Main content area */}
      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px', // Adjust content position based on sidebar hover state
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography variant="h4" marginRight={13} sx={{ fontFamily: 'Fjalla One, sans-serif', fontWeight: 'bold' }}>
              Author Management
            </Typography>
            <Typography variant="body3" sx={{ color: 'gray', marginTop: 2 }}>
            Add new authors, edit details, and view a complete list of all authors.
            </Typography>
          </Box>

          <Button
              variant="contained"
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
              onClick={() => setModalVisible(true)}
            >
              Add New Author
            </Button>

            {isModalVisible && (
              <NewAuthor
                isModalVisible={isModalVisible} // Pass the correct prop
                onClose={() => setModalVisible(false)} // Close modal
              />
            )}

        </Box>

        {/* DataTable for authors */}
        <TableContainer component={Paper}>
          <MUIDataTable title="Author List" data={authors} columns={columns} options={options} />
        </TableContainer>

        {/* Bulk delete button */}
        {selectedAuthors.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDelete}
            sx={{ marginTop: 2 }}
          >
            Delete Selected
          </Button>
        )}

        {/* Modal for adding new author */}
        {isModalVisible && (
          <NewAuthor
            onAddAuthor={handleAddAuthor}
            onClose={() => setModalVisible(false)} // Close modal
          />
        )}
      </Box>
    </Box>
  );
};

export default AuthorList;

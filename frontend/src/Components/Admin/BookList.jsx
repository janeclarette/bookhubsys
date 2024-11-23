import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar
import NewBook from './NewBook'; // Import NewBook modal component

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  // Fetch books data
  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      const books = response.data.books.map((book) => ({
        ...book,
        authorName: book.authorId ? book.authorId.name : '',
        genreName: book.genreId ? book.genreId.name : '',
        supplierName: book.supplierId ? book.supplierId.name : '',
      }));
      setBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete selected books?')) {
      try {
        await Promise.all(
          selectedRows.map((rowIndex) => axios.delete(`/books/${books[rowIndex]._id}`))
        );
        fetchBooks(); // Refresh book list
        setSelectedRows([]); // Clear selected rows
      } catch (error) {
        console.error('Error deleting books:', error);
      }
    }
  };

  // Single delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${id}`);
        fetchBooks(); // Refresh book list
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  // Define columns for the table
  const columns = [
    { name: 'title', label: 'Title' },
    {
      name: 'publicationDate',
      label: 'Publication Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        customBodyRender: (value) => {
          if (value == null || isNaN(value)) {
            return '$0.00'; // Fallback if value is missing or invalid
          }
          return `$${value.toFixed(2)}`; // Format as price
        },
      },
    },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (id) => (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/admin/books/update/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowsSelect: (rowsSelected, allRows) => {
      setSelectedRows(allRows.map((row) => row.dataIndex));
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const book = books[rowMeta.dataIndex];
      return (
        <tr>
          <td colSpan={columns.length}>
            <div style={{ padding: '15px' }}>
              <p>
                <strong>Author:</strong> {book.authorName}
              </p>
              <p>
                <strong>Genre:</strong> {book.genreName}
              </p>
              <p>
                <strong>Supplier:</strong> {book.supplierName}
              </p>
              <p>
                <strong>Stock:</strong> {book.stock}
              </p>
              <div>
                <strong>Images:</strong>
                {book.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Book Image ${index + 1}`}
                    width="100"
                    style={{ margin: '5px' }}
                  />
                ))}
              </div>
            </div>
          </td>
        </tr>
      );
    },
    customToolbarSelect: () => (
      <Button
        variant="contained"
        color="secondary"
        onClick={handleBulkDelete}
      >
        Bulk Delete
      </Button>
    ),
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
    header: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      marginBottom: '20px',
    },
    addButton: {
      background: 'linear-gradient(135deg, #9e1c63, #c6a0e5)',
      color: 'white',
      borderRadius: '25px',
      padding: '10px 20px',
      textTransform: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        background: 'linear-gradient(135deg, #c6a0e5, #9e1c63)',
      },
    },
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar component with hover effect handling */}
      <Sidebar onHoverChange={setSidebarHovered} />

      {/* Main content area */}
      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={styles.header}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Fjalla One, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left', // Ensure title is left-aligned
              marginTop: '20px', // Slightly move title down
            }}
          >
            Book Management
          </Typography>
          <Typography
            variant="body3"
            sx={{
              color: 'gray',
              marginTop: 1,
              marginBottom: -8,
              textAlign: 'left', // Ensure subtitle is left-aligned
            }}
          >
            Manage your collection of books by adding, updating, or removing entries from the system.
          </Typography>
        </Box>

        {/* Add New Book Button */}
        <Box sx={{ marginBottom: '20px', textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={styles.addButton}
            onClick={() => setIsNewBookModalOpen(true)} // Open modal on click
          >
            Add New Book
          </Button>
        </Box>

        {/* DataTable for books */}
        <MUIDataTable
          title="Book List"
          data={books}
          columns={columns}
          options={options}
        />
      </Box>

      {/* New Book Modal */}
      <NewBook
        isModalVisible={isNewBookModalOpen}
        onClose={() => setIsNewBookModalOpen(false)} // Close modal on close button click
      />
    </Box>
  );
};

export default BookList;

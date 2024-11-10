import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      const books = response.data.books.map(book => ({
        ...book,
        authorName: book.authorId ? book.authorId.name : '',
        genreName: book.genreId ? book.genreId.name : '',
        supplierName: book.supplierId ? book.supplierId.name : ''
      }));
      setBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete selected books?')) {
      try {
        await Promise.all(
          selectedRows.map((rowIndex) => axios.delete(`/books/${books[rowIndex]._id}`))
        );
        fetchBooks(); // Refresh the book list
        setSelectedRows([]); // Clear selected rows
      } catch (error) {
        console.error('Error deleting books:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${id}`);
        fetchBooks(); // Refresh the book list after deletion
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const columns = [
    { name: 'title', label: 'Title' },
    {
      name: 'publicationDate',
      label: 'Publication Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    { name: '_id', label: 'Actions', options: { customBodyRender: (id) => (
      <div>
        <Button variant="contained" color="primary" onClick={() => navigate(`/admin/books/update/${id}`)}>Edit</Button>
        <Button variant="contained" color="secondary" onClick={() => handleDelete(id)}>Delete</Button>
      </div>
    )} },
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
            <div>
              <strong>Author:</strong> {book.authorName}
            </div>
            <div>
              <strong>Genre:</strong> {book.genreName}
            </div>
            <div>
              <strong>Supplier:</strong> {book.supplierName}
            </div>
            <div>
              <strong>Stock:</strong> {book.stock}
            </div>
            <div>
              <strong>Images:</strong>
              {book.images.map((image, index) => (
                <img key={index} src={image.url} alt={`Book Image ${index + 1}`} width="100" style={{ margin: '5px' }} />
              ))}
            </div>
          </td>
        </tr>
      );
    },
    customToolbarSelect: () => (
      <Button variant="contained" color="secondary" onClick={handleBulkDelete}>Bulk Delete</Button>
    ),
  };

  return (
    <MUIDataTable title="Book List" data={books} columns={columns} options={options} />
  );
};

export default BookList;

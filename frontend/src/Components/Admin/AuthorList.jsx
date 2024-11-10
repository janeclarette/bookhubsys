// Components/Admin/AuthorList.jsx
import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

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
      await Promise.all(
        selectedAuthors.map(id => axios.delete(`/authors/${id}`))
      );
      setAuthors(authors.filter(author => !selectedAuthors.includes(author._id)));
      setSelectedAuthors([]);
      alert('Selected authors deleted successfully!');
    } catch (error) {
      console.error('Error deleting authors:', error);
    }
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
        display: false, // Hides bio in main table, shown in expandable row
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
          <div>
            <Link to={`/admin/authors/update/${value}`}>Edit</Link>
          </div>
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
            <div style={{ padding: '20px' }}>
              <h4>Bio</h4>
              <p>{author.bio}</p>
              <h4>Images</h4>
              <div>
                {author.imagePath.map((img, index) => (
                  <img key={index} src={img} alt="Author" style={{ width: '100px', marginRight: '10px' }} />
                ))}
              </div>
            </div>
          </td>
        </tr>
      );
    },
  };

  return (
    <div>
      <h1>Authors List</h1>
      <Link to="/admin/authors/new">Add New Author</Link>
      <MUIDataTable
        title="Authors"
        data={authors}
        columns={columns}
        options={options}
      />
      {selectedAuthors.length > 0 && (
        <button onClick={handleBulkDelete}>Delete Selected</button>
      )}
    </div>
  );
};

export default AuthorList;

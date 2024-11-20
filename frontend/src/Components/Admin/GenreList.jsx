import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import Sidebar from './Sidebar'; // Import Sidebar

const GenreList = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres'); // Updated endpoint
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const deleteGenre = async (id) => {
    try {
      await axios.delete(`/genres/${id}`); // Updated endpoint
      setGenres(genres.filter((genre) => genre._id !== id));
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const deleteSelectedGenres = async (selectedRows) => {
    const idsToDelete = selectedRows.data.map((row) => genres[row.index]._id);
    try {
      await Promise.all(idsToDelete.map((id) => axios.delete(`/genres/${id}`)));
      setGenres((prevGenres) => prevGenres.filter((genre) => !idsToDelete.includes(genre._id)));
    } catch (error) {
      console.error('Error deleting selected genres:', error);
    }
  };

  const columns = [
    { name: 'name', label: 'Genre Name' },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <div>
            <Link to={`/admin/genres/update/${value}`} style={{ marginRight: '10px' }}>
              Edit
            </Link>
            <button onClick={() => deleteGenre(value)}>Delete</button>
          </div>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowsDelete: (rowsDeleted) => {
      deleteSelectedGenres(rowsDeleted);
    },
    customToolbarSelect: (selectedRows) => (
      <button
        onClick={() => deleteSelectedGenres(selectedRows)}
        style={{ color: 'red', cursor: 'pointer' }}
      >
        Delete Selected
      </button>
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
  };

  return (
    <div style={styles.container}>
      <Sidebar /> {/* Sidebar for navigation */}
      <main style={styles.content}>
        <h1>Genres List</h1>
        <Link to="/admin/genres/new">Add New Genre</Link>
        <MUIDataTable
          title="Genres"
          data={genres}
          columns={columns}
          options={options}
        />
      </main>
    </div>
  );
};

export default GenreList;

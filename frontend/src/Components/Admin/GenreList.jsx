import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';

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
          <>
            <Link to={`/admin/genres/update/${value}`}>Edit</Link>
            <button onClick={() => deleteGenre(value)}>Delete</button>
          </>
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

  return (
    <div>
      <h1>Genres List</h1>
      <Link to="/admin/genres/new">Add New Genre</Link>
      <MUIDataTable
        title="Genres"
        data={genres}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default GenreList;

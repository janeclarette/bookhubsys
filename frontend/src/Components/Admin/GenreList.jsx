import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import MUIDataTable from 'mui-datatables';
import Sidebar from './Sidebar';
import { Box, Button, Typography, Paper, TableContainer } from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import NewGenre from './NewGenre'; 
const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const deleteGenre = async (id) => {
    try {
      await axios.delete(`/genres/${id}`);
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
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#e91e63', 
                  color: 'white',
                  padding: '5px 15px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#d81b60', 
                  },
                }}
              >
                <FaEdit style={{ marginRight: '5px' }} /> Edit
              </Button>
            </Link>
            <Button
              onClick={() => deleteGenre(value)}
              variant="contained"
              sx={{
                backgroundColor: '#9e1c63', 
                color: 'white',
                padding: '5px 15px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#c6a0e5', 
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
    onRowsDelete: (rowsDeleted) => {
      deleteSelectedGenres(rowsDeleted);
    },
    customToolbarSelect: (selectedRows) => (
      <Button
        onClick={() => deleteSelectedGenres(selectedRows)}
        variant="outlined"
        color="error"
        sx={{ marginTop: 2 }}
      >
        Delete Selected
      </Button>
    ),
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar onHoverChange={setSidebarHovered} />

      <Box
        style={{
          marginLeft: isSidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography
              variant="h4"
              marginRight={38}
              sx={{ fontFamily: 'Fjalla One, sans-serif', fontWeight: 'bold' }}
            >
              Genre Management
            </Typography>
            <Typography variant="body3" sx={{ color: 'gray', marginTop: 2 }}>
              Manage and organize your list of genres, add new genres, update details, or delete
              existing ones.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setIsModalVisible(true)} 
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
            Add New Genre
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <MUIDataTable title="Genres" data={genres} columns={columns} options={options} />
        </TableContainer>

        {selectedGenres.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteSelectedGenres(selectedGenres)}
            sx={{ marginTop: 2 }}
          >
            Delete Selected
          </Button>
        )}
      </Box>

      {/* New Genre Modal */}
      <NewGenre isModalVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Box>
  );
};

export default GenreList;

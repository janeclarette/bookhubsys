import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { Button, Box, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import { FaCheckCircle, FaBan } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const toggleActiveStatus = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/users/${userId}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: response.data.isActive } : user
        )
      );
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'role', label: 'Role' },
    {
      name: 'isActive',
      label: 'Status',
      options: {
        customBodyRender: (isActive) =>
          isActive ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>
          ),
      },
    },
    {
      name: '_id',
      label: 'Actions',
      options: {
        customBodyRender: (id, tableMeta) => {
          const isActive = users[tableMeta.rowIndex]?.isActive;
          return (
            <Button
              variant="contained"
              color={isActive ? 'error' : 'success'}
              startIcon={isActive ? <FaBan /> : <FaCheckCircle />}
              onClick={() => toggleActiveStatus(id)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar onHoverChange={setSidebarHovered} />
      <Box
        style={{
          marginLeft: sidebarHovered ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginBottom: '20px',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Fjalla One, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left',
              marginTop: '20px',
            }}
          >
            User Management
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'gray',
              marginTop: 1,
              textAlign: 'left',
            }}
          >
            Manage users by activating or deactivating their accounts.
          </Typography>
        </Box>

        <MUIDataTable
          title="User List"
          data={users}
          columns={columns}
          options={options}
        />
      </Box>
    </Box>
  );
};

export default UserList;

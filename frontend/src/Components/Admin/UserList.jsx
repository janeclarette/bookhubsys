import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const UserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/admin/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error("Failed to fetch users:", error);
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
            console.error("Failed to toggle user status:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>User Management</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Button
                                    variant={user.isActive ? 'danger' : 'success'}
                                    onClick={() => toggleActiveStatus(user._id)}
                                >
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserList;

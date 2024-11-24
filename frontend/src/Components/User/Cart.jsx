import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/me', { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/cart/${user._id}`);
          setCart(response.data.items || []);
        } catch (err) {
          setError('Failed to fetch cart items');
        }
      };

      fetchCart();
    }
  }, [user]);

  const handleIncreaseQuantity = async (bookId, quantity) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/cart/quantity`, {
        userId: user._id,
        bookId,
        quantity: quantity + 1,
      });
      setCart(cart.map(item => (item.bookId._id === bookId ? { ...item, quantity: quantity + 1 } : item)));
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const handleDecreaseQuantity = async (bookId, quantity) => {
    if (quantity <= 1) return;
    try {
      await axios.patch(`http://localhost:5000/api/v1/cart/quantity`, {
        userId: user._id,
        bookId,
        quantity: quantity - 1,
      });
      setCart(cart.map(item => (item.bookId._id === bookId ? { ...item, quantity: quantity - 1 } : item)));
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/cart/bulk-delete`, {
        data: { userId: user._id, bookIds: selectedItems },
      });
      setCart(cart.filter(item => !selectedItems.includes(item.bookId._id)));
      setSelectedItems([]);
    } catch (error) {
      setError('Failed to delete selected items');
    }
  };

  const calculateTotal = () => {
    if (selectedItems.length === 0) return 0;

    return cart
      .filter(item => selectedItems.includes(item.bookId._id))
      .reduce((total, item) => total + item.quantity * item.bookId.price, 0)
      .toFixed(2);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleItemSelect = (bookId) => {
    setSelectedItems(prevState => 
      prevState.includes(bookId) 
      ? prevState.filter(id => id !== bookId) 
      : [...prevState, bookId]
    );
  };

  return (
    <div>
      <Navbar />
      <h2>Your Cart</h2>
      {error && <div>{error}</div>}
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
              <TableRow key={item.bookId._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.bookId._id)}
                    onChange={() => handleItemSelect(item.bookId._id)}
                  />
                </TableCell>
                <TableCell>{item.bookId.title}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.bookId.price.toFixed(2)}</TableCell>
                <TableCell>{(item.quantity * item.bookId.price).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleIncreaseQuantity(item.bookId._id, item.quantity)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDecreaseQuantity(item.bookId._id, item.quantity)}>
                    <RemoveIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cart.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/checkout', {
          state: {
            selectedItems: cart.filter(item => selectedItems.includes(item.bookId._id)),
            user: user // Pass the user data
          }
        })}
        disabled={selectedItems.length === 0}
      >
        Checkout Selected
      </Button>

      <div style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleBulkDelete}
          disabled={selectedItems.length === 0}
        >
          Delete Selected
        </Button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Order Summary</h3>
        <p>Total: {calculateTotal()}</p>
      </div>
    </div>
  );
};

export default Cart;

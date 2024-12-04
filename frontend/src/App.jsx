// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthorList from './Components/Admin/AuthorList';
import NewAuthor from './Components/Admin/NewAuthor';
import UpdateAuthor from './Components/Admin/UpdateAuthor';
import GenreList from './Components/Admin/GenreList';
import NewGenre from './Components/Admin/NewGenre';
import UpdateGenre from './Components/Admin/UpdateGenre';
import SupplierList from './Components/Admin/SupplierList';
import NewSupplier from './Components/Admin/NewSupplier';
import UpdateSupplier from './Components/Admin/UpdateSupplier';
import BookList from './Components/Admin/BookList'; 
import NewBook from './Components/Admin/NewBook'; 
import UpdateBook from './Components/Admin/UpdateBook'; 
import UserList from './Components/Admin/UserList';
import OrderList from './Components/Admin/OrderList';
import Review from './Components/Admin/Review';
// import { AuthProvider } from './context/AuthContext';
// import Login from './Components/User/Login';
// import Register from './Components/User/Register';
// import ProtectedRoutes from './Components/Route/ProtectedRoutes';
import Home from './Components/Home'; 
import Genre from './Components/Genre';
import Authors from './Components/Authors';
import AuthorsWorks from './Components/AuthorsWorks';

import Sidebar from './Components/Admin/Sidebar';
import Dashboard from './Components/Admin/Dashboard';

import RegisterAdmin from './Components/Auth/RegisterAdmin';
import LoginAdmin from './Components/Auth/LoginAdmin';


import Login from './Components/User/Login';
import Register from './Components/User/Register';
import UserDashboard from './Components/User/UserDashboard';
import Profile from './Components/User/Profile';
import Cart from './Components/User/Cart';
import Checkout from './Components/User/Checkout';
import Order from './Components/User/Order';
import Rating from './Components/User/Rating';

import './App.css';






const App = () => {
    return (
        <Router>
        <div style={{ display: 'flex' }}>
          {/* <Sidebar /> */}
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
                {/* <Route path="/" element={<Dashboard />} />  */}
                <Route path="/" element={<Home />} />
                <Route path="/admin/authors" element={<AuthorList />} />
                <Route path="/admin/authors/new" element={<NewAuthor />} />
                <Route path="/admin/authors/update/:id" element={<UpdateAuthor />} />
                <Route path="/admin/genres" element={<GenreList />} />
                <Route path="/admin/genres/new" element={<NewGenre />} />
                <Route path="/admin/genres/update/:id" element={<UpdateGenre />} />
                <Route path="/admin/suppliers" element={<SupplierList />} />
                <Route path="/admin/suppliers/new" element={<NewSupplier />} />
                <Route path="/admin/suppliers/update/:id" element={<UpdateSupplier />} />
                <Route path="/admin/books" element={<BookList />} /> 
                <Route path="/admin/books/new" element={<NewBook />} /> 
                <Route path="/admin/books/update/:id" element={<UpdateBook />} /> 
                <Route path="/admin/users" element={<UserList />} /> 
                <Route path="/admin/orders" element={<OrderList />} /> 
                <Route path="/admin/reviews" element={<Review />} /> 

                <Route path="/admin" element={<Dashboard />}/>
                <Route path="/genres" element={<Genre />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/authorworks/:authorId" element={<AuthorsWorks />} />

                <Route path="/register/admin" element={<RegisterAdmin />} />
                <Route path="/login/admin" element={<LoginAdmin />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Order />} />
                <Route path="/rating" element={<Rating />} />

            </Routes>
            </div>
            </div>
        </Router>
    );
};

export default App;

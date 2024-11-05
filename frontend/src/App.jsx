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
import BookList from './Components/Admin/BookList'; // Import BookList
import NewBook from './Components/Admin/NewBook'; // Import NewBook
import UpdateBook from './Components/Admin/UpdateBook'; // Import UpdateBook
// import { AuthProvider } from './context/AuthContext';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
// import ProtectedRoutes from './Components/Route/ProtectedRoutes';
// import Home from './Components/Home'; 

import Sidebar from './Components/Admin/Sidebar';
import Dashboard from './Components/Admin/Dashboard';

import './App.css';

const App = () => {
    return (
        <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
                <Route path="/" element={<Dashboard />} /> 
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/admin/authors" element={<AuthorList />} />
                <Route path="/admin/authors/new" element={<NewAuthor />} />
                <Route path="/admin/authors/update/:id" element={<UpdateAuthor />} />
                <Route path="/admin/genres" element={<GenreList />} />
                <Route path="/admin/genres/new" element={<NewGenre />} />
                <Route path="/admin/genres/update/:id" element={<UpdateGenre />} />
                <Route path="/admin/suppliers" element={<SupplierList />} />
                <Route path="/admin/suppliers/new" element={<NewSupplier />} />
                <Route path="/admin/suppliers/update/:id" element={<UpdateSupplier />} />
                <Route path="/admin/books" element={<BookList />} /> {/* Route for BookList */}
                <Route path="/admin/books/new" element={<NewBook />} /> {/* Route for NewBook */}
                <Route path="/admin/books/update/:id" element={<UpdateBook />} /> {/* Route for UpdateBook */}
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/register" element={<Register />} />
                {/* <ProtectedRoute path="/admin" element={<AdminDashboard />} /> */}
            </Routes>
            </div>
            </div>
        </Router>
    );
};

export default App;

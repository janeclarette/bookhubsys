import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const BookList = () => {
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('/books');
            setBooks(response.data.books);
        } catch (error) {
            console.error('Error fetching books:', error.response.data);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`/books/${id}`);
                fetchBooks(); // Refresh the book list
            } catch (error) {
                console.error('Error deleting book:', error.response.data);
            }
        }
    };

    return (
        <div>
            <h1>Book List</h1>
            <Link to="/admin/books/new">Add New Book</Link>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>Publication Date</th> {/* New column for publication date */}
                        <th>Stock</th> {/* New column for stock */}
                        <th>Supplier</th> {/* New column for supplier name */}
                        <th>Images</th> {/* Images column */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.authorId.name}</td> {/* Display author's name */}
                            <td>{book.genreId.name}</td> {/* Display genre's name */}
                            <td>{new Date(book.publicationDate).toLocaleDateString()}</td> {/* Format publication date */}
                            <td>{book.stock}</td> {/* Display stock level */}
                            <td>{book.supplierId.name}</td> {/* Display supplier's name */}
                            <td>
                                {book.images.map((image, index) => (
                                    <img 
                                        key={index} 
                                        src={image.url} 
                                        alt={`Book Image ${index + 1}`} 
                                        width="100" 
                                        style={{ margin: '5px' }} // Optional styling for spacing
                                    />
                                ))}
                            </td>
                            <td>
                                <Link to={`/admin/books/update/${book._id}`}>Edit</Link>
                                <button onClick={() => handleDelete(book._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;

// AuthorsWorks.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Navbar from './Layout/Navbar';

const AuthorsWorks = () => {
  const { authorId } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooksByAuthor();
  }, []);

  const fetchBooksByAuthor = async () => {
    try {
      const response = await axios.get(`/books/author/${authorId}`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Books by Author</h1>
      <div style={styles.bookList}>
        {books.length === 0 ? (
          <p>No books found for this author.</p>
        ) : (
          books.map((book) => (
            <div key={book._id} style={styles.bookCard}>
              <img
                src={book.images[0]?.url || 'default.jpg'}
                alt={book.title}
                style={styles.bookImage}
              />
              <h3>{book.title}</h3>
              <p>Published on: {new Date(book.publicationDate).toDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  bookList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  bookCard: {
    width: '200px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  bookImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
};

export default AuthorsWorks;

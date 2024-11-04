import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const NewBook = () => {
    const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [stock, setStock] = useState(0);
  const [authorId, setAuthorId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [images, setImages] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchSuppliers();
  }, []);

  const fetchAuthors = async () => {
    const response = await axios.get('/authors');
    setAuthors(response.data.authors);
  };

  const fetchGenres = async () => {
    const response = await axios.get('/genres');
    setGenres(response.data.genres);
  };

  const fetchSuppliers = async () => {
    const response = await axios.get('/suppliers');
    setSuppliers(response.data.suppliers);
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const createBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('publicationDate', publicationDate);
    formData.append('stock', stock);
    formData.append('authorId', authorId);
    formData.append('genreId', genreId);
    formData.append('supplierId', supplierId);
    if (images) {
      Array.from(images).forEach(image => formData.append('images', image));
    }

    try {
        await axios.post('/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Book created successfully!');
        navigate('/admin/books');
      } catch (error) {
        console.error('Error creating book:', error);
      }
  };

  return (
    <form onSubmit={createBook}>
      <h1>Add New Book</h1>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Publication Date:
        <input type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} required />
      </label>
      <label>
        Stock:
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" required />
      </label>
      <label>
        Author:
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} required>
          <option value="">Select an Author</option>
          {authors.map(author => (
            <option key={author._id} value={author._id}>{author.name}</option>
          ))}
        </select>
      </label>
      <label>
        Genre:
        <select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
          <option value="">Select a Genre</option>
          {genres.map(genre => (
            <option key={genre._id} value={genre._id}>{genre.name}</option>
          ))}
        </select>
      </label>
      <label>
        Supplier:
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
          <option value="">Select a Supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
          ))}
        </select>
      </label>
      <label>
        Images:
        <input type="file" multiple onChange={handleFileChange} />
      </label>
      <button type="submit">Create Book</button>
    </form>
  );
};

export default NewBook;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar'; // Import Sidebar

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(''); // Add price state
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
    fetchBook();
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

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/books/${id}`);
      const { title, publicationDate, stock, price, authorId, genreId, supplierId } = response.data.book;
      setTitle(title);
      setPublicationDate(publicationDate);
      setStock(stock);
      setPrice(price); // Set price when fetching book details
      setAuthorId(authorId);
      setGenreId(genreId);
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const updateBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('publicationDate', publicationDate);
    formData.append('stock', stock);
    formData.append('price', price); // Include price in form data
    formData.append('authorId', authorId);
    formData.append('genreId', genreId);
    formData.append('supplierId', supplierId);
    if (images) {
      Array.from(images).forEach((image) => formData.append('images', image));
    }

    try {
      await axios.put(`/books/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Book updated successfully!');
      navigate('/admin/books');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <div>
      <Sidebar /> {/* Sidebar for navigation */}
      <h1>Update Book</h1>
      <form onSubmit={updateBook}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Publication Date:
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            required
          />
        </label>
        <label>
          Stock:
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </label>
        <label>
          Author:
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Genre:
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            required
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Supplier:
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Images:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBook;

// Components/Admin/UpdateAuthor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const UpdateAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState(null);

  useEffect(() => {
    fetchAuthor();
  }, []);

  const fetchAuthor = async () => {
    try {
      const response = await axios.get(`/authors/${id}`); // Changed to '/authors/${id}'
      const { name, bio, imagePath } = response.data.author;
      setName(name);
      setBio(bio);
      setImages(imagePath);
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const updateAuthor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (images) {
      Array.from(images).forEach(image => formData.append('images', image));
    }

    try {
      await axios.put(`/authors/${id}`, formData, { // Changed to '/authors/${id}'
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Author updated successfully!');
      navigate('/admin/authors');
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  return (
    <form onSubmit={updateAuthor}>
      <h1>Update Author</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Bio:
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength="1000" />
      </label>
      <label>
        Images:
        <input type="file" multiple onChange={handleFileChange} />
      </label>
      <button type="submit">Update Author</button>
    </form>
  );
};

export default UpdateAuthor;

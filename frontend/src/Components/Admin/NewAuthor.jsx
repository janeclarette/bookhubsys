// Components/Admin/NewAuthor.jsx
import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';

const NewAuthor = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState(null);

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const createAuthor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (images) {
      Array.from(images).forEach(image => formData.append('images', image));
    }

    try {
      await axios.post('/authors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Author created successfully!');
      setName('');
      setBio('');
      setImages(null);
    } catch (error) {
      console.error('Error creating author:', error);
    }
  };

  return (
    <form onSubmit={createAuthor}>
      <h1>Add New Author</h1>
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
      <button type="submit">Create Author</button>
    </form>
  );
};

export default NewAuthor;

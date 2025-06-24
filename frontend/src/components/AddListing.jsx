import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddListing() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // 🔒 Redirect if user is not admin
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    if (parsed.role !== "admin") {
      alert("Access denied: Admins only");
      navigate("/packages");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('user');
    if (!token) {
      setError('You must be logged in to add a listing');
      return;
    }

    const formData = { name, description, image, state, district, price, contact };

    try {
      const response = await fetch('http://localhost:5000/addListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token).token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        setSuccess('Listing added successfully!');
        setName('');
        setDescription('');
        setImage('');
        setState('');
        setDistrict('');
        setPrice('');
        setContact('');

        navigate('/');
      } else {
        setError(data.message || 'Failed to add listing');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: '50%', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 text-primary">Add a New Listing</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Listing Name</label>
            <input type="text" className="form-control border-dark" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control border-dark" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input type="text" className="form-control border-dark" value={image} onChange={(e) => setImage(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">State</label>
            <input type="text" className="form-control border-dark" value={state} onChange={(e) => setState(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">District</label>
            <input type="text" className="form-control border-dark" value={district} onChange={(e) => setDistrict(e.target.value)} required />
          </div>
          <div className="mb-3 d-flex gap-3">
            <div className="w-50">
              <label className="form-label">Price</label>
              <input type="number" className="form-control border-dark" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="w-50">
              <label className="form-label">Contact</label>
              <input type="text" className="form-control border-dark" value={contact} onChange={(e) => setContact(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Listing</button>
        </form>
      </div>
    </div>
  );
}

export default AddListing;

import React, { useState } from "react";

const AddListing = ({ onAdd }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="container mt-5">
      <h2>Add a New Listing</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;

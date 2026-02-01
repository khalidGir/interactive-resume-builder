import React, { useState, useEffect } from 'react';

const PersonalInfoForm = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...formData,
      [name]: value
    };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="form-section">
      <h3>Personal Information</h3>
      <div className="form-group">
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="summary">Professional Summary:</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
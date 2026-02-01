import React, { useState, useEffect } from 'react';

const ExperienceForm = ({ data, onUpdate }) => {
  const [experiences, setExperiences] = useState([
    { 
      jobTitle: '', 
      company: '', 
      startDate: '', 
      endDate: '', 
      currentlyWorking: false, 
      responsibilities: '' 
    }
  ]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setExperiences(data);
    }
  }, [data]);

  const handleInputChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedExperiences = [...experiences];
    
    if (type === 'checkbox') {
      updatedExperiences[index][name] = checked;
    } else {
      updatedExperiences[index][name] = value;
    }
    
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences, 
      { 
        jobTitle: '', 
        company: '', 
        startDate: '', 
        endDate: '', 
        currentlyWorking: false, 
        responsibilities: '' 
      }
    ]);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      const updatedExperiences = [...experiences];
      updatedExperiences.splice(index, 1);
      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
    }
  };

  return (
    <div className="form-section">
      <h3>Work Experience</h3>
      {experiences.map((exp, index) => (
        <div key={index} className="experience-item">
          <h4>Experience #{index + 1}</h4>
          
          <div className="form-group">
            <label htmlFor={`jobTitle-${index}`}>Job Title:</label>
            <input
              type="text"
              id={`jobTitle-${index}`}
              name="jobTitle"
              value={exp.jobTitle}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`company-${index}`}>Company:</label>
            <input
              type="text"
              id={`company-${index}`}
              name="company"
              value={exp.company}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`startDate-${index}`}>Start Date:</label>
            <input
              type="month"
              id={`startDate-${index}`}
              name="startDate"
              value={exp.startDate}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`endDate-${index}`}>End Date:</label>
            <input
              type="month"
              id={`endDate-${index}`}
              name="endDate"
              value={exp.endDate}
              onChange={(e) => handleInputChange(index, e)}
              disabled={exp.currentlyWorking}
            />
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={exp.currentlyWorking}
                onChange={(e) => handleInputChange(index, e)}
              />
              I currently work here
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor={`responsibilities-${index}`}>Responsibilities:</label>
            <textarea
              id={`responsibilities-${index}`}
              name="responsibilities"
              value={exp.responsibilities}
              onChange={(e) => handleInputChange(index, e)}
              rows="4"
            ></textarea>
          </div>
          
          <button type="button" onClick={() => removeExperience(index)} disabled={experiences.length <= 1}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addExperience}>Add Experience</button>
    </div>
  );
};

export default ExperienceForm;
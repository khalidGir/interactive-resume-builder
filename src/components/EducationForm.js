import React, { useState, useEffect } from 'react';

const EducationForm = ({ data, onUpdate }) => {
  const [educations, setEducations] = useState([{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setEducations(data);
    }
  }, [data]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducations = [...educations];
    updatedEducations[index][name] = value;
    setEducations(updatedEducations);
    onUpdate(updatedEducations);
  };

  const addEducation = () => {
    setEducations([...educations, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }]);
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      const updatedEducations = [...educations];
      updatedEducations.splice(index, 1);
      setEducations(updatedEducations);
      onUpdate(updatedEducations);
    }
  };

  return (
    <div className="form-section">
      <h3>Education</h3>
      {educations.map((edu, index) => (
        <div key={index} className="education-item">
          <h4>Education #{index + 1}</h4>
          
          <div className="form-group">
            <label htmlFor={`institution-${index}`}>Institution:</label>
            <input
              type="text"
              id={`institution-${index}`}
              name="institution"
              value={edu.institution}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`degree-${index}`}>Degree:</label>
            <input
              type="text"
              id={`degree-${index}`}
              name="degree"
              value={edu.degree}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`fieldOfStudy-${index}`}>Field of Study:</label>
            <input
              type="text"
              id={`fieldOfStudy-${index}`}
              name="fieldOfStudy"
              value={edu.fieldOfStudy}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`startDate-${index}`}>Start Date:</label>
            <input
              type="month"
              id={`startDate-${index}`}
              name="startDate"
              value={edu.startDate}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`endDate-${index}`}>End Date:</label>
            <input
              type="month"
              id={`endDate-${index}`}
              name="endDate"
              value={edu.endDate}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`gpa-${index}`}>GPA:</label>
            <input
              type="text"
              id={`gpa-${index}`}
              name="gpa"
              value={edu.gpa}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          
          <button type="button" onClick={() => removeEducation(index)} disabled={educations.length <= 1}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addEducation}>Add Education</button>
    </div>
  );
};

export default EducationForm;
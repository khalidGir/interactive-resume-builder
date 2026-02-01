import React, { useState, useEffect } from 'react';

const SkillsForm = ({ data, onUpdate }) => {
  const [skills, setSkills] = useState(['']);

  useEffect(() => {
    if (data && data.length > 0) {
      setSkills(data);
    }
  }, [data]);

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
    onUpdate(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      setSkills(updatedSkills);
      onUpdate(updatedSkills);
    }
  };

  return (
    <div className="form-section">
      <h3>Skills</h3>
      {skills.map((skill, index) => (
        <div key={index} className="skill-item">
          <div className="form-group">
            <label htmlFor={`skill-${index}`}>Skill #{index + 1}:</label>
            <input
              type="text"
              id={`skill-${index}`}
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              placeholder="Enter a skill"
            />
            <button type="button" onClick={() => removeSkill(index)} disabled={skills.length <= 1}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addSkill}>Add Skill</button>
    </div>
  );
};

export default SkillsForm;
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the resume preview to PDF
 * @param {string} elementId - The ID of the element to convert to PDF
 * @param {string} filename - The name of the PDF file to download
 */
export const exportToPDF = async (elementId, filename = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Use html2canvas to capture the element as an image
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    // Create a new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Exports resume data to a simple text format
 * @param {Object} resumeData - The resume data object
 * @param {string} filename - The name of the text file to download
 */
export const exportToText = (resumeData, filename = 'resume.txt') => {
  try {
    const { personalInfo, education, experience, skills } = resumeData;
    
    let content = '';
    
    // Add personal info
    content += `RESUME\n\n`;
    content += `Name: ${personalInfo.fullName || ''}\n`;
    content += `Email: ${personalInfo.email || ''}\n`;
    content += `Phone: ${personalInfo.phone || ''}\n`;
    content += `Address: ${personalInfo.address || ''}\n\n`;
    
    if (personalInfo.summary) {
      content += `SUMMARY\n`;
      content += `${personalInfo.summary}\n\n`;
    }
    
    // Add education
    if (education && education.length > 0) {
      content += `EDUCATION\n`;
      education.forEach(edu => {
        content += `\n${edu.degree} in ${edu.fieldOfStudy}\n`;
        content += `${edu.institution}\n`;
        content += `${edu.startDate} - ${edu.endDate || 'Present'}\n`;
        if (edu.gpa) content += `GPA: ${edu.gpa}\n`;
      });
      content += `\n`;
    }
    
    // Add experience
    if (experience && experience.length > 0) {
      content += `EXPERIENCE\n`;
      experience.forEach(exp => {
        content += `\n${exp.jobTitle} at ${exp.company}\n`;
        content += `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}\n`;
        content += `${exp.responsibilities}\n`;
      });
      content += `\n`;
    }
    
    // Add skills
    if (skills && skills.length > 0) {
      content += `SKILLS\n`;
      content += `${skills.join(', ')}\n\n`;
    }
    
    // Create and download the text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating text file:', error);
    alert('Failed to generate text file. Please try again.');
  }
};
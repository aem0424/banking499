import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from 'axios';

function ReactDemo() {
  const [accountId, setAccountId] = useState('');

  const handleClick = async () => {
    try {
  
      const response = await axios.get(`/1099form`, {
        params: {
          AccountID: accountId,
        },
        responseType: 'blob', // Set the responseType to 'blob' for binary data (PDF)
      });
      
      // Assuming the response is a PDF file
      const pdfUrl = URL.createObjectURL(new Blob([response.data]));

      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <label style={{ backgroundColor: 'black', color: 'white', padding: '5px' }}>
        Enter Account ID:
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </label>
      <button onClick={handleClick}>Generate 1099 Form</button>
    </div>
  );
}


export default ReactDemo; // Export with the corrected component name

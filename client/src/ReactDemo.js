import React, { useState } from "react";
import axios from 'axios';
import { saveAs } from 'file-saver';

function ReactDemo() {
  const [accountId, setAccountId] = useState('');

  const handleClick = async () => {
    try {
      const response = await axios.get(`/1099form`, {
        params: {
          AccountID: accountId,
        },
        responseType: 'arraybuffer',
      });

      // Use file-saver to trigger the download
      saveAs(new Blob([response.data], { type: 'application/pdf' }), '1099form.pdf');
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

export default ReactDemo;


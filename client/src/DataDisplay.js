import React, { useState, useEffect } from 'react';

function DataDisplay() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(JSON.stringify(result, null, 2))
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(JSON.stringify(data, null, 2))
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>PhoneNumber</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user['User ID']}</td>
                <td>{user['Email']}</td>
                <td>{user['Password']}</td>
                <td>{user['Role']}</td>
                <td>{user['PhoneNumber']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataDisplay;
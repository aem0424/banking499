import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

function AdminTellerList() {
    const [tellers, setTellers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios.get('/admin/tellers')
        .then((response) => {
          if (response.status === 200) {
            setTellers(response.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tellers:', error);
          setLoading(false);
        });
    }, []);
  
    return (
      <div className='container'>
        <h1>Teller List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {tellers.map((teller, index) => (
              <li key={index}>
                <Link to={`/Admin/Teller/EditTeller/${teller.id}`} state={{ tellerData: teller }}>Edit {teller.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
export default AdminTellerList;
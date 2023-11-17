import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTellerList() {
  const location = useLocation();
  const user = location.state && location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tellers, setTellers] = useState([]);

    // Check if user is null, redirect to "/"
    useEffect(() => {
      if (!user) {
        navigate('/Login');
      }
    }, [user, navigate]);

  const handleLogoutClick = () => {
    axios.post('/user/logout')
      .then((response) => {
        if (response.status === 200) {
          navigate('/Login');
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleNewTellerClick = () => {
    navigate('/Admin/Teller/CreateTeller', { state: { user } });
  };
  
  useEffect(() => {
    if (user) {
      axios.get('/user', {})
        .then((response) => {
          if (response.status === 200) {
            setUserData(response.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  
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
  }, [user]);

  const handleEditTellersClick = (teller) => {
    navigate('/Admin/Teller/EditTeller/$teller.UserID', { state: { user, tellerData : teller } });
  };

  const handleDeleteTellerClick = (teller) => {
    navigate('/Admin/Teller/Delete', { state: { user, tellerData : teller } });
  };

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLoadPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;


    return (
      <div className='container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
          <h1>Teller List</h1>
          <table className='striped-table'>
            <thead>
              {/*<tr>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>
        </tr>*/}
            </thead>
            <tbody>
              {tellers
              .slice(startIndex,endIndex)
              .sort((a,b) => a.LastName.localeCompare(b.LastName))
              .map((teller, index) => (
                <tr key={startIndex + index}>
                  <td>
                    {teller.LastName}, {teller.FirstName}
                  </td>
                  <td>
                    <button onClick={() => handleEditTellersClick(teller)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteTellerClick(teller)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {startIndex > 0 && (
              <button onClick={handleLoadPrevious} className='form-button'>Load Previous Tellers</button>
            )}
      {endIndex < tellers.length && (
            <button onClick={handleLoadMore} className='form-button'>Load Next Tellers</button>
          )}
          <button onClick={handleNewTellerClick} className='submit-button'>Add New Teller</button>
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
          <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
        </div>
        )}
      </div>
    );
  }
export default AdminTellerList;
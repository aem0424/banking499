import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

let AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // http://localhost:8000
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },

})


function AdminTellerEdit() {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tellerData = location.state.tellerData;
  

  const [formData, setFormData] = useState({
    Email: tellerData?.Email || "",
    FirstName: tellerData?.FirstName || "",
    LastName: tellerData?.LastName || "",
    DOB: tellerData?.DOB || "",
    SSN: tellerData?.SSN || "",
    Street: tellerData?.Street || "",
    Street2: tellerData?.Street2 || "",
    State: tellerData?.State || "",
    City: tellerData?.City || "",
    ZIP: tellerData?.ZIP || "",
    PhoneNumber: tellerData?.PhoneNumber || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
  
  useEffect(() => {
    if (user) {
      axios.get('/user', {})
        .then((response) => {
          if (response.status === 200) {
            setUserData(response.data);
            setLoading(false);
            console.log('User in AdminTellerEdit:', user);
            console.log('User FirstName:', userData.FirstName);
          }
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleAdminMainClick = () => {
    navigate('/Admin', { state: { user } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:4000/admin/teller/update', formData, {withCredentials:true});
  
      if (response.status === 200) {
        console.log('Teller Updated successfully:', response.data);
      } else {
        console.error('Error updating teller:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  return (
    <div className='container'>
      <h1>Edit Teller</h1>
      <p>Name: {tellerData.FirstName} {tellerData.LastName}</p>
      <form onSubmit={handleSubmit} className="register-form">
          <div className="form-columns">
            <div className='form-group'>
              <label htmlFor="FirstName" className='form-label'>First Name:</label>
              <input
                type="text"
                id="FirstName"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="LastName" className='form-label'>Last Name:</label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="SSN" className='form-label'>SSN:</label>
              <input
                type="text"
                id="SSN"
                name="SSN"
                value={formData.SSN}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="PhoneNumber" className='form-label'>Phone Number:</label>
              <input
                type="tel"
                id="PhoneNumber"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
          </div>
          <div className="form-columns">
            
            <div className='form-group'>
              <label htmlFor="DOB" className='form-label'>Date of Birth:</label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={formData.DOB}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="Street" className='form-label'>Address Line 1:</label>
              <input
                type="text"
                id="Street"
                name="Street"
                value={formData.Street}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="Street2" className='form-label'>Address Line 2:</label>
              <input
                type="text"
                id="Street2"
                name="Street2"
                value={formData.Street2}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="City" className='form-label'>City:</label>
              <input
                type="text"
                id="City"
                name="City"
                value={formData.City}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label htmlFor="State" className='form-label'>State:</label>
              <select
                id="State"
                name="State"
                value={formData.State}
                onChange={handleInputChange}
                required
              >
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="Arizona">Arizona</option>
                    <option value="Arkansas">Arkansas</option>
                    <option value="California">California</option>
                    <option value="Colorado">Colorado</option>
                    <option value="Connecticut">Connecticut</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Florida">Florida</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Hawaii">Hawaii</option>
                    <option value="Idaho">Idaho</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Indiana">Indiana</option>
                    <option value="Iowa">Iowa</option>
                    <option value="Kansas">Kansas</option>
                    <option value="Kentucky">Kentucky</option>
                    <option value="Louisiana">Louisiana</option>
                    <option value="Maine">Maine</option>
                    <option value="Maryland">Maryland</option>
                    <option value="Massachusetts">Massachusetts</option>
                    <option value="Michigan">Michigan</option>
                    <option value="Minnesota">Minnesota</option>
                    <option value="Mississippi">Mississippi</option>
                    <option value="Missouri">Missouri</option>
                    <option value="Montana">Montana</option>
                    <option value="Nebraska">Nebraska</option>
                    <option value="Nevada">Nevada</option>
                    <option value="New Hampshire">New Hampshire</option>
                    <option value="New Jersey">New Jersey</option>
                    <option value="New Mexico">New Mexico</option>
                    <option value="New York">New York</option>
                    <option value="North Carolina">North Carolina</option>
                    <option value="North Dakota">North Dakota</option>
                    <option value="Ohio">Ohio</option>
                    <option value="Oklahoma">Oklahoma</option>
                    <option value="Oregon">Oregon</option>
                    <option value="Pennsylvania">Pennsylvania</option>
                    <option value="Rhode Island">Rhode Island</option>
                    <option value="South Carolina">South Carolina</option>
                    <option value="South Dakota">South Dakota</option>
                    <option value="Tennessee">Tennessee</option>
                    <option value="Texas">Texas</option>
                    <option value="Utah">Utah</option>
                    <option value="Vermont">Vermont</option>
                    <option value="Virginia">Virginia</option>
                    <option value="Washington">Washington</option>
                    <option value="West Virginia">West Virginia</option>
                    <option value="Wisconsin">Wisconsin</option>
                    <option value="Wyoming">Wyoming</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor="ZIP" className='form-label'>Zipcode:</label>
              <input
                type="text"
                id="ZIP"
                name="ZIP"
                value={formData.ZIP}
                onChange={handleInputChange}
                required
                className='form-input'
              />
            </div>
            </div>
        <button type='submit' className='submit-button'>Save Changes</button>
      </form>
      <div className="form-links">
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
        </div>
        <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
    </div>
  );
}

export default AdminTellerEdit;
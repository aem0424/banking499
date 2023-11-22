import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminTellerEdit() {
  const location = useLocation();
  const user = location.state && location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tellerData = location.state.tellerData;
  const [successMessage, setSuccessMessage] = useState(null);
  

  const [formData, setFormData] = useState({
    UserID: tellerData?.UserID || "",
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
    CellPhoneNumber: tellerData?.CellPhoneNumber || "",
    UserID: tellerData?.UserID,
  });

  const [errors, setErrors] = useState({
    Email: '',
    Password: '',
    FirstName: '',
    LastName: '',
    SSN: '',
    PhoneNumber: '',
    CellPhoneNumber: '',
    Street: '',
    Street2: '',
    City: '',
    ZIP: '',
  });

    // Check if user is null, redirect to "/"
    useEffect(() => {
      if (!user) {
        navigate('/Login');
      }
    }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
  
    if (name === 'SSN' && (isNaN(value) || value.length !== 9)) {
      error = 'Invalid SSN.';
    } else if (name === 'PhoneNumber' && (isNaN(value) || value.length !== 10)) {
      error = 'Invalid Phone Number.';
    } else if (name === 'CellPhoneNumber' && (isNaN(value) || value.length !== 10)) {
      error = 'Invalid Phone Number.';
    }else if (name === 'Password' && value.length < 6) {
      error = 'Must be at least 6 characters.';
    } else if (['FirstName', 'LastName'].includes(name) && !/^[a-zA-Z]+$/.test(value)) {
      error = `Invalid ${name === 'FirstName' ? 'First' : 'Last'} Name.`;
    } else if (['Street', 'Street2', 'City'].includes(name) && !/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
      error = `Invalid ${name}.`;
    } else if (name === 'Email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid Email.';
    } else if (name === 'ZIP' && (isNaN(value) || value.length !==5)) {
      error = 'Invalid ZIP Code.';
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const allFieldsValid = Object.values(errors).every((error) => error === '');

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

  const handleManageTellersClick = () => {
    navigate('/Admin/Teller/TellerList', { state: { user } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allFieldsValid) {
      console.error('Please fill in all fields correctly before submitting.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/admin/teller/update', formData, {withCredentials:true});
  
      if (response.status === 200) {
        console.log('Teller Updated successfully:', response.data);
        setSuccessMessage('Teller updated successfully');
      } else {
        console.error('Error updating teller:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Request details:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }
    }
  };
  return (
    <div className='container'>
      <h2>Teller Personal Information</h2>
          <div className='info'>
            <p><strong>Name:</strong> {tellerData.FirstName} {tellerData.LastName}</p>
            <p><strong>Address:</strong> {tellerData.Street}, {tellerData.Street2}, {tellerData.City}, {tellerData.State}, {tellerData.ZIP}</p>         
            <p><strong>Home Phone Number:</strong> {tellerData.PhoneNumber} <strong>Cell Phone Number:</strong> {tellerData.CellPhoneNumber}</p>
            <p><strong>SSN:</strong> {tellerData.SSN} <strong>Date of Birth</strong> {tellerData.DOB}</p>
          </div>

      <h2>Edit Teller</h2>
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
                className={`form-input ${errors.FirstName ? 'error' : ''}`}
              />
               {errors.FirstName && <><br /><span className="error-message">{errors.FirstName}</span></>}
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
                className={`form-input ${errors.LastName ? 'error' : ''}`}
                />
                  {errors.LastName && <><br /><span className="error-message">{errors.LastName}</span></>}
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
                className={`form-input ${errors.SSN ? 'error' : ''}`}
                />
                  {errors.SSN && <><br /><span className="error-message">{errors.SSN}</span></>}
              </div>
            <div className='form-group'>
              <label htmlFor="PhoneNumber" className='form-label'> Home Phone Number:</label>
              <input
                type="tel"
                id="PhoneNumber"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleInputChange}
                required
                className={`form-input ${errors.PhoneNumber ? 'error' : ''}`}
                />
                  {errors.PhoneNumber && <><br /><span className="error-message">{errors.PhoneNumber}</span></>}
              </div>
            <div className='form-group'>
            <label htmlFor="CellPhoneNumber" className='form-label'>Cell Phone Number:</label>
            <input
              type="tel"
              id="CellPhoneNumber"
              name="CellPhoneNumber"
              value={formData.CellPhoneNumber}
              onChange={handleInputChange}
              required
              className={`form-input ${errors.CellPhoneNumber ? 'error' : ''}`}
            />
            {errors.CellPhoneNumber && <><br /><span className="error-message">{errors.CellPhoneNumber}</span></>}
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
                className={`form-input ${errors.Street ? 'error' : ''}`}
                />
                  {errors.Street && <><br /><span className="error-message">{errors.Street}</span></>}
              </div>
            <div className='form-group'>
              <label htmlFor="Street2" className='form-label'>Address Line 2:</label>
              <input
                type="text"
                id="Street2"
                name="Street2"
                value={formData.Street2}
                onChange={handleInputChange}
                className={`form-input ${errors.Street2 ? 'error' : ''}`}
                />
                  {errors.Street2 && <><br /><span className="error-message">{errors.Street2}</span></>}
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
                className={`form-input ${errors.City ? 'error' : ''}`}
                />
                  {errors.City && <><br /><span className="error-message">{errors.City}</span></>}
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
                className={`form-input ${errors.ZIP ? 'error' : ''}`}
                />
                  {errors.ZIP && <><br /><span className="error-message">{errors.ZIP}</span></>}
              </div>
            </div>
            {successMessage && (<p className="success-message">{successMessage}</p>)}
        <button type='submit' className='submit-button'>Save Changes</button>
      </form>
      <div className="form-links">
      <button onClick={handleManageTellersClick} className='form-button'>Manage Tellers</button>
          <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
        </div>
        <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
    </div>
  );
}

export default AdminTellerEdit;
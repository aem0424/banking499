import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pre/Logout.css';
import { useNavigate, useLocation } from 'react-router-dom';


function AdminCreateTeller() {

  const location = useLocation();
  const user = location.state && location.state.user;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  
    const [formData, setFormData] = useState({
      Email: '',
      Password: '',
      FirstName: '',
      LastName: '',
      PhoneNumber: '',
      /*SSN: '',
      PhoneNumber: '',
      DOB: '',
      Street: '',
      Street2: '',
      City: '',
      State: '',
      ZIP: '',*/
      Question1: '',
      Answer1: '',
      Question2: '',
      Answer2: '',
    });

    const [errors, setErrors] = useState({
      Email: '',
      Password: '',
      FirstName: '',
      LastName: '',
      PhoneNumber: '',
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
    
      if (name === 'PhoneNumber' && isNaN(value) && value.length !== 10) {
        error = 'Invalid Phone Number.';
      } else if (name === 'Password' && value.length < 6) {
        error = 'Must be at least 6 characters.';
      } else if (['FirstName', 'LastName'].includes(name) && !/^[a-zA-Z]+$/.test(value)) {
        error = `Invalid ${name === 'FirstName' ? 'First' : 'Last'} Name.`;
      } else if (name === 'Email' && !/\S+@\S+\.\S+/.test(value)) {
        error = 'Invalid Email.';
      }
    
      setFormData({
        ...formData,
        [name]: value,
        Role: 'Teller'
      });
  
      setErrors({
        ...errors,
        [name]: error,
      });
    };

    const allFieldsValid = Object.values(errors).every((error) => error === '');

    const handleAdminMainClick = () => {
      navigate('/Admin', { state: { user } });
    };

    const handleManageTellersClick = () => {
      navigate('/Admin/Teller/TellerList', { state: { user } });
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
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);

      if (!allFieldsValid) {
        console.error('Please fill in all fields correctly before submitting.');
        return;
      }
  
      try {
        const response = await axios.put('/admin/teller/register', formData);
    
        if (response.status === 200) {
          console.log('Teller added successfully:', response.data);
          setSuccessMessage('Teller registered successfully');
        } else {
          console.error('Error adding teller:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    return (
      <div className='container'>
        <h1>Summit Financial</h1>
        <h2>Add a New Teller</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-columns">
            <div className='form-group'>
              <label htmlFor="Email" className='form-label'>Email:</label>
              <input
                type="Email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                required
                className={`form-input ${errors.Email ? 'error' : ''}`}
                />
                  {errors.Email && <><br /><span className="error-message">{errors.Email}</span></>}
              </div>
            <div className='form-group'>
              <label htmlFor="Password" className='form-label'>Password:</label>
              <input
                type="Password"
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                required
                className={`form-input ${errors.Password ? 'error' : ''}`}
                />
                  {errors.Password && <><br /><span className="error-message">{errors.Password}</span></>}
              </div>
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
            {/*
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
            */}
            <div className='form-group'>
              <label htmlFor="PhoneNumber" className='form-label'>Phone Number:</label>
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
          </div>

          {/*

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
                required
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

          */}
          
            <div className="form-columns">
            <div className='form-group'>
              <label htmlFor="Question1" className='form-label'>Security Question 1:</label>
             <select
               id="Question1"
                name="Question1"
                value={formData.Question1}
                onChange={handleInputChange}
               required
              >
                <option value="DEFAULT" disabled>Select your security question</option>
               <option value="What is your mother\'s maiden name?">What is your mother's maiden name?</option>
               <option value="What is the name of your first pet??">What is the name of your first pet?</option>
               <option value="In which city were you born?">In which city were you born?</option>
              </select>
            </div>
            <div className='form-group'>
                <label htmlFor="Answer1" className='form-label'>Answer:</label>
              <input
                type="text"
                id="Answer1"
                name="Answer1"
                value={formData.Answer1}
                onChange={handleInputChange}
               required
                className='form-input'
               placeholder="Answer 1"
              />
           </div>

            <div className='form-group'>
             <label htmlFor="Question2" className='form-label'>Security Question 2:</label>
             <select
              id="Question2"
              name="Question2"
              value={formData.Question2}
              onChange={handleInputChange}
              required
             >
               <option value="DEFAULT" disabled>Select your security question</option>
                <option value="What is your mother\'s maiden name?">What is your mother's maiden name?</option>
               <option value="What is the name of your first pet??">What is the name of your first pet?</option>
               <option value="In which city were you born?">In which city were you born?</option>
             </select>
             </div>
              <div className='form-group'>
                <label htmlFor="Answer2" className='form-label'>Answer:</label>
                <input
                type="text"
                id="Answer2"
                name="Answer2"
                value={formData.Answer2}
                onChange={handleInputChange}
               required
                className='form-input'
               placeholder="Answer 2"
              />
           </div>
          </div>
          {successMessage && (<p className="success-message">{successMessage}</p>)}
          <button type="submit" className='submit-button'>Add Teller</button>
        </form>
        <div className="form-links">
        <button onClick={handleManageTellersClick} className='form-button'>Manage Tellers</button>
        <button onClick={handleAdminMainClick} className='form-button'>Admin Main</button>
        </div>
        <button onClick={handleLogoutClick} className='logout-button'>Logout</button>
      </div>
    );
  }
  
  export default AdminCreateTeller;
  
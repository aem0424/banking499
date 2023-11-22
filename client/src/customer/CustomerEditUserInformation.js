import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerEditUserInformation.css';

function CustomerEditUserInformation() {
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(null);
    const user = location.state && location.state.user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const customerData = location.state.customerData;

    const [formData, setFormData] = useState({
        Email: customerData?.Email || "",
        Password: customerData?.Password || "",
        FirstName: customerData?.FirstName || "",
        LastName: customerData?.LastName || "",
        FullName: customerData?.FullName || "",
        Street: customerData?.Street || "",
        Street2: customerData?.Street2 || "",
        City: customerData?.City || "",
        State: customerData?.State || "",
        ZIP: customerData?.ZIP || "",              
        PhoneNumber: customerData?.PhoneNumber || "",
        CellPhoneNumber: customerData?.CellPhoneNumber || "",
        DOB: customerData?.DOB || "",
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
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleBackButtonClick = () => {
      navigate('/Customer/UserInfo', { state : { user }})
    }

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

      const handleSubmit = async (e) => {
        e.preventDefault();
        formData.FullName = formData.FirstName + ' ' + formData.LastName;
        if (!allFieldsValid) {
          console.error('Please fill in all fields correctly before submitting.');
          return;
        }
    
        try {
          const response = await axios.post('/customer/update', formData, {withCredentials:true});

          if (response.status === 200) {
            console.log('Customer updated successfully:', response.data);
            setSuccessMessage('Customer updated successfully');
          } else {
            console.error('Error updating customer:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };
    return (
        <div className='container'>
            <div>
            <h2>Edit User Information</h2>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-columns">
                  <div className='form-group'>
                    <label htmlFor="FirstName" className="form-label">First Name</label>
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
                <div className="form-group">
                    <label htmlFor="LastName" className="form-label">Last Name</label>
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
                <div className="form-group">
                    <label htmlFor="Street" className="form-label">Address</label>
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
                <div className="form-group">
                    <label htmlFor="Street2" className="form-label">Address 2</label>
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
                </div>
                <div className="form-columns">
                  <div className='form-group'>
                    <label htmlFor="City" className="form-label">City</label>
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
                <div className="group">
                    <label htmlFor="State" className="form-label">State</label>
                    <select
                       id="State"
                       name="State"
                       value={formData.State}
                       onChange={handleInputChange}
                       required
                    >
                  <option value="" disabled>Select a State</option>                      
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
                <div className="form-group">
                    <label htmlFor="ZIP" className="form-label">ZIP Code</label>
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
                <div className="form-group">
                    <label htmlFor="PhoneNumber" className="form-label">Home Phone Number</label>
                    <input
                        type="text"
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
                <div className="form-group">
                    <label htmlFor="DOB" className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        id="DOB"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleInputChange}
                        required
                    />             
                </div>
                </div>
                {successMessage && (<p className="success-message">{successMessage}</p>)}
                <button type="submit" className="submit-button">Make Edits</button><br/>
            </form>
           </div>
          <button onClick={handleBackButtonClick} className='form-button'>Back</button>          
        </div>
    )
}
export default CustomerEditUserInformation;
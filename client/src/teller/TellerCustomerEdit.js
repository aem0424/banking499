import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function TellerCustomerEdit() {
    const location = useLocation();
    const navigate = useNavigate();    
    const user = location.state && location.state.user;
    const customer = location.state.customer;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const [success, setSuccess] = useState(false);          
    const [formData, setFormData] = useState({
        Email: customer?.Email || "",
        Password: customer?.Password || "",
        UserID: customer?.UserID || "",
        FirstName: customer?.FirstName || "",
        LastName: customer?.LastName || "",
        FullName: customer?.FullName || "",
        Street: customer?.Street || "",
        Street2: customer?.Street2 || "",
        City: customer?.City || "",
        State: customer?.State || "",
        ZIP: customer?.ZIP || "",              
        PhoneNumber: customer?.PhoneNumber || "",
        CellPhoneNumber: customer?.CellPhoneNumber || "",
        DOB: customer?.DOB || "",        
    });

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', { state : { user, customer }})
      };

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

    const handleInputChange = (e) => {
       const { name, value } = e.target;
       setFormData({
         ...formData,
         [name]: value,
       });
     };

     const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('/teller/customer/update', formData);

        if (response.status === 200) {
          console.log('Customer updated successfully:', response.data);
          setSuccess(true);            
        } else {
          console.error('Error updating customer:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };           

     return (
        <div className='container'>
          { success ? (
            <p>Successfully edited!</p>
          ) : user ? (
            <div>
            <h1>Edit User Credentials</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-columns">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <input
                        type="text"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-columns">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input
                        type="text"
                        id="Password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>       
                <button type="submit" className="submit-button">Make Edits</button><br/>                
            </form>
         </div>        
          ) : null }
         <button onClick={handleBackButtonClick} className='form-button'>Back</button>                                 
        </div>
)}

export default TellerCustomerEdit
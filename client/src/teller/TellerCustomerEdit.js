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
        Email:customer?.Email,
        Password:customer?.PasswordOriginal,
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
        const response = await axios.post('/teller/customer/account/update', formData, {withCredentials:true});

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
                    <label htmlFor="AccountType" className="form-label">Password</label>
                    <input
                        type="text"
                        id="PasswordOriginal"
                        name="PasswordOriginal"
                        value={formData.PasswordOriginal}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>       
                <button type="submit" className="form-button">Make Edits</button><br/>                
            </form>
         </div>        
          ) : null }
         <button onClick={handleBackButtonClick}>Back</button>                                 
        </div>
)}

export default TellerCustomerEdit
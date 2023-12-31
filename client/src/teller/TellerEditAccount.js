import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerEditAccount.css';


function TellerEditAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer; 
    const account = location.state.account;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [formData, setFormData] = useState({
        AccountID: account?.AccountID || "",
        UserID: account?.UserID || "",
        Balance: account?.Balance || 0,
        Activated: account?.Activated || true,
        AccountNumber: account?.AccountNumber || "",
        AccountName: account?.AccountName || "",
        AccountType: account?.AccountType || "",
        InterestRate: account?.InterestRate || 0,
    });
    const [success, setSuccess] = useState(false);    

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);


    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', { state : { user, customer }})
      };
  
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

    useEffect(() => {
        if (user) {
          axios.get('/user', {})
            .then((response) => {
              if (response.status === 200) {
                console.log('success');
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
            <h1>Edit Account Information</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label htmlFor="AccountName" className="form-label">Account Name</label>
                    <input
                        type="text"
                        id="AccountName"
                        name="AccountName"
                        value={formData.AccountName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="AccountType" className="form-label">Account Type</label>
                    <select
                        type="text"
                        id="AccountType"
                        name="AccountType"
                        value={formData.AccountType}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    >
                      <option value="" disabled>Select Account Type</option>
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Money Market">Money Market</option>
                      <option value="Home Mortgage Loan">Home Mortgage Loan</option>
                      <option value="Credit Card">Credit Card</option>
                  </select>
                </div>       
                <div className="form-group">
                    <label htmlFor="InterestRate" className="form-label">Interest Rate %</label>
                    <input
                        type="numeric"
                        id="InterestRate"
                        name="InterestRate"
                        value={formData.InterestRate}
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
export default TellerEditAccount;
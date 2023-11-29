import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerCreateAccount.css';


function TellerCreateAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;  
    const customer = location.state.customer;
    const [formData, setFormData] = useState({
        UserID: customer?.UserID,
        Balance: 0,
        InterestRate: 1,
        Activated:true,
        AccountName: '',
        AccountType: '',
    })
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      if (!user) {
        navigate('/Login');
      }
    }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer/UserInfo', {state: {user, customer}})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          const response = await axios.put('/teller/customer/account/create', formData)
          if (response.status === 200) {
            console.log('Account creation requested successful:', response.data)
            setSuccess(true);
          }
          else {
            console.error('Error requesting account creation:', response.statusText)
          }
        } catch (error) {
          console.error('An error has occured:', error)
          setError(error);
        }
      };        

    return (
        <div className='container'>
          {success ? (
            <p>Successfully created account!</p>
          ) : error ? (
            <p>ERROR: {error}</p>
          ) : user ? ( 
            <form onSubmit={handleSubmit}>
            <div>
              <h2>Make Transaction</h2>
             <label htmlFor="AccountName" className='form-label'>Account Name:</label>
                <input
                    type="text"
                    id="AccountName"
                    name="AccountName"
                    value={formData.AccountName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
             <label htmlFor="AccountType" className='form-label'>Account Type:</label>
                <select
                    id="AccountType"
                    name="AccountType"
                    value={formData.AccountType}
                    onChange={handleInputChange}
                    required
                >
                  <option value="" disabled>Select Type</option>                      
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="MoneyMarket">Money Market</option>
                  <option value="HomeMortgage">Home Mortgage</option>
                  <option value="CreditCard">Credit Card</option>
                </select>
            </div>        
          <button type = "submit" className='submit-button'>Create Request</button> 
        </form>
        ) : null }
        <button onClick={handleBackButtonClick} className='form-button'>Back</button>                                           
        </div>
    )
}
export default TellerCreateAccount;
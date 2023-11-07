import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerCreateAccount.css';


function TellerCreateAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;    
    const customer = location.state.customer;
    const [formData, setFormData] = useState({
        AccountName: '',
        AccountType: '',
    })
    const [error, setError] = useState(null);

    const handleBackButtonClick = () => {
        navigate('/Customer/Account', {state: {user, customer}})
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
          const response = await axios.put('/customer/account/create', formData)
          if (response.status === 200) {
            console.log('Account creation requested successful:', response.data)
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
            <form onSubmit={handleSubmit}>
                <div>
                 <label htmlFor="AccountName">Account Name:</label>
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
                 <label htmlFor="AccountType">Account Type:</label>
                    <select
                        id="AccountType"
                        name="AccountType"
                        value={formData.AccountType}
                        onChange={handleInputChange}
                        required
                    >
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="MoneyMarket">Money Market</option>
                      <option value="HomeMortgage">Home Mortgage</option>
                      <option value="CreditCard">Credit Card</option>
                    </select>
                </div>        
              <button type = "submit" className='form-button'>Create Request</button> 
              <button onClick={handleBackButtonClick}>Back</button>                                   
            </form>
        </div>
    )
}
export default TellerCreateAccount;
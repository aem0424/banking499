import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerCreateAccount() {
    const [formData, setFormData] = useState({
        AccountName: '',
        AccountType:'',
        Balance:'',
        InterestRate:'',
      });
    const [error, setError] = useState(null);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
                        type="text"
                        id="AccountType"
                        name="AccountType"
                        value={formData.AccountType}
                        onChange={handleInputChange}
                        required
                    >
                      <option value="Checking">Checking</option>
                    </select>
                </div>
                <div>
                 <label htmlFor="Balance">Balance:</label>
                    <input
                        type="text"
                        id="Balance"
                        name="Balance"
                        value={formData.Balance}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                 <label htmlFor="InterestRate">Interest Rate:</label>
                    <input
                        type="text"
                        id="InterestRate"
                        name="InterestRate"
                        value={formData.InterestRate}
                        onChange={handleInputChange}
                        required
                    />
                </div>                                                
            </form>
            <p>Account Type:</p>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}
export default CustomerCreateAccount;
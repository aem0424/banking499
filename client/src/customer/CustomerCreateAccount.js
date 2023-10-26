import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerCreateAccount() {
    const [formData, setFormData] = useState({
        accountname: '',
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
        const { accountname } = formData;
        setError(null); // Clear any previous error messages       
      };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                 <label htmlFor="accountname">Account Name:</label>
                    <input
                        type="text"
                        id="accountname"
                        name="accountname"
                        value={formData.accountname}
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
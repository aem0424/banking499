import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerTransfer() {
    const [formData, setFormData] = useState({
        amount:0,
        to:'',
        from:'',
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const {amount, to, from} = formData;
        setError(null);
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className="amount-form">
                <div>
                    <label htmlFor="amount">Amount to Transfer:</label>
                    <input
                     type="float"
                     id="amount"
                     name="amount"
                     value={formData.amount}
                     onChange={handleInputChange}
                     required
                    />
                </div>
            </form>
            <button type="submit">Transfer Funds</button>
        </div>
    )
}
export default CustomerTransfer;
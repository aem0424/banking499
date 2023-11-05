import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './/css/CustomerDeposit.css';


function CustomerDeposit() {
    const [formData, setFormData] = useState({
        PayTo:'',
        PayAmount:'',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {payto, paymount} = formData;
        setError(null);
    };

    return (
        <div>
            <h1>This is a placeholder for the customer deposit screen. I may try to implement a dropdown that 
                shows all of a customer's accounts instead of requiring them to type it out.</h1>
            <select>
                <option value="test1">TBA</option>
            </select>                
            <form onSubmit={handleSubmit} className='amount-form'>
                <label htmlFor="amount">Amount of Deposit</label>
                <input
                    type="text"
                    id="PayAmount"
                    name="PayAmount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Deposit Funds</button>
            </form>
        </div>
    )
}
export default CustomerDeposit;
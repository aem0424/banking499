import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerTransfer.css';


function CustomerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [formData, setFormData] = useState({
        amount:'',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {amount, to, from} = formData;
        setError(null);

        try {
            const response = await axios.post('http://localhost:4000/user', {
                amount,
                to,
                from
            });

            if (response.data) {
                console.log("successful response");
                // to do...
            } else {
                setError('user ID error');
            }

        } catch (error) {
            setError('error');
        }
    };

    const handleBackButtonClick = () => {
        navigate('/Customer/Transaction', {state: {user}})
    }

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
            <buttin onCLick={handleBackButtonClick}>Back</buttin>
        </div>
    )
}
export default CustomerTransfer;
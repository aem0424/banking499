import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CustomerBillPay() {
    const [formData, setFormData] = useState({
        payto:'',
        payamount:0,
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
            <h1>This is a placeholder for the customer bill payment screen.</h1>
            <label>
                Select Acount to Pay From
                <select>
                    <option value="test1">TBA</option>
                </select>
                <form>
                    <div>
                        <label>Pay To</label>
                        <label>Amount</label>
                    </div>
                </form>
            </label>
            <button type="submit">Pay Bill</button>
        </div>
    )
}
export default CustomerBillPay;
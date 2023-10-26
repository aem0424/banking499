import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CustomerEditUserInformation() {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const {payto, paymount} = formData;
        setError(null);
    };    
    return (
        <div>
            <h1>Edit User Information</h1>
        </div>
    )
}
export default CustomerEditUserInformation;
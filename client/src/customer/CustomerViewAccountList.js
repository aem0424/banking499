import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './/css/CustomerViewAccountList.css';


function CustomerViewAccountList() {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        try {
            axios.get('accounts')
            .then(function(response) {
                console.log(response);
            });
        } catch (error) {
            console.log("error", error);
        }
    }, []);

    //const navigate = useNavigate();
    return (
        <div>
            <h1>placeholder</h1>
        </div>
    )
}
export default CustomerViewAccountList;
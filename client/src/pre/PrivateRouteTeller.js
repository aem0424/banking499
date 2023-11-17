import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteTeller = () => {
  const [isTeller, setIsTeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/user/role');
        const role = response.data;
        console.log(role);
        setIsTeller(role === 'Teller');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsTeller(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div className='container'>Loading...</div>;
  }

  return isTeller ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouteTeller;
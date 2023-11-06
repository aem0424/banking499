import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, user, allowedRoles }) => {
  const navigate = useNavigate();

  if (!user) {
    navigate('/Login');
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    navigate('/Unauthorized');
    return null;
  }

  return element;
};

export default ProtectedRoute;
import React from 'react';
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'
const CheckToken = ({ children }) => {
    const token = Cookies.get('access_token');

    if (!token) {
        return <Navigate to={'/login'} />;
    }
    return (
        <div>
            {children}
        </div>
    );
}

export default CheckToken;

import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => {
    return (
        <div className='text-center position-absolute top-50 start-50 translate-middle'>
            <h3>404 Not Found</h3>
            <Link className='btn btn-secondary' to={'/'}>Back to Home</Link>
        </div>
    );
}

export default NotFound;

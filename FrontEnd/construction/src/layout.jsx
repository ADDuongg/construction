import React from 'react';
import Sidebar from './component/sidebar';
import Header from './component/header';

const Layout = ({ children }) => {
    return (
        <div className='d-flex h-100'>
            <Sidebar />
            <div className='divContent'>
                <Header/>
                {children}
            </div>

        </div>
    );
}

export default Layout;

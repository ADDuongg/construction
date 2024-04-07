import React from 'react';
import Sidebar from './component/sidebar';
import Header from './component/header';

const Layout = ({ children }) => {

    return (

        <div className='d-flex wrapper'>
            <Sidebar />
            <div className='divContent h-100'>
                <Header />
                {children}
            </div>

        </div>

    );
}

export default Layout;

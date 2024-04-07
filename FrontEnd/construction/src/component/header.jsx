import React from 'react';
import { Link } from 'react-router-dom';
import http from '../axios';
import Cookies from 'js-cookie';
const Header = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser?JSON.parse(dataUser):null;


    function handleLogout() {
        http.post('/api/logout')
            .then(res => {
                if (res.data.status === 200) {
                    Cookies.remove('access_token')
                    Cookies.remove('user')
                    window.location.reload()
                }
            })
    }
    return (
        <div className='container-fluid d-flex justify-content-between border-1 border-bottom shadow p-2 header'>
            <button className="btn btnsidebar" type="button" data-bs-toggle="offcanvas" href="#offcanvasExample" >
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className='d-flex align-items-center'>
                <i className="fa-solid fa-bell me-4 mt-1" style={{fontSize: '20px'}}></i>
                <div className="dropdown">
                    <div className="dropdown-toggle fw-bold" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false">
                        {user && user[0]?.hoten} --- {user[0]?.duan_id}
                    </div>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" >Action</Link></li>
                        <li><Link className="dropdown-item" >Another action</Link></li>
                        <li onClick={handleLogout} className="dropdown-item" style={{cursor: 'pointer'}}><i className="fa-solid fa-right-from-bracket text-danger me-3"></i> Log out</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;

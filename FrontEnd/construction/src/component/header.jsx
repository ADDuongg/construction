import React from 'react';

const Header = () => {
    return (
        <div className='container-fluid d-flex justify-content-between border-1 border-bottom shadow p-2 header'>
            <button class="btn btnsidebar" type="button" data-bs-toggle="offcanvas" href="#offcanvasExample" >
                <i class="fa-solid fa-bars"></i>
            </button>
            <div className='d-flex align-items-center'>
                <i class="fa-solid fa-bell me-4 mt-1" style={{fontSize: '20px'}}></i>
                <div class="dropdown">
                    <div class="dropdown-toggle fw-bold" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false">
                        Nguyễn Văn Dương
                    </div>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;

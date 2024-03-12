import React from 'react';
import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <>
            <nav className=" sidebar pt-3 navbar-expand-lg ">
                <div className="container-fluid text-center px-0">
                    <div className='d-flex justify-content-start align-items-center h-100 w-100 px-3'>
                        <img className='rounded-circle me-3' src="images/logo.png" style={{ height: '5rem', width: '5rem' }} alt="" />
                        <div className="" style={{ fontSize: '18px' }}>Tan Long Constructor</div>
                    </div>
                    <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <div className='d-flex align-items-center h-100 w-100'>
                                <img className='rounded-circle me-3' src="images/logo.png" style={{ width: '5rem%', height: '6rem' }} alt="" />
                                <a className="navbar-brand" href="#">Tan Long Constructor</a>
                            </div>

                            <button type="button" className="btn-close bg-white" data-bs-dismiss="offcanvas" aria-label="Close" />
                        </div>
                        <div className="offcanvas-body mt-3 px-0 ">
                            <div className="w-100 d-flex flex-column align-items-start" style={{overflowY: 'auto', height: '600px'}}>
                                {/* Quản lý dự án */}
                                <Link className='navitem' to={'/'}>Home</Link>
                                <Link className='navitem' to={'/project'}>Quản lý dự án</Link>
                                <Link className='navitem' to={'/project'}>Tiến độ dự án</Link>
                                <Link className='navitem' to={'/project'}>Quản lý công trình</Link>
                                <Link className='navitem' to={'/project'}>Quản lý hợp đồng</Link>
                                <Link className='navitem' to={'/project'}>Quản lý khách hàng</Link>
                                <Link className='navitem' to={'/project'}>Quản lý nhà thầu</Link>
                                <Link className='navitem' to={'/project'}>Phân công dự án</Link>
                                <Link className='navitem' to={'/project'}>Quản lý nhân viên</Link>
                                {/* Quản lý thi công */}
                                {/* <Link className='navitem' to={'/project'}>Quản lý công nhân</Link>
                                <Link className='navitem' to={'/project'}>Điểm danh công nhân</Link>
                                <Link className='navitem' to={'/project'}>Chấm công</Link>
                                <Link className='navitem' to={'/project'}>Báo cáo tiến độ</Link>
                                <Link className='navitem' to={'/project'}>Quản lý dự án</Link>
                                <Link className='navitem' to={'/project'}>Thuê máy móc</Link>
                                <Link className='navitem' to={'/project'}>Nhập vật liệu</Link> */}
                                {/* Kế toán */}
                                <Link className='navitem' to={'/project'}>Phiếu thu</Link>
                                <Link className='navitem' to={'/project'}>Phiếu chi</Link>
                                <Link className='navitem' to={'/project'}>Báo cáo thống kê</Link>
                            </div>
                        </div>
                    </div>


                </div>
            </nav>
        </>
    );
}

export default Sidebar;

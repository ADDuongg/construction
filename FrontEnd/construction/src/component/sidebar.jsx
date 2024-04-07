import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'
const Sidebar = () => {
    const [showMaterials, setShowMaterials] = useState(false);
    const [showContract, setShowContract] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    return (
        <>
            <nav className=" sidebar pt-3 navbar-expand-lg ">
                <div className="container-fluid text-center px-0">
                    <div className='d-flex justify-content-start align-items-center h-100 w-100 px-3'>
                        <img className='rounded-circle me-3' src="images/logo.png" style={{ height: '5rem', width: '5rem' }} alt="" />
                        <div className="" style={{ fontSize: '18px' }}>Tan Long Constructor</div>
                    </div>
                    <div className="offcanvas-xl  offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <div className='d-flex align-items-center h-100 w-100'>
                                <img className='rounded-circle me-3' src="images/logo.png" style={{ width: '5rem%', height: '6rem' }} alt="" />
                                <Link to={'/'} className="navbar-brand" >Tan Long Constructor</Link>
                            </div>

                            <button type="button" className="btn-close bg-white" data-bs-dismiss="offcanvas" href="#offcanvasExample" aria-label="Close" />
                        </div>
                        <div className="offcanvas-body px-0 mt-3">
                            <div className="w-100 d-flex flex-column align-items-start" style={{ height: '800px' }}>
                                {/* Quản lý dự án */}
                                {user[0]?.chucvu === 'project manager' ? (
                                    <>
                                        <Link className='navitem' to={'/'}><i className="fa-solid fa-house me-3"></i>Trang chủ</Link>
                                        <Link onClick={() => setShowMaterials(!showMaterials)} className='navitem d-flex justify-content-between align-items-center'><div className='d-flex align-items-center'><i className="fa-solid fa-list-check me-3"></i>Quản lý hợp đồng</div><div><i className="fa-solid fa-caret-down me-3"></i></div></Link>
                                        {showMaterials && (
                                            <ul style={{ listStyle: 'none' }} className='w-100 p-0 d-flex flex-column align-items-start m-0'>
                                                <Link className='navitem ps-5' to={'/contractPayment'}><i className="fa-solid fa-up-right-and-down-left-from-center me-3"></i>Thanh lý hợp đồng</Link>
                                                <Link className='navitem ps-5' to={'/statePayment'}><i className="fa-solid fa-house me-3"></i>Thanh toán theo đợt</Link>
                                                <Link className='navitem ps-5' to={'/contracts'}><i className="fa-solid fa-file-signature me-3"></i>Quản lý hợp đồng</Link>
                                                <Link className='navitem ps-5' to={'/extendContract'}><i className="fa-solid fa-up-right-and-down-left-from-center me-3"></i>Gia hạn hợp đồng</Link>
                                            </ul>
                                        )}
                                        <Link onClick={() => setShowContract(!showContract)} className='navitem d-flex justify-content-between align-items-center' ><div className='d-flex align-items-center'><i className="fa-solid fa-list-check me-3"></i>Quản lý dự án</div> <div><i className="fa-solid fa-caret-down me-3"></i></div></Link>
                                        {showContract && (
                                            <ul style={{ listStyle: 'none' }} className='w-100 p-0 d-flex flex-column align-items-start m-0'>
                                                <Link className='navitem ps-5' to={'/extendProject'}><i className="fa-solid fa-up-right-and-down-left-from-center me-3"></i>Gia hạn dự án</Link>
                                                <Link className='navitem ps-5' to={'/project'}><i className="fa-solid fa-house me-3"></i>Quản lý dự án</Link>
                                                <Link className='navitem ps-5' to={'/attendance'}><i className="fa-solid fa-clipboard-user me-3"></i>Quản lý điểm danh</Link>
                                                <Link className='navitem ps-5' to={'/stateProject'}><i className="fa-solid fa-arrow-trend-up me-3"></i>Giai đoạn dự án</Link>
                                                <Link className='navitem ps-5' to={'/detailSchedule'}><i className="fa-solid fa-list-check me-3"></i>Danh sách công việc</Link>
                                            </ul>
                                        )}
                                        <Link onClick={() => setShowInfo(!showInfo)} className='navitem d-flex justify-content-between align-items-center'><div className='d-flex align-items-center'><i className="fa-solid fa-list-check me-3"></i>Máy móc và vật liệu xây dựng</div> <div><i className="fa-solid fa-caret-down me-3"></i></div></Link>
                                        {showInfo && (
                                            <ul style={{ listStyle: 'none' }} className='w-100 p-0 d-flex flex-column align-items-start m-0'>
                                                <Link className='navitem ps-5' to={'/matterials'}><i className="fa-solid fa-recycle me-3"></i>Thông tin vật liệu </Link>
                                                <Link className='navitem ps-5' to={'/machine'}><i className="fa-solid fa-oil-well me-3"></i>Thông tin máy móc</Link>
                                            </ul>
                                        )}
                                        <Link className='navitem mt-3' to={'/importMatterials'}><i className="fa-solid fa-truck-droplet me-3"></i>Nhập vật liệu </Link>
                                        <Link className='navitem' to={'/hireMachine'}><i className="fa-solid fa-truck-front me-3"></i>Thuê máy móc</Link>

                                        <Link className='navitem' to={'/buildingPermit'}><i className="fa-solid fa-file-circle-check me-3"></i>Giấy phép xây dựng</Link>
                                        <Link className='navitem' to={'/customers'}><i className="fa-solid fa-user me-3"></i>Quản lý khách hàng</Link>
                                        <Link className='navitem' to={'/contractors'}><i className="fa-solid fa-users me-3"></i>Quản lý nhà thầu</Link>
                                        <Link className='navitem' to={'/statistics'}><i className="fa-solid fa-chart-simple me-3"></i>Thống kê ngày</Link>
                                        <Link className='navitem' to={'/assignment'}><i className="fa-solid fa-braille me-3"></i>Phân công dự án</Link>
                                        <Link className='navitem' to={'/staff'}><i className="fa-solid fa-user-gear me-3"></i>Quản lý nhân viên</Link>

                                    </>
                                ) : (
                                    <>
                                        {/* Quản lý thi công */}
                                        <Link className='navitem' to={'/'}><i className="fa-solid fa-house me-3"></i>Trang chủ</Link>
                                        <Link className='navitem ' to={'/extendProject'}><i className="fa-solid fa-up-right-and-down-left-from-center me-3"></i>Gia hạn dự án</Link>
                                        <Link className='navitem ' to={'/project'}><i className="fa-solid fa-house me-3"></i>Quản lý dự án</Link>
                                        <Link className='navitem ' to={'/attendance'}><i className="fa-solid fa-clipboard-user me-3"></i>Quản lý điểm danh</Link>
                                        <Link className='navitem ' to={'/stateProject'}><i className="fa-solid fa-arrow-trend-up me-3"></i>Giai đoạn dự án</Link>
                                        <Link className='navitem ' to={'/detailSchedule'}><i className="fa-solid fa-list-check me-3"></i>Danh sách công việc</Link>
                                        <Link className='navitem ' to={'/matterials'}><i className="fa-solid fa-recycle me-3"></i>Thông tin vật liệu </Link>
                                        <Link className='navitem ' to={'/machine'}><i className="fa-solid fa-oil-well me-3"></i>Thông tin máy móc</Link>
                                        <Link className='navitem mt-3' to={'/importMatterials'}><i className="fa-solid fa-truck-droplet me-3"></i>Nhập vật liệu </Link>
                                        <Link className='navitem' to={'/hireMachine'}><i className="fa-solid fa-truck-front me-3"></i>Thuê máy móc</Link>
                                        <Link className='navitem' to={'/statistics'}><i className="fa-solid fa-chart-simple me-3"></i>Thống kê ngày</Link>

                                    </>
                                )}





                            </div>
                        </div>
                    </div>


                </div>
            </nav>
        </>
    );
}

export default Sidebar;

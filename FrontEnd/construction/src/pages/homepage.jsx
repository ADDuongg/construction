import React from 'react';
import Layout from '../layout';
import Cookies from 'js-cookie';
import http from '../axios';
import { Navigate } from 'react-router-dom';
const Homepage = () => {
    const token = Cookies.get('access_token');

    if (!token) {
        return <Navigate to={'/login'} />;
    }
    return (
        <Layout>
            <section className='homepage pt-4'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="p-2 col-lg-3 col-md-6 " >
                            <div className="h-100 w-100 d-flex justify-content-start align-items-center text-white rounded" style={{ backgroundColor: '#DD3545' }}>
                                <div className='h-100 w-25 d-flex justify-content-center align-items-center p-3 me-3 rounded' style={{ backgroundColor: '#B32939' }}>
                                    <i className="fa-solid fa-building-columns" style={{ fontSize: '30px' }}></i>
                                </div>
                                <div className=''>
                                    <div>CÔNG TRÌNH </div>
                                    <div>1</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 col-lg-3 col-md-6 " >
                            <div className="h-100 w-100 d-flex justify-content-start align-items-center text-white rounded" style={{ backgroundColor: '#27A547' }}>
                                <div className='h-100 w-25 d-flex justify-content-center align-items-center p-3 me-3 rounded' style={{ backgroundColor: '#228437' }}>
                                    <i className="fa-solid fa-file-signature" style={{ fontSize: '30px' }}></i>
                                </div>
                                <div>
                                    <div>HỢP ĐỒNG</div>
                                    <div>1</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 col-lg-3 col-md-6 " >
                            <div className="h-100 w-100 d-flex justify-content-start align-items-center text-white rounded" style={{ backgroundColor: '#FFBF09' }}>
                                <div className='h-100 w-25 d-flex justify-content-center align-items-center p-3 me-3 rounded' style={{ backgroundColor: '#D09808' }}>
                                    <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '30px' }}></i>
                                </div>
                                <div>
                                    <div>DỰ ÁN</div>
                                    <div>1</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 col-lg-3 col-md-6 " >
                            <div className="h-100 w-100 d-flex justify-content-start align-items-center text-white rounded" style={{ backgroundColor: '#18A2B9' }}>
                                <div className='h-100 w-25 d-flex justify-content-center align-items-center p-3 me-3 rounded' style={{ backgroundColor: '#168194' }}>
                                    <i className="fa-solid fa-user-group" style={{ fontSize: '30px' }}></i>
                                </div>
                                <div>
                                    <div>NHÂN VIÊN</div>
                                    <div>1</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='fw-bold pb-2 mt-3' style={{ fontSize: '25px', borderBottom: '1px solid black' }}>XÂY TRỌN GÓI</div>
                    <div className="row g-3 mt-3">
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='fw-bold pb-2 mt-3' style={{ fontSize: '25px', borderBottom: '1px solid black' }}>XÂY MỚI</div>
                    <div className="row g-3 mt-3">
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>


                    </div>
                    <div className='fw-bold pb-2 mt-3' style={{ fontSize: '25px', borderBottom: '1px solid black' }}>BẢO DƯỠNG & SỬA CHỮA</div>
                    <div className="row g-3 mt-3">
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="h-100 w-100 d-flex flex-column rounded bg-white shadow p-2 divHome">
                                <i className="fa-solid fa-magnifying-glass iconDetail text-primary"></i>
                                <div className='w-100 text-center '>
                                    <i className="fa-solid fa-building-columns fw-bold " style={{ fontSize: '10rem' }}></i>
                                </div>
                                <div className='w-100 text-center mt-2'>
                                    <div><strong>Khách hàng: </strong> nguyễn văn A</div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default Homepage;

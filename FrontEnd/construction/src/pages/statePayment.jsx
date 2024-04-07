import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { deleteAPI, getAPI } from '../utility/api';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import ModalAddStatePayment from '../modal/state/modalAddStatePayment'
import ModalUpdateStatePayment from '../modal/state/modalUpdateStatePayment';
import Cookies from 'js-cookie'
const StatePayment = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        duan_id: '',
        dot_thanhtoan: '',
        ghichu: '',
        giatrisauthue: '',
        giaidoan_duan_id: '',
        khachhang_id: '',
        nguoitao: user[0]?.hoten,
        hopdong_id: '',
        page: 1
    });
    const [idStatePayment, setIdStatePayment] = useState(null);
    const { data, isLoading } = useQuery(['state_payments', searchParams.page, searchParams.limit], () => getAPI('/api/paymentStates'), {
        refetchOnWindowFocus: false,
    });

    function handleUpdateStatePayment(id) {
        setIdStatePayment(id);
    }


    const total_page = data?.state_payment ? Number(data.state_payment.last_page) : 1;
    const from = data?.state_payment ? Number(data.state_payment.from) : 1;
    const to = data?.state_payment ? Number(data.state_payment.to) : 3
    const total_item = data?.state_payment ? Number(data.state_payment.total) : 3

    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const mutationSearch = useMutation((searchParams) => getAPI('/api/paymentStates', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['state_payments', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {

        mutationSearch.mutate(searchParams);
    };


    const mutationDelete = useMutation((id) => deleteAPI(`/api/paymentStates/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('state_payments')
            toast.success("Xóa phiếu thống kê ngày công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    });
    const handleDelete = (id) => {
        Swal.fire({
            title: `Are you sure want to delete this payments ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                mutationDelete.mutate(id);
            }
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Thanh toán theo đợt</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="ghichu" className='form-label'>Tìm kiếm theo ghi chú</label>
                                <input name='ghichu' type="search" className='form-control' placeholder='Nhập từ khóa...' value={searchParams.congtrinh_xaydung} onChange={handleInputChange} />
                            
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="giatrisauthue" className='form-label'>Tìm kiếm theo giá trị sau thuế</label>
                                <input name='giatrisauthue' type="text" className='form-control ' value={searchParams.noidung} onChange={handleInputChange} />
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="d-flex w-100 mb-3">

                                <div className='w-50 me-3'>
                                    <label htmlFor="capngay" className='form-label'>Tìm kiếm theo dự án</label>
                                    <select name="duan_id" className='form-select' onChange={handleInputChange} id="">
                                        <option value="">---Chọn dự án---</option>
                                        {data?.projects.map((item,index) => (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-50'>
                                <label htmlFor="hopdong_id" className='form-label'>Tìm kiếm theo hợp đồng</label>
                                    <select name="hopdong_id" className='form-select' onChange={handleInputChange} id="">
                                        <option value="">---Chọn hợp đồng---</option>
                                        {data?.contracts.map((item,index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex w-100 mb-3">

                                <div className='w-50 me-3'>
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng</label>
                                    <select onChange={(e) => handleInputChange(e)} name="khachhang_id" id="" className='form-select'>
                                        <option value="">Tìm khách hàng</option>
                                        {data && data.customers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-50'>
                                <label htmlFor="capngay" className='form-label'>Tìm kiếm theo giai đoạn của dự án</label>
                                    <select name="giaidoan_duan_id" className='form-select' onChange={handleInputChange} id="">
                                        <option value="">---Chọn dự án---</option>
                                        {data?.state_projects.map((item,index) => (
                                            <option key={index} value={item.giaidoan_duan_id}>{item.giaidoan}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button data-bs-toggle="modal" data-bs-target="#modalAddStatePayment" className='btn btn-primary'><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách thống kê theo từng ngày</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row" style={{overflow: 'auto'}}>
                        <table className="table" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Dự án</th>
                                    <th scope="col">Hợp đồng</th>
                                    <th scope="col">Khách hàng</th>
                                    <th scope="col">Giai đoạn dự án</th>
                                    <th scope="col">Lần thanh toán</th>
                                    <th scope="col" style={{ width: '45%' }}>Chi tiết thanh toán</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7"><div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></td></tr>
                                ) :

                                    mutationSearch.isLoading ? (
                                        <tr><td colSpan="7"><div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Searching...</span>
                                        </div> </td></tr>
                                    )
                                        :
                                        (
                                            data?.state_payment?.data?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.STT}</td>
                                                    <td>{item.tenduan}</td>
                                                    <td>{item.tenhopdong}</td>
                                                    <td>{item.hoten}</td>
                                                    <td>{item.giaidoan}</td>
                                                    <td>{item.dot_thanhtoan}</td>
                                                    <td className='text-start' style={{ fontSize: '15px' }}>
                                                        <table className='table table-striped'>
                                                            <thead>
                                                                <tr>
                                                                    <th>STT</th>
                                                                    <th>Nội dung</th>
                                                                    <th>Cách tính</th>
                                                                    <th>Đơn vị</th>
                                                                    <th>Gía trị sau thuế</th>
                                                                    <th>Ghi chú</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data.detail_state_payment && data.detail_state_payment.map((detailState, index) => {
                                                                    if (detailState.thanhtoan_tungdot_id === item.id) {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{detailState.STT}</td>
                                                                                <td>{detailState.noidung}</td>
                                                                                <td>{detailState.cachtinh}</td>
                                                                                <td>{detailState.donvi}</td>
                                                                                <td>{detailState.giatrisauthue}</td>
                                                                                <td>{detailState.ghichu}</td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                Hành động
                                                            </button>
                                                            <ul className="dropdown-menu px-3">
                                                                <button data-bs-toggle="modal" data-bs-target="#modalUpdateStatePayment" onClick={() => handleUpdateStatePayment(item.id)} className='btn btn-primary w-100 mb-2'><i className="fa-solid fa-pen-to-square me-3"></i>Update</button>
                                                                <button className='btn btn-danger w-100' onClick={() => handleDelete(item.id)} ><i className="fa-solid fa-trash me-3"></i>Delete</button>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                            
                                        )}
                            </tbody>
                        </table>
                        <ModalAddStatePayment data={{ projects: data?.projects || [], contracts: data?.contracts || [], customers: data?.customers || [], state_projects: data?.state_projects || [] }} />
                        <ModalUpdateStatePayment data={{ statePayments: data?.state_payment?.data || [], detailStatePayments: data?.detail_state_payment || [], idStatePayment, projects: data?.projects || [], contracts: data?.contracts || [], customers: data?.customers || [], state_projects: data?.state_projects || [] }} />

                        <div className='w-100 d-flex justify-content-between' style={{minWidth: '100vh'}}>
                            <div>Show {from} to {to} of {total_item}</div>
                            <ReactPaginate
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                pageCount={total_page || 1}

                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                previousClassName='page-item'
                                previousLinkClassName='page-link'
                                nextClassName='page-item'
                                nextLinkClassName='page-link'
                                breakClassName='page-item'
                                breakLinkClassName='page-link'
                                activeClassName='active'
                            />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default StatePayment;

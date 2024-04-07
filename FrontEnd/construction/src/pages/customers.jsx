import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalAddCustomer from '../modal/customer/modalAddCustomer';
import ModalUpdateCustomer from '../modal/customer/modalUpdateCustomer';
const Contracts = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        hoten: '',
        sdt: '',
        email: '',
        loaikhachhang: '',
        page: 1
    });
    const [idCustomer, setIdCustomer] = useState('')

    const { isLoading, isError, data } = useQuery(['customers', searchParams.page, searchParams.limit], () => getAPI('/api/customer', searchParams));
    const total_page = data?.customers ? Number(data.customers.last_page) : 1;
    const from = data?.customers ? Number(data.customers.from) : 1;
    const to = data?.customers ? Number(data.customers.to) : 3
    const total_item = data?.customers ? Number(data.customers.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/customer', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['customers', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const deleteStaff = async (id) => {

        Swal.fire({
            title: `Are you sure want to delete this customer`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/customer/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('customers');
                    }
                } catch (error) {
                    console.error("Error deleting staff:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the staff.",
                        icon: "error"
                    });
                }
            }
        });
    };
    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const mutation = useMutation(deleteStaff, {
    });

    const handleDelete = (id) => {
        mutation.mutate(id);
    };

    const handleUpdateStaff = (id) => {
        setIdCustomer(id);

    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý khách hàng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="hoten" className='form-label'>Tên khách hàng</label>
                                <input onChange={handleInputChange} name='hoten' type="text" className='form-control' placeholder='Nhập tên khách hàng...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                    <input onChange={handleInputChange} name='ngaysinh' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                    <select onChange={handleInputChange} name="gioitinh" className='form-select' id="">
                                        <option value="">Chọn giới tính</option>
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="email" className='form-label'>Email</label>
                                <input onChange={handleInputChange} type="text" className='form-control' name='email' placeholder='Nhập Email...' />
                            </div>
                            <div className='mb-3 '>

                                <label htmlFor="loaikhachhang" className='form-label'>Loại khách hàng</label>
                                <select onChange={handleInputChange} name="loaikhachhang" id="" className='form-select'>
                                    <option value="">Tìm theo loại khách hàng</option>
                                    <option value="1">Khách hàng cá nhân</option>
                                    <option value="2">Khách hàng doanh nghiệp</option>
                                    <option value="3">Khách hàng bất động sản</option>
                                </select>

                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddCustomer"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách hợp đồng</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row" style={{overflow: 'auto'}}>
                        <table className="table table-striped" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">SDT</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Ngày sinh</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Loại khách hàng</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) :
                                    mutationSearch.isLoading ? (
                                        <tr>
                                            <td colSpan="11" className="text-center">Searching...</td>
                                        </tr>
                                    ) : (
                                        data && data.customers && data.customers.data && data.customers.data.length > 0 ? (
                                            data.customers.data.map((customer, index) => (
                                                <tr key={index}>
                                                    <td>{customer.khachhang_id}</td>
                                                    <td>{customer.hoten}</td>
                                                    <td>{customer.diachi}</td>
                                                    <td>{customer.sdt}</td>
                                                    <td>{customer.email}</td>
                                                    <td>{customer.ngaysinh}</td>
                                                    <td>{
                                                        customer.gioitinh === 0 ? (<div><i className="fa-solid fa-mars text-primary fw-bold" style={{ fontSize: '20px' }}></i></div>) : (<div><i className="fa-solid fa-venus fw-bold" style={{ color: '#de687c', fontSize: '20px' }}></i></div>)
                                                    }</td>
                                                    <td>{customer.loaikhachhang}</td>
                                                    <td>
                                                        <button className="btn btn-primary me-2" onClick={() => handleUpdateStaff(customer.khachhang_id)} data-bs-toggle='modal' data-bs-target='#modalUpdateCustomer'><i className="fa-solid fa-pen-to-square "></i></button>
                                                        <button className="btn btn-danger" onClick={() => handleDelete(customer.khachhang_id)}><i className="fa-solid fa-trash "></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className='fw-bold' colSpan="9">Không có thông tin nhân viên tìm kiếm</td>
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                        <ModalAddCustomer />
                        <ModalUpdateCustomer data={{ allCustomers: data && data.customers && data.customers.data ? data.customers.data : [], id: idCustomer }} />
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
    )
}

export default Contracts;

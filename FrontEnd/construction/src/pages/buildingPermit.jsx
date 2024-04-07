import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import ModalAddPermit from '../modal/building_permit/modalAddPermit'
import ModalUpdatePermit from '../modal/building_permit/modalUpdatePermit'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';




const BuildingPermit = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        congtrinh_xaydung: '',
        noidung: '',
        capngay: '',
        thoihan: '',
        thoigian_giahan: '',
        page: 1
    });
    const [idPermit, setIdPermit] = useState('')

    const { isLoading, isError, data } = useQuery(['building_permit', searchParams.page, searchParams.limit], () => getAPI('/api/buildingPermit', searchParams));
    const total_page = data?.building_permits ? Number(data.building_permits.last_page) : 1;
    const from = data?.building_permits ? Number(data.building_permits.from):1;
    const to = data?.building_permits ? Number(data.building_permits.to):3
    const total_item = data?.building_permits ? Number(data.building_permits.total):3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/buildingPermit', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['building_permit', searchParams.page, searchParams.limit], () => {
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
            title: `Are you sure want to delete this building permit ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/buildingPermit/${id}`);
                    if (response.status === 204) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Permit has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('building_permit');
                    }
                } catch (error) {
                    console.error("Error deleting permit:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the Permit.",
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

    const handleSubmit = (id) => {
        mutation.mutate(id);
    };

    const handleUpdateStaff = (id) => {
        setIdPermit(id);
        
    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý giấy phép xây dựng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="congtrinh_xaydung" className='form-label'>Tìm kiếm theo tên công trình</label>
                                <input name='congtrinh_xaydung' type="search" className='form-control' placeholder='Nhập từ khóa...' value={searchParams.congtrinh_xaydung} onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="noidung" className='form-label'>Nội dung</label>
                                <input name='noidung' type="text" className='form-control ' value={searchParams.noidung} onChange={handleInputChange} />
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="d-flex w-100 mb-3">

                            <div className='w-50 me-3'>
                                <label htmlFor="capngay" className='form-label'>Cấp ngày</label>
                                <input name='capngay' type="date" className='form-control ' value={searchParams.capngay} onChange={handleInputChange} />
                            </div>
                            <div className='w-50'>
                                <label htmlFor="thoihan" className='form-label'>Thời hạn giấy phép</label>
                                <input name='thoihan' type="date" className='form-control ' value={searchParams.thoihan} onChange={handleInputChange} />
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
                                <label htmlFor="thoigian_giahan" className='form-label'>Thời gian gia hạn</label>
                                <input name='thoigian_giahan' type="date" className='form-control ' value={searchParams.thoigian_giahan} onChange={handleInputChange} />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddPermit"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách giấy phép xây dựng</h4>
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
                                    <th scope="col">Tên công trình</th>
                                    <th scope="col">Khách hàng</th>
                                    <th scope="col">Nội dung</th>
                                    <th scope="col">Cấp ngày</th>
                                    <th scope="col">Thời hạn giấy phép</th>
                                    <th scope="col">Thời gian gia hạn</th>
                                    <th scope="col">Lý do gia hạn</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : (
                                    mutationSearch.isLoading ? (
                                        <tr>
                                            <td colSpan="9">Searching...</td>
                                        </tr>
                                    ) : (
                                        data && data.building_permits && data.building_permits.data && data.building_permits.data.length > 0 ? (
                                            data.building_permits.data.map((permit, index) => (
                                                <tr key={index}>
                                                    <td>{permit.id}</td>
                                                    <td>{permit.congtrinh_xaydung}</td>
                                                    <td>{permit.hoten}</td>
                                                    <td>{permit.noidung}</td>
                                                    <td>{permit.capngay}</td>
                                                    <td>{permit.thoihan}</td>
                                                    <td>{permit.thoigian_giahan}</td>
                                                    <td>{permit.lydo_giahan}</td>
                                                    <td>
                                                        <button className="btn btn-primary me-2" onClick={() => handleUpdateStaff(permit.id)} data-bs-toggle = 'modal' data-bs-target = '#modalUpdatePermit'><i className="fa-solid fa-pen-to-square "></i></button>
                                                        <button className="btn btn-danger" onClick={() => handleSubmit(permit.id)}><i className="fa-solid fa-trash "></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className='fw-bold' colSpan="9">Không có thông tin nhân viên tìm kiếm</td>
                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>
                        </table>
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
                        {/* Modal */}
                        <ModalAddPermit  data={{allCustomers: data?.customers || []}} />
                        <ModalUpdatePermit data = {{allCustomers: data?.customers || [],allPermit: data && data.building_permits && data.building_permits.data? data.building_permits.data:[], id:idPermit}} />
                    </div>
                </div>

            </section>
        </Layout>
    )
}

export default BuildingPermit;

import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';

import { useQuery, useMutation, useQueryClient } from 'react-query'

import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalAddExtendContract from '../modal/extend/modalAddExtendContract';
import ModalUpdateExtendContract from '../modal/extend/modalUpdateExtendContract';

const ExtendContract = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenhopdong: '',
        ngaybatdau: '',
        ngayketthuc: '',
        thoigiangiahan: '',
        ngaygiahan: '',
        /* hopdong_id: '', */
        page: 1
    });
    const [idProject, setIdProject] = useState('')
    const [selectedProject, setSelectedProject] = useState(null);
    const { isLoading, isError, data } = useQuery(['extend_contract', searchParams.page, searchParams.limit], () => getAPI('/api/extendContract', searchParams));
    const total_page = data?.extend_contract ? Number(data.extend_contract.last_page) : 1;
    const from = data?.extend_contract ? Number(data.extend_contract.from) : 1;
    const to = data?.extend_contract ? Number(data.extend_contract.to) : 3
    const total_item = data?.extend_contract ? Number(data.extend_contract.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/extendContract', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['extend_contract', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    };
    const handleSelectProject = (project) => {
        setSelectedProject(project);
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
            title: `Bạn có chắc muốn xóa gia hạn hợp đồng này này ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/extendContract/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "grace period has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('extend_contract');
                    }
                } catch (error) {
                    console.error("Error deleting project:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the project.",
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

    const handleUpdateExtend = (id) => {
        setIdProject(id);

    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý gia hạn hợp đồng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenhopdong" className='form-label'>Tên hợp đồng</label>
                                <input onChange={handleInputChange} name='tenhopdong' type="text" className='form-control' placeholder='Nhập tên hợp đồng...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu hợp đồng</label>
                                    <input onChange={handleInputChange} name='ngaybatdau' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc hợp đồng</label>
                                    <input onChange={handleInputChange} name='ngayketthuc' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='w-100 d-flex'>
                                {/* <div className='mb-3 w-100'>
                                    <label htmlFor="hopdong_id" className='form-label'>Hợp đồng</label>
                                    <select onChange={handleInputChange} name="hopdong_id" id="" className='form-select'>
                                        <option value="">Chọn hợp đồng</option>
                                        {data?.contracts?.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div> */}
                                <div className="mb-3 w-100">
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select onChange={handleInputChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {data?.customers?.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="thoigiangiahan" className='form-label'>Ngày gia hạn</label>
                                    <input onChange={handleInputChange} name='thoigiangiahan' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="lydogiahan" className='form-label'>Lý do gia hạn</label>
                                    <input onChange={handleInputChange} name='lydogiahan' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddExtendContract"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
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
                        <table className="table" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên hợp đồng</th>
                                    <th scope="col">Ngày bắt đầu hợp đồng</th>
                                    <th scope="col">Ngày kết thúc hợp đồng</th>
                                    <th scope="col">Thời gian gia hạn</th>
                                    <th scope="col">Lý do gia hạn</th>
                                    <th scope="col">Người gia hạn</th>
                                    <th scope="col">Khách hàng</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8">Loading...</td>
                                    </tr>
                                ) : mutationSearch.isLoading ? (
                                    <tr>
                                        <td colSpan="8">Searching...</td>
                                    </tr>
                                ) : data && data.extend_contract && data.extend_contract.data && data.extend_contract.data.length > 0 ? (
                                    data.extend_contract.data.map((contract, index) => (
                                        <tr key={contract.id}>
                                            <td>{index + 1}</td>
                                            <td>{contract.tenhopdong}</td>
                                            <td>{contract.ngaybatdau}</td>
                                            <td>{contract.ngayketthuc}</td>
                                            <td>{contract.thoigian_giahan}</td>
                                            <td>{contract.lydogiahan}</td>
                                            <td>{contract.nguoigiahan}</td>
                                            <td>{contract.hoten}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Hành động
                                                    </button>
                                                    <ul className="dropdown-menu px-3">

                                                        <button data-bs-toggle="modal" data-bs-target="#modalUpdateExtendContract" onClick={() => handleUpdateExtend(contract.id)} className='btn btn-primary w-100 mb-2'><i className="fa-solid fa-pen-to-square me-3"></i>Update</button>
                                                        <button className='btn btn-danger w-100' onClick={() => handleDelete(contract.id)} ><i className="fa-solid fa-trash me-3"></i>Delete</button>
                                                       
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Không có hợp đồng nào được tìm thấy</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <ModalAddExtendContract data={{ allContract: data && data.contracts ? data.contracts : [], allCustomers: data && data.customers ? data.customers : [] }} />
                        <ModalUpdateExtendContract data={{ idProject , allExtend: data && data.extend_contract.data ? data.extend_contract.data : [], allCustomers: data && data.customers ? data.customers : [], allContract: data && data.contracts ? data.contracts : [] }} />

                        
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

export default ExtendContract;

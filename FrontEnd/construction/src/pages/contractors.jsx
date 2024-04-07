import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalAddContractor from '../modal/contractor/modalAddContractor';
import ModalUpdateContractor from '../modal/contractor/modalUpdateContractor';
const Contractors = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tennhathau: '',
        diachi: '',
        sdt: '',
        email: '',
        loaihinhhoatdong: '',
        page: 1
    });
    const [idContractor, setIdContractor] = useState('')

    const { isLoading, isError, data } = useQuery(['contractors', searchParams.page, searchParams.limit], () => getAPI('/api/contractor', searchParams));
    const total_page = data?.contractors ? Number(data.contractors.last_page) : 1;
    const from = data?.contractors ? Number(data.contractors.from) : 1;
    const to = data?.contractors ? Number(data.contractors.to) : 3
    const total_item = data?.contractors ? Number(data.contractors.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/contractor', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['contractors', searchParams.page, searchParams.limit], () => {
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
            title: `Are you sure want to delete this contractor`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/contractor/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('contractors');
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
        setIdContractor(id);
        console.log(id);
    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý nhà thầu</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tennhathau" className='form-label'>Tên nhà thầu</label>
                                <input name='tennhathau' onChange={(e) => handleInputChange(e)} type="text" className='form-control' placeholder='Nhập tên nhà thầu...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="diachi" className='form-label'>Địa chỉ</label>
                                    <input type="text" onChange={(e) => handleInputChange(e)} className='form-control' name='diachi' placeholder='Nhập địa chỉ...' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="sdt" className='form-label'>Số điện thoại</label>
                                    <input type="text" onChange={(e) => handleInputChange(e)} className='form-control' name='sdt' placeholder='Nhập số điện thoại...' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="email" className='form-label'>Email</label>
                                <input type="text" onChange={(e) => handleInputChange(e)} className='form-control' name='email' placeholder='Nhập Email...' />
                            </div>
                            <div className='mb-3 '>

                                <label htmlFor="loaihinhhoatdong" className='form-label'>Loại hình hoạt động</label>
                                <input type="text" onChange={(e) => handleInputChange(e)} className='form-control' name='loaihinhhoatdong' placeholder='Nhập loại hình hoạt động...' />

                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddContractor"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách nhà thầu</h4>
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
                                    <th scope="col">Tên nhà thầu</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">SDT</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Loại hình hoạt động</th>
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
                                ): (
                                    data && data.contractors && data.contractors.data && data.contractors.data.length > 0 ? (
                                        data.contractors.data.map((contractor, index) => (
                                            <tr key={index}>
                                                <td>{contractor.nhathau_id}</td>
                                                <td>{contractor.tennhathau}</td>
                                                <td>{contractor.diachi}</td>
                                                <td>{contractor.sdt}</td>
                                                <td>{contractor.email}</td>
                                                <td>{contractor.loaihinhhoatdong}</td>
                                                <td>
                                                    <button className="btn btn-primary me-2" onClick={() => handleUpdateStaff(contractor.nhathau_id)} data-bs-toggle='modal' data-bs-target='#modalUpdateContractor'><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(contractor.nhathau_id)}><i className="fa-solid fa-trash "></i></button>
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
                        <ModalAddContractor />
                        <ModalUpdateContractor data={{ allContractors: data && data.contractors && data.contractors.data ? data.contractors.data : [], id: idContractor }} />
                    </div>
                </div>

            </section>
        </Layout>
    )
}

export default Contractors;

import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import ModalAddStaff from '../modal/staffs/modalAddStaff';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalUpdateStaff from '../modal/staffs/modalUpdateStaff';



const Staff = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        query: '',
        ngaysinh: '',
        gioitinh: '',
        chucvu: '',
        page: 1
    });
    const [idStaff, setIdStaff] = useState('')

    const { isLoading, isError, data } = useQuery(['staffs', searchParams.page, searchParams.limit], () => getAPI('/api/staff', searchParams));
    const total_page = data?.staffs ? Number(data.staffs.last_page) : 1;
    const from = data?.staffs ? Number(data.staffs.from) : 1;
    const to = data?.staffs ? Number(data.staffs.to) : 3
    const total_item = data?.staffs ? Number(data.staffs.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/staff', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['staffs', searchParams.page, searchParams.limit], () => {
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
            title: `Are you sure want to delete this staff`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/staff/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('staffs');
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

    const handleSubmit = (id) => {
        mutation.mutate(id);
    };

    const handleUpdateStaff = (id) => {
        setIdStaff(id);
        console.log(id);
    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý nhân viên</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="query" className='form-label'>Tìm kiếm theo từ khóa</label>
                                <input name='query' type="search" className='form-control' placeholder='Nhập từ khóa...' value={searchParams.query} onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                <input name='ngaysinh' type="date" className='form-control ' value={searchParams.ngaysinh} onChange={handleInputChange} />
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                <select name="gioitinh" id="" className='form-select' value={searchParams.gioitinh} onChange={handleInputChange}>
                                    <option value="">Chọn giới tính</option>
                                    <option value="0">Nam</option>
                                    <option value="1">Nữ</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="chucvu" className='form-label'>Chức vụ</label>
                                <select name="chucvu" id="" className='form-select' value={searchParams.chucvu} onChange={handleInputChange}>
                                    <option value="">Chọn chức vụ</option>
                                    <option value="project manager">Quản lý dự án</option>
                                    <option value="construction manager">Quản lý thi công</option>
                                    <option value="worker">Công nhân</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalStaff"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách nhân viên</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row" style={{ overflow: 'auto' }}>
                        <table className="table table-striped" style={{ minWidth: '100vh' }}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên nhân viên</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">SDT</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Ngày sinh</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Chức vụ</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : (
                                    data && data.staffs && data.staffs.data && data.staffs.data.length > 0 ? (
                                        data.staffs.data.map((staff, index) => (
                                            <tr key={index}>
                                                <td>{staff.nhanvien_id}</td>
                                                <td>{staff.hoten}</td>
                                                <td>{staff.email}</td>
                                                <td>{staff.sdt}</td>
                                                <td>{staff.diachi}</td>
                                                <td>{staff.ngaysinh}</td>
                                                <td>{staff.gioitinh === 0 ? 'Nam' : 'Nữ'}</td>
                                                <td>{staff.chucvu}</td>
                                                <td>
                                                    <button className="btn btn-primary me-2" onClick={() => handleUpdateStaff(staff.nhanvien_id)} data-bs-toggle='modal' data-bs-target='#modalUpdateStaff'><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger" onClick={() => handleSubmit(staff.nhanvien_id)}><i className="fa-solid fa-trash "></i></button>
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
                        <div className=' d-flex justify-content-between' style={{minWidth: '100vh'}}>
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
                        <ModalAddStaff />
                        <ModalUpdateStaff data={{ allStaff: data && data.staffs && data.staffs.data ? data.staffs.data : [], id: idStaff }} />
                    </div>
                </div>

            </section>
        </Layout>
    )
}

export default Staff;

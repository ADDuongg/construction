import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import ModalAddStaff from '../modal/staffs/modalAddStaff';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
const Staff = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        query: '',
        ngaysinh: '',
        gioitinh: '',
        chucvu: ''
    });
    const [staffs, setStaffs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await http.get('/api/staff', { params: searchParams });
            setStaffs(response.data.staffs.data || []);
            setTotalPages(Number(response.data.staffs.last_page) || 1);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        fetchData();
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
                        fetchData();
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

    const handleSubmit = (id) => {
        deleteStaff(id);
    };

    const handlePageClick = () => {
        // Handle pagination click
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
                                <input name='query' type="text" className='form-control' placeholder='Nhập từ khóa...' value={searchParams.query} onChange={handleInputChange} />
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
                    <div className="row">

                        <table className="table table-striped">
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
                                {staffs.map((staff, index) => {
                                    return (
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
                                                <button className="btn btn-primary me-2"><i className="fa-solid fa-pen-to-square "></i></button>
                                                <button className="btn btn-danger" ><i className="fa-solid fa-trash "></i></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {/*  {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : (
                                    data && data.staffs && data.staffs.data ? (
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
                                                    <button className="btn btn-primary me-2"><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger" onClick={() => handleSubmit(staff.nhanvien_id)}><i className="fa-solid fa-trash "></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">No data found</td>
                                        </tr>
                                    )
                                )} */}

                            </tbody>
                        </table>
                        <div className='w-100 d-flex justify-content-end'>
                            <ReactPaginate
                                previousLabel={'previous'}
                                nextLabel={'next'}
                                breakLabel={'...'}
                                pageCount={ 1}

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
                    </div>
                </div>

            </section>
        </Layout>
    )
}



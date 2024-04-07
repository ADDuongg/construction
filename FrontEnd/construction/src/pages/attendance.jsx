import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalAddAttendance from '../modal/attendance/modalAddAttendance';
import ModalUpdateAttendance from '../modal/attendance/modalUpdateAttendance';
import Cookies from 'js-cookie'

const Attendance = () => {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        duan_id: '',
        ngaydiemdanh: '',
        giaidoan_duan_id: '',
        nguoitao: '',
        hopdong_id: '',
        page: 1
    });
    const [idAttendance, setIdAttendance] = useState('')

    const { isLoading, isError, data } = useQuery(['attendance', searchParams.page, searchParams.limit], () => getAPI('/api/attendance', searchParams));
    const total_page = data?.attendance ? Number(data.attendance.last_page) : 1;
    const from = data?.attendance ? Number(data.attendance.from) : 1;
    const to = data?.attendance ? Number(data.attendance.to) : 3
    const total_item = data?.attendance ? Number(data.attendance.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/attendance', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['attendance', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    };

    const duanIdsArray = user.map(item => item.duan_id);

   
    const filteredData = data?.attendance?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.duan_id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });

    



    const filteredProject = data?.projects?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const deleteStaff = async (id) => {

        Swal.fire({
            title: `Are you sure want to delete this attendance`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/attendance/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('attendance');
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
    /* console.log(user?.map((item) => item.duan_id)); */
    const handleUpdateStaff = (id) => {
        setIdAttendance(id);
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
                                <label htmlFor="nguoitao" className='form-label'>Tìm kiếm người tạo</label>
                                <input name='nguoitao' type="search" className='form-control' placeholder='Nhập từ khóa...' onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="ngaydiemdanh" className='form-label'>Ngày tạo điểm danh</label>
                                <input name='ngaydiemdanh' type="date" className='form-control ' onChange={handleInputChange} />
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="d-flex w-100 mb-3">

                                <div className='w-50 me-3'>
                                    <label htmlFor="capngay" className='form-label'>Tìm kiếm theo dự án</label>
                                    <select name="duan_id" className='form-select' onChange={handleInputChange} id="">
                                        <option value="">---Chọn dự án---</option>
                                        {filteredProject?.map((item, index) =>
                                        (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
                                        )
                                        )}
                                    </select>
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="hopdong_id" className='form-label'>Tìm kiếm theo hợp đồng</label>
                                    <select name="hopdong_id" className='form-select' onChange={handleInputChange} id="">
                                        <option value="">---Chọn hợp đồng---</option>
                                        {data?.contracts.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className=''>
                                <label htmlFor="giaidoan_duan_id" className='form-label'>Tìm kiếm theo giai đoạn của dự án</label>
                                <select name="giaidoan_duan_id" className='form-select' onChange={handleInputChange} id="">
                                    <option value="">---Chọn dự án---</option>
                                    {data?.state_projects.map((item, index) => {

                                        return item.duan_id === parseInt(searchParams.duan_id) ? (
                                            <option key={index} value={item.id}>{item.giaidoan}</option>
                                        ) : (null)
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddAttendance"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
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
                    <div className="row" style={{overflow: 'auto'}}>

                        <table className="table table-striped" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên dự án</th>
                                    <th scope="col">Giai đoạn dự án</th>
                                    <th scope="col">Người tạo</th>
                                    <th scope="col">Ngày điểm danh</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : mutationSearch.isLoading ? (
                                    <tr>
                                        <td colSpan="9">Searching...</td>
                                    </tr>
                                ) : (
                                    filteredData && filteredData?.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.duan_id}</td>
                                                <td>{item.giaidoan}</td>
                                                <td>{item.nguoitao}</td>
                                                <td>{item.ngaydiemdanh}</td>
                                                <td>

                                                    <button className="btn btn-primary " onClick={() => handleUpdateStaff(item.id)} data-bs-toggle='modal' data-bs-target='#modalUpdateAttendance'><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger mx-2" onClick={() => handleSubmit(item.id)}><i className="fa-solid fa-trash "></i></button>
                                                    <Link className="btn btn-primary" to={`/attendanceDetail/${item.id}`} ><i className="fa-solid fa-eye"></i></Link>
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
                        <ModalAddAttendance data={{ staffs: data?.staff || [], projects: data?.projects || [], state_projects: data?.state_projects || [] }} />
                        <ModalUpdateAttendance data={{ staffs: data?.staff || [], projects: data?.projects || [], state_projects: data?.state_projects || [], idAttendance, attendances: data?.attendance?.data || [] }} />
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

export default Attendance;

import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalAddProject from '../modal/project/modalAddProject'
import ModalUpdateProject from '../modal/project/modalUpdateProject'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Cookies from 'js-cookie'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';

import ModalAddBluePrint from '../modal/project/modalAddBluePrint';
import ModalUpdateBluePrint from '../modal/project/modalUpdateBluePrint';
const Project = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenduan: '',
        ngaybatdau: '',
        ngayketthuc: '',
        trangthai: '',
        hopdong_id: '',
        page: 1
    });
    const [idProject, setIdProject] = useState('')
    const [selectedProject, setSelectedProject] = useState(null);
    const { isLoading, isError, data } = useQuery(['projects', searchParams.page, searchParams.limit], () => getAPI('/api/project', searchParams));
    const { data: allContract } = useQuery(['contract_project'], () => getAPI('/api/allcontract'))
    const total_page = data?.projects ? Number(data.projects.last_page) : 1;
    const from = data?.projects ? Number(data.projects.from) : 1;
    const to = data?.projects ? Number(data.projects.to) : 3
    const total_item = data?.projects ? Number(data.projects.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/project', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['projects', searchParams.page, searchParams.limit], () => {
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
    const duanIdsArray = user.map(item => item.duan_id);


    const filteredProjects = data?.projects?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });


    console.log(duanIdsArray);
    const deleteStaff = async (id) => {

        Swal.fire({
            title: `Bạn có chắc muốn xóa dự án này, các lịch trình của dự án này sẽ bị hủy bỏ theo ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/project/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('projects');
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

    const handleUpdateProject = (id) => {
        setIdProject(id);

    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý dự án</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenduan" className='form-label'>Tên dự án</label>
                                <input onChange={handleInputChange} name='tenduan' type="text" className='form-control' placeholder='Nhập tên dự án...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                    <input onChange={handleInputChange} name='ngaybatdau' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                    <input onChange={handleInputChange} name='ngayketthuc' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="hopdong_id" className='form-label'>Hợp đồng</label>
                                <select onChange={handleInputChange} name="hopdong_id" id="" className='form-select'>
                                    <option value="1">Thi công công trình A</option>
                                    <option value="2">Thi công công trình B</option>
                                    <option value="3">Thi công công trình C</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddProject"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách dự án</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row" style={{overflowX: 'auto', overflowY: 'unset'}}>
                        <table className="table"style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên dự án</th>
                                    <th scope="col">Tên công trình</th>
                                    <th scope="col">Địa điểm</th>
                                    <th scope="col">Mô tả</th>
                                    <th>Số lượng giai đoạn</th>
                                    <th scope="col">Ngày bắt đầu</th>
                                    <th scope="col">Ngày kết thúc</th>
                                    <th scope="col">File thiết kế dự án</th>
                                    <th scope="col">Trạng thái</th>
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
                                ) : filteredProjects && filteredProjects.length > 0 ? (
                                    filteredProjects.map((project, index) => (
                                        <tr key={index}>
                                            <td>{project.id}</td>
                                            <td>{project.tenduan}</td>
                                            <td>{project.tencongtrinh}</td>
                                            <td>{project.diadiem}</td>
                                            <td>{project.mota}</td>
                                            <td>{project.soluonggiaidoan}</td>
                                            <td>{project.ngaybatdau}</td>
                                            <td>{project.ngayketthuc}</td>
                                            <td >
                                                {data?.all_blueprint.some(item => item.duan_id === project.id) ? (
                                                    data?.all_blueprint.map((item, index) => (
                                                        item.duan_id === project.id ? (
                                                            <div className='d-flex flex-column w-100'>
                                                                <a key={index} target='_blank' href={process.env.REACT_APP_FILE_PATH + `${item.file_path}`}>{item.file}</a>
                                                            </div>
                                                        ) : (
                                                            <div className='h-100' key={index}></div>
                                                        )
                                                    ))
                                                ) : (
                                                    <div className='h-100'>Không có file</div>
                                                )}
                                            </td>

                                            <td>{project.status}</td>
                                            <td>
                                                <div className="dropdown " >
                                                    <button className="btn btn-secondary dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Hành động
                                                    </button>
                                                    <ul className="dropdown-menu px-3" >
                                                        {user[0].chucvu === 'construction manager' ? (
                                                            <li>
                                                                <Link to={`/addSchedule/${project.id}`} className='btn btn-secondary w-100 mb-2'>Thêm lịch trình dự án</Link>
                                                            </li>
                                                        )
                                                            : (
                                                                <>
                                                                    <li>
                                                                        <Link to={`/addSchedule/${project.id}`} className='btn btn-secondary w-100 mb-2'>Thêm lịch trình dự án</Link>
                                                                    </li>
                                                                    <li>
                                                                        <button onClick={() => handleUpdateProject(project.id)} className='btn btn-secondary w-100 mb-2 text-white' data-bs-toggle="modal" data-bs-target="#modalAddBluePrint">Thêm bản thiết kế</button>
                                                                    </li>
                                                                    <li>
                                                                        <button onClick={() => handleUpdateProject(project.id)} className='btn btn-secondary w-100 mb-2 text-white' data-bs-toggle="modal" data-bs-target="#modalUpdateBluePrint">Cập nhật bản thiết kế</button>
                                                                    </li>
                                                                    <li>
                                                                        <button data-bs-toggle="modal" data-bs-target="#modalUpdateProject" onClick={() => handleUpdateProject(project.id)} className='btn btn-primary w-100 mb-2'><i className="fa-solid fa-pen-to-square me-3"></i>Update</button>
                                                                    </li>
                                                                    <li>
                                                                        <button className='btn btn-danger w-100' onClick={() => handleDelete(project.id)} ><i className="fa-solid fa-trash me-3"></i>Delete</button>
                                                                    </li>
                                                                </>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Không có dự án nào được tìm thấy</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <ModalAddBluePrint data={{ idProject, AllProject: data && data.projects ? data.projects.data : [] }} />
                        <ModalUpdateBluePrint data={{ AllBluePrint: data?.all_blueprint || [], idProject, AllProject: data && data.projects ? data.projects.data : [] }} />
                        <ModalAddProject data={{ AllContracts: allContract && allContract.contracts ? allContract.contracts : [] }} />

                        {/*  <ModalAddContract customers={data && data.customers ? data.customers : []} /> */}
                        <ModalUpdateProject data={{ AllProject: data && data.projects ? data.projects.data : [], allContracts: allContract && allContract.contracts && allContract.contracts ? allContract.contracts : [], id: idProject }} />

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

export default Project;

import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import Cookies from 'js-cookie'
import ModalAddExtend from '../modal/extend/modalAddExtend';
import ModalUpdateExtend from '../modal/extend/modalUpdateExtend';
const ExtendProject = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenduan: '',
        ngaybatdau: '',
        ngayketthuc: '',
        thoigiangiahan: '',
        ngaygiahan: '',
        hopdong_id: '',
        page: 1
    });
    const [idProject, setIdProject] = useState('')
    const [selectedProject, setSelectedProject] = useState(null);
    const { isLoading, isError, data } = useQuery(['extend_project', searchParams.page, searchParams.limit], () => getAPI('/api/extendProject', searchParams));
    const total_page = data?.extend_project ? Number(data.extend_project.last_page) : 1;
    const from = data?.extend_project ? Number(data.extend_project.from) : 1;
    const to = data?.extend_project ? Number(data.extend_project.to) : 3
    const total_item = data?.extend_project ? Number(data.extend_project.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/extendProject', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['extend_project', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    };
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredProjects = data?.extend_project?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.duan_id);
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
            title: `Bạn có chắc muốn xóa gia hạn tiến độ này này ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/extendProject/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "grace period has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('extend_project');
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
                            <li className="breadcrumb-item active" aria-current="page">Quản lý gia hạn dự án</li>
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
                                    <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu dự án</label>
                                    <input onChange={handleInputChange} name='ngaybatdau' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc dự án</label>
                                    <input onChange={handleInputChange} name='ngayketthuc' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='w-100 d-flex'>
                                <div className='mb-3 w-100'>
                                    <label htmlFor="hopdong_id" className='form-label'>Hợp đồng</label>
                                    <select onChange={handleInputChange} name="hopdong_id" id="" className='form-select'>
                                        <option value="">Chọn hợp đồng</option>
                                        {data?.contracts?.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div className="mb-3 w-50">
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select onChange={handleInputChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {data?.customers?.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div> */}
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="thoigiangiahan" className='form-label'>Ngày gia hạn</label>
                                    <input onChange={handleInputChange} name='thoigiangiahan' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="lydogiahan" className='form-label'>Lý do gia hạn</label>
                                    <input onChange={handleInputChange} name='lydogiahan' type="text" className='form-control ' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddExtend"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
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
                    <div className="row"style={{overflow: 'auto'}}>
                        <table className="table" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên dự án</th>
                                    <th scope="col">Ngày bắt đầu dự án</th>
                                    <th scope="col">Ngày kết thúc dự án</th>
                                    <th scope="col">Thời gian gia hạn</th>
                                    <th scope="col">Lý do gia hạn</th>
                                    <th scope="col">Người gia hạn</th>
                                    {/* <th scope="col">Khách hàng</th> */}
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
                                ) : filteredProjects && filteredProjects?.length > 0 ? (
                                    filteredProjects?.map((project, index) => (
                                        <tr key={project.id}>
                                            <td>{index + 1}</td>
                                            <td>{project.tenduan}</td>
                                            <td>{project.ngaybatdau}</td>
                                            <td>{project.ngayketthuc}</td>
                                            <td>{project.thoigian_giahan}</td>
                                            <td>{project.lydogiahan}</td>
                                            <td>{project.hoten}</td>
                                            {/* <td>{project.hoten}</td> */}
                                            <td>
                                                <div className="dropdown">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Hành động
                                                    </button>
                                                    <ul className="dropdown-menu px-3">

                                                        <button data-bs-toggle="modal" data-bs-target="#modalUpdateExtend" onClick={() => handleUpdateExtend(project.id)} className='btn btn-primary w-100 mb-2'><i className="fa-solid fa-pen-to-square me-3"></i>Update</button>
                                                        <button className='btn btn-danger w-100' onClick={() => handleDelete(project.id)} ><i className="fa-solid fa-trash me-3"></i>Delete</button>
                                                        {/* <button   className='btn btn-warning w-100 mt-2' >Gia hạn dự án</button> */}
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

                        <ModalAddExtend data={{ allProject: data && data.projects ? data.projects : [], /* allCustomers: data && data.customers ? data.customers : [] */ }} />
                        <ModalUpdateExtend data={{ allExtend: data && data.extend_project.data ? data.extend_project.data : [], /* allCustomers: data && data.customers ? data.customers : [] */ allProject: data && data.projects && data.projects ? data.projects : [], id: idProject }} />

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

export default ExtendProject;

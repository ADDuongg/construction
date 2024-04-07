import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAPI, postAPI, deleteAPI } from '../utility/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import ReactPaginate from 'react-paginate';
import ModalUpdateAssign from '../modal/modalUpdateAssign';
const Assignment = () => {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [idAssign, setIdAssign] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 10,
        hoten: '',
        duan_id: '',
        chucvu: '',
        ghichu: '',
        page: 1
    });
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['assign', searchParams.page, searchParams.limit], () => getAPI('/api/assignStaff', searchParams));
    const total_page = data?.assigns ? Number(data.assigns.last_page) : 1;
    const from = data?.assigns ? Number(data.assigns.from) : 1;
    const to = data?.assigns ? Number(data.assigns.to) : 3
    const total_item = data?.assigns ? Number(data.assigns.total) : 3
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleStaffChange = (event) => {
        setSelectedStaff(event.target.value);
    };
    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };
    const mutationSearch = useMutation((searchParams) => getAPI('/api/assignStaff', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['assign', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    }

    const mutation = useMutation((combinedData) => postAPI('api/assignStaff', combinedData), {
        onSuccess: () => {
            toast.success("Thêm khách hàng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('assign')
        },
        onError: (error) => {
            if (error.message.includes('422')) {
                toast.error("Nhân viên này đã được phân công cho dự án này trước đó", {
                    position: "top-right",
                    autoClose: 3000
                })
            }
        },

    })
    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const handleAssign = () => {
        const combinedData = {
            nhanvien_id: selectedStaff,
            duan_id: selectedProject
        }
        if (selectedStaff && selectedProject) {
            mutation.mutate(combinedData)
        }
        else {
            toast.warning("Vui lòng chọn đầy đủ thông tin dự án và nhân viên để phân công", {
                position: "top-right",
                autoClose: 1000
            });
        }
        console.log(combinedData);
    }
    function handleUpdateAssign(id) {
        setIdAssign(id)
    }
    const mutationDelete = useMutation((id) => deleteAPI(`/api/assignStaff/${id}`), {
        onSuccess: () => {

            Swal.fire({
                title: "Deleted!",
                text: "Schedule has been deleted.",
                icon: "success"
            });
            queryClient.invalidateQueries('assign')
        }
    });
    const handleDelete = (id) => {
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
                    mutationDelete.mutate(id)
                } catch (error) {
                    console.error("Error deleting attendance:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the staff.",
                        icon: "error"
                    });
                }
            }
        });

    };

    /* console.log(data?.assigns?.data); */
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white p-5 rounded">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Phân công dự án</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">

                        <div className="col-md-6 col-12">
                            <label htmlFor="query" className='form-label'>Tìm kiếm theo dự án</label>
                            <select onChange={handleInputChange} name="duan_id" className='form-select' id="">
                                <option value="">Chọn dự án</option>
                                {
                                    data?.projects?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.tenduan}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="col-md-6 col-12">
                            <label htmlFor="ghichu" className='form-label'>Tìm kiếm theo ghi chú</label>
                            <input name='ghichu' type="search" className='form-control' placeholder='Nhập từ khóa...' onChange={handleInputChange} />
                        </div>

                    </div>
                    <div className="row my-2 g-3">

                        <div className="col-md-6 col-12">
                            <label htmlFor="hoten" className='form-label'>Tìm kiếm theo tên nhân viên</label>
                            <input name='hoten' type="search" className='form-control' placeholder='Nhập từ khóa...' onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6 col-12">
                            <label htmlFor="query" className='form-label'>Tìm kiếm theo chức vụ nhân viên</label>
                            <input onChange={handleInputChange} type="text" name='chucvu' className='form-control' />
                        </div>

                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">

                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >

                    <h2 className='my-4'>Phân công dự án cho nhân viên</h2>
                    <div className="row g-3 my-3">
                        <div className='d-flex col-lg-3 col-md-6' style={{ fontSize: '20px' }}>Danh sách dự án <div className='text-danger'>(*)</div></div>
                        <div className='d-flex col-lg-9 col-md-6'>
                            <select name="duan_id" className='form-select' onChange={handleProjectChange}>
                                <option value="">Chọn dự án</option>
                                {
                                    data?.projects?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.tenduan}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row g-3 my-3">
                        <div className='d-flex col-lg-3 col-md-6' style={{ fontSize: '20px' }}>Tên nhân viên <div className='text-danger'>(*)</div></div>
                        <div className='d-flex col-lg-9 col-md-6'>
                            <select name="nhanvien_id" className='form-select' onChange={handleStaffChange}>
                                <option value="">Chọn nhân viên</option>
                                {data?.staffs?.map((staff, index) => (
                                    <option key={index} value={staff.nhanvien_id}>{staff.hoten} - {staff.chucvu}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-100 text-end mb-3">
                        <button className='btn btn-primary' onClick={handleAssign}>Phân công</button>
                    </div>
                    <div className="row g-3">
                        <div className="my-3  d-flex align-items-center">
                            <input onChange={handleInputChange} name='limit' type="number" className='form-control me-3' style={{ width: '5rem' }} value={searchParams?.limit || ''} />
                            <label htmlFor="limit">entries per page</label>
                        </div>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên nhân viên</th>
                                    <th>Chức vụ</th>
                                    <th>Dự án được phân công</th>
                                    <th>Ghi chú</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? (
                                        <tr>
                                            <td colSpan={6}>Loading ...</td>
                                        </tr>
                                    ) :
                                        mutationSearch.isLoading ? (
                                            <tr>
                                                <td colSpan={6}>Searching ...</td>
                                            </tr>
                                        ) : (
                                            data?.assigns?.data?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.hoten}</td>
                                                    <td>{item.chucvu}</td>
                                                    <td>{item.tenduan}</td>
                                                    <td>{item.ghichu}</td>
                                                    <td><div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Hành động
                                                        </button>
                                                        <ul className="dropdown-menu px-3">
                                                            <button className="btn btn-sm btn-primary w-100" data-bs-toggle="modal" data-bs-target="#modalUpdateAssign" onClick={() => handleUpdateAssign(item.id)}>Update</button>
                                                            <button className="btn btn-sm btn-danger w-100 mt-2" onClick={() => handleDelete(item.id)}>Delete</button>
                                                        </ul>
                                                    </div></td>
                                                </tr>
                                            ))
                                        )
                                }
                            </tbody>
                        </table>
                        <ModalUpdateAssign data = {{idAssign, projects: data?.projects || [], staffs: data?.staffs || [], assigns: data?.assigns?.data || []}} />
                        
                        <div className='w-100 d-flex justify-content-between'>
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
        </Layout >
    );
};

export default Assignment;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layout';
import ModalSchedule from '../modal/modalSchedule';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { deleteAPI, getAPI } from '../utility/api';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'
const StateProject = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [searchParams, setSearchParams] = useState({
        limit: 4,
        tenduan: '',
        ngaybatdau: '',
        ngayketthuc: '',
        soluonggiaidoan: '',
        page: 1
    });
    const { data, isLoading } = useQuery(['states', searchParams.page, searchParams.limit], () => getAPI('/api/projectState', searchParams))
    const queryClient = useQueryClient();
    const total_page = data?.project ? Number(data.project.last_page) : 1;
    const from = data?.project ? Number(data.project.from) : 1;
    const to = data?.project ? Number(data.project.to) : 3
    const total_item = data?.project ? Number(data.project.total) : 3
    const mutationSearch = useMutation((searchParams) => getAPI('/api/projectState', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['states', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });

    const duanIdsArray = user?.map(item => item.duan_id);

   
    const filteredProjects= data?.project?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const mutationDelete = useMutation((id) => deleteAPI(`/api/projectState/${id}`), {
        onSuccess: () => {
            toast.success("Xóa thành công giai đoạn", {
                position: "top-right",
                autoClose: 2000
            });
            queryClient.invalidateQueries(['states', searchParams.page, searchParams.limit]);
        }
    })
    const handleDelete = (id) => {
        Swal.fire({
            title: `Bạn có chắc muốn xóa giai đoạn này`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    mutationDelete.mutate(id);
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
    }
    const handleSearch = () => {
        mutationSearch.mutate(searchParams);
    };

    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevParams => ({
            ...prevParams,
            [name]: value
        }));
    };

    const checkPhaseStatus = (startFrom, endAt) => {
        const currentDate = new Date();
        const startDate = new Date(startFrom);
        const endDate = new Date(endAt);

        if (currentDate <= endDate && currentDate >= startDate) {
            return 'Giai đoạn đang diễn ra';
        } else if (currentDate > endDate) {
            return 'Giai đoạn đã kết thúc';
        } else {
            return 'Giai đoạn chưa bắt đầu';
        }
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
                                <input onChange={onChangeInput} name='tenduan' type="text" className='form-control' placeholder='Nhập tên dự án...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="tenduan" className='form-label'>Ngày bắt đầu</label>
                                    <input onChange={onChangeInput} name='ngaybatdau' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="tenduan" className='form-label'>Ngày kết thúc</label>
                                    <input onChange={onChangeInput} name='ngayketthuc' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenhopdong" className='form-label'>Hợp đồng</label>
                                <select onChange={onChangeInput} name="tenhopdong" id="" className='form-select'>
                                    <option value="1">Thi công công trình A</option>
                                    <option value="2">Thi công công trình B</option>
                                    <option value="3">Thi công công trình C</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="soluonggiaidoan" className='form-label'>Số lượng giai đoạn</label>
                                <input onChange={onChangeInput} name='soluonggiaidoan' type="text" className='form-control' placeholder='Nhập số lượng giai đoạn...' />
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <Link to={'/project'} className='btn btn-primary'><i className="fa-solid fa-plus me-2"></i>Thêm mới</Link>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-100 bg-white p-4">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {filteredProjects?.map((project, index) => (
                                <div key={index}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className='container-fluid px-2'>
                                            <h3>Dự án ID: {project.id}</h3>
                                            <h3>Tên dự án: {project.tenduan}</h3>
                                        </div>
                                        {/* <button className='btn btn-warning h-25 ' style={{ width: '15rem' }}>Gia hạn dự án</button> */}
                                    </div>

                                    <div className='container-fluid bg-white rounded px-2 my-4 py-3 '>
                                        <div className="row g-3">
                                            {data.all_state.map((phase, phaseIndex) => {
                                                if (phase.duan_id === project.id) {
                                                    return (
                                                        <div key={phaseIndex} className="phase col-lg-3 col-12">
                                                            <div className="w-100 bg-secondary text-white rounded p-3 ">
                                                                <div className="phase-info mb-3">
                                                                    <div className='w-100 d-flex align-items-center mb-2 justify-content-between'>
                                                                        <div className='fw-bold'>Giai đoạn: {phase.giaidoan}</div>
                                                                        <div className='d-flex'>
                                                                            {/* <i className="fa-solid fa-magnifying-glass " data-bs-toggle="modal" data-bs-target={`#exampleModal${phase.id}`}></i> */}
                                                                            <i onClick={() => handleDelete(phase.id)} className="fa-solid fa-trash text-danger mx-3"></i>
                                                                            <i data-bs-toggle="modal" data-bs-target={`#exampleModal${phase.id}`} className="fa-solid fa-pen-to-square text-warning"></i>
                                                                        </div>
                                                                    </div>
                                                                    <ModalSchedule data={{
                                                                        tenduan: project.tenduan,
                                                                        id: phase.id,
                                                                        phase: phase.giaidoan,
                                                                        start_from: phase.ngaybatdau,
                                                                        end_at: phase.ngayketthuc,
                                                                        description: phase.mota
                                                                    }} />
                                                                </div>
                                                                <div className='d-flex align-items-center'>
                                                                    <i className="fa-regular fa-calendar-days me-3" /* data-bs-toggle="modal" data-bs-target={`#exampleModal${phase.id}`} */ style={{ fontSize: '5rem' }}></i>
                                                                    <div >
                                                                        <div className='d-flex'>Ngày bắt đầu : {phase.ngaybatdau}</div>
                                                                        <div className='d-flex'>Ngày kết thúc : {phase.ngayketthuc}</div>
                                                                        <div className='d-flex'>Mô tả : {phase.mota}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        {data.all_state.filter(phase => phase.duan_id === project.id).length === 0 && (
                                            <div className="alert alert-info" role="alert">
                                                <h5>Dự án này chưa có giai đoạn <Link to={`/addSchedule/${project.id}`} className='btn btn-success'>Thêm ngay</Link></h5>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default StateProject;

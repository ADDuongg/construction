import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { deleteAPI, getAPI } from '../utility/api';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
const Statistic = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenduan: '',
        ngaythongke: '',
        hoten: '',
        tenvatlieu: '',
        tenmaymoc: '',
        /* hopdong_id: '', */
        page: 1
    });
    const { data, isLoading } = useQuery(['statistic', searchParams.page, searchParams.limit], () => getAPI('/api/statistic'), {
        refetchOnWindowFocus: false,
    });
    const duanIdsArray = user.map(item => item.duan_id);
    const filtered = data?.statistics?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.duan_id);
        }
        if (user[0]?.chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    
    const total_page = data?.statistics ? Number(data.statistics.last_page) : 1;
    const from = data?.statistics ? Number(data.statistics.from) : 1;
    const to = data?.statistics ? Number(data.statistics.to) : 3
    const total_item = data?.statistics ? Number(data.statistics.total) : 3

    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const mutationSearch = useMutation((searchParams) => getAPI('/api/statistic', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['statistic', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        console.log(searchParams);
        mutationSearch.mutate(searchParams);
    };


    const mutationDelete = useMutation((id) => deleteAPI(`/api/statistic/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('statistic')
            toast.success("Xóa phiếu thống kê ngày công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    });
    const handleDelete = (id) => {
        Swal.fire({
            title: `Are you sure want to delete this statistic`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                mutationDelete.mutate(id);
            }
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Thống kê theo ngày</li>
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
                                    <label htmlFor="ngaythongke" className='form-label'>Ngày thống kê</label>
                                    <input onChange={handleInputChange} name='ngaythongke' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="hoten" className='form-label'>Người thống kê</label>
                                    <input onChange={handleInputChange} name='hoten' type="text" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-3">
                                <div className=' w-200 mb-3'>
                                    <label htmlFor="tenvatlieu" className='form-label'>Tên vật liệu</label>
                                    <select onChange={handleInputChange} name="tenvatlieu" id="" className='form-select'>
                                        <option value="">Chọn tên vật liệu</option>
                                        {data && data.matterials && data.matterials.map((item, index) => (
                                            <option key={index} value={item.tenvatlieu}>{item.tenvatlieu}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-100'>
                                    <label htmlFor="tenmaymoc" className='form-label'>Tên máy móc</label>
                                    <select onChange={handleInputChange} name="tenmaymoc" id="" className='form-select'>
                                        <option value="">Chọn tên máy móc</option>
                                        {data && data.machines && data.machines.map((item, index) => (
                                            <option key={index} value={item.tenmaymoc}>{item.tenmaymoc}</option>
                                        ))}
                                    </select>
                                </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <Link to={'/addStatistic'} className='btn btn-primary'><i className="fa-solid fa-plus me-2"></i>Thêm mới</Link>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách thống kê theo từng ngày</h4>
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
                                    <th scope="col">Tên người thống kê</th>
                                    <th scope="col">Thông tin vật liệu thống kê</th>
                                    <th scope="col">Thông tin máy móc thống kê</th>
                                    <th scope="col">Ghi chú</th>
                                    <th scope="col">Ngày thống kê</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7"><div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div></td></tr>
                                ) :

                                    mutationSearch.isLoading ? (
                                        <tr><td colSpan="7"><div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div> </td></tr>
                                    )
                                        :
                                        (
                                            filtered && filtered.length > 0 ? (
                                                filtered.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index}</td>
                                                        <td>{item.hoten}</td>
                                                        <td className='text-start' style={{ fontSize: '13px' }}>
                                                            <table className='table table-striped'>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Mã vật liệu</th>
                                                                        <th>Tên vật liệu</th>
                                                                        <th>Khối lượng dựng</th>
                                                                        <th>Loại vật liệu</th>
                                                                        <th>Đơn vị tính</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data.matterials_statistic && data.matterials_statistic.map((matterial, index) => {

                                                                        if (item.thongkengay_id === matterial.thongkengay_id) {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{matterial.mavatlieu}</td>
                                                                                    <td>{matterial.tenvatlieu}</td>
                                                                                    <td>{matterial.khoiluongdung}</td>
                                                                                    <td>{matterial.loaivatlieu}</td>
                                                                                    <td>{matterial.donvitinh}</td>
                                                                                </tr>
                                                                            );
                                                                        }

                                                                    })}

                                                                </tbody>
                                                            </table>



                                                        </td>
                                                        <td className='text-start' style={{ fontSize: '13px' }}>
                                                            <table className='table table-striped'>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Mã máy móc</th>
                                                                        <th>Tên máy móc</th>
                                                                        <th>Số giờ thuê</th>
                                                                        <th>Loại máy móc</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {data.machines_statistic && data.machines_statistic.map((machine, index) => {
                                                                        if (item.thongkengay_id === machine.thongkengay_id) {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{machine.mamaymoc}</td>
                                                                                    <td>{machine.tenmaymoc}</td>
                                                                                    <td>{machine.sogiothue}</td>
                                                                                    <td>{machine.loaimaymoc}</td>
                                                                                </tr>
                                                                            );
                                                                        }

                                                                    })}

                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td>{item.ghichu}</td>
                                                        <td>{item.ngaythongke}</td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Hành động
                                                                </button>
                                                                <ul className="dropdown-menu px-3">
                                                                    <Link to={`/editStatistic/${item.thongkengay_id}`} className='btn btn-primary w-100 mb-2'><i className="fa-solid fa-pen-to-square me- 3"></i>Update</Link>
                                                                    <button className='btn btn-danger w-100' onClick={() => handleDelete(item.thongkengay_id)} ><i className="fa-solid fa-trash me-3"></i>Delete</button>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <div>Không tìm thấy thông tin</div>
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
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default Statistic;

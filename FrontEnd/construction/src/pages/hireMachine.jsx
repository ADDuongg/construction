import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { getAPI, deleteAPI } from '../utility/api';
import ModalAddMachine from '../modal/machine/modalAddMachine'
import ModalHireMachine from '../modal/machine/modalHireMachine'
import React, { useState } from 'react';
import ModalUpdateHireMachine from '../modal/machine/modalUpdateHireMachine';
import Cookies from 'js-cookie'
const HireMachine = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [id, setID] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        query: '',
        loaimaymoc: '',
        sogiothue: '',
        ngaynhap: '',
        nhathau: '',
        thanhtien: '',
        page: 1
    });
    const queryClient = useQueryClient();
    const handleUpdateReceipt = (id) => {
        setID(id);

    };

    const handleAddMatterials = () => {
        setID(null)

    }

    const { data, isLoading } = useQuery(['hire', searchParams.page, searchParams.limit], () => getAPI('/api/hireMachine', searchParams))
    const total_page = data?.hireReceipt ? Number(data.hireReceipt.last_page) : 1;
    const from = data?.hireReceipt ? Number(data.hireReceipt.from) : 1;
    const to = data?.hireReceipt ? Number(data.hireReceipt.to) : 3
    const total_item = data?.hireReceipt ? Number(data.hireReceipt.total) : 3
    const mutationSearch = useMutation((searchParams) => getAPI('/api/hireMachine', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['hire', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredData = data?.hireReceipt?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.duan_id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const filteredProjects = data?.project?.filter(project => {
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
    function handleSearch() {

        mutationSearch.mutate(searchParams)
    }
    const handlePageClick = ({ selected }) => {
        console.log(searchParams.page);
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const mutationDelete = useMutation((id) => deleteAPI(`/api/hireMachine/${id}`), {
        onSuccess: () => {
            toast.success("Xóa phiếu thuê thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries(['hire', searchParams.page, searchParams.limit])
        }
    })
    function handleDelete(id) {
        Swal.fire({
            title: `Are you sure want to delete this receipt`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                mutationDelete.mutate(id)
            }
        });
    }

    return (
        <Layout>
            <section className='hireMaterial detailContent p-5'>
                <div className="container-fluid p-5 bg-white rounded">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Thông tin máy móc/thiết bị</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenmaymoc" className='form-label'>Tên máy móc</label>
                                <input onChange={handleInputChange} name='tenmaymoc' type="text" className='form-control' placeholder='Nhập tên máy móc...' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="sogiothue" className='form-label'>Số giờ thuê</label>
                                <input onChange={handleInputChange} name='sogiothue' type="text" className='form-control' placeholder='Nhập số giờ thuê...' />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='d-flex justify-content-between w-100'>
                                <div className='mb-3 w-50'>
                                    <label htmlFor="loaimaymoc" className='form-label'>Loại máy móc</label>
                                    <select onChange={handleInputChange} name="loaimaymoc" id="" className='form-select' >
                                        <option value="">Chọn loại máy móc</option>
                                        {data?.machine_types?.map((item, index) => (
                                            <option key={index} value={item.ten_loaimaymoc}>{item.ten_loaimaymoc}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='mb-3 w-50 '>
                                    <label htmlFor="duan_id" className='form-label'>Tìm theo dự án</label>
                                    <select name="duan_id" onChange={handleInputChange} className='form-select text-center' id="">
                                        <option value="">---Chọn dự án---</option>
                                        {filteredProjects?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='mb-3 w-50 me-3'>
                                    <label htmlFor="thanhtien" className='form-label'>Số tiền</label>
                                    <select onChange={handleInputChange} name="thanhtien" id="" className='form-select'>
                                        <option value="">Tìm theo số tiền thuê</option>
                                        <option value="500">500000</option>
                                        <option value="500-1000">500000 - 1000000</option>
                                        <option value="1000">1000000</option>
                                    </select>
                                </div>
                                <div className='mb-3 w-50 '>
                                    <label htmlFor="nhathau_id" className='form-label'>Nhà thầu</label>
                                    <select onChange={handleInputChange} name="nhathau_id" id="" className='form-select' >
                                        <option value="">Chọn nhà thầu</option>
                                        {data?.contractor?.map((item, index) => (
                                            <option key={index} value={item.nhathau_id}>{item.tennhathau}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <div >
                            <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                        </div>
                    </div>
                    <div className="row " style={{overflow: 'auto'}}>
                        <h2>Thông tin máy móc/thiết bị</h2>
                        <div className='w-100 text-end mt-3'>
                            <button className='btn btn-primary me-3' data-bs-toggle="modal" data-bs-target="#modalMachine" >Thêm mới máy móc</button>
                            <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" >Thuê máy móc</button>
                        </div>
                        <ModalAddMachine />
                        <ModalHireMachine />
                        <ModalUpdateHireMachine data={{ AllHire: data && data.hireReceipt ? data.hireReceipt.data : [], allContractors: data && data.contractor ? data.contractor : [], id }} />
                        <table className='table table-striped my-3' id="materialTable" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Người tạo phiếu</th>
                                    <th className='text-start'>Chi tiết thuê</th>
                                    <th>Ghi chú</th>
                                    <th>Ngày tạo phiếu</th>

                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? (
                                        <tr><td colSpan={6}>Loading ...</td></tr>
                                    ) : (
                                        mutationSearch.isLoading ? (
                                            <tr ><td colSpan={6}>Searching ...</td></tr>
                                        ) : (
                                            filteredData?.map((item) => (
                                                <tr key={item.id}>
                                                    <td >{item.id}</td>
                                                    <td >{item.nguoithue}</td>
                                                    <td className='text-start' style={{ fontSize: '20px' }}>
                                                        <table className='table table-striped'>
                                                            <thead>
                                                                <tr>
                                                                    <th>Tên máy móc</th>
                                                                    <th>Mã máy móc</th>
                                                                    <th>Số giờ thuê</th>
                                                                    <th>Loại máy móc</th>
                                                                    <th>Đơn giá</th>
                                                                    <th>Thành tiền</th>
                                                                    <th>Nhà thầu</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item.tenmaymoc && item.tenmaymoc.split(',').map((ten, index) => (
                                                                    <tr key={index}>
                                                                        <td>{ten.trim()}</td>
                                                                        <td>{item.mamaymoc && item.mamaymoc.split(',')[index].trim()}</td>
                                                                        <td>{item.sogiothue && item.sogiothue.split(',')[index].trim()}</td>
                                                                        <td>{item.loaimaymoc && item.loaimaymoc.split(',')[index].trim()}</td>
                                                                        <td>{item.dongia && item.dongia.split(',')[index].trim()}</td>
                                                                        <td>{item.thanhtien && item.thanhtien.split(',')[index].trim()}</td>
                                                                        <td>{item.tennhathau && item.tennhathau.split(',')[index].trim()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>



                                                    </td>
                                                    <td>{item.ghichu}</td>
                                                    <td >{item.created_at}</td>
                                                    <td >
                                                        <div className='d-flex justify-content-center h-100'>
                                                            <Link data-bs-toggle="modal" data-bs-target="#modalUpdateHireReceipt" className='btn btn-primary me-3' onClick={() => handleUpdateReceipt(item.id)} style={{ textDecoration: 'none', color: 'white' }}><i className="fa-solid fa-pen-to-square"></i></Link>
                                                            <button onClick={() => handleDelete(item.id)} className='btn btn-danger me-3' ><i className="fa-solid fa-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    )
                                }
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
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default HireMachine;

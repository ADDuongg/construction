import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalAddContract from '../modal/contract/modalAddContract';
import ModalUpdateContract from '../modal/contract/modalUpdateContract';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
const Contracts = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenhopdong: '',
        ngaybatdau: '',
        ngayketthuc: '',
        khachhang_id: '',
        giatrihopdong: '',
        page: 1
    });
    const [idContract, setIdContract] = useState('')

    const { isLoading, isError, data } = useQuery(['contracts', searchParams.page, searchParams.limit], () => getAPI('/api/contract', searchParams));
    const total_page = data?.contracts ? Number(data.contracts.last_page) : 1;
    const from = data?.contracts ? Number(data.contracts.from) : 1;
    const to = data?.contracts ? Number(data.contracts.to) : 3
    const total_item = data?.contracts ? Number(data.contracts.total) : 3
    const queryClient = useQueryClient();
    const mutationSearch = useMutation((searchParams) => getAPI('/api/contract', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['contracts', searchParams.page, searchParams.limit], () => {
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
            title: `Bạn có chắc muốn xóa hợp đồng này, các dự án và lịch trình sẽ bị hủy bỏ theo ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/contract/${id}`);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Staff has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('contracts');
                    }
                } catch (error) {
                    console.error("Error deleting contract:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the contract.",
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

    const handleUpdateContract = (id) => {
        setIdContract(id);

    };
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý hợp đồng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenhopdong" className='form-label'>Tên hợp đồng</label>
                                <input onChange={(e) => handleInputChange(e)} name='tenhopdong' type="text" className='form-control' placeholder='Nhập tên dự án...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                    <input onChange={(e) => handleInputChange(e)} name='ngaybatdau' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                    <input onChange={(e) => handleInputChange(e)} name='ngayketthuc' type="date" className='form-control ' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="khachhang_id" className='form-label'>Khách hàng</label>
                                <select onChange={(e) => handleInputChange(e)} name="khachhang_id" id="" className='form-select'>
                                    <option value="">Tìm khách hàng</option>
                                    {data && data.customers.map((item, index) => (
                                        <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-3 d-flex justify-content-between w-100'>
                                <div className=' w-100'>
                                    <label htmlFor="giatrihopdong" className='form-label'>Giá trị hợp đồng</label>
                                    <select onChange={(e) => handleInputChange(e)} name="giatrihopdong" id="" className='form-select'>
                                        <option value="">Tìm theo giá trị hợp đồng</option>
                                        <option value="500">500000000</option>
                                        <option value="500-1500">500000000 - 1500000000</option>
                                        <option value="1500-3000">1500000000-3000000000</option>
                                        <option value="3000"> trên 3000000000</option>
                                    </select>
                                </div>
                                {/* <div className='w-50'>
                                    <label htmlFor="duan_id" className='form-label'>Dự án</label>
                                    <select name="duan_id" id="" className='form-select'>
                                        <option value="">Tìm theo dự án</option>
                                        <option value="1">Dự án A</option>
                                        <option value="2">Dự án B</option>
                                        <option value="3">Dự án C</option>
                                    </select>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddContract" ><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách hợp đồng</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row">
                        <table className="table table-striped" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên hợp đồng</th>
                                    <th scope="col">Giá trị hợp đồng</th>
                                    <th scope="col">Tạm ứng</th>
                                    <th scope="col">Còn lại</th>
                                    <th scope="col">Ngày ký</th>
                                    <th scope="col">Loại hợp đồng</th>
                                    <th scope="col">Ngày bắt đầu</th>
                                    <th scope="col">Ngày kết thúc</th>
                                    <th scope="col">Ngày đáo hạn</th>
                                    <th scope="col">Phí trễ hạn</th>
                                    <th>Nội dung hợp đồng</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="11" className="text-center">Loading...</td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan="11" className="text-center">Error fetching data</td>
                                    </tr>
                                ) :
                                    mutationSearch.isLoading ? (
                                        <tr>
                                            <td colSpan="11" className="text-center">Searching...</td>
                                        </tr>
                                    )
                                        : (
                                            data && data.contracts && data.contracts.data && data.contracts.data.length > 0 ? (
                                                data.contracts.data.map((contract, index) => (
                                                    <tr key={index}>
                                                        <td>{contract.hopdong_id}</td>
                                                        <td>{contract.tenhopdong}</td>
                                                        <td>{contract.giatrihopdong}</td>
                                                        <td>{contract.tamung}</td>
                                                        <td>{contract.conlai}</td>
                                                        <td>{contract.ngayky}</td>
                                                        <td>{contract.loaihopdong}</td>
                                                        <td>{contract.ngaybatdau}</td>
                                                        <td>{contract.ngayketthuc}</td>
                                                        <td>{contract.ngaydaohan}</td>
                                                        <td>{contract.phitrehan}</td>
                                                        <td><textarea readOnly className='form-control' name="" id="" cols="30" rows="5">{contract.noidung}</textarea></td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Hành động
                                                                </button>
                                                                <ul className="dropdown-menu px-3">
                                                                    <button className="btn btn-sm btn-primary w-100" data-bs-toggle="modal" data-bs-target="#modalUpdateContract" onClick={() => handleUpdateContract(contract.hopdong_id)}>Update</button>
                                                                    <button className="btn btn-sm btn-danger w-100 mt-2" onClick={() => handleDelete(contract.hopdong_id)}>Delete</button>
                                                                </ul>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className='fw-bold' colSpan="11">Không có thông tin hợp đồng tìm kiếm</td>
                                                </tr>
                                            )

                                        )}
                            </tbody>

                        </table>
                        <ModalAddContract data={{ Allcustomers: data && data.customers ? data.customers : [] }} />

                        {/*  <ModalAddContract customers={data && data.customers ? data.customers : []} /> */}
                        <ModalUpdateContract data={{ Allcustomers: data && data.customers ? data.customers : [], allContracts: data && data.contracts && data.contracts.data ? data.contracts.data : [], id: idContract }} />
                        <div className='w-100 d-flex justify-content-between' style={{minWidth: '150vh'}}>
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

export default Contracts;

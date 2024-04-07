import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAPI } from '../utility/api';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'
import http from '../axios';
import ModalAddContractPayment from '../modal/contract/modalAddContractPayment';
import ModalUpdateContractPayment from '../modal/contract/modalUpdateContractPayment';

const ContractPayment = () => {
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        hopdong_id: '',
        khachhang_id: '',
        giatri_truocthue: '',
        vat: '',
        giatri_sauthue: '',
        ngaythanhtoan: '',
        noidung: '',
        page: 1
    });
    const [idContract, setIdContract] = useState('');

    const { isLoading, isError, data } = useQuery(['contract_payment', searchParams.page, searchParams.limit], () => getAPI('/api/paymentContracts', searchParams));
    const total_page = data?.paymentContracts ? Number(data.paymentContracts.last_page) : 1;
    const from = data?.paymentContracts ? Number(data.paymentContracts.from) : 1;
    const to = data?.paymentContracts ? Number(data.paymentContracts.to) : 3;
    const total_item = data?.paymentContracts ? Number(data.paymentContracts.total) : 3;
    const queryClient = useQueryClient();

    const mutationSearch = useMutation((searchParams) => getAPI('/api/paymentContracts', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['contract_payment', searchParams.page, searchParams.limit], () => {
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

    const deleteContract = async (id) => {
        Swal.fire({
            title: `Are you sure want to delete this payment contract?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await http.delete(`/api/paymentContracts/${id}`);
                    if (response.status === 204) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Payment contract has been deleted.",
                            icon: "success"
                        });
                        queryClient.invalidateQueries('contract_payment');
                    }
                } catch (error) {
                    console.error("Error deleting payment contract:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the payment contract.",
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

    const mutation = useMutation(deleteContract);

    const handleSubmit = (id) => {
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
                            <li className="breadcrumb-item active" aria-current="page">Quản lý thanh lý hợp đồng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="hopdong_id" className='form-label'>Tìm kiếm theo hợp đồng</label>
                                <select onChange={(e) => handleInputChange(e)} name="hopdong_id" id="" className='form-select'>
                                    <option value="">Tìm Hợp đồng</option>
                                    {data && data.contracts.map((item, index) => (
                                        <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="khachhang_id" className='form-label'>Khách hàng</label>
                                <select onChange={(e) => handleInputChange(e)} name="khachhang_id" id="" className='form-select'>
                                    <option value="">Tìm khách hàng</option>
                                    {data && data.customers.map((item, index) => (
                                        <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="d-flex w-100 mb-3">
                                <div className='w-50 me-3'>
                                    <label htmlFor="giatri_truocthue" className='form-label'>Giá trị trước thuế</label>
                                    <input name='giatri_truocthue' type="text" className='form-control ' value={searchParams.giatri_truocthue} onChange={handleInputChange} />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="vat" className='form-label'>VAT</label>
                                    <input name='vat' type="text" className='form-control ' value={searchParams.vat} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="d-flex w-100 mb-3">
                                <div className='w-50 me-3'>
                                    <label htmlFor="giatri_sauthue" className='form-label'>Giá trị sau thuế</label>
                                    <input name='giatri_sauthue' type="text" className='form-control ' value={searchParams.giatri_sauthue} onChange={handleInputChange} />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="ngaythanhtoan" className='form-label'>Ngày thanh toán</label>
                                    <input name='ngaythanhtoan' type="date" className='form-control ' value={searchParams.ngaythanhtoan} onChange={handleInputChange} />
                                </div>
                            </div>

                        </div>
                        <div className="col-12">
                            <div className='mb-3'>
                                <label htmlFor="noidung" className='form-label'>Nội dung</label>
                                <input name='noidung' type="text" className='form-control ' value={searchParams.noidung} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddContractPayment"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded px-5 py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách thanh lý hợp đồng</h4>
                    <div className="my-3  d-flex align-items-center">
                        <input defaultValue={3} min={1} type="number" name='limit' className='form-control w-auto me-3' onChange={(e) => handleInputChange(e)} />
                       
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row" style={{overflow: 'auto'}}>
                        <table className="table table-striped" style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Mã hợp đồng</th>
                                    <th scope="col">Mã khách hàng</th>
                                    <th scope="col">Giá trị trước thuế</th>
                                    <th scope="col">VAT</th>
                                    <th scope="col">Giá trị sau thuế</th>
                                    <th scope="col">Ngày thanh toán</th>
                                    <th scope="col">Nội dung</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : (
                                    data && data.paymentContracts && data.paymentContracts.data.length > 0 ? (
                                        data.paymentContracts.data.map((contract, index) => (
                                            <tr key={index}>
                                                <td>{contract.id}</td>
                                                <td>{contract.tenhopdong}</td>
                                                <td>{contract.hoten}</td>
                                                <td>{contract.giatri_truocthue}</td>
                                                <td>{contract.vat}</td>
                                                <td>{contract.giatri_sauthue}</td>
                                                <td>{contract.ngaythanhtoan}</td>
                                                <td>{contract.noidung}</td>
                                                <td>
                                                    <button data-bs-toggle="modal" data-bs-target="#modalUpdateContractPayment" className="btn btn-primary me-2" onClick={() => handleUpdateContract(contract.id)}><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger" onClick={() => handleSubmit(contract.id)}><i className="fa-solid fa-trash "></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className='fw-bold' colSpan="9">Không có thông tin hợp đồng thanh lý</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                        <ModalAddContractPayment data={{ allCustomers: data && data.customers ? data.customers : [], allContracts: data && data.contracts ? data.contracts : [] }}/>
                        <ModalUpdateContractPayment data={{ idContract, allPayment: data && data.paymentContracts.data ? data.paymentContracts.data : []  , allCustomers: data && data.customers ? data.customers : [], allContracts: data && data.contracts ? data.contracts : [] }}/>
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

export default ContractPayment;

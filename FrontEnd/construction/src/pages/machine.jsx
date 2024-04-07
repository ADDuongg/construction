import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';

import { useQuery, useMutation, useQueryClient } from 'react-query'
import ReactPaginate from 'react-paginate';
import { deleteAPI, getAPI } from '../utility/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ModalHireMachine from '../modal/machine/modalHireMachine';
import ModalAddMachine from '../modal/machine/modalAddMachine';
import ModalUpdateMachine from '../modal/machine/modalUpdateMachine'
const Machine = () => {
    const [id, setID] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenmaymoc: '',
        loaimaymoc: null,
        mota: '',
        page: 1
    });
    const queryClient = useQueryClient();
    const { isLoading, isError, data } = useQuery(['machine', searchParams.page, searchParams.limit], () => getAPI('/api/machine', searchParams));
    const total_page = data?.machines ? Number(data.machines.last_page) : 1;
    const from = data?.machines ? Number(data.machines.from) : 1;
    const to = data?.machines ? Number(data.machines.to) : 3
    const total_item = data?.machines ? Number(data.machines.total) : 3
    const handleUpdatemachines = (id) => {
        setID(id);

    };

    const mutationSearch = useMutation((searchParams) => getAPI('/api/machine', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['machine', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const mutationDelete = useMutation((id) => deleteAPI(`/api/machine/${id}`), {
        onSuccess: () => {
            toast.success("Xóa máy móc thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries(['machine', searchParams.page, searchParams.limit])
        }
    })
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    function handleDelete(id) {
        Swal.fire({
            title: `Are you sure want to delete this machine ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(() => {
            mutationDelete.mutate(id)
        });
    }
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
                                <input name='tenmaymoc' onChange={(e) => handleInputChange(e)} type="text" className='form-control' placeholder='Nhập tên máy móc...' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="mota" className='form-label'>Mô tả</label>
                                <input name='mota' onChange={(e) => handleInputChange(e)} type="text" className='form-control' placeholder='Nhập mô tả máy móc...' />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="loaimaymoc" className='form-label'>Loại máy móc</label>
                                <input onChange={(e) => handleInputChange(e)} name='loaimaymoc' type="search" className='form-control' placeholder='Nhập loại máy móc...' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="mota" className='form-label'></label>

                                <div className="d-flex justify-content-end mt-3">

                                    <button className='btn btn-primary me-3' data-bs-toggle="modal" data-bs-target="#modalMachine" >Thêm mới máy móc</button>
                                    <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row " style={{overflow: 'auto'}}>
                        <h2>Thông tin máy móc/thiết bị</h2>
                        {/* <div className='w-100 text-end'>
                            <button className='btn btn-primary me-3' data-bs-toggle="modal" data-bs-target="#modalMachine" >Thêm mới máy móc</button>
                            <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => openModal(1)}>Thuê máy móc</button>
                        </div> */}
                        <ModalAddMachine />
                        <ModalHireMachine data={{ id }} />
                        <table className='table table-striped my-3' id="materialTable"  style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên máy móc</th>
                                    <th>Loại máy móc</th>
                                    <th>Mô tả</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading || mutationSearch.isLoading ? (<tr>
                                    <td colSpan="9">Loading...</td>
                                </tr>) : (
                                    data && data.machines && data.machines.data && data.machines.data.length > 0 ? (
                                        data.machines.data.map((machine, index) => (
                                            <tr key={index}>
                                                <td>{machine.id}</td>
                                                <td>{machine.tenmaymoc}</td>
                                                <td>

                                                    <div>
                                                        <div>
                                                            {machine.loaimaymoc_name?.split(',').map(item => (
                                                                <div key={item}>{item}</div>
                                                            ))}
                                                        </div>

                                                    </div>

                                                </td>
                                                <td>{machine.mota}</td>
                                                <td>
                                                    <button className="btn btn-primary me-2" onClick={() => handleUpdatemachines(machine.id)} data-bs-toggle='modal' data-bs-target='#modalUpdateMachine'><i className="fa-solid fa-pen-to-square "></i></button>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(machine.id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr>
                                        <td className='fw-bold' colSpan="9">Không có thông tin nhân viên tìm kiếm</td>
                                    </tr>)
                                )
                                }
                            </tbody>
                        </table>
                        <div className='w-100 d-flex justify-content-between'  style={{minWidth: '100vh'}}>
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
                    <ModalUpdateMachine data={{ allMachines: data && data.machines && data.machines.data ? data.machines.data : [], mamaymoc: id }} />
                </div>
            </section>
        </Layout>
    );
}

export default Machine;

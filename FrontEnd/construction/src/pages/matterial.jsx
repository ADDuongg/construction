import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalImportMatterials from '../modal/matterials/modalImportMatterials';
import ModalAddMatterials from '../modal/matterials/modalAddMatterials';
import ModalUpdateMatterials from '../modal/matterials/modalUpdateMatterials';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import ReactPaginate from 'react-paginate';
import { deleteAPI, getAPI } from '../utility/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const Matterials = () => {

    const [id, setID] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        tenvatlieu: '',
        loaivatlieu: null,
        donvitinh: '',
        mota: '',
        page: 1
    });
    const queryClient = useQueryClient();
    const { isLoading, isError, data } = useQuery(['matterials', searchParams.page, searchParams.limit], () => getAPI('/api/matterial', searchParams));
    const total_page = data?.matterials ? Number(data.matterials.last_page) : 1;
    const from = data?.matterials ? Number(data.matterials.from) : 1;
    const to = data?.matterials ? Number(data.matterials.to) : 3
    const total_item = data?.matterials ? Number(data.matterials.total) : 3
    const handleUpdateMatterials = (id) => {
        setID(id);

    };

    const mutationSearch = useMutation((searchParams) => getAPI('/api/matterial', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['matterials', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const mutationDelete = useMutation((id) => deleteAPI(`/api/matterial/${id}`), {
        onSuccess: () => {
            toast.success("Xóa vật liệu thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries(['matterials', searchParams.page, searchParams.limit])
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
            title: `Are you sure want to delete this matterial`,
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
                            <li className="breadcrumb-item active" aria-current="page">Thông tin vật liệu</li>
                        </ol>
                    </nav>

                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="tenvatlieu" className='form-label'>Tên vật liệu</label>
                                <input onChange={(e) => handleInputChange(e)} name='tenvatlieu' type="search" className='form-control' placeholder='Nhập tên dự án...' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="mota" className='form-label'>Mô tả</label>
                                <input onChange={(e) => handleInputChange(e)} name='mota' type="search" className='form-control' placeholder='Nhập mô tả vật liệu...' />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="donvitinh" className='form-label'>Đơn vị tính</label>
                                <select onChange={(e) => handleInputChange(e)} name="donvitinh" id="" className='form-select' >
                                    <option value="">Chọn đơn vị tính</option>
                                    <option value="kg">kg</option>
                                    <option value="m3">m3</option>
                                    <option value="ml">ml</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="loaivatlieu" className='form-label'>Loại vật liệu</label>
                                <input type="search" onChange={(e) => handleInputChange(e)} className='form-control' name='loaivatlieu' placeholder='nhập loại vật liệu cần tìm ...' />
                                {/* <select onChange={(e) => handleInputChange(e)} name="loaivatlieu" id="" className='form-select' >
                                    <option value=''>Chọn loại vật liệu</option>
                                    {data && data.matterials_type && data.matterials_type.map((item, index) => (
                                        <option key={index} value={item.ten_loaivatlieu}>{item.ten_loaivatlieu}</option>
                                    ))}
                                </select> */}
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div >
                                <button className='btn btn-primary me-3 ' data-bs-toggle="modal" data-bs-target="#modalMatterials">Thêm mới vật liệu</button>
                                <button className='btn btn-success' onClick={handleSearch}><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                        </div>
                    </div>

                    <div className="row " style={{overflow: 'auto'}}>
                        <h2>Thông tin vật liệu</h2>
                        <div className="my-3  d-flex align-items-center">
                            <select name="limit" id="" className='form-select w-auto me-3' onChange={(e) => handleInputChange(e)}>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <label htmlFor="limit">entries per page</label>
                        </div>

                        <table className='table table-striped my-3' id="materialTable"  style={{minWidth: '100vh'}}>
                            <thead>
                                <tr>
                                    <th>Mã vật liệu</th>
                                    <th>Tên vật liệu</th>
                                    <th>Loại vật liệu</th>
                                    <th className=''>Đơn vị tính</th>
                                    <th>Mô tả</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>

                                {isLoading ? (<tr>
                                    <td colSpan="9">Loading...</td>
                                </tr>)
                                    : mutationSearch.isLoading ? (
                                        <tr>
                                            <td colSpan="8">Searching...</td>
                                        </tr>
                                    ) : (
                                        data && data.matterials && data.matterials.data && data.matterials.data.length > 0 ? (
                                            data.matterials.data.map((matterial, index) => (
                                                <tr key={index}>
                                                    <td>{matterial.id}</td>
                                                    <td>{matterial.tenvatlieu}</td>
                                                    <td>

                                                        <div>
                                                            <div>
                                                                {matterial.loaivatlieu_name?.split(',').map(item => (
                                                                    <div key={item}>{item}</div>
                                                                ))}
                                                            </div>

                                                        </div>

                                                    </td>
                                                    <td>{matterial.donvitinh}</td>
                                                    <td>{matterial.mota}</td>
                                                    <td>
                                                        <button className="btn btn-primary me-2" onClick={() => handleUpdateMatterials(matterial.id)} data-bs-toggle='modal' data-bs-target='#modalUpdateMatterials'><i className="fa-solid fa-pen-to-square "></i></button>
                                                        <button className="btn btn-danger" onClick={() => handleDelete(matterial.id)}>
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
                        <ModalAddMatterials />
                        <ModalUpdateMatterials data={{ allMatterials: data && data.matterials && data.matterials.data ? data.matterials.data : [], mavatlieu: id }} />
                        {/*  <ModalImportMatterials /> */}

                    </div>
                </div>
            </section>

        </Layout>
    );
}

export default Matterials;

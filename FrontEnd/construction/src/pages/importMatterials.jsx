import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalImportMatterials from '../modal/matterials/modalImportMatterials';
import ModalAddMatterials from '../modal/matterials/modalAddMatterials';
import Cookies from 'js-cookie'
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { getAPI, deleteAPI } from '../utility/api';
import ModalUpdateImportMatterial from '../modal/matterials/modalUpdateImportMatterial';
const ImportMatterials = () => {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [id, setID] = useState(null);
    const [searchParams, setSearchParams] = useState({
        limit: 3,
        query: '',
        loaivatlieu: '',
        donvitinh: '',
        khoiluongdung: '',
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

    const { data, isLoading } = useQuery(['import', searchParams.page, searchParams.limit], () => getAPI('/api/importMatterial', searchParams))
    const total_page = data?.importReceipt ? Number(data.importReceipt.last_page) : 1;
    const from = data?.importReceipt ? Number(data.importReceipt.from) : 1;
    const to = data?.importReceipt ? Number(data.importReceipt.to) : 3
    const total_item = data?.importReceipt ? Number(data.importReceipt.total) : 3
    const mutationSearch = useMutation((searchParams) => getAPI('/api/importMatterial', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['import', searchParams.page, searchParams.limit], () => {
                return { ...dataSearch }
            });
        }
    });
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredData = data?.importReceipt?.data?.filter(project => {
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
    const mutationDelete = useMutation((id) => deleteAPI(`/api/importMatterial/${id}`), {
        onSuccess: () => {
            toast.success("Xóa phiếu nhập thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries(['import', searchParams.page, searchParams.limit])
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
                            <li className="breadcrumb-item active" aria-current="page">Thông tin vật liệu</li>
                        </ol>
                    </nav>

                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="query" className='form-label'>Từ khóa</label>
                                <input onChange={handleInputChange} name='query' type="text" className='form-control' placeholder='Nhập từ khóa tìm kiếm...' />
                            </div>
                            <div className='d-flex justify-content-between w-100'>

                                <div className='mb-3 w-50 me-3'>
                                    <label htmlFor="ngaynhap" className='form-label'>Ngày nhập</label>
                                    <input onChange={handleInputChange} name='ngaynhap' type="date" className='form-control' />
                                </div>
                                <div className='mb-3 w-50'>
                                    <label htmlFor="nhathau_id" className='form-label'>Nhà thầu</label>
                                    <select onChange={handleInputChange} name="donvitinh" id="" className='form-select' >
                                        <option value="">Chọn nhà thầu</option>
                                        {data?.contractor?.map((item, index) => (
                                            <option key={index} value={item.nhathau_id}>{item.tennhathau}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='d-flex justify-content-between w-100'>

                                <div className='mb-3 me-3 w-50 '>
                                    <label htmlFor="soluongdung" className='form-label'>Khối lượng dựng</label>
                                    <input onChange={handleInputChange} name='soluongdung' type="input" className='form-control' placeholder='Nhập khối lượng dựng...' />
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
                                    <label htmlFor="loaivatlieu" className='form-label'>Loại vật liệu</label>
                                    <select onChange={handleInputChange} name="loaivatlieu" id="" className='form-select' >
                                        <option value="">Chọn loại vật liệu</option>
                                        {data && data.matterial_types && data.matterial_types.map((item, index) => (
                                            <option key={index} value={item.ten_loaivatlieu}>{item.ten_loaivatlieu}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='me-3 w-50'>
                                    <label htmlFor="thanhtien" className='form-label'>Số tiền</label>
                                    <select onChange={handleInputChange} name="thanhtien" id="" className='form-select'>
                                        <option value="">Tìm theo số tiền nhập</option>
                                        <option value="500">500000</option>
                                        <option value="500-1000">500000 - 1000000</option>
                                        <option value="1000">trên 1000000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row " >
                        <div className="col d-flex justify-content-end">
                            <div >
                                <button onClick={handleSearch} className='btn btn-success'><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
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
                        <div className='w-100 text-end'>
                            <button className='btn btn-primary me-3' onClick={handleAddMatterials} data-bs-toggle="modal" data-bs-target="#modalMatterials">Thêm mới vật liệu</button>
                            <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal"   >Nhập vât liệu</button>
                        </div>

                        <table className='table table-striped my-3' id="materialTable" style={{ minWidth: '100vh' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Người tạo phiếu</th>
                                    <th className='text-start'>Chi tiết nhập</th>
                                    <th>Ghi chú</th>
                                    <th>Ngày tạo phiếu</th>

                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={6}>Loading ...</td></tr>
                                ) : (
                                    mutationSearch.isLoading ? (
                                        <tr><td colSpan={6}>Searching ...</td></tr>
                                    ) : (
                                        filteredData?.map((item) => (
                                            <tr key={item.id}>
                                                <td >{item.id}</td>
                                                <td >{item.hoten}</td>
                                                <td className='text-start' style={{ fontSize: '20px' }}>
                                                    <table className='table table-striped'>
                                                        <thead>
                                                            <tr>
                                                                <th>Tên vật liệu</th>
                                                                <th>Mã vật liệu</th>
                                                                <th>Khối lượng dựng</th>
                                                                <th>Loại vật liệu</th>
                                                                <th>Đơn vị tính</th>
                                                                <th>Đơn giá</th>
                                                                <th>Thành tiền</th>
                                                                <th>Nhà thầu</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.tenvatlieu && item.tenvatlieu.split(',').map((ten, index) => (
                                                                <tr key={index}>
                                                                    <td>{ten.trim()}</td>
                                                                    <td>{item.mavatlieu && item.mavatlieu.split(',')[index].trim()}</td>
                                                                    <td>{item.khoiluongdung && item.khoiluongdung.split(',')[index].trim()}</td>
                                                                    <td>{item.loaivatlieu && item.loaivatlieu.split(',')[index].trim()}</td>
                                                                    <td>{item.donvitinh && item.donvitinh.split(',')[index].trim()}</td>
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
                                                        <Link data-bs-toggle="modal" data-bs-target="#modalUpdateImportReceipt" className='btn btn-primary me-3' onClick={() => handleUpdateReceipt(item.id)} style={{ textDecoration: 'none', color: 'white' }}><i className="fa-solid fa-pen-to-square"></i></Link>
                                                        <button onClick={() => handleDelete(item.id)} className='btn btn-danger me-3' ><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
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
                        <ModalUpdateImportMatterial data={{ AllImport: data && data.importReceipt ? data.importReceipt.data : [], allContractors: data && data.contractor ? data.contractor : [], id }} />
                        <ModalImportMatterials />

                    </div>
                </div>
            </section>

        </Layout>
    );
}

export default ImportMatterials;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const ModalAddStatePayment = (props) => {
    const queryClient = useQueryClient();
    const { projects, customers, contracts, state_projects } = props.data
    const [rows, setRows] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [statePayment, setStatePayment] = useState({
        duan_id: '',
        hopdong_id: '',
        giaidoan_duan_id: '',
        khachhang_id: '',
        dot_thanhtoan: '',
        /* nguoitao: user[0]?.hoten, */
    });
    
    const addRow = () => {
        const newRow = {
            STT: rows.length + 1,
            noidung: '',
            cachtinh: '',
            donvi: '',
            giatrisauthue: '',
            ghichu: ''
        };
        setRows([...rows, newRow]);
    };
    function handleSetState(e) {
        setStatePayment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;
        setRows(updatedRows);
    };

    const deleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };

    const mutation = useMutation((combinedData) => postAPI('/api/paymentStates', combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('state_payments')
            setStatePayment({ duan_id: '', hopdong_id: '', khachhang_id: '', giaidoan_duan_id: '', dot_thanhtoan: '', });
            setRows([])
            toast.success("Thêm phiếu thuê thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    const logData = () => {
        const combinedData = {
            detailStatePayment: [...rows],
            statePayment: { ...statePayment }
        };
        mutation.mutate(combinedData)
        console.log(combinedData);
    };

    const handleCloseModal = () => {
        setStatePayment({ duan_id: '', hopdong_id: '', giaidoan_duan_id: '', khachhang_id: '', dot_thanhtoan: '', });
        setRows([]);
    };

    return (
        <div className={`modal fade `} id="modalAddStatePayment" >
            <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: '1500px' }}>
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '100vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Thanh lý theo đợt </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid m-0">

                                <div className="row ">

                                    <div className='w-100 text-end mb-3'>
                                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>
                                    </div>
                                    <div className="d-flex ">
                                        <div className=" w-25">
                                            <label htmlFor="duan_id" className='form-label'>Danh sách dự án</label>
                                            <select name="duan_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn dự án---</option>
                                                {projects?.map((project, index) => (
                                                    <option key={index} value={project.id}>{project.tenduan}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 ms-3">
                                            <label htmlFor="hopdong_id" className='form-label'>Danh sách hợp đồng</label>
                                            <select name="hopdong_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn hợp đồng---</option>
                                                {contracts?.map((contract, index) => (
                                                    <option key={index} value={contract.hopdong_id}>{contract.tenhopdong}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 mx-3">
                                            <label htmlFor="giaidoan_duan_id" className='form-label'>Danh sách giai đoạn dự án</label>
                                            <select name="giaidoan_duan_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn giai đoạn dự án---</option>
                                                {state_projects?.map((state, index) => (
                                                    <option key={index} value={state.id}>{state.giaidoan}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className=" w-25">
                                            <label htmlFor="khachhang_id" className='form-label'>Danh sách khách hàng</label>
                                            <select name="khachhang_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn khách hàng---</option>
                                                {customers?.map((customer, index) => (
                                                    <option key={index} value={customer.khachhang_id}>{customer.hoten}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 mx-3">
                                            <label htmlFor="dot_thanhtoan" className='form-label'>Đợt thanh toán</label>
                                            <input onChange={handleSetState} type="text" className='form-control' name='dot_thanhtoan' placeholder='nhập đợt thanh toán...' />
                                        </div>

                                    </div>
                                    <table className='table table-striped my-3' id="materialTable">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th style={{ width: '50%' }}>Nội dung</th>
                                                <th>Cách tính</th>
                                                <th className=''>Đơn vị</th>
                                                <th className=''>Giá trị sau thuế</th>

                                                <th>Ghi chú</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                rows.map((row, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>{row.STT}</td>
                                                            <td><input className='form-control' type="text" value={row.noidung} onChange={(e) => handleInputChange(e, index, 'noidung')} /></td>
                                                            <td><input className='form-control' type="text" value={row.cachtinh} onChange={(e) => handleInputChange(e, index, 'cachtinh')} /></td>

                                                            <td><input className='form-control' type="text" value={row.donvi} onChange={(e) => handleInputChange(e, index, 'donvi')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.giatrisauthue} onChange={(e) => handleInputChange(e, index, 'giatrisauthue')} /></td>
                                                            <td><input className='form-control' type="text" value={row.ghichu} onChange={(e) => handleInputChange(e, index, 'ghichu')} /></td>

                                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index)}><i className="fa-solid fa-trash"></i></button></td>
                                                        </tr>


                                                    </React.Fragment>

                                                ))
                                            }
                                        </tbody>
                                    </table>


                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleCloseModal} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={logData}>Tạo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddStatePayment;

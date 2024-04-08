import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI, putAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const ModalUpdateStatePayment = (props) => {
    const queryClient = useQueryClient();
    const { projects, customers, contracts, state_projects, idStatePayment, detailStatePayments, statePayments } = props.data
    const initialRows = detailStatePayments && detailStatePayments.filter(detail => detail.thanhtoan_tungdot_id === parseInt(idStatePayment));
    const initialState = statePayments.find(state => state.id === parseInt(idStatePayment));
    const [rows, setRows] = useState([]);
    const [new_row, setNewRow] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [statePayment, setStatePayment] = useState({
        duan_id: '',
        hopdong_id: '',
        giaidoan_duan_id: '',
        khachhang_id: '',
        dot_thanhtoan: '',
       /*  nguoitao: user[0]?.hoten, */
    });
    useEffect(() => {
        if (initialState) {
            setStatePayment({
                duan_id: initialState.duan_id,
                hopdong_id: initialState.hopdong_id,
                giaidoan_duan_id: initialState.giaidoan_duan_id,
                khachhang_id: initialState.khachhang_id,
                dot_thanhtoan: initialState.dot_thanhtoan,
                /* nguoitao: initialState.nguoitao, */
            });

        }
        if (detailStatePayments && detailStatePayments.length > 0) {
            setRows(initialRows);
        }
    }, [idStatePayment]);

    const addRow = () => {
        const newRow = {
            STT: rows.length + 1,
            noidung: '',
            cachtinh: '',
            donvi: '',
            giatrisauthue: '',
            ghichu: ''
        };
        setNewRow([...new_row, newRow]);
    };
    function handleSetState(e) {
        setStatePayment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleInputChange = (event, index, field, type) => {
        const updatedRows = type === 'old' ? [...rows] : [...new_row];
        updatedRows[index][field] = event.target.value;
        if (type === 'old') {
            setRows(updatedRows);
        } else {
            setNewRow(updatedRows);
        }
    };

    const deleteRow = (index, check) => {
        if (check === 'old') {

            const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
            setRows(updatedRows);
        }
        else {
            const updatedRows = new_row.filter((row, rowIndex) => rowIndex !== index);
            setNewRow(updatedRows);
        }
    };

    const mutation = useMutation((combinedData) => putAPI(`/api/paymentStates/${idStatePayment}`, combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('state_payments')
            if (initialRows && initialRows.length > 0) {
                setRows(initialRows);
            } else {
                setRows([]);
            }
            toast.success("Thêm phiếu thanh toán thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    const logData = () => {
        const combinedData = {
            detailStatePayment: [...rows],
            new_detailStatePayment: [...new_row],
            statePayment: { ...statePayment }
        };

        mutation.mutate(combinedData)

        console.log(combinedData);
    };

    const handleCloseModal = () => {
        
        if (initialRows && initialRows.length > 0) {
            setRows(initialRows);
        } else {
            setRows([]);
        }
        setStatePayment({
            duan_id: initialState.duan_id,
            hopdong_id: initialState.hopdong_id,
            giaidoan_duan_id: initialState.giaidoan_duan_id,
            khachhang_id: initialState.khachhang_id,
            dot_thanhtoan: initialState.dot_thanhtoan,
           /*  nguoitao: initialState.nguoitao, */
        });
        setNewRow([]);
    };

    return (
        <div className={`modal fade `} id="modalUpdateStatePayment" >
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
                                            <select value={statePayment.duan_id} name="duan_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn dự án---</option>
                                                {projects?.map((project, index) => (
                                                    <option key={index} value={project.id}>{project.tenduan}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 ms-3">
                                            <label htmlFor="hopdong_id" className='form-label'>Danh sách hợp đồng</label>
                                            <select value={statePayment.hopdong_id} name="hopdong_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn hợp đồng---</option>
                                                {contracts?.map((contract, index) => (
                                                    <option key={index} value={contract.hopdong_id}>{contract.tenhopdong}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 mx-3">
                                            <label htmlFor="giaidoan_duan_id" className='form-label'>Danh sách giai đoạn dự án</label>
                                            <select value={statePayment.giaidoan_duan_id} name="giaidoan_duan_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn giai đoạn dự án---</option>
                                                {state_projects?.map((state, index) => (
                                                    <option key={index} value={state.id}>{state.giaidoan}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className=" w-25">
                                            <label htmlFor="khachhang_id" className='form-label'>Danh sách khách hàng</label>
                                            <select value={statePayment.khachhang_id} name="khachhang_id" onChange={handleSetState} className='form-select text-center'>
                                                <option value="">---Chọn khách hàng---</option>
                                                {customers?.map((customer, index) => (
                                                    <option key={index} value={customer.khachhang_id}>{customer.hoten}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className=" w-25 mx-3">
                                            <label htmlFor="dot_thanhtoan" className='form-label'>Đợt thanh toán</label>
                                            <input value={statePayment.dot_thanhtoan} onChange={handleSetState} type="text" className='form-control' name='dot_thanhtoan' placeholder='nhập đợt thanh toán...' />
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
                                                            <td><input className='form-control' type="text" value={row.noidung} onChange={(e) => handleInputChange(e, index, 'noidung', 'old')} /></td>
                                                            <td><input className='form-control' type="text" value={row.cachtinh} onChange={(e) => handleInputChange(e, index, 'cachtinh', 'old')} /></td>

                                                            <td><input className='form-control' type="text" value={row.donvi} onChange={(e) => handleInputChange(e, index, 'donvi', 'old')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.giatrisauthue} onChange={(e) => handleInputChange(e, index, 'giatrisauthue', 'old')} /></td>
                                                            <td><input className='form-control' type="text" value={row.ghichu} onChange={(e) => handleInputChange(e, index, 'ghichu', 'old')} /></td>

                                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index, 'old')}><i className="fa-solid fa-trash"></i></button></td>
                                                        </tr>


                                                    </React.Fragment>

                                                ))
                                            }
                                            {
                                                new_row.map((newRow, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td>{newRow.STT}</td>
                                                            <td><input className='form-control' type="text" value={newRow.noidung} onChange={(e) => handleInputChange(e, index, 'noidung', 'mew')} /></td>
                                                            <td><input className='form-control' type="text" value={newRow.cachtinh} onChange={(e) => handleInputChange(e, index, 'cachtinh', 'mew')} /></td>

                                                            <td><input className='form-control' type="text" value={newRow.donvi} onChange={(e) => handleInputChange(e, index, 'donvi', 'mew')} /></td>
                                                            <td><input className='form-control ' type="text" value={newRow.giatrisauthue} onChange={(e) => handleInputChange(e, index, 'giatrisauthue', 'mew')} /></td>
                                                            <td><input className='form-control' type="text" value={newRow.ghichu} onChange={(e) => handleInputChange(e, index, 'ghichu', 'mew')} /></td>

                                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index, 'new')}><i className="fa-solid fa-trash"></i></button></td>
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
                            <button type="button" className="btn btn-primary" onClick={logData}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateStatePayment;

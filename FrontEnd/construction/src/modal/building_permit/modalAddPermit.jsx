import React, { useState } from 'react';
import axios from 'axios';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
const ModalAddPermit = (props) => {
    const { allCustomers } = props.data
    const [formData, setFormData] = useState({
        khachhang_id: '',
        congtrinh_xaydung: '',
        noidung: '',
        capngay: '',
        thoihan: '',
        thoigian_giahan: '',
        lydo_giahan: '',
        error_list: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addStaff = async () => {
        try {
            const response = await http.post('/api/buildingPermit', formData);

        } catch (error) {
            throw new Error(error);
        }
    };
    const queryClient = useQueryClient()
    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Thêm giấy phép xây dựng cho khách hàng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('building_permit');
        },
    });
    const handleSubmit = () => {
        mutation.mutate();
    };
    return (
        <div className="modal fade" id="modalAddPermit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Thêm nhân viên</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="khachhang_id" className='form-label'>Danh sách khách hàng</label>
                                <select onChange={(e) => handleChange(e)} name="khachhang_id" id="" className='form-select'>
                                    <option value="">Tìm khách hàng</option>
                                    {allCustomers.map((item, index) => (
                                        <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="congtrinh_xaydung" className='form-label'>Tên công trình</label>
                                <input type="text" name='congtrinh_xaydung' className='form-control' value={formData.congtrinh_xaydung} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="noidung" className='form-label'>Nội dung giấy phép</label>
                                <input type="text" name="noidung" className='form-control' value={formData.noidung} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="capngay" className='form-label'>Ngày cấp giấy phép</label>
                                <input type="date" name='capngay' className='form-control' value={formData.capngay} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="thoihan" className='form-label'>Thời hạn giấy phép</label>
                                <input type="date" name="thoihan" className='form-control' value={formData.thoihan} onChange={handleChange} />
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="thoigian_giahan" className='form-label'>Thời gian gia hạn( có thể bỏ trống)</label>
                                    <input type="date" name='thoigian_giahan' className='form-control' value={formData.thoigian_giahan} onChange={handleChange} />
                                </div>
                                <div className="w-50">
                                    <label htmlFor="lydo_giahan" className='form-label'>Lý do gia hạn</label>
                                    <input type="text" name='lydo_giahan' className='form-control' value={formData.lydo_giahan} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className={`btn btn-primary `} disabled={`${mutation.isLoading ? 'disabled' : ''}`} onClick={handleSubmit}>
                                {mutation.isLoading ? 'Đang thêm...' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddPermit;

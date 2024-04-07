import React, { useState } from 'react';
import axios from 'axios';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
const ModalAddStaff = () => {
    const [formData, setFormData] = useState({
        hoten: '',
        email: '',
        sdt: '',
        diachi: '',
        ngaysinh: '',
        gioitinh: '',
        chucvu: '',
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
            const response = await http.post('/api/staff', formData);
            
        } catch (error) {
            throw new Error(error);
        }
    };
    const queryClient = useQueryClient()
    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Thêm nhân viên thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('staffs');
        },
    });
    const handleSubmit = () => {
        mutation.mutate();
    };
    return (
        <div className="modal fade" id="modalStaff">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Thêm nhân viên</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="hoten" className='form-label'>Họ và tên</label>
                                <input type="text" name="hoten" className='form-control' placeholder='Nhập họ tên...' value={formData.hoten} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className='form-label'>Email</label>
                                <input type="text" name='email' className='form-control' placeholder='Nhập email...' value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sdt" className='form-label'>Số điện thoại</label>
                                <input type="text" name="sdt" className='form-control' placeholder='Nhập số điện thoại...' value={formData.sdt} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="diachi" className='form-label'>Địa chỉ</label>
                                <input type="text" name='diachi' className='form-control' placeholder='Nhập địa chỉ...' value={formData.diachi} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                <input type="date" name="ngaysinh" className='form-control' value={formData.ngaysinh} onChange={handleChange} />
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                    <select name="gioitinh" className='form-control' value={formData.gioitinh} onChange={handleChange}>
                                        <option value="">Chọn giới tính</option>
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                                <div className="w-50">
                                    <label htmlFor="chucvu" className='form-label'>Chức vụ</label>
                                    <select name="chucvu" className='form-control' value={formData.chucvu} onChange={handleChange}>
                                        <option value="">Chọn chức vụ</option>
                                        <option value="worker">Công nhân thi công</option>
                                        <option value="project manager">Quản lý dự án</option>
                                        <option value="construction manager">Quản lý thi công</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className={`btn btn-primary `} disabled = {`${mutation.isLoading ? 'disabled' : ''}`} onClick={handleSubmit}>
                                {mutation.isLoading ? 'Đang thêm...' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddStaff;

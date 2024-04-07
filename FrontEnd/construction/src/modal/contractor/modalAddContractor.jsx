import React, { useState } from 'react';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
const ModalAddContractor = () => {
    const [formData, setFormData] = useState({
        tennhathau: '',
        email: '',
        sdt: '',
        diachi: '',
        loaihinhhoatdong: '',
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
            const response = await http.post('/api/contractor', formData);

        } catch (error) {
            throw new Error(error);
        }
    };
    const queryClient = useQueryClient()
    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Thêm nhà thầu thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contractors');
        },
    });
    const handleSubmit = () => {
        mutation.mutate();
    };
    return (
        <div className="modal fade" id="modalAddContractor">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Thêm nhà thầu</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="tennhathau" className='form-label'>Tên nhà thầu</label>
                                <input type="text" name="tennhathau" className='form-control' placeholder='Nhập họ tên...' value={formData.hoten} onChange={handleChange} />
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
                                <label htmlFor="loaihinhhoatdong" className='form-label'>Loại hình hoạt động</label>
                                <input type="text" name="loaihinhhoatdong" className='form-control' value={formData.loaihinhhoatdong} onChange={handleChange} />
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

export default ModalAddContractor;

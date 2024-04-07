import React, { useState } from 'react';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const ModalAddCustomer = ({check}) => {
    const [formData, setFormData] = useState({
        hoten: '',
        sdt: '',
        email: '',
        ngaysinh: '',
        diachi: '',
        gioitinh: 0,
        loaikhachhang: '',
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
            const response = await http.post('/api/customer', formData);

        } catch (error) {
            throw new Error(error);
        }
    };
    const queryClient = useQueryClient()
    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Thêm khách hàng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('customers');
            queryClient.invalidateQueries('contracts');
        },
    });
    const handleSubmit = () => {
        mutation.mutate();
    };
    return (
        <div className="modal fade" id="modalAddCustomer" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Thêm khách hàng</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="hoten" className='form-label'>Tên khách hàng</label>
                                <input type="text" name="hoten" className='form-control' placeholder='Nhập họ tên...' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className='form-label'>Email</label>
                                <input type="text" name='email' className='form-control' placeholder='Nhập email...' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sdt" className='form-label'>Số điện thoại</label>
                                <input type="text" name="sdt" className='form-control' placeholder='Nhập số điện thoại...' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="diachi" className='form-label'>Địa chỉ</label>
                                <input type="text" name='diachi' className='form-control' placeholder='Nhập địa chỉ...' onChange={handleChange} />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                    <input onChange={handleChange} name='ngaysinh' type="date" className='form-control ' />
                                </div>
                                <div className='w-50'>
                                    <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                    <select onChange={handleChange} name="gioitinh" className='form-select' id="">
                                        <option value="">Chọn giới tính</option>
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loaikhachhang" className='form-label'>Loại khách hàng</label>
                                <input type="text" name="loaikhachhang" className='form-control' onChange={handleChange} />
                            </div>

                        </div>
                        <div className="modal-footer">
                            
                            {check ? <button type="button" data-bs-toggle="modal" data-bs-target="#modalAddContract" className="btn btn-secondary" data-bs-dismiss="modal">Quay lại</button>: <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>}
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

export default ModalAddCustomer;

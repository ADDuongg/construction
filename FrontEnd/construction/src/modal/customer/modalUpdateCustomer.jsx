import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateCustomer = (props) => {
    const { allCustomers, id } = props.data;
    const customerById = allCustomers.find((staff) => staff.khachhang_id === id) || {};
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        hoten: customerById.hoten || '',
        email: customerById.email || '',
        sdt: customerById.sdt || '',
        diachi: customerById.diachi || '',
        ngaysinh:customerById.ngaysinh || '',
        gioitinh: customerById.gioitinh || '',
        loaikhachhang: customerById.loaikhachhang || '',
        _method: 'PUT',
    });
    
    const mutation = useMutation(() => putAPI(`/api/customer/${customerById.khachhang_id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin khách hàng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('customers');
        },
    });
    function handleUpdate() {
        console.log(customerById);
        mutation.mutate();
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    useEffect(() => {
        setFormData({
            hoten: customerById.hoten || '',
            email: customerById.email || '',
            sdt: customerById.sdt || '',
            diachi: customerById.diachi || '',
            ngaysinh:customerById.ngaysinh || '',
            gioitinh: customerById.gioitinh || '',
            loaikhachhang: customerById.loaikhachhang,
            _method: 'PUT',
        });
    }, [id]);
    return (
        <div className="modal fade" id="modalUpdateCustomer">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '80vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa nhà thầu</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="hoten" className='form-label'>Tên khách hàng</label>
                                <input type="text" name="hoten" className='form-control' placeholder='Nhập họ tên...' value={formData.hoten} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className='form-label'>Email</label>
                                <input type="text" name='email' className='form-control' placeholder='Nhập email...' value={formData.email} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sdt" className='form-label'>Số điện thoại</label>
                                <input type="text" name="sdt" className='form-control' placeholder='Nhập số điện thoại...' value={formData.sdt} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="diachi" className='form-label'>Địa chỉ</label>
                                <input type="text" name='diachi' className='form-control' placeholder='Nhập địa chỉ...' value={formData.diachi} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='me-3 w-50'>
                                    <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                    <input value={formData.ngaysinh} onChange={(e) => handleChange(e)} name='ngaysinh' type="date" className='form-control ' />
                                </div>
                                <div className="w-50 ">
                                    <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                    <select name="gioitinh" className='form-control' value={formData.gioitinh} onChange={(e) => handleChange(e)}>
                                        <option value="">Chọn giới tính</option>
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="loaikhachhang" className='form-label'>Loại hình hoạt động</label>
                                    <input type="text" name='loaikhachhang' className='form-control' value={formData.loaikhachhang} onChange={(e) => handleChange(e)} />

                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button onClick={handleUpdate} type="button" disabled={`${mutation.isLoading ? 'disabled' : ''}`} className={`btn btn-primary `} >
                                {mutation.isLoading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateCustomer;

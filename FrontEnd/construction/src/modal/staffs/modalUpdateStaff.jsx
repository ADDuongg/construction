import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';
const ModalUpdateStaff = (props) => {
    const { allStaff, id } = props.data;
    const staffById = allStaff.find((staff) => staff.nhanvien_id === id) || {};
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        hoten: staffById.hoten || '',
        email: staffById.email || '',
        sdt: staffById.sdt || '',
        diachi: staffById.diachi || '',
        ngaysinh: staffById.ngaysinh || '',
        gioitinh: staffById.gioitinh || '',
        chucvu: staffById.chucvu || '',
        _method: 'PUT',
    });

    const mutation = useMutation(() => putAPI(`/api/staff/${staffById.nhanvien_id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin nhân viên thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('staffs');
        },
    });
    function handleUpdate() {
        
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
            hoten: staffById.hoten || '',
            email: staffById.email || '',
            sdt: staffById.sdt || '',
            diachi: staffById.diachi || '',
            ngaysinh: staffById.ngaysinh || '',
            gioitinh: staffById.gioitinh,
            chucvu: staffById.chucvu || '',
            _method: 'PUT',
        });
    }, [id]);
    return (
        <div className="modal fade" id="modalUpdateStaff">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa nhân viên</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="hoten" className='form-label'>Họ và tên</label>
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
                            <div className="mb-3">
                                <label htmlFor="ngaysinh" className='form-label'>Ngày sinh</label>
                                <input type="date" name="ngaysinh" className='form-control' value={formData.ngaysinh} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="gioitinh" className='form-label'>Giới tính</label>
                                    <select name="gioitinh" className='form-control' value={formData.gioitinh} onChange={(e) => handleChange(e)}>
                                        <option value="">Chọn giới tính</option>
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                                <div className="w-50">
                                    <label htmlFor="chucvu" className='form-label'>Chức vụ</label>
                                    <select name="chucvu" className='form-control' value={formData.chucvu} onChange={(e) => handleChange(e)}>
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

export default ModalUpdateStaff;

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateContractor = (props) => {
    const { allContractors, id } = props.data;
    const contractorById = allContractors.find((staff) => staff.nhathau_id === id) || {};
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        tennhathau: contractorById.tennhathau || '',
        email: contractorById.email || '',
        sdt: contractorById.sdt || '',
        diachi: contractorById.diachi || '',

        loaihinhhoatdong: contractorById.loaihinhhoatdong || '',
        _method: 'PUT',
    });

    const mutation = useMutation(() => putAPI(`/api/contractor/${contractorById.nhathau_id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin nhà thầu thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contractors');
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
            tennhathau: contractorById.tennhathau || '',
            email: contractorById.email || '',
            sdt: contractorById.sdt || '',
            diachi: contractorById.diachi || '',

            loaihinhhoatdong: contractorById.loaihinhhoatdong,

            _method: 'PUT',
        });
    }, [id]);
    return (
        <div className="modal fade" id="modalUpdateContractor">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa nhà thầu</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="tennhathau" className='form-label'>Tên nhà thầu</label>
                                <input type="text" name="tennhathau" className='form-control' placeholder='Nhập họ tên...' value={formData.tennhathau} onChange={(e) => handleChange(e)} />
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

                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="loaihinhhoatdong" className='form-label'>Loại hình hoạt động</label>
                                    <input type="text" name='loaihinhhoatdong' className='form-control'  value={formData.loaihinhhoatdong} onChange={(e) => handleChange(e)} />

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

export default ModalUpdateContractor;

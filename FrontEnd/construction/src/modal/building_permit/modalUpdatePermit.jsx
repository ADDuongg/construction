import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';
const ModalUpdatePermit = (props) => {
    const { allPermit, id, allCustomers } = props.data;
    const permitById = allPermit.find((permit) => permit.id === parseInt(id)) || {};
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        congtrinh_xaydung: permitById.congtrinh_xaydung || '',
        khachhang_id: permitById.khachhang_id || '',
        capngay: permitById.capngay || '',
        noidung: permitById.noidung || '',
        thoihan: permitById.thoihan || '',
        thoigian_giahan: permitById.thoigian_giahan || '',
        lydo_giahan: permitById.lydo_giahan || '',
        _method: 'PUT',
    });

    const mutation = useMutation(() => putAPI(`/api/buildingPermit/${permitById.id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin nhân viên thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('building_permit');
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
            congtrinh_xaydung: permitById.congtrinh_xaydung || '',
            khachhang_id: permitById.khachhang_id || '',
            capngay: permitById.capngay || '',
            noidung: permitById.noidung || '',
            thoihan: permitById.thoihan || '',
            thoigian_giahan: permitById.thoigian_giahan,
            lydo_giahan: permitById.lydo_giahan || '',
            _method: 'PUT',
        });
    }, [id]);
    return (
        <div className="modal fade" id="modalUpdatePermit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa giấy phép xây dựng</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label htmlFor="khachhang_id" className='form-label'>Danh sách khách hàng</label>
                                <select value={formData.khachhang_id} onChange={(e) => handleChange(e)} name="khachhang_id" id="" className='form-select'>
                                    <option value="">Tìm khách hàng</option>
                                    {allCustomers.map((item, index) => (
                                        <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="congtrinh_xaydung" className='form-label'>Tên công trình</label>
                                <input value={formData.congtrinh_xaydung} type="text" name='congtrinh_xaydung' className='form-control'  onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="noidung" className='form-label'>Nội dung giấy phép</label>
                                <input value={formData.noidung} type="text" name="noidung" className='form-control' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="capngay" className='form-label'>Ngày cấp giấy phép</label>
                                <input value={formData.capngay} type="date" name='capngay' className='form-control' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="thoihan" className='form-label'>Thời hạn giấy phép</label>
                                <input value={formData.thoihan} type="date" name="thoihan" className='form-control'  onChange={handleChange} />
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="thoigian_giahan" className='form-label'>Thời gian gia hạn( có thể bỏ trống)</label>
                                    <input value={formData.thoigian_giahan} type="date" name='thoigian_giahan' className='form-control'  onChange={handleChange} />
                                </div>
                                <div className="w-50">
                                    <label htmlFor="lydo_giahan" className='form-label'>Lý do gia hạn</label>
                                    <input value={formData.lydo_giahan} type="text" name='lydo_giahan' className='form-control'  onChange={handleChange} />
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

export default ModalUpdatePermit;

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateContract = (props) => {
    const { allContracts, id, Allcustomers } = props.data;
    const contractorById = allContracts.find((staff) => staff.hopdong_id === id) || {};
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        tenhopdong: contractorById.tenhopdong || '',
        ghichu: contractorById.ghichu || '',
        ngaybatdau: contractorById.ngaybatdau || '',
        ngayketthuc: contractorById.ngayketthuc || '',
        ngaydaohan: contractorById.ngaydaohan || '',
        loaihopdong: contractorById.loaihopdong || '',
        khachhang_id: contractorById.khachhang_id || '',
        conlai: contractorById.conlai || '',
        phitrehan: contractorById.phitrehan || '',
        tamung: contractorById.tamung || '',
        giatrihopdong: contractorById.giatrihopdong || '',
        ngayky: contractorById.ngayky || '',
        _method: 'PUT',
    });

    const mutation = useMutation(() => putAPI(`/api/contract/${contractorById.hopdong_id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin hợp đồng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contracts');
        },
    });
    function handleUpdate() {
        if (formData.ngaydaohan && formData.ngayketthuc && new Date(formData.ngaydaohan) <= new Date(formData.ngayketthuc)) {
           
            toast.error("Ngày đáo hạn phải lớn hơn ngày kết thúc", {
                position: "top-right",
                autoClose: 2000
            });
        } else {
           
            mutation.mutate();
        }
       
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
            tenhopdong: contractorById.tenhopdong || '',
            ghichu: contractorById.ghichu || '',
            ngaybatdau: contractorById.ngaybatdau || '',
            ngayketthuc: contractorById.ngayketthuc || '',
            ngaydaohan: contractorById.ngaydaohan || '',
            loaihopdong: contractorById.loaihopdong || '',
            khachhang_id: contractorById.khachhang_id || '',
            conlai: contractorById.conlai || '',
            phitrehan: contractorById.phitrehan || '',
            tamung: contractorById.tamung || '',
            giatrihopdong: contractorById.giatrihopdong || '',
            ngayky: contractorById.ngayky || '',
            _method: 'PUT',
        });
    }, [id]);
    return (
        <div className="modal fade" id="modalUpdateContract">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa thông tin hợp đồng</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body py-2 px-4">
                            <div className="mb-3">
                                <label htmlFor="tenhopdong" className='form-label'>Tên hợp đồng</label>
                                <input type="text" name="tenhopdong" className='form-control' placeholder='Nhập tên hợp đồng...' value={formData.tenhopdong} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ngayky" className='form-label'>Ngày ký</label>
                                <input type="date" name="ngayky" className='form-control' value={formData.ngayky} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="giatrihopdong" className='form-label'>Giá trị hợp đồng</label>
                                <input type="text" name="giatrihopdong" className='form-control' placeholder='Nhập giá trị hợp đồng...' value={formData.giatrihopdong} onChange={handleChange} />
                            </div>
                            <div className="d-flex">
                                <div className="mb-3 w-50 me-3">
                                    <label htmlFor="tamung" className='form-label'>Tạm ứng</label>
                                    <input type="text" name="tamung" className='form-control' placeholder='Nhập số tiền tạm ứng...' value={formData.tamung} onChange={handleChange} />
                                </div>
                                <div className="mb-3 w-50">
                                    <label htmlFor="conlai" className='form-label'>Còn lại</label>
                                    <input type="text" name="conlai" className='form-control' placeholder='Nhập số tiền còn lại...' value={formData.conlai} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="mb-3 ">
                                    <label htmlFor="phitrehan" className='form-label'>Phí trễ hạn</label>
                                    <input type="text" name="phitrehan" className='form-control' placeholder='Nhập số tiền trễ hạn...' onChange={handleChange} />
                                </div>
                            <div className="d-flex mb-3 align-items-end justify-content-between">
                                <div className=" w-50" >
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng</label>
                                    <select name="khachhang_id" className='form-select' value={formData.khachhang_id} onChange={handleChange}>
                                        <option value="">Chọn khách hàng</option>
                                        {Allcustomers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ghichu" className='form-label'>Ghi chú</label>
                                <textarea name="ghichu" className='form-control' placeholder='Nhập ghi chú...' value={formData.ghichu} onChange={handleChange} />
                            </div>
                            <div className="d-flex mb-3">
                                <div className="w-50 me-3">
                                    <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                    <input type="date"  value={formData.ngaybatdau} name="ngaybatdau" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="w-50">
                                    <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                    <input type="date"  value={formData.ngayketthuc} name="ngayketthuc" className='form-control' onChange={handleChange} />
                                </div>
                            </div>
                            <div className="mb-3">
                                    <label htmlFor="ngaydaohan" className='form-label'>Ngày đáo hạn</label>
                                    <input type="date" name="ngaydaohan" className='form-control' onChange={handleChange} />
                                </div>
                            <div className="mb-3">
                                <label htmlFor="loaihopdong" className='form-label'>Loại hợp đồng</label>
                                <input type="text"  value={formData.loaihopdong} name="loaihopdong" className='form-control' onChange={handleChange} />
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

export default ModalUpdateContract;

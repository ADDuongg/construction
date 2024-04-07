import React, { useState } from 'react';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import ModalAddCustomer from '../customer/modalAddCustomer';

const ModalAddContract = (props) => {
    var { Allcustomers } = props.data || []
    const [formData, setFormData] = useState({
        tenhopdong: '',
        ngayky: '',
        giatrihopdong: '',
        tamung: '',
        conlai: '',
        khachhang_id: '',
        ghichu: '',
        ngaybatdau: '',
        ngayketthuc: '',
        ngaydaohan: '',
        phitrehan: '',
        loaihopdong: '',
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
            const response = await http.post('/api/contract', formData);

        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Thêm hợp đồng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contracts');
        },
    });

    const handleSubmit = () => {
        const { tenhopdong, ngayky, giatrihopdong, ghichu, ngaybatdau, ngayketthuc, loaihopdong } = formData;

        if (!tenhopdong || !ngayky || !giatrihopdong || !ghichu || !ngaybatdau || !ngayketthuc || !loaihopdong) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
                position: "top-right",
                autoClose: 2000
            });
        }
        if (!formData.khachhang_id) {
            toast.error("Vui lòng chọn khách hàng", {
                position: "top-right",
                autoClose: 2000
            });
        } else {
            mutation.mutate();
        }
    };


    return (
        <div>
            <div className="modal fade" id="modalAddContract">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Thêm hợp đồng xây dựng</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="tenhopdong" className='form-label'>Tên hợp đồng</label>
                                    <input type="text" name="tenhopdong" className='form-control' placeholder='Nhập tên hợp đồng...' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngayky" className='form-label'>Ngày ký</label>
                                    <input type="date" name="ngayky" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="giatrihopdong" className='form-label'>Giá trị hợp đồng</label>
                                    <input type="text" name="giatrihopdong" className='form-control' placeholder='Nhập giá trị hợp đồng...' onChange={handleChange} />
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="tamung" className='form-label'>Tạm ứng</label>
                                        <input type="text" name="tamung" className='form-control' placeholder='Nhập số tiền tạm ứng...' onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="conlai" className='form-label'>Còn lại</label>
                                        <input type="text" name="conlai" className='form-control' placeholder='Nhập số tiền còn lại...' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="phitrehan" className='form-label'>Phí trễ hạn</label>
                                    <input type="text" name="phitrehan" className='form-control' placeholder='Nhập số tiền trễ hạn...' onChange={handleChange} />
                                </div>
                                <div className="d-flex mb-3 align-items-end justify-content-between">
                                    <div className="mb-3 w-50" >
                                        <label htmlFor="khachhang_id" className='form-label'>Khách hàng</label>
                                        <select name="khachhang_id" className='form-select' onChange={handleChange}>
                                            <option value="">Chọn khách hàng</option>
                                            {Allcustomers.map((item, index) => (
                                                <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="mb-3 d-flex ">
                                        <p className='fw-bold' style={{ fontSize: '15px' }}>Không tìm thấy khách hàng? </p>
                                        <button data-bs-toggle="modal" data-bs-target="#modalAddCustomer" className='btn btn-success ms-2'>Thêm khách hàng</button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="ghichu" className='form-label'>Ghi chú</label>
                                    <textarea name="ghichu" className='form-control' placeholder='Nhập ghi chú...' onChange={handleChange} />
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="w-50 me-3">
                                        <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                        <input type="date" name="ngaybatdau" className='form-control' onChange={handleChange} />
                                    </div>
                                    <div className="w-50">
                                        <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                        <input type="date" name="ngayketthuc" className='form-control' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngaydaohan" className='form-label'>Ngày đáo hạn</label>
                                    <input type="date" name="ngaydaohan" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="loaihopdong" className='form-label'>Loại hợp đồng</label>
                                    <input type="text" name="loaihopdong" className='form-control' onChange={handleChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className={`btn btn-primary ${mutation.isLoading ? 'disabled' : ''}`} disabled={mutation.isLoading ? 'disabled' : ''} onClick={handleSubmit}>
                                    {mutation.isLoading ? 'Đang thêm...' : 'Thêm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddCustomer check={true} />
        </div>
    );
}

export default ModalAddContract;

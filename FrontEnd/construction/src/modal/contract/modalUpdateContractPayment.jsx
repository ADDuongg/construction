import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateContractPayment = (props) => {
    const { allContracts, idContract, allCustomers, allPayment } = props.data;
    const contractPaymentById = allPayment.find((contractPayment) => contractPayment.id === parseInt(idContract)) || {};
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        khachhang_id: contractPaymentById.khachhang_id || '',
        hopdong_id: contractPaymentById.hopdong_id || '',
        giatri_truocthue: contractPaymentById.giatri_truocthue || '',
        vat: contractPaymentById.vat || '',
        giatri_sauthue: contractPaymentById.giatri_sauthue || '',
        ngaythanhtoan: contractPaymentById.ngaythanhtoan || '',
        noidung: contractPaymentById.noidung || '',
        _method: 'PUT',
    });
    console.log(contractPaymentById);
    const mutation = useMutation(() => putAPI(`/api/paymentContracts/${contractPaymentById.id}`, formData), {
        onSuccess: () => {
            toast.success("Cập nhật thông tin hợp đồng thanh toán thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contract_payment');
        },
    });

    function handleUpdate() {
        if (!formData.khachhang_id || !formData.giatri_truocthue || !formData.vat || !formData.giatri_sauthue || !formData.ngaythanhtoan || !formData.noidung) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
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
            khachhang_id: contractPaymentById.khachhang_id || '',
            hopdong_id: contractPaymentById.hopdong_id || '',
            giatri_truocthue: contractPaymentById.giatri_truocthue || '',
            vat: contractPaymentById.vat || '',
            giatri_sauthue: contractPaymentById.giatri_sauthue || '',
            ngaythanhtoan: contractPaymentById.ngaythanhtoan || '',
            noidung: contractPaymentById.noidung || '',
            _method: 'PUT',
        });
    }, [idContract]);

    return (
        <div className="modal fade" id="modalUpdateContractPayment">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <div className='d-flex'><h3>Sửa thông tin hợp đồng thanh toán</h3><h3 className='text-danger'>*</h3></div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body py-2 px-4">
                            <div className="mb-3">
                                <label htmlFor="hopdong_id" className='form-label'>Mã hợp đồng</label>
                                <select value={formData.hopdong_id} onChange={(e) => handleChange(e)} name="hopdong_id" className='form-select'>
                                    <option >Chọn Hợp đồng</option>
                                    {allContracts?.map((item, index) => (
                                        <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="khachhang_id" className='form-label'>Mã khách hàng</label>
                                <select  value={formData.khachhang_id} onChange={(e) => handleChange(e)} name="khachhang_id" id="" className='form-select'>
                                    <option value="">Chọn khách hàng</option>
                                    {allCustomers?.map((item, index) => (
                                        <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="giatri_truocthue" className='form-label'>Giá trị trước thuế</label>
                                <input type="text" name="giatri_truocthue" className='form-control' placeholder='Nhập giá trị trước thuế...' value={formData.giatri_truocthue} onChange={handleChange} />
                            </div>
                            <div className="d-flex">
                                <div className="mb-3 w-50 me-3">
                                    <label htmlFor="vat" className='form-label'>VAT</label>
                                    <input type="text" name="vat" className='form-control' placeholder='Nhập VAT...' value={formData.vat} onChange={handleChange} />
                                </div>
                                <div className="mb-3 w-50">
                                    <label htmlFor="giatri_sauthue" className='form-label'>Giá trị sau thuế</label>
                                    <input type="text" name="giatri_sauthue" className='form-control' placeholder='Nhập giá trị sau thuế...' value={formData.giatri_sauthue} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ngaythanhtoan" className='form-label'>Ngày thanh toán</label>
                                <input type="date" name="ngaythanhtoan" className='form-control' value={formData.ngaythanhtoan} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="noidung" className='form-label'>Nội dung</label>
                                <textarea name="noidung" className='form-control' placeholder='Nhập nội dung...' value={formData.noidung} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button onClick={handleUpdate} type="button" className={`btn btn-primary ${mutation.isLoading ? 'disabled' : ''}`} disabled={mutation.isLoading ? 'disabled' : ''}>
                                {mutation.isLoading ? 'Đang cập nhật...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateContractPayment;

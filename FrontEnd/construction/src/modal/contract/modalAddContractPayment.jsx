import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import ModalAddCustomer from '../customer/modalAddCustomer';

const ModalAddContractPayment = (props) => {
    const { allCustomers, allContracts } = props.data || [];
    const [formData, setFormData] = useState({
        hopdong_id: '',
        khachhang_id: '',
        giatri_truocthue: '',
        vat: '',
        giatri_sauthue: '', // Sửa giá trị mặc định giatri_sauthue thành ''
        ngaythanhtoan: '',
        noidung: '',
        error_list: []
    });

    useEffect(() => {
        // Tính giá trị sau thuế khi có sự thay đổi trong giá trị trước thuế hoặc VAT
        const calculateAfterTaxValue = () => {
            const { giatri_truocthue, vat } = formData;
            if (giatri_truocthue && vat) {
                const giatri_sauthue = parseFloat(giatri_truocthue) + parseFloat(giatri_truocthue) * parseFloat(vat) / 100;
                setFormData(prevState => ({
                    ...prevState,
                    giatri_sauthue: giatri_sauthue // Giữ 2 chữ số thập phân
                }));
            }
        };

        calculateAfterTaxValue();
    }, [formData.giatri_truocthue, formData.vat]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addPaymentContract = async () => {
        try {
            const response = await http.post('/api/paymentContracts', formData);
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(addPaymentContract, {
        onSuccess: () => {
            toast.success("Thêm hợp đồng thanh toán thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('contract_payment');
        },
    });

    const handleSubmit = () => {
        const { hopdong_id, khachhang_id, giatri_truocthue, vat, giatri_sauthue, ngaythanhtoan, noidung } = formData;

        if (!hopdong_id || !khachhang_id || !giatri_truocthue || !vat || !giatri_sauthue || !ngaythanhtoan || !noidung) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
                position: "top-right",
                autoClose: 2000
            });
        } else {
            mutation.mutate();
        }
    };

    return (
        <div>
            <div className="modal fade" id="modalAddContractPayment">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Thêm hợp đồng thanh toán</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="hopdong_id" className='form-label'>Mã hợp đồng</label>
                                    <select onChange={(e) => handleChange(e)} name="hopdong_id" id="" className='form-select'>
                                        <option value="">Chọn Hợp đồng</option>
                                        {allContracts?.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="khachhang_id" className='form-label'>Mã khách hàng</label>
                                    <select onChange={(e) => handleChange(e)} name="khachhang_id" id="" className='form-select'>
                                        <option value="">Chọn khách hàng</option>
                                        {allCustomers?.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="giatri_truocthue" className='form-label'>Giá trị trước thuế</label>
                                    <input type="text" name="giatri_truocthue" className='form-control' placeholder='Nhập giá trị trước thuế...' onChange={handleChange} />
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="vat" className='form-label'>VAT</label>
                                        <input type="text" name="vat" className='form-control' placeholder='Nhập VAT...' onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="giatri_sauthue" className='form-label'>Giá trị sau thuế</label>
                                        <input type="text" name="giatri_sauthue" value={formData.giatri_sauthue} className='form-control' placeholder='Nhập giá trị sau thuế...' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngaythanhtoan" className='form-label'>Ngày thanh toán</label>
                                    <input type="date" name="ngaythanhtoan" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="noidung" className='form-label'>Nội dung</label>
                                    <textarea name="noidung" className='form-control' placeholder='Nhập nội dung...' onChange={handleChange} />
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
        </div>
    );
}

export default ModalAddContractPayment;

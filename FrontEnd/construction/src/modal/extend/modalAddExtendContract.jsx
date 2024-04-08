import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify'
import { getAPI } from '../../utility/api';
import Cookies from 'js-cookie';

const ModalAddExtendContract = (props) => {
    const { allContract , allCustomers  } = props.data;
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const [formData, setFormData] = useState({
        hopdong_id: '',
        thoigian_giahan: '',
        lydogiahan: '',
        khachhang_id: '',
        nhanvien_id: user[0]?.nhanvien_id
    });
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (selectedProject) {
            setFormData(prevState => ({
                ...prevState,
                ngaybatdau: selectedProject.ngaybatdau || '',
                ngayketthuc: selectedProject.ngayketthuc || ''
            }));
        }
    }, [selectedProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        const project = allContract.find(project => project.hopdong_id.toString() === value);
        setSelectedProject(project);
    };

    const addStaff = async () => {
        try {
            const response = await http.post('/api/extendContract', formData);
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Gia hạn hợp đồng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('extend_contract');
        },
    });

    const handleSubmit = () => {
        const { hopdong_id, thoigian_giahan, ngayketthuc } = formData;

        if (!hopdong_id || !thoigian_giahan) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
                position: "top-right",
                autoClose: 2000
            });
        } else if (new Date(thoigian_giahan) < new Date(ngayketthuc)) {
            toast.warning("Ngày gia hạn phải lớn hơn hoặc bằng ngày kết thúc của hợp đồng", {
                position: "top-right",
                autoClose: 2000
            });
        } else {
            
            mutation.mutate();
        }
    };
    return (
        <div>
            <div className="modal fade" id="modalAddExtendContract">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Gia hạn hợp đồng</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="hopdong_id" className='form-label'>Chọn hợp đồng gia hạn</label>
                                    <select onChange={handleChange} className='form-control' name="hopdong_id" id="">
                                        <option value="">Chọn hợp đồng</option>
                                        {allContract.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                        <input readOnly type="date" name="ngaybatdau" className='form-control' value={formData.ngaybatdau || ''} />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                        <input readOnly type="date" name="ngayketthuc" className='form-control' value={formData.ngayketthuc || ''} />
                                    </div>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="thoigian_giahan" className='form-label'>Gia hạn đến</label>
                                    <input type="date" name="thoigian_giahan" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select onChange={handleChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {allCustomers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lydogiahan" className='form-label'>Lý do gia hạn</label>
                                    <textarea name="lydogiahan" className='form-control' placeholder='' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nguoigiahan" className='form-label'>Người gia hạn : <strong>{user[0].hoten}</strong></label>
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

export default ModalAddExtendContract;

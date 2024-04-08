import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify'
import { getAPI } from '../../utility/api';
import Cookies from 'js-cookie';

const ModalUpdateExtendContract = (props) => {
    const { allExtend, allContract, idProject, allCustomers } = props.data;
    const [selectedProject, setSelectedProject] = useState(null);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const projectById = allExtend.find((item) => item.id === parseInt(idProject)) || {};
    
    const [formData, setFormData] = useState({
        hopdong_id: '',
        thoigian_giahan: 1,
        
        ngaybatdau: '',
        ngayketthuc: '',
        lydogiahan: '',
        khachhang_id: '',
        nhanvien_id: user[0]?.nhanvien_id
    });

    useEffect(() => {
        if (projectById) {
            setFormData({
                ...formData,
                
                thoigian_giahan: projectById.thoigian_giahan || 1,
                hopdong_id: projectById.hopdong_id || '',
                ngaybatdau: projectById.ngaybatdau || '',
                ngayketthuc: projectById.ngayketthuc || '',
                lydogiahan: projectById.lydogiahan || '',
                khachhang_id: projectById.khachhang_id || '',
                nhanvien_id: projectById.nhanvien_id || '',
            });
        }
    }, [idProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        const project = allContract.find(project => project.hopdong_id.toString() === value);
        setSelectedProject(project);
        // Cập nhật ngày bắt đầu và ngày kết thúc khi hợp đồng được chọn
        if (project) {
            setFormData(prevState => ({
                ...prevState,
                ngaybatdau: project.ngaybatdau,
                ngayketthuc: project.ngayketthuc
            }));
        }
    };

    const updateProject = async () => {
        try {
            const response = await http.put(`/api/extendContract/${idProject}`, formData);
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(updateProject, {
        onSuccess: () => {
            toast.success("Cập nhật gia hạn hợp đồng thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('extend_contract');
        },
    });

    const handleSubmit = () => {
        const { hopdong_id,  khachhang_id, ngaybatdau, ngayketthuc } = formData;

        if (!hopdong_id || !hopdong_id || !khachhang_id || !ngaybatdau || !ngayketthuc) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
                position: "top-right",
                autoClose: 2000
            });
        } else {
            mutation.mutate();
        }
    };
    console.log(formData);
    return (
        <div>
            <div className="modal fade" id="modalUpdateExtendContract">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Cập nhật hợp đồng thi công</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="hopdong_id" className='form-label'>Chọn hợp đồng gia hạn</label>
                                    <select value={formData.hopdong_id || ''} onChange={handleChange} className='form-control' name="hopdong_id" id="">
                                        <option value="">Chọn hợp đồng</option>
                                        {allContract.map((item, index) => (
                                            <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                        <input value={formData.ngaybatdau || ''} readOnly type="date" name="ngaybatdau" className='form-control'  />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                        <input value={formData.ngayketthuc || ''} readOnly type="date" name="ngayketthuc" className='form-control' />
                                    </div>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="thoigian_giahan" className='form-label'>Gia hạn đến</label>
                                    <input value={formData.thoigian_giahan || ''} type="date" name="thoigian_giahan" className='form-control' onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select value={formData.khachhang_id || ''} onChange={handleChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {allCustomers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lydogiahan" className='form-label'>Lý do gia hạn</label>
                                    <textarea value={formData.lydogiahan} name="lydogiahan" className='form-control' placeholder='' onChange={handleChange} />
                                </div>
                                {/* <div className="mb-3">
                                    <label htmlFor="nhanvien_id" className='form-label'>Người gia hạn </label>
                                    <input type="text" name='nhanvien_id' className='form-control' onChange={handleChange} value={formData.nhanvien_id} />
                                </div> */}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className={`btn btn-primary ${mutation.isLoading ? 'disabled' : ''}`} disabled={mutation.isLoading ? 'disabled' : ''} onClick={handleSubmit}>
                                    {mutation.isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ModalUpdateExtendContract;

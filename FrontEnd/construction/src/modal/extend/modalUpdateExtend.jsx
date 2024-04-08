import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify'
import { getAPI } from '../../utility/api';
import Cookies from 'js-cookie';

const ModalUpdateExtend = (props) => {
    const { allExtend, allProject, id, /* allCustomers */ } = props.data;
    const [selectedProject, setSelectedProject] = useState(null);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const projectById = allExtend.find((item) => item.id === parseInt(id)) || {};

    const [formData, setFormData] = useState({
        duan_id: '',
        thoigian_giahan: 1,
        hopdong_id: '',
        ngaybatdau: '',
        ngayketthuc: '',
        lydogiahan: '',
        
        nhanvien_id: user[0]?.nhanvien_id
    });

    useEffect(() => {
        if (projectById) {
            setFormData({
                ...formData,
                duan_id: projectById.duan_id || '',
                thoigian_giahan: projectById.thoigian_giahan || 1,
                hopdong_id: projectById.hopdong_id || '',
                ngaybatdau: projectById.ngaybatdau || '',
                ngayketthuc: projectById.ngayketthuc || '',
                lydogiahan: projectById.lydogiahan || '',
               
                nhanvien_id: projectById.nhanvien_id || '',
            });
        }
    }, [id]);
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredProjects = allProject?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        const project = filteredProjects?.find(project => project.id.toString() === value);
        setSelectedProject(project);
        // Cập nhật ngày bắt đầu và ngày kết thúc khi dự án được chọn
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
            const response = await http.put(`/api/extendProject/${id}`, formData);
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(updateProject, {
        onSuccess: () => {
            toast.success("Cập nhật gia hạn dự án thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('extend_project');
        },
    });

    const handleSubmit = () => {
        const { duan_id, hopdong_id, ngaybatdau, ngayketthuc } = formData;

        if (!duan_id || !hopdong_id  || !ngaybatdau || !ngayketthuc) {
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
            <div className="modal fade" id="modalUpdateExtend">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Cập nhật dự án thi công</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="duan_id" className='form-label'>Chọn dự án gia hạn</label>
                                    <select value={formData.duan_id || ''} onChange={handleChange} className='form-control' name="duan_id" id="">
                                        <option value="">Chọn dự án</option>
                                        {filteredProjects?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
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
                                {/* <div className="mb-3">
                                    <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select value={formData.khachhang_id || ''} onChange={handleChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {allCustomers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select>
                                </div> */}
                                <div className="mb-3">
                                    <label htmlFor="lydogiahan" className='form-label'>Lý do gia hạn</label>
                                    <textarea value={formData.lydogiahan} name="lydogiahan" className='form-control' placeholder='' onChange={handleChange} />
                                </div>
                                {/* <div className="mb-3">
                                    <label htmlFor="nguoigiahan" className='form-label'>Người gia hạn </label>
                                    <input type="text" name='nguoigiahan' className='form-control' onChange={handleChange} value={formData.nguoigiahan} />
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

export default ModalUpdateExtend;

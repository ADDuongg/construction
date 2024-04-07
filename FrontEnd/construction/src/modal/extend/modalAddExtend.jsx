import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify'
import { getAPI } from '../../utility/api';
import Cookies from 'js-cookie';

const ModalAddExtend = (props) => {
    const { allProject/* , allCustomers */ } = props.data;
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const [formData, setFormData] = useState({
        duan_id: '',
        thoigian_giahan: '',
        lydogiahan: '',
        /*  khachhang_id: '', */
        nguoigiahan: user[0]?.hoten
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
    };

    const addStaff = async () => {
        try {
            const response = await http.post('/api/extendProject', formData);
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(addStaff, {
        onSuccess: () => {
            toast.success("Gia hạn dự án thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('extend_project');
        },
    });

    const handleSubmit = () => {
        const { duan_id, thoigian_giahan, ngayketthuc } = formData;

        if (!duan_id || !thoigian_giahan) {
            toast.error("Vui lòng điền đầy đủ thông tin", {
                position: "top-right",
                autoClose: 2000
            });
        } else if (new Date(thoigian_giahan) < new Date(ngayketthuc)) {
            toast.warning("Ngày gia hạn phải lớn hơn hoặc bằng ngày kết thúc của dự án", {
                position: "top-right",
                autoClose: 2000
            });
        } else {

            mutation.mutate();
        }
    };
    return (
        <div>
            <div className="modal fade" id="modalAddExtend">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Gia hạn dự án</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="duan_id" className='form-label'>Chọn dự án gia hạn</label>
                                    <select onChange={handleChange} className='form-control' name="duan_id" id="">
                                        <option value="">Chọn dự án</option>
                                        {filteredProjects?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
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
                                    {/* <label htmlFor="khachhang_id" className='form-label'>Khách hàng gia hạn</label>
                                    <select onChange={handleChange} className='form-control' name="khachhang_id" id="">
                                        <option value="">Chọn khách hàng</option>
                                        {allCustomers.map((item, index) => (
                                            <option key={index} value={item.khachhang_id}>{item.hoten}</option>
                                        ))}
                                    </select> */}
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

export default ModalAddExtend;

import React, { useState, useEffect } from 'react';
import http from '../../axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify'
import { getAPI } from '../../utility/api';
import Cookies from 'js-cookie';
const ModalUpdateProject = (props) => {
    const { AllProject, allContracts, id } = props.data;

    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const projectById = AllProject.find((item) => item.id === parseInt(id)) || {};

    const [formData, setFormData] = useState({
        tenduan: '',
        soluonggiaidoan: 1,
        hopdong_id: '',
        ngaybatdau: '',
        ngayketthuc: '',
        tencongtrinh: '',
        diadiem: '',
        mota: '',
        status: '',
        nguoitao: user[0]?.hoten
    });

    useEffect(() => {
        if (projectById) {
            setFormData({
                tenduan: projectById.tenduan || '',
                soluonggiaidoan: projectById.soluonggiaidoan || 1,
                hopdong_id: projectById.hopdong_id || '',
                ngaybatdau: projectById.ngaybatdau || '',
                ngayketthuc: projectById.ngayketthuc || '',
                tencongtrinh: projectById.tencongtrinh || '',
                diadiem: projectById.diadiem || '',
                mota: projectById.mota || '',
                status: projectById.status || '',
                nguoitao: projectById.nguoitao|| ''
            });
        }
    }, [id]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateProject = async () => {
        try {
            const response = await http.put(`/api/project/${id}`, formData);
        } catch (error) {
            throw new Error(error);
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(updateProject, {
        onSuccess: () => {
            toast.success("Cập nhật dự án thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('projects');
        },
    });

    const handleSubmit = () => {
        const { tenduan, hopdong_id, status, ngaybatdau, ngayketthuc } = formData;

        if (!tenduan || !hopdong_id || !status || !ngaybatdau || !ngayketthuc) {
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
            <div className="modal fade" id="modalUpdateProject">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                        <div style={{ minWidth: '70vh', height: '100%' }}>
                            <div className="modal-header">
                                <div className='d-flex'><h3>Cập nhật dự án thi công</h3><h3 className='text-danger'>*</h3></div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body py-2 px-4">
                                <div className="mb-3">
                                    <label htmlFor="tenduan" className='form-label'>Tên dự án</label>
                                    <input type="text" name="tenduan" className='form-control' placeholder='Nhập tên hợp đồng...' value={formData.tenduan} onChange={handleChange} />
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="tencongtrinh" className='form-label'>Tên công trình</label>
                                        <input type="text" name="tencongtrinh" className='form-control'  onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="diadiem" className='form-label'>Địa điểm</label>
                                        <input type="text" name="diadiem" className='form-control'  onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="soluonggiaidoan" className='form-label'>Số lượng giai đoạn</label>
                                    <input type="text" name="soluonggiaidoan" className='form-control' value={formData.soluonggiaidoan} onChange={handleChange} placeholder='có thể để trống mục này' />
                                </div>

                                <div className="d-flex">
                                    <div className="mb-3 w-50 me-3">
                                        <label htmlFor="ngaybatdau" className='form-label'>Ngày bắt đầu</label>
                                        <input type="date" name="ngaybatdau" className='form-control' value={formData.ngaybatdau} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3 w-50">
                                        <label htmlFor="ngayketthuc" className='form-label'>Ngày kết thúc</label>
                                        <input type="date" name="ngayketthuc" className='form-control' value={formData.ngayketthuc} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="d-flex mb-3 align-items-end justify-content-between">
                                    <div className="mb-3 w-100" >
                                        <label htmlFor="hopdong_id" className='form-label'>Hợp đồng</label>

                                        <select name="hopdong_id" className='form-select' value={formData.hopdong_id} onChange={handleChange}>
                                            <option value="">Chọn hợp đồng</option>
                                            {allContracts?.map((item, index) => (
                                                <option key={index} value={item.hopdong_id}>{item.tenhopdong}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="mb-3 d-flex ">
                                        <p className='fw-bold' style={{ fontSize: '15px' }}>Chưa tạo hợp đồng ? </p>
                                        <button data-bs-toggle="modal" data-bs-target="#modalAddContract" className='btn btn-success ms-2'>Tạo hợp đồng</button>
                                    </div> */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mota" className='form-label'>Mô tả dự án</label>
                                    <textarea name="mota" className='form-control' value={formData.mota} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className='form-label'>Trạng thái</label>
                                    <textarea name="status" className='form-control' value={formData.status} onChange={handleChange} />
                                </div>
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

export default ModalUpdateProject;

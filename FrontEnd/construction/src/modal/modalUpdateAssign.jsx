import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { putAPI } from '../utility/api';
import { toast } from 'react-toastify';
const ModalUpdateAssign = (props) => {
    
    const { idAssign, assigns, projects, staffs } = props.data
    const assignById = assigns?.find((item) => item.id === parseInt(idAssign)) || {};

    const queryClient = useQueryClient();


    const [formData, setFormData] = useState({
        nhanvien_id: assignById.nhanvien_id || '',
        duan_id: assignById.duan_id || '',
        ghichu: assignById.ghichu || '',
        _method: 'PUT',
    });
    useEffect(() => {
        setFormData({
            nhanvien_id: assignById.nhanvien_id || '',
            duan_id: assignById.duan_id || '',
            ghichu: assignById.ghichu || '',
            _method: 'PUT',
        })

    }, [idAssign])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const mutation = useMutation(() => putAPI(`/api/assignStaff/${idAssign}`, formData), {
        onSuccess: () => {
            queryClient.invalidateQueries('assign')
            toast.success("Cập nhật thông tin phân công thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    function handleUpdate() {
        mutation.mutate();


    }
    return (
        <div className="modal fade" id="modalUpdateAssign">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Chỉnh sửa thông tin vật liệu</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label htmlFor="duan_id" className="form-label">Dự án</label>
                                <select value={formData.duan_id} name="duan_id" className='form-select' onChange={handleChange}>
                                    <option value="">Chọn dự án</option>
                                    {
                                        projects?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.tenduan}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nhanvien_id" className="form-label">Nhân viên</label>
                                <select value={formData.nhanvien_id} name="nhanvien_id" className='form-select' onChange={handleChange}>
                                    <option value="">Chọn nhân viên</option>
                                    {staffs?.map((staff, index) => (
                                        <option key={index} value={staff.nhanvien_id}>{staff.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ghichu" className="form-label">Ghi chú</label>
                                <textarea  type="text" className="form-control" id="ghichu" name="ghichu" value={formData.ghichu} onChange={handleChange} rows={8}></textarea>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" onClick={handleUpdate} className="btn btn-primary" >Sửa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateAssign;

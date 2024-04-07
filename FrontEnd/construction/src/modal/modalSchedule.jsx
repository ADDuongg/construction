import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { putAPI } from '../utility/api';
import {toast} from 'react-toastify'
const ModalSchedule = ({ data }) => {
    const [formData, setFormData] = useState({
        ngaybatdau: '',
        ngayketthuc: '',
        mota: '',
        _method: 'PUT'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    useEffect(() => {
        // Set giá trị ban đầu cho các trường khi dữ liệu `data` thay đổi
        setFormData({
            ngaybatdau: data.start_from,
            ngayketthuc: data.end_at,
            mota: data.description,
            _method: 'PUT'
        });
    }, [data]);
    const queryClient = useQueryClient()
    const mutation = useMutation((formDataToSend) => putAPI(`/api/projectState/${data?.id}`,formDataToSend),{
        onSuccess: () => {
            toast.success("Cập nhật thành công giai đoạn", {
                position: "top-right",
                autoClose: 2000
            });
            queryClient.invalidateQueries(['states']);
        }
    } )
    const handleSubmit = () => {
        const formDataToSend = {
            ngaybatdau: formData.ngaybatdau,
            ngayketthuc: formData.ngayketthuc,
            mota: formData.mota,
            _method: formData._method
        };
        console.log(formData);
        mutation.mutate(formDataToSend)
    };


    const handleCloseModal = () => {
        // Đóng modal ở đây
    };

    return (
        <div className="modal fade" id={`exampleModal${data.id}`} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog ">
                <div className="modal-content text-dark">
                    <div className="modal-header ">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Chi tiết  {data.phase} dự án {data.tenduan}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="ngaybatdau" className="form-label">Ngày bắt đầu:</label>
                            <input type="date" className="form-control" id="ngaybatdau" name="ngaybatdau" value={formData.ngaybatdau} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ngayketthuc" className="form-label">Ngày kết thúc:</label>
                            <input type="date" className="form-control" id="ngayketthuc" name="ngayketthuc" value={formData.ngayketthuc} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mota" className="form-label">Mô tả:</label>
                            <textarea className="form-control" id="mota" name="mota" value={formData.mota || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalSchedule;

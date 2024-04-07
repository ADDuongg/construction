import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { postAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateAttendance = (props) => {
    const { projects, state_projects, idAttendance, attendances } = props.data;

    const [detailAttendance, setDetailAttendance] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const [attendance, setAttendance] = useState({
        id: '',
        duan_id: '',
        giaidoan_duan_id: '',
        ngaydiemdanh: '',
        nguoitao: user[0]?.hoten
    });
    const duanIdsArray = user.map(item => item.duan_id);

   
    const filteredProjects= projects?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const hoursOfDay = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hoursOfDay.push(hour + ':00');
    }
   
    useEffect(() => {
        if (attendances && idAttendance) {
            const attendanceToUpdate = attendances.find((item) => item.id === parseInt(idAttendance));
            setAttendance({
                id: attendanceToUpdate?.id,
                duan_id: attendanceToUpdate?.duan_id,
                giaidoan_duan_id: attendanceToUpdate?.giaidoan_duan_id,
                ngaydiemdanh: attendanceToUpdate?.ngaydiemdanh,
                nguoitao: attendanceToUpdate?.nguoitao
            });
        }
    }, [attendances, idAttendance]);

    const handleChangeDetail = (index, fieldName, value) => {
        const updatedAttendanceRows = [...detailAttendance];
        updatedAttendanceRows[index][fieldName] = value;
        setDetailAttendance(updatedAttendanceRows);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAttendance((prev) => ({ ...prev, [name]: value }));
    };

    const queryClient = useQueryClient();
    const mutation = useMutation((combinedData) => postAPI(`/api/attendance/${attendance?.id}`, combinedData), {
        onSuccess: () => {
            toast.success("Cập nhật bảng điểm danh thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('attendance');
        },
        onError: (error) => {
            toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 2000
            });
        }
    });

    const handleUpdate = () => {
        const combinedData = {
            attendance,
            _method: 'PUT'
        };
        mutation.mutate(combinedData);
    };

    return (
        <div className="modal fade" id="modalUpdateAttendance" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Cập nhật bảng điểm danh</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='mb-3'>
                                <label htmlFor="duan_id" className='form-label'>Dự án</label>
                                <select name="duan_id" className='form-select' value={attendance.duan_id} onChange={handleChange}>
                                    <option value="">---Chọn dự án---</option>
                                    {filteredProjects?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.tenduan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="giaidoan_duan_id" className='form-label'>Giai đoạn dự án</label>
                                <select name="giaidoan_duan_id" className='form-select' value={attendance.giaidoan_duan_id} onChange={handleChange}>
                                    <option value="">---Chọn giai đoạn---</option>
                                    {state_projects?.map((item, index) => {
                                        return item.duan_id === parseInt(attendance.duan_id) ? (
                                            <option key={index} value={item.id}>{item.giaidoan}</option>
                                        ) : null;
                                    })}

                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="ngaydiemdanh" className='form-label'>Ngày điểm danh</label>
                                <input type="date" className='form-control' value={attendance.ngaydiemdanh} onChange={handleChange} name='ngaydiemdanh' />
                            </div>
                            {/* Add detail attendance inputs here */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button disabled = {mutation.isLoading} onClick={handleUpdate} type="button" className="btn btn-primary">{mutation.isLoading ? 'Đang cập nhật' : 'Cập nhật'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateAttendance;

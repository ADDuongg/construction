import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { postAPI } from '../../utility/api';
import { toast } from 'react-toastify'

const ModalAddAttendance = (props) => {
    const { staffs, projects, state_projects } = props.data;
    const [detailAttendance, setDetailAttendance] = useState([]);
    const [stateProject, setStateProjects] = useState([])
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
    const [attendance, setAttendance] = useState({
        duan_id: '',
        giaidoan_duan_id: '',
        ngaydiemdanh: '',
        nguoitao: user[0]?.nhanvien_id
    });

    const hoursOfDay = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hoursOfDay.push(hour + ':00');
    }
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredProjects = projects?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    
    const handleCreateAttendance = () => {
        const filteredStaffs = staffs?.filter(staff => staff.chucvu === 'worker');
        const newAttendanceRows = filteredStaffs.map(employee => {
            return {
                hotennhanvien: employee.hoten,
                thoigianvao: '',
                thoigianra: '',
                ghichu: '',
            };
        });
        setDetailAttendance(newAttendanceRows);
    };

    const handleChangeDetail = (index, fieldName, value) => {
        const updatedAttendanceRows = [...detailAttendance];
        updatedAttendanceRows[index][fieldName] = value;
        setDetailAttendance(updatedAttendanceRows);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if(name === 'duan_id'){
            const filteredStateProjects = state_projects.filter(item => item.duan_id === parseInt(value));
            setStateProjects(filteredStateProjects);
        }


        setAttendance((prev) => ({ ...prev, [name]: value }));


    };

    const queryClient = useQueryClient();
    const mutation = useMutation((combinedData) => postAPI('/api/attendance', combinedData), {
        onSuccess: () => {
            toast.success("Thêm bảng điểm danh thành công", {
                position: "top-right",
                autoClose: 1000
            });
            queryClient.invalidateQueries('attendance')
        },
        onError: () => {
            toast.error("Bảng điểm danh cho ngày, dự án và giai đoạn dự án này đã tồn tại.", {
                position: "top-right",
                autoClose: 2000
            });
        }
    });

    const handleAdd = () => {
        if (attendance.duan_id && attendance.giaidoan_duan_id && attendance.ngaydiemdanh) {
            const combinedData = {
                attendance,
                detailAttendance
            };
            mutation.mutate(combinedData);
            console.log(combinedData);
        } else {
            toast.error("Vui lòng nhập đủ thông tin dự án, giai đoạn và ngày điểm danh");
        }
    };
    /* console.log(stateProject); */
    return (
        <div className="modal fade" id="modalAddAttendance" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl ">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='mb-3'>
                                <label htmlFor="capngay" className='form-label'>Tìm kiếm theo dự án</label>
                                <select name="duan_id" className='form-select' onChange={handleChange} id="">
                                    <option value="">---Chọn dự án---</option>
                                    {filteredProjects?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.tenduan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="capngay" className='form-label'>giai đoạn dự án</label>
                                <select name="giaidoan_duan_id" className='form-select' onChange={handleChange} id="">
                                    <option value="">---Chọn giai đoạn---</option>

                                    {stateProject?.map((item, index) =>
                                    (
                                        <option key={index} value={item.id}>{item.giaidoan}</option>
                                    )

                                    )}
                                </select>

                            </div>
                            <div className='mb-3'>
                                <label htmlFor="capngay" className='form-label'>Ngày điểm danh</label>
                                <input type="date" className='form-control' onChange={handleChange} name='ngaydiemdanh' />
                            </div>

                            <div className="text-end w-100">
                                <button className='btn btn-secondary my-3' onClick={handleCreateAttendance}>Tạo Điểm Danh</button>
                            </div>
                            {detailAttendance.length > 0 &&
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Họ Tên</th>
                                            <th>Thời Gian Vào</th>
                                            <th>Thời Gian Ra</th>
                                            <th>Ghi Chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailAttendance.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.hotennhanvien}</td>
                                                <td>
                                                    <select className='form-select' value={row.thoigianvao} onChange={(e) => handleChangeDetail(index, 'thoigianvao', e.target.value)}>
                                                        <option value="">Chọn giờ vào</option>
                                                        {hoursOfDay.map((hour, i) => (
                                                            <option key={i} value={hour}>{hour}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select className='form-select' value={row.thoigianra} onChange={(e) => handleChangeDetail(index, 'thoigianra', e.target.value)}>
                                                        <option value="">Chọn giờ ra</option>
                                                        {hoursOfDay.map((hour, i) => (
                                                            <option key={i} value={hour}>{hour}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input className='form-control' type="text" value={row.ghichu} onChange={(e) => handleChangeDetail(index, 'ghichu', e.target.value)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled = {mutation.isLoading} onClick={handleAdd} type="button" className="btn btn-primary">{mutation.isLoading ? 'Đang tạo': 'Tạo'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddAttendance;

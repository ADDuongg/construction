import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../layout';
import { Link, useParams } from 'react-router-dom';
import {useReactToPrint} from 'react-to-print'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAPI, putAPI } from '../../utility/api';


const AttendanceDetail = () => {
    const [timeIn, setTimeIn] = useState([]);
    const [timeOut, setTimeOut] = useState([]);
    const [note, setNote] = useState([]);
    const params = useParams();
    const id = params.id;
    const { isLoading, isError, data } = useQuery(['attendance'], () => getAPI('/api/attendance'));
    const detailById = data?.detail_attendance.filter((item) => item.diemdanh_id === parseInt(id));


    const hoursOfDay = [];
    for (let i = 0; i <= 23; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        hoursOfDay.push(hour + ':00');
    }
    useEffect(() => {
        if (!isLoading && data?.detail_attendance) {

            setTimeIn(detailById?.map(task => task.thoigianvao));
            setTimeOut(detailById?.map(task => task.thoigianra));
            setNote(detailById?.map(task => task.ghichu));
        }

    }, [isLoading, data]);
    // Tạo 3 refs
    const timeInRef = useRef(null);
    const timeOutRef = useRef(null);
    const noteRef = useRef(null);


    const handleChangeIn = (index, e) => {
        const updatedTasks = [...timeIn];
        updatedTasks[index] = e.target.value;
        setTimeIn(updatedTasks);
        timeInRef.current = e.target.value;
    }


    const handleChangeNote = (index, e) => {
        const value = e.target.value
        const updatedTasks = [...note];
        updatedTasks[index] = value;
        setNote(updatedTasks);
        timeOutRef.current = value;
    }
    const handleChangeOut = (index, e) => {
        const value = e.target.value
        const updatedTasks = [...timeOut];
        updatedTasks[index] = value;
        setTimeOut(updatedTasks);
        noteRef.current = value;
    }

    const mutation = useMutation(({ formData, taskId }) => putAPI(`/api/detailAttendance/${taskId}`, formData))



    const handleTimeInBlur = (id, e) => {

        const newValue = e.target.value;
        const dataUpdate = {
            name: e.target.name,
            value: e.target.value
        }
        if (timeInRef.current === newValue) {
            updateTaskAPI(id, dataUpdate)
        }

    };

    const handleTimeOutBlur = (id, e) => {

        const newValue = e.target.value;
        const dataUpdate = {
            name: e.target.name,
            value: e.target.value
        }

        if (timeOutRef.current !== newValue) {
            updateTaskAPI(id, dataUpdate)
        }

    };

    const handleNoteBlur = (id, e) => {

        const newValue = e.target.value;
        const dataUpdate = {
            name: e.target.name,
            value: e.target.value
        }
        if (noteRef.current !== newValue) {
            updateTaskAPI(id, dataUpdate)
        }
    };
    const updateTaskAPI = async (taskId, value) => {
        const formData = new FormData();
        for (const key in value) {
            formData.append(key, value[key]);
        }
        formData.append('_method', 'PUT');

        mutation.mutate({ formData, taskId });
    };
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'attendance-detail',
        /* onAfterPrint: () => alert('ok') */
    })
    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid p-5 rounded bg-white">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <Link to={'/attendance'} className="breadcrumb-item">Quản lý điểm danh</Link>
                            <li className="breadcrumb-item active" aria-current="page">Chi tiết điểm danh</li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="w-100 d-flex justify-content-between mt-3">
                            <h2>Chi tiết điểm danh</h2>
                            <div className='d-flex'>
                                <button onClick={handlePrint} className='btn btn-secondary me-3'><i className="fa-solid fa-print me-3"></i>Print</button>
                               
                            </div>
                        </div>
                        <table ref={printRef} className='table table-bordered mt-3' id='table-to-xls'>
                            <thead>
                                <tr>
                                    <th>Họ Tên</th>
                                    <th>Thời Gian Vào</th>
                                    <th>Thời Gian Ra</th>
                                    <th>Ghi Chú</th>
                                </tr>
                            </thead>
                            <tbody>

                                {mutation.isLoading ? (
                                    <tr>
                                        <td colSpan={4}>Updating ...</td>
                                    </tr>
                                ) : (
                                    detailById?.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.hotennhanvien}</td>
                                            <td>
                                                <select
                                                    name='thoigianvao'
                                                    className='form-select'
                                                    value={timeIn[index] || ''}
                                                    onChange={(e) => handleChangeIn(index, e)}
                                                    onBlur={(e) => handleTimeInBlur(row.id, e)}
                                                    ref={timeInRef}
                                                >
                                                    <option value=""></option>
                                                    {hoursOfDay.map((hour, i) => (
                                                        <option key={i} value={hour}>{hour}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    name='thoigianra'
                                                    className='form-select'
                                                    value={timeOut[index] || ''}
                                                    onChange={(e) => handleChangeOut(index, e)}
                                                    onBlur={(e) => handleTimeOutBlur(row.id, e)}
                                                    ref={timeOutRef}
                                                >
                                                    <option value=""></option>
                                                    {hoursOfDay.map((hour, i) => (
                                                        <option key={i} value={hour}>{hour}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    name='ghichu'
                                                    className='form-control'
                                                    type="text"
                                                    value={note[index] || ''}
                                                    onChange={(e) => handleChangeNote(index, e)}
                                                    onBlur={(e) => handleNoteBlur(row.id, e)}
                                                    ref={noteRef}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}


                            </tbody>
                        </table>

                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AttendanceDetail;

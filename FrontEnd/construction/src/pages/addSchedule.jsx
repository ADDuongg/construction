import React, { useState } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalSearchState from '../modal/modalSearchState';
import { useMutation, useQuery } from 'react-query';
import { getAPI, postAPI } from '../utility/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
function AddSchedule() {
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(2022);
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState({});
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const handleDateChange = (index, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].time = new Date(value);
        setTasks(updatedTasks);
    };

    const generateTaskList = () => {
        if (!project.duan_id || !project.giaidoan_duan_id || !month || !year) {
            toast.error('Vui lòng chọn dự án, giai đoạn, tháng và năm trước khi lưu lịch trình', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        const daysInMonth = new Date(year, month, 0).getDate();
        const newTasks = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const taskDate = new Date(year, month - 1, i);
            newTasks.push({ id: i, task: '', time: taskDate, duan_id: '', giaidoan_duan_id: '' });
        }
        setTasks(newTasks);
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };
    const { data, isLoading } = useQuery(['schedule'], () => getAPI('/api/schedule'));
    const duanIdsArray = user.map(item => item.duan_id);


    const filteredProjects = data?.project?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const mutation = useMutation((dataCombine) => postAPI('/api/schedule', dataCombine), {
        onSuccess: () => {
            toast.success('Thêm lịch trình cho dự án thành công', {
                position: 'top-right',
                autoClose: 1000,
            })
        },
        onError: (error) => {
            if (error.message.includes('400')) {
                toast.error("Dự án và giai đoạn này đã có lịch vui lòng kiểm tra lại", {
                    position: "top-right",
                    autoClose: 3000
                })
            }
        }
    });

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
    };

    const handleDeleteAllTasks = () => {
        setTasks([]);
    };

    const handleTaskChange = (index, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].task = value;
        setTasks(updatedTasks);
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target
        setProject((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    function handleSave() {
        const dataCombine = {
            tasks: tasks,
            duan_id: project.duan_id,
            giaidoan_duan_id: project.giaidoan_duan_id
        };
        mutation.mutate(dataCombine);
    }

    return (
        <Layout>
            <section className="detailContent p-5">
                <div className="container-fluid p-5 bg-white rounded">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">
                                Home
                            </Link>
                            <Link to={'/detailSchedule'} className="breadcrumb-item">
                                Lịch trình thi công
                            </Link>
                            <li className="breadcrumb-item active" aria-current="page">
                                Thêm lịch trình cụ thể
                            </li>
                        </ol>
                    </nav>

                    <div className="row g-3 mt-3">
                        <div className="col-lg-3 col-md-6 col-12">
                            <label htmlFor="">Chọn dự án để tạo lịch</label>
                            <select className='form-control' name='duan_id' onChange={handleSelectChange}>
                                <option value="">Chọn dự án</option>
                                {
                                    filteredProjects?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.tenduan}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <label htmlFor="">Chọn giai đoạn dự án</label>
                            <select className='form-control' name='giaidoan_duan_id' onChange={handleSelectChange}>
                                <option value="">Chọn giai đoạn dự án</option>
                                {
                                    data?.state?.filter(item => item.duan_id === parseInt(project.duan_id)).map((item, index) => (
                                        <option key={index} value={item.id}>{item.giaidoan}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <label htmlFor="">Chọn tháng </label>
                            <select className='form-control ' onChange={(e) => setMonth(parseInt(e.target.value))}>
                                <option value="">Chọn tháng tạo lịch</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>Tháng {m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <label htmlFor="">Chọn năm </label>
                            <select className='form-control' onChange={(e) => setYear(parseInt(e.target.value))}>
                                <option value="">Chọn năm</option>
                                {Array.from({ length: 10 }, (_, i) => year + i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className=" mt-3 row g-3">
                        <div className='col text-end ms-0'>
                            <button className=' me-3  btn btn-danger' onClick={handleDeleteAllTasks}><i className="fa-solid fa-arrow-rotate-left me-3"></i>Xóa tất cả</button>
                            <button className=' me-3 btn btn-success  w-auto ' ><i className="fa-solid fa-file-csv me-2"></i> Xuất Excel</button>
                            <button className=' me-3  btn btn-primary  w-auto ' onClick={handleSave}><i className="fa-solid fa-floppy-disk me-2"></i> Lưu lịch trình</button>
                            <button className=' me-3 mt-md-0 mt-3 btn btn-warning   w-auto ' onClick={generateTaskList}>Tạo Danh Sách</button>
                        </div>

                    </div>

                    <div className=" mt-3" style={{overflow: 'auto'}}>
                        <div>
                            <table className='table table-striped' style={{minWidth: '100vh'}}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th >Danh sách công việc</th>
                                        <th >Thời gian</th>
                                        <th >Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><input type="text" name='task' className='form-control' value={task.task} onChange={(e) => handleTaskChange(index, e.target.value)} /></td>
                                            <td><input type="date" name='time' className='form-control' value={formatDate(task.time)} onChange={(e) => handleDateChange(index, e.target.value)} /></td>
                                            <td><i onClick={() => handleDeleteTask(task.id)} className="fa-solid fa-trash text-danger" style={{ fontSize: '2rem' }}></i></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default AddSchedule;

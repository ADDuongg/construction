import React, { useEffect, useState, useRef } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import ModalSearchState from '../modal/modalSearchState';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteAPI, getAPI, postAPI, putAPI } from '../utility/api';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'
function DetailSchedule() {
    const dataUser = Cookies.get('user')
    const user = dataUser ? JSON.parse(dataUser) : null;
    const [thoigian, setThoiGian] = useState([]);
    const [nhiemvu, setNhiemVu] = useState([]);
    const [project, setProject] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [searchParams, setSearchParams] = useState({
        limit: 10,
        duan_id: '',
        giaidoan_duan_id: '',
        nhiemvu: '',
        thoigian: '',
        page: 1
    });
    const previousInputValueRef = useRef(null);
    const previousDateValueRef = useRef(null);
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery(['schedule', searchParams.limit, searchParams.page], () => getAPI('/api/schedule', searchParams));
    const total_page = data?.schedule ? Number(data.schedule.last_page) : 1;
    const from = data?.schedule ? Number(data.schedule.from) : 1;
    const to = data?.schedule ? Number(data.schedule.to) : 3
    const total_item = data?.schedule ? Number(data.schedule.total) : 3
    const handleCheckBox = (e) => {
        const { name, checked } = e.target;
        if (name === 'allCheck') {
            const tmp_data = schedule.map((item) => ({ ...item, isChecked: checked }));
            setSchedule(tmp_data);
            
        } else {
            
            const tmp_data = schedule.filter((item) => (item.id === parseInt(name) ? { ...item, isChecked: checked } : item));
            setSchedule(tmp_data);
        }
    };
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredProjects= data?.project?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    const filteredSchedule= data?.schedule?.data?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.duan_id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });

    console.log(filteredProjects);
    useEffect(() => {
        if (!isLoading && data?.schedule?.data) {

            setNhiemVu(data.schedule.data.map(task => task.nhiemvu));
            setThoiGian(data.schedule.data.map(task => task.thoigian));
        }
        /* setSchedule(data?.schedule?.data) */
    }, [isLoading, data, searchParams]);
    const mutationSearch = useMutation((searchParams) => getAPI('/api/schedule', searchParams), {
        onSuccess: (dataSearch) => {
            queryClient.setQueryData(['schedule', searchParams.limit, searchParams.page], () => {
                return { ...dataSearch }
            });
        }
    });
    const handleSearch = () => {
        mutationSearch.mutate(searchParams)
    }


    const handlePageClick = ({ selected }) => {
        setSearchParams(prevState => ({
            ...prevState,
            page: selected + 1,
        }));
    };
    const mutationDelete = useMutation((id) => deleteAPI(`/api/schedule/${id}`), {
        onSuccess: () => {

            Swal.fire({
                title: "Deleted!",
                text: "Schedule has been deleted.",
                icon: "success"
            });
            queryClient.invalidateQueries('schedule')
        }
    });



    const handleDeleteTask = (id) => {
        Swal.fire({
            title: `Are you sure want to delete this schedule`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    mutationDelete.mutate(id)
                } catch (error) {
                    console.error("Error deleting staff:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the staff.",
                        icon: "error"
                    });
                }
            }
        });

    };
    const mutationDeleteAll = useMutation((dataCombine) => postAPI(`/api/schedule/deleteAll`, dataCombine), {
        onSuccess: () => {

            Swal.fire({
                title: "Deleted!",
                text: "Schedule has been deleted.",
                icon: "success"
            });
            queryClient.invalidateQueries('schedule')
        }
    });
    const handleDeleteAllTasks = () => {
        Swal.fire({
            title: `Are you sure want to delete all schedule`,
            text: "You won't be able to revert all!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const dataCombine = {
                        checkAll: [...schedule]
                    }
                    mutationDeleteAll.mutate(dataCombine)
                    console.log(dataCombine);
                } catch (error) {
                    console.error("Error deleting staff:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while deleting the staff.",
                        icon: "error"
                    });
                }
            }
        });

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleTaskInputChange = (index, value) => {
        const updatedTasks = [...nhiemvu];
        updatedTasks[index] = value;
        setNhiemVu(updatedTasks);
        previousInputValueRef.current = value;
    };

    const handleTaskDateChange = (index, value) => {
        const updatedTasks = [...thoigian];
        updatedTasks[index] = value;
        setThoiGian(updatedTasks);
        previousDateValueRef.current = value;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };

   

    
    const handleTaskInputBlur = (taskId, e) => {
        const newValue = e.target.value
        const updatedValue = {
            name: e.target.name,
            value: newValue
        };

        if (newValue === previousInputValueRef.current) {
            updateTaskAPI(taskId, updatedValue);
        }
        else {
            console.log('giữ nguyên');
        }
    };

    const handleDateBlur = (taskId, e) => {
        const newValue = e.target.value
        const updatedValue = {
            name: e.target.name,
            value: newValue
        };

        if (newValue === previousDateValueRef.current) {
            updateTaskAPI(taskId, updatedValue);
        } else {
            console.log('giữ nguyên');
        }
    };

    const mutation = useMutation(({ formData, id }) => putAPI(`/api/schedule/${id}`, formData), {
        onSuccess: () => {
            toast.success('Cập nhật lịch trình dự án thành công', {
                position: 'top-right',
                autoClose: 1000,
            })
            queryClient.invalidateQueries('schedule')
        }
    })

    const updateTaskAPI = async (taskId, value) => {
        const formData = new FormData();
        for (const key in value) {
            formData.append(key, value[key]);
        }
        formData.append('_method', 'PUT');
        formData.append('id', taskId);
        const id = formData.get('id');
        mutation.mutate({ formData, id });
    };


    return (
        <Layout>

            <section className="detailContent p-5">
                <div className="container-fluid p-5 bg-white rounded">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">
                                Home
                            </Link>
                            <Link to={'/project'} className="breadcrumb-item">
                                Quản lý dự án
                            </Link>
                            <Link to={'/stateProject'} className="breadcrumb-item">
                                Tiến độ dự án
                            </Link>
                            <li className="breadcrumb-item active" aria-current="page">
                                Thêm lịch trình cụ thể
                            </li>
                        </ol>
                    </nav>
                    <div className="row  g-3">
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="duan_id" className='form-label'>Tên dự án</label>
                                <select className='form-control' name="duan_id" id="" onChange={(e) => handleInputChange(e)}>
                                    <option value="">Chọn dự án</option>
                                    {
                                        filteredProjects?.map((item, index) => (
                                            <option key={index} value={item.id || ''}>{item.tenduan}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="giaidoan_duan_id" className='form-label'>Giai đoạn dự án</label>
                                <select className='form-control' name="giaidoan_duan_id" id="" onChange={(e) => handleInputChange(e)}>
                                    <option value="">Chọn giai đoạn dự án</option>
                                    {
                                        data?.state?.filter(item => item.duan_id === parseInt(project.duan_id)).map((item, index) => (
                                            <option key={index} value={item.id || ''}>{item.giaidoan}</option>
                                        ))
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="col-lg-6 col-12">
                            <div className='mb-3'>
                                <label htmlFor="gioitinh" className='form-label'>Nhiệm vụ</label>
                                <input onChange={handleInputChange} name='gioitinh' type="text" className='form-control ' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="thoigian" className='form-label'>Tìm theo ngày</label>

                                <select onChange={handleInputChange} name="thoigian" className='form-control' id="">
                                    <option value="">Chọn ngày</option>
                                    {[...Array(31)].map((_, index) => (
                                        <option key={index + 1} value={index + 1 || ''}>{index + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='text-end'><button onClick={handleSearch} className='btn btn-success'>Tìm kiếm</button></div>
                    </div>

                    <div className=" text-end mt-3">
                        <button className='btn btn-success  w-auto me-3' ><i className="fa-solid fa-file-csv me-2"></i> Xuất Excel</button>
                        <Link className='btn btn-primary w-auto' to={'/addSchedule'}>Tạo Danh Sách</Link>
                    </div>

                    <div className=" mt-3">
                        <div className="my-3  d-flex align-items-center">
                            <select onChange={handleInputChange} name="limit" id="" className='form-select w-auto me-3'>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                            </select>
                            <label htmlFor="limit">entries per page</label>
                        </div>

                        <div className="my-3 d-flex align-items-center">
                            <label className="mx-2">Check All</label>
                            <input
                                type="checkbox"
                                name='allCheck'
                                className='form-check-input '
                                style={{ width: '1rem', height: '1rem' }}
                                onChange={handleCheckBox}
                                checked={schedule?.every((item) => item?.isChecked === true) || false}
                            />

                            <button onClick={handleDeleteAllTasks} className='btn btn-danger ms-3'>Delete All</button>
                        </div>
                        <div className='row' style={{overflow: 'auto'}}>
                            <table className='table table-striped'  style={{minWidth: '100vh'}}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>STT</th>
                                        <th >Dự án</th>
                                        <th >Giai đoạn dự án</th>
                                        <th >Danh sách công việc</th>
                                        <th >Thời gian</th>
                                        <th >Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mutation.isLoading ? (
                                        <tr>
                                            <td colSpan={7}>Updating ...</td>
                                        </tr>
                                    ) : (
                                        filteredSchedule?.map((task, index) => (
                                            <tr key={index}>
                                                <td >

                                                    <input

                                                        name={task.id}
                                                        checked={task?.isChecked || false}
                                                        type="checkbox"
                                                        className='form-check-input'
                                                        onChange={handleCheckBox}
                                                    />

                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{task.tenduan}</td>
                                                <td>{task.giaidoan}</td>

                                                <td>
                                                    <input
                                                        ref={previousInputValueRef}
                                                        type="text"
                                                        name='nhiemvu'
                                                        className='form-control'
                                                        value={nhiemvu[index] || ''}
                                                        onChange={(e) => handleTaskInputChange(index, e.target.value)}
                                                        onBlur={(e) => handleTaskInputBlur(task.id, e)}
                                                    />

                                                </td>


                                                <td>

                                                    <input
                                                        onChange={(e) => handleTaskDateChange(index, e.target.value)}
                                                        ref={previousDateValueRef}
                                                        onBlur={(e) => handleDateBlur(task.id, e)}
                                                        type="date"
                                                        name='thoigian'
                                                        className='form-control'
                                                        value={formatDate(thoigian[index]) || ''}
                                                    />

                                                </td>

                                                <td>

                                                    <i onClick={() => handleDeleteTask(task.id)} className="fa-solid fa-trash text-danger" style={{ fontSize: '2rem' }}></i>

                                                </td>
                                            </tr>
                                        ))
                                    )
                                    }



                                </tbody>
                            </table>
                            <div className='w-100 d-flex justify-content-between'  style={{minWidth: '100vh'}}>
                                <div>Show {from} to {to} of {total_item}</div>
                                <ReactPaginate
                                    previousLabel={'previous'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    pageCount={total_page || 1}

                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousClassName='page-item'
                                    previousLinkClassName='page-link'
                                    nextClassName='page-item'
                                    nextLinkClassName='page-link'
                                    breakClassName='page-item'
                                    breakLinkClassName='page-link'
                                    activeClassName='active'
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </section>
        </Layout>

    );
}

export default DetailSchedule;

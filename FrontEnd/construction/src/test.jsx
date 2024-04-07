import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios library

function StatePayment() {
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2024);
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Nhân viên A', position: 'Chức vụ A' },
        { id: 2, name: 'Nhân viên B', position: 'Chức vụ B' },
    ]);
    const [dates, setDates] = useState([]); // State để lưu giá trị ngày cho mỗi nhân viên
    const [daysOfMonth, setDaysOfMonth] = useState([]); // State để lưu trạng thái của checkbox

    useEffect(() => {
        const daysArray = [...Array(new Date(year, month, 0).getDate()).keys()];
        setDaysOfMonth(daysArray);
    }, [month, year]);

    const getDayName = (dayIndex) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[dayIndex];
    };

    const handleDelete = (id) => {
        setEmployees(employees.filter(employee => employee.id !== id));
        setDates(dates.filter((date, index) => index !== id)); // Xóa ngày của nhân viên đã bị xóa
    };

    const handleSaveData = () => {
        console.log(daysOfMonth);
    };

    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid bg-white rounded px-5 py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <li className="breadcrumb-item active" aria-current="page">Quản lý thanh lý hợp đồng</li>
                        </ol>
                    </nav>
                    <div className="row  g-3"></div>
                    <div className="row ">
                        <div className="col d-flex justify-content-end">
                            <div className="me-3">
                                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalAddContractPayment"><i className="fa-solid fa-plus me-2"></i>Thêm mới</button>
                            </div>
                            <div >
                                <button className='btn btn-success' ><i className="fa-solid fa-magnifying-glass me-2"></i>Tìm kiếm</button>
                            </div>
                            <div>
                                <button className='btn btn-primary' onClick={handleSaveData}>Lưu dữ liệu</button> {/* Nút lưu dữ liệu */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid bg-white rounded  py-3 mt-3 overflow-x-auto" >
                    <h4>Danh sách thanh lý hợp đồng</h4>
                    <div className="my-3  d-flex align-items-center">
                        <select name="limit" id="" className='form-select w-auto me-3' >
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="limit">entries per page</label>
                    </div>
                    <div className="row">
                        <div style={{overflowX: 'auto'}}>
                            <label htmlFor="month">Chọn tháng:</label>
                            <select id="month" onChange={(e) => setMonth(parseInt(e.target.value))}>
                                {[...Array(12).keys()].map((monthIndex) => (
                                    <option key={monthIndex} value={monthIndex + 1}>Tháng {monthIndex + 1}</option>
                                ))}
                            </select>
                            <label htmlFor="year">Chọn năm:</label>
                            <select id="year" onChange={(e) => setYear(parseInt(e.target.value))}>
                                {[...Array(5).keys()].map((yearIndex) => (
                                    <option key={yearIndex} value={yearIndex + 2022}>{yearIndex + 2022}</option>
                                ))}
                            </select>
                            <table className='table table-striped mt-3' border="1">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Họ tên</th>
                                        <th>Chức vụ</th>
                                        {daysOfMonth.map((dayIndex) => {
                                            const date = new Date(year, month - 1, dayIndex + 1);
                                            return (
                                                <th key={dayIndex} className="dayinmonth">
                                                    {dayIndex + 1} <div>{getDayName(date.getDay())}</div>
                                                </th>
                                            );
                                        })}
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.position}</td>
                                            {daysOfMonth.map((dayIndex) => (
                                                <td key={dayIndex}>
                                                    <input type="checkbox" className='' name={`attendance[${index}][${dayIndex}]`} />
                                                </td>
                                            ))}
                                            <td><button className="btn btn-danger" onClick={() => handleDelete(employee.id)}>Xóa</button></td>
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

export default StatePayment;

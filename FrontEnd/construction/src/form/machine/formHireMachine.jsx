import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const FormHireMachine = ({setRowsMachines}) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['hireMachine'], () => getAPI('/api/getInfomationMachine'))
    const [rows, setRows] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mamaymoc: '',
            loaimaymoc: '',
            /* dongia: '', */
            sogiothue: '',
            tenmaymoc: '',
            /* thanhtien: '' */
        };
        setRows([...rows, newRow]);
        setRowsMachines([...rows,newRow]);
    };



    const handleMaterialChange = (event, index) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        const updatedRows = [...rows];
        updatedRows[index].mamaymoc = selectedId;
        updatedRows[index].tenmaymoc = materialName;
        updatedRows[index].loaimaymoc = '';
        setRows(updatedRows);
        setRowsMachines(updatedRows);
    };


    const handleMaterialTypeChange = (event, index) => {
        const selectedType = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index].loaimaymoc = selectedType;
        setRows(updatedRows);
        setRowsMachines(updatedRows);
    };


    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;
        
        setRows(updatedRows);
        setRowsMachines(updatedRows);
    };

    const deleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
        setRowsMachines(updatedRows);
    };

    const getMaterialName = (id) => {
        const machine = data && data.machines && data.machines.find(machine => machine.id === parseInt(id));
        return machine ? machine.tenmaymoc : '';
    };


    return (
        <div style={{minWidth: '80vh'}}>
            <div className="container-fluid m-0">

                <div className="row ">

                    <div className='w-100 text-end mb-3'>
                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>
                    </div>
                   
                    <table className='table table-striped my-3' id="materialTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên máy móc</th>
                                <th>Loại máy móc</th>
                                {/* <th>Đơn giá/h</th> */}
                                <th className=''>Số giờ thuê</th>
                                {/* <th>Thành tiền</th> */}
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rows.map((row, index) => (
                                    <React.Fragment key={index}>
                                        <tr>

                                            <td>
                                                <select
                                                    name="mamaymoc"
                                                    className='form-select'
                                                    value={row.mamaymoc}
                                                    onChange={(e) => handleMaterialChange(e, index)}>
                                                    <option value="">---Chọn máy móc---</option>
                                                    {data && data.machines && data.machines.map((machine, indexMatterial) => (
                                                        <option key={machine.id} value={machine.id}>{machine.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mamaymoc)}</td>
                                            <td>
                                                <select
                                                    name="loaimaymoc"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index)}>
                                                    <option value="">---Chọn loại máy móc---</option>
                                                    {data && data.machines && data.machines.map(machine => (
                                                        machine.id === parseInt(row.mamaymoc) ? (
                                                            machine.loaimaymoc_name.split(',').map((item, indexType) => (
                                                                <option key={indexType + 4} value={item}>
                                                                    {item}
                                                                </option>
                                                            ))
                                                        ) : null
                                                    ))}
                                                </select>

                                            </td>
                                            {/* <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia')} /></td> */}
                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue')} /></td>
                                            {/* <td><input className='form-control' type="text" value={row.thanhtien} onChange={(e) => handleInputChange(e, index, 'thanhtien')} /></td> */}
                                            
                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index)}><i className="fa-solid fa-trash"></i></button></td>
                                        </tr>


                                    </React.Fragment>

                                ))
                            }
                        </tbody>
                    </table>
                    

                </div>
            </div>
        </div>
    );
}

export default FormHireMachine;

import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { putAPI, getAPI } from '../../utility/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const FormUpdateHireMachine = (props) => {
    const { id, setNewRowsMachines, setRowsMachines } = props.data;
    const queryClient = useQueryClient();
    const receiptMachineQuery = useQuery(['receipt_machine'], () => getAPI('/api/machineStatistic'));
    const hireMachineQuery = useQuery(['hireMachine'], () => getAPI('/api/getInfomationMachine'));

    const receiptMachineData = queryClient.getQueryData(['receipt_machine']);
    const hireMachineData = queryClient.getQueryData(['hireMachine']);

    const receiptMachineIsSuccess = receiptMachineQuery.isSuccess;
    const hireMachineIsSuccess = hireMachineQuery.isSuccess;

    const hireById = receiptMachineData ? receiptMachineData.machine_statistic.filter((item) => item.thongkengay_id === parseInt(id)) : [];

    const [rows, setRows] = useState([]);
    const [new_row, setNewRow] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

    useEffect(() => {
        if (receiptMachineIsSuccess) {
            setRows(hireById);
            setRowsMachines(hireById)
        }
    }, [id, receiptMachineIsSuccess]);


    
    const resetRows = () => {
        setRows([...hireById]);
        setRowsMachines([...hireById])
        setNewRow([]);
    };
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mamaymoc: '',
            loaimaymoc: '',
            sogiothue: '',
            tenmaymoc: '',
        };
        setNewRow([...new_row, newRow]);
        setNewRowsMachines([...new_row, newRow])
    };
   
    const handleMaterialChange = (event, index, check) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], mamaymoc: selectedId, tenmaymoc: materialName, loaimaymoc: '' };
            setRows(updatedRows);
            setRowsMachines(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], mamaymoc: selectedId, tenmaymoc: materialName, loaimaymoc: '' };
            setNewRow(updatedRows);
            setNewRowsMachines(updatedRows)
        }
    };

    const deleteRow = (index, check) => {
        if (check === 'old') {
            const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
            setRows(updatedRows);
            setRowsMachines(updatedRows)
        } else {
            const updatedRows = new_row.filter((row, rowIndex) => rowIndex !== index);
            setNewRow(updatedRows);
            setNewRowsMachines(updatedRows)
        }
    };

    const getMaterialName = (id) => {
        const material = hireMachineData?.machines?.find(material => material.id === parseInt(id));
        return material ? material.tenmaymoc : '';
    };

    const handleMaterialTypeChange = (event, index, check) => {
        const selectedType = event.target.value;
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], loaimaymoc: selectedType };
            setRows(updatedRows);
            setRowsMachines(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], loaimaymoc: selectedType };
            setNewRow(updatedRows);
            setNewRowsMachines(updatedRows)
        }
    };

    const handleContractorsChange = (event, index, check) => {
        const selectedId = parseInt(event.target.value);
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], nhathau_id: selectedId };
            setRows(updatedRows);
            setRowsMachines(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], nhathau_id: selectedId };
            setNewRow(updatedRows);
            setNewRowsMachines(updatedRows)
        }
    };

    const handleInputChange = (event, index, field, check) => {
        const updatedValue = event.target.value;
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], [field]: updatedValue };
            setRows(updatedRows);
            setRowsMachines(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], [field]: updatedValue };
            setNewRow(updatedRows);
            setNewRowsMachines(updatedRows)
        }
    };


    

    return (
        <div>
            <div style={{minWidth: '80vh'}}>

                <div className="row ">

                    <div className='w-100 text-end mb-3'>
                        <button className='btn btn-warning me-3' onClick={resetRows}>Reset</button>
                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>

                    </div>

                    <table className='table table-striped my-3' id="materialTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên máy móc</th>
                                <th>Loại máy móc</th>
                                <th>Số giờ thuê</th>
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
                                                    onChange={(e) => handleMaterialChange(e, index, 'old')}>
                                                    <option value="">---Chọn máy móc---</option>
                                                    {hireMachineData && hireMachineData.machines && hireMachineData.machines.map((material, indexMatterial) => (
                                                        <option key={material.id} value={material.id}>{material.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mamaymoc, 'old')}</td>
                                            <td>
                                                <select
                                                    name="loaimaymoc"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index, 'old')}
                                                    value={row.loaimaymoc}
                                                >

                                                    <option value="">---Chọn loại máy móc---</option>
                                                    {hireMachineData && hireMachineData.machines && hireMachineData.machines.map(material => (
                                                        material.id === parseInt(row.mamaymoc) ? (
                                                            material.loaimaymoc_name.split(',').map((item, indexType) => (
                                                                <option key={indexType + 4} value={item}>
                                                                    {item}
                                                                </option>
                                                            ))
                                                        ) : null
                                                    ))}
                                                </select>

                                            </td>
                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue', 'old')} /></td>

                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index, 'old')}><i className="fa-solid fa-trash"></i></button></td>
                                        </tr>


                                    </React.Fragment>

                                ))
                            }
                            {
                                new_row.map((row, index) => (
                                    <React.Fragment key={index}>
                                        <tr>

                                            <td>
                                                <select
                                                    name="mamaymoc"
                                                    className='form-select'
                                                    value={row.mamaymoc}
                                                    onChange={(e) => handleMaterialChange(e, index, 'new')}>
                                                    <option value="">---Chọn máy móc---</option>
                                                    {hireMachineData && hireMachineData.machines && hireMachineData.machines.map((material, indexMatterial) => (
                                                        <option key={material.id} value={material.id}>{material.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mamaymoc, 'new')}</td>
                                            <td>
                                                <select
                                                    name="loaimaymoc"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index, 'new')}
                                                    value={row.loaimaymoc}
                                                >

                                                    <option value="">---Chọn loại máy móc---</option>
                                                    {hireMachineData && hireMachineData.machines && hireMachineData.machines.map(material => (
                                                        material.id === parseInt(row.mamaymoc) ? (
                                                            material.loaimaymoc_name.split(',').map((item, indexType) => (
                                                                <option key={indexType + 4} value={item}>
                                                                    {item}
                                                                </option>
                                                            ))
                                                        ) : null
                                                    ))}
                                                </select>

                                            </td>
                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue', 'new')} />
                                            </td>
                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index, 'new')}><i className="fa-solid fa-trash"></i></button></td>
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

export default FormUpdateHireMachine;


import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { putAPI, getAPI } from '../../utility/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
const FormUpdateMatterial = (props) => {
    const { id, setNewRowsMatterials, setRowsMatterials } = props.data;
    const queryClient = useQueryClient();
    const receiptMatterialQuery = useQuery(['receipt_matterial'], () => getAPI('/api/matterialStatistic'));
    const hireMatterialQuery = useQuery(['importMatterial'], () => getAPI('/api/getInfomation'));

    const receiptMatterialData = queryClient.getQueryData(['receipt_matterial']);
    const hireMachineData = queryClient.getQueryData(['importMatterial']);

    const receiptMatterialsSuccess = receiptMatterialQuery.isSuccess;


    const importById = receiptMatterialData ? receiptMatterialData.matterial_statistic.filter((item) => item.thongkengay_id === parseInt(id)) : [];

    const [rows, setRows] = useState([]);
    const [new_row, setNewRow] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

    useEffect(() => {
        if (receiptMatterialsSuccess) {
            setRows(importById);
            setRowsMatterials(importById)
        }
    }, [id, receiptMatterialsSuccess]);




    const resetRows = () => {
        setRows([...importById]);
        setRowsMatterials([...importById])
        setNewRow([]);
    };
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mavatlieu: '',
            loaivatlieu: '',
            khoiluongdung: '',
            tenvatlieu: '',
            donvitinh: ''
            
        };
        setNewRow([...new_row, newRow]);
        setNewRowsMatterials([...new_row, newRow])
    };

    const handleMaterialChange = (event, index, check) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], mavatlieu: selectedId, tenvatlieu: materialName, loaivatlieu: '' };
            setRows(updatedRows);
            setRowsMatterials(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], mavatlieu: selectedId, tenvatlieu: materialName, loaivatlieu: '' };
            setNewRow(updatedRows);
            setNewRowsMatterials(updatedRows)
        }
    };

    const deleteRow = (index, check) => {
        if (check === 'old') {
            const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
            setRows(updatedRows);
            setRowsMatterials(updatedRows)
        } else {
            const updatedRows = new_row.filter((row, rowIndex) => rowIndex !== index);
            setNewRow(updatedRows);
            setNewRowsMatterials(updatedRows)
        }
    };

    const getMaterialName = (id) => {
        const material = hireMachineData?.matterials?.find(material => material.id === parseInt(id));
        return material ? material.tenvatlieu : '';
    };

    const handleMaterialTypeChange = (event, index, check) => {
        const selectedType = event.target.value;
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], loaivatlieu: selectedType };
            setRows(updatedRows);
            setRowsMatterials(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], loaivatlieu: selectedType };
            setNewRow(updatedRows);
            setNewRowsMatterials(updatedRows)
        }
    };


    const handleInputChange = (event, index, field, check) => {
        const updatedValue = event.target.value;
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index] = { ...updatedRows[index], [field]: updatedValue };
            setRows(updatedRows);
            setRowsMatterials(updatedRows)
        } else {
            const updatedRows = [...new_row];
            updatedRows[index] = { ...updatedRows[index], [field]: updatedValue };
            setNewRow(updatedRows);
            setNewRowsMatterials(updatedRows)
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
                                <th>Tên vật liệu</th>
                                <th>Loại vật liệu</th>
                                <th>Đơn vị tính</th>
                                <th>Khối lượng dựng</th>
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
                                                    name="mavatlieu"
                                                    className='form-select'
                                                    value={row.mavatlieu}
                                                    onChange={(e) => handleMaterialChange(e, index, 'old')}>
                                                    <option value="">---Chọn vật liệu---</option>
                                                    {hireMachineData && hireMachineData.matterials && hireMachineData.matterials.map((material, indexMatterial) => (
                                                        <option key={material.id} value={material.id}>{material.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mavatlieu, 'old')}</td>
                                            <td>
                                                <select
                                                    name="loaivatlieu"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index, 'old')}
                                                    value={row.loaivatlieu}
                                                >

                                                    <option value="">---Chọn loại vật liệu---</option>
                                                    {hireMachineData && hireMachineData.matterials && hireMachineData.matterials.map(material => (
                                                        material.id === parseInt(row.mavatlieu) ? (
                                                            material.loaivatlieu_name.split(',').map((item, indexType) => (
                                                                <option key={indexType + 4} value={item}>
                                                                    {item}
                                                                </option>
                                                            ))
                                                        ) : null
                                                    ))}
                                                </select>

                                            </td>
                                            <td><input className='form-control ' type="text" value={row.donvitinh} onChange={(e) => handleInputChange(e, index, 'donvitinh', 'old')} /></td>
                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung', 'old')} /></td>

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
                                                    name="mavatlieu"
                                                    className='form-select'
                                                    value={row.mavatlieu}
                                                    onChange={(e) => handleMaterialChange(e, index, 'new')}>
                                                    <option value="">---Chọn vật liệu---</option>
                                                    {hireMachineData && hireMachineData.matterials && hireMachineData.matterials.map((material, indexMatterial) => (
                                                        <option key={material.id} value={material.id}>{material.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mavatlieu, 'new')}</td>
                                            <td>
                                                <select
                                                    name="loaivatlieu"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index, 'new')}
                                                    value={row.loaivatlieu}
                                                >

                                                    <option value="">---Chọn loại vật liệu---</option>
                                                    {hireMachineData && hireMachineData.matterials && hireMachineData.matterials.map(material => (
                                                        material.id === parseInt(row.mavatlieu) ? (
                                                            material.loaivatlieu_name.split(',').map((item, indexType) => (
                                                                <option key={indexType + 4} value={item}>
                                                                    {item}
                                                                </option>
                                                            ))
                                                        ) : null
                                                    ))}
                                                </select>

                                            </td>
                                            <td><input className='form-control ' type="text" value={row.donvitinh} onChange={(e) => handleInputChange(e, index, 'donvitinh', 'new')} /></td>
                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung', 'new')} /></td>

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

export default FormUpdateMatterial;

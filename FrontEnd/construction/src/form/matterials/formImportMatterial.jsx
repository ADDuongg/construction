import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
const FormImportMatterial = ({setRowsMatterials}) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['importMatterial'], () => getAPI('/api/getInfomation'))
    const [rows, setRowsLocal] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mavatlieu: '',
            loaivatlieu: '',
            khoiluongdung: '',
            donvitinh: '',
            tenvatlieu: '',

        };
        setRowsLocal([...rows, newRow]);
        setRowsMatterials([...rows, newRow]);
    };
    
    /* const calculateTotal = (dongia, khoiluongdung) => {
        return parseFloat(dongia) * parseFloat(khoiluongdung);
    }; */

    const handleMaterialChange = (event, index) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        const updatedRows = [...rows];
        updatedRows[index].mavatlieu = selectedId;
        updatedRows[index].tenvatlieu = materialName;
        updatedRows[index].loaivatlieu = '';
        setRowsLocal(updatedRows);
        setRowsMatterials(updatedRows);
    };


    const handleMaterialTypeChange = (event, index) => {
        const selectedType = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index].loaivatlieu = selectedType;
        setRowsLocal(updatedRows);
        setRowsMatterials(updatedRows);
    };

    

    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;
        setRowsLocal(updatedRows);
        setRowsMatterials(updatedRows);
    };

    const deleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRowsLocal(updatedRows);
        setRowsMatterials(updatedRows);
    };




    const getMaterialName = (id) => {
        const material = data && data.matterials && data.matterials.find(material => material.id === parseInt(id));
        return material ? material.tenvatlieu : '';
    };
    return (
        <div style={{minWidth: '80vh'}}>
            <div className="container-fluid m-0">

                <div className="row " >

                    <div className='w-100 text-end mb-3'>
                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>
                    </div>
                    
                    <table className='table table-striped my-3' id="materialTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên vật liệu</th>
                                <th>Loại vật liệu</th>
                                <th>Đơn vị tính</th>
                               {/*  <th>Đơn giá</th> */}
                                <th>Khối lượng dựng</th>
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
                                                    name="mavatlieu"
                                                    className='form-select'
                                                    value={row.mavatlieu}
                                                    onChange={(e) => handleMaterialChange(e, index)}>
                                                    <option value="">---Chọn vật liệu---</option>
                                                    {data && data.matterials && data.matterials.map((material, indexMatterial) => (
                                                        <option key={material.id} value={material.id}>{material.id}</option>
                                                    ))}

                                                </select>
                                            </td>
                                            <td>{getMaterialName(row.mavatlieu)}</td>
                                            <td>
                                                <select
                                                    name="loaivatlieu"
                                                    className='form-select'
                                                    onChange={(e) => handleMaterialTypeChange(e, index)}>
                                                    <option value="">---Chọn loại vật liệu---</option>
                                                    {data && data.matterials && data.matterials.map(material => (
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
                                            
                                            <td><input className='form-control' type="text" value={row.donvitinh} onChange={(e) => handleInputChange(e, index, 'donvitinh')} /></td>
                                            {/* <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia')} /></td> */}
                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung')} /></td>
                                            {/* <td><input className='form-control' type="text" value={row.thanhtien} onChange={(e) => handleInputChange(e, index, 'thanhtien')} /></td> */}
                                            {/* <td>
                                                <select
                                                    name="nhathau_id"
                                                    className='form-select'

                                                    onChange={(e) => handleContractorsChange(e, index)}>
                                                    <option value="">---Chọn nhà thầu---</option>
                                                    {data && data.contractor && data.contractor.map((contractor, indexContractor) => (
                                                        <option key={indexContractor} value={contractor.nhathau_id}>{contractor.tennhathau}</option>
                                                    ))}
                                                </select>
                                            </td> */}
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

export default FormImportMatterial;

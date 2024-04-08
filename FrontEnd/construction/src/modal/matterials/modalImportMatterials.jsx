import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
const ModalImportMatterials = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['importMatterial'], () => getAPI('/api/getInfomation'))
    const [rows, setRows] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [importMatterial, setImport] = useState({
        duan_id: '',
        ghichu: '',
        nguoinhap: user[0]?.nhanvien_id,
    });
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mavatlieu: '',
            loaivatlieu: '',
            dongia: '',
            donvitinh: '',
            khoiluongdung: '',
            nhathau_id: '',
            tenvatlieu: '',
            thanhtien: ''
        };
        setRows([...rows, newRow]);
    };
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
    function handleImport(e) {
        setImport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const calculateTotal = (dongia, khoiluongdung) => {
        return parseFloat(dongia) * parseFloat(khoiluongdung);
    };

    const handleMaterialChange = (event, index) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        const updatedRows = [...rows];
        updatedRows[index].mavatlieu = selectedId;
        updatedRows[index].tenvatlieu = materialName;
        updatedRows[index].loaivatlieu = '';
        setRows(updatedRows);
    };


    const handleMaterialTypeChange = (event, index) => {
        const selectedType = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index].loaivatlieu = selectedType;
        setRows(updatedRows);
    };

    const handleContractorsChange = (event, index) => {
        const selectedId = parseInt(event.target.value);
        const updatedRows = [...rows];
        updatedRows[index].nhathau_id = selectedId;
        setRows(updatedRows);
    };

    const handleInputChange = (event, index, field) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = event.target.value;
        if (updatedRows[index].dongia !== '' && updatedRows[index].khoiluongdung !== '') {
            updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].khoiluongdung);
        }
        setRows(updatedRows);
    };

    const deleteRow = (index) => {
        const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(updatedRows);
    };
    const validateData = () => {

        let isValid = true;
        rows.forEach((row, index) => {
            if (!row.mavatlieu || !row.loaivatlieu || !row.donvitinh || !row.dongia || !row.khoiluongdung || !row.nhathau_id) {

                isValid = false;
            }
        });
        return isValid;
    };
    const mutation = useMutation((combinedData) => postAPI('/api/importMatterial', combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('import')
            
            setRows([])
            toast.success("Thêm vật liệu thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    const logData = () => {
       
        if (!importMatterial.duan_id) {
            Swal.fire({
                title: "Thông báo",
                text: "Vui lòng chọn dự án",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
            return;
        }

        if (rows.length === 0) {
            Swal.fire({
                title: "Thông báo",
                text: "Vui lòng thông tin vật liệu muốn nhập",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
            return;
        }

        if (!validateData()) {
            Swal.fire({
                title: "Thông báo",
                text: "Vui lòng nhập đủ thông tin nhập",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
            return;
        }

        
        const combinedData = {
            detailImport: [...rows],
            importMatterial: { ...importMatterial }
        };
        mutation.mutate(combinedData)
    };

    const handleCloseModal = () => {
        
        setRows([]);
    };


    const getMaterialName = (id) => {
        const material = data && data.matterials && data.matterials.find(material => material.id === parseInt(id));
        return material ? material.tenvatlieu : '';
    };

    return (
        <div className="modal fade" id="exampleModal" >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content" style={{ overflow: 'auto' }}>
                    <div style={{ minWidth: '100vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" >Nhập vật liệu</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body" >
                            <div className="container m-0">

                                <div className="row ">

                                    <div className='w-100 text-end mb-3'>
                                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>
                                    </div>
                                    <div className=" w-25">
                                        <label htmlFor="duan_id" className='form-label'>Danh sách dự án đang có</label>
                                        <select value={importMatterial.duan_id} name="duan_id" onChange={handleImport} className='form-select text-center' id="">
                                            <option value="">---Chọn dự án---</option>
                                            {filteredProjects?.map((item,index) => (
                                                <option key={index} value={item.id}>{item.tenduan}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <table className='table table-striped my-3' id="materialTable"  style={{minWidth: '100vh'}}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên vật liệu</th>
                                                <th>Loại vật liệu</th>
                                                <th className=''>Đơn vị tính</th>
                                                <th>Đơn giá</th>
                                                <th>Khối lượng dựng</th>
                                                <th>Thành tiền</th>
                                                <th>Nhà thầu</th>
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

                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung')} /></td>
                                                            <td><input className='form-control' type="text" value={row.thanhtien} onChange={(e) => handleInputChange(e, index, 'thanhtien')} /></td>
                                                            <td>
                                                                <select
                                                                    name="nhathau_id"
                                                                    className='form-select'

                                                                    onChange={(e) => handleContractorsChange(e, index)}>
                                                                    <option value="">---Chọn nhà thầu---</option>
                                                                    {data && data.contractor && data.contractor.map((contractor, indexContractor) => (
                                                                        <option key={indexContractor} value={contractor.nhathau_id}>{contractor.tennhathau}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index)}><i className="fa-solid fa-trash"></i></button></td>
                                                        </tr>


                                                    </React.Fragment>

                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <div className="my-3 w-100"  style={{minWidth: '100vh'}}>
                                        <textarea value={importMatterial.ghichu} onChange={handleImport} name="ghichu" rows={5} className='form-control' id="" placeholder='Nhập ghi chú...'></textarea>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleCloseModal} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" disabled={`${mutation.isLoading ? 'disabled' : ''}`} onClick={logData}>{mutation.isLoading ? 'Đang nhập...' : 'nhập'}</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    );
}

export default ModalImportMatterials;

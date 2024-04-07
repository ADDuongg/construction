import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const ModalHireMachine = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['hireMachine'], () => getAPI('/api/getInfomationMachine'))
    const [rows, setRows] = useState([]);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [importMatterial, setImport] = useState({
        duan_id: '',
        ghichu: '',
        nguoithue: user[0]?.hoten,
    });
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            mamaymoc: '',
            loaimaymoc: '',
            dongia: '',
            sogiothue: '',
            nhathau_id: '',
            tenmaymoc: '',
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
    const calculateTotal = (dongia, sogiothue) => {
        return parseFloat(dongia) * parseFloat(sogiothue);
    };

    const handleMaterialChange = (event, index) => {
        const selectedId = event.target.value;
        const materialName = getMaterialName(selectedId);
        const updatedRows = [...rows];
        updatedRows[index].mamaymoc = selectedId;
        updatedRows[index].tenmaymoc = materialName;
        updatedRows[index].loaimaymoc = '';
        setRows(updatedRows);
    };


    const handleMaterialTypeChange = (event, index) => {
        const selectedType = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index].loaimaymoc = selectedType;
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
        if (updatedRows[index].dongia !== '' && updatedRows[index].sogiothue !== '') {
            updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].sogiothue);
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
            if (!row.mamaymoc || !row.loaimaymoc  || !row.dongia || !row.sogiothue || !row.nhathau_id) {

                isValid = false;
            }
        });
        return isValid;
    };
    const mutation = useMutation((combinedData) => postAPI('/api/hireMachine', combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('hire')
            
            setRows([])
            toast.success("Thêm phiếu thuê thành công", {
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
                text: "Vui lòng thông tin máy móc muốn nhập",
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
            detailHire: [...rows],
            hireMachine: { ...importMatterial }
        };
        mutation.mutate(combinedData)
    };

    const handleCloseModal = () => {
        
        setRows([]);
    };


    const getMaterialName = (id) => {
        const machine = data && data.machines && data.machines.find(machine => machine.id === parseInt(id));
        return machine ? machine.tenmaymoc : '';
    };
    return (
        <div className={`modal fade `} id="exampleModal" >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content" style={{ overflow: 'auto' }}>
                    <div style={{ minWidth: '100vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Thuê máy móc </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="container m-0">

                                <div className="row " >

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
                                    <table className='table table-striped my-3' id="materialTable" style={{minWidth: '100vh'}}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên máy móc</th>
                                                <th>Loại máy móc</th>
                                                <th className=''>Đơn giá/h</th>
                                                <th className=''>Số giờ thuê</th>
                                                {/* <th>Khối lượng dựng</th> */}
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
                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue')} /></td>
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
                                    
                                        <textarea value={importMatterial.ghichu} onChange={handleImport} name="ghichu" rows={5} className='form-control mt-3' style={{minWidth: '100vh'}} id="" placeholder='Nhập ghi chú...'></textarea>
                                    

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleCloseModal} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled = {mutation.isLoading} type="button" className="btn btn-primary" onClick={logData}>{mutation.isLoading ? 'Đang tạo' : 'Tạo phiếu thuê'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalHireMachine;

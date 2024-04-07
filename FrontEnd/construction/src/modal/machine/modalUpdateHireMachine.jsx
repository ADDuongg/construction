import React, { useState, useEffect } from 'react';
import { useQueryClient, useQuery , useMutation } from 'react-query';
import Cookies from 'js-cookie';
import { putAPI, getAPI } from '../../utility/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const ModalUpdateHireMachine = (props) => {
    const { id, AllHire } = props.data
    const hireById = AllHire.find((item) => item.id === id) || {};
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData('hireMachine')
    const { data:info, isLoading } = useQuery(['hireMachine'], () => getAPI('/api/getInfomationMachine'))
    const contractors = data ? data.contractor : []
    const [rows, setRows] = useState([])
    const [new_row, setNewRow] = useState([])
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [hireMachine, setImport] = useState({
        duan_id: '',
        ghichu: '',
        nguoithue: user[0]?.hoten,
    });
    const duanIdsArray = user.map(item => item.duan_id);
    const filteredProjects = info?.project?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
    useEffect(() => {
        const duan_id = hireById.duan_id ? hireById.duan_id : ''
        const ghichu = hireById.ghichu ? hireById.ghichu : ''
        setImport((prev) => ({ ...prev, duan_id, ghichu }))


        if (hireById) {
            const tenvatlieuArray = hireById.tenmaymoc ? hireById.tenmaymoc.split(",") : [];
            const mavatlieuArray = hireById.mamaymoc ? hireById.mamaymoc.split(",") : [];
            const khoiluongdungArray = hireById.sogiothue ? hireById.sogiothue.split(",") : [];
            const loaivatlieuArray = hireById.loaimaymoc ? hireById.loaimaymoc.split(",") : [];
            const dongiaArray = hireById.dongia ? hireById.dongia.split(",") : [];
            const thanhtienArray = hireById.thanhtien ? hireById.thanhtien.split(",") : [];
            const nhathauIdArray = hireById.nhathau_id ? hireById.nhathau_id.split(",") : [];
            const idDetail = hireById.idDetail ? hireById.idDetail.split(",") : [];
            const newRows = tenvatlieuArray.map((tenmaymoc, index) => ({
                idDetail: parseInt(idDetail[index]),
                mamaymoc: mavatlieuArray[index],
                loaimaymoc: loaivatlieuArray[index],
                dongia: dongiaArray[index],
                sogiothue: khoiluongdungArray[index],
                nhathau_id: nhathauIdArray[index],
                tenmaymoc: tenmaymoc,
                thanhtien: thanhtienArray[index]
            }));

            setRows(newRows);
        }

    }, [id]);
    console.log(hireById);
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
        setNewRow([...new_row, newRow]);
    };

    const handleMaterialChange = (event, index, check) => {
        if (check === 'old') {

            const selectedId = event.target.value;
            const materialName = getMaterialName(selectedId);
            const updatedRows = [...rows];
            updatedRows[index].mamaymoc = selectedId;
            updatedRows[index].tenmaymoc = materialName;
            updatedRows[index].loaimaymoc = '';
            setRows(updatedRows);
        } else {
            const selectedId = event.target.value;
            const materialName = getMaterialName(selectedId);
            const updatedRows = [...new_row];
            updatedRows[index].mamaymoc = selectedId;
            updatedRows[index].tenmaymoc = materialName;
            updatedRows[index].loaimaymoc = '';
            setNewRow(updatedRows);
        }
    };
    const deleteRow = (index, check) => {
        if (check === 'old') {
            const updatedRows = rows.filter((row, rowIndex) => rowIndex !== index);
            setRows(updatedRows);
        }
        else {
            const updatedRows = new_row.filter((row, rowIndex) => rowIndex !== index);
            setNewRow(updatedRows);
        }
    };
    const getMaterialName = (id) => {
        const material = data && data.machines && data.machines.find(material => material.id === parseInt(id));
        return material ? material.tenmaymoc : '';
    };
    const calculateTotal = (dongia, sogiothue) => {
        return parseFloat(dongia) * parseFloat(sogiothue);
    };
    const handleMaterialTypeChange = (event, index, check) => {
        if (check === 'old') {
            const selectedType = event.target.value;
            const updatedRows = [...rows];
            updatedRows[index].loaimaymoc = selectedType;
            setRows(updatedRows);

        } else {
            const selectedType = event.target.value;
            const updatedRows = [...new_row];
            updatedRows[index].loaimaymoc = selectedType;
            setNewRow(updatedRows);
        }
    };

    const handleContractorsChange = (event, index, check) => {
        if (check === 'old') {
            const selectedId = parseInt(event.target.value);
            const updatedRows = [...rows];
            updatedRows[index].nhathau_id = selectedId;
            setRows(updatedRows);

        } else {
            const selectedId = parseInt(event.target.value);
            const updatedRows = [...new_row];
            updatedRows[index].nhathau_id = selectedId;
            setNewRow(updatedRows);
        }
    };
    const handleInputChange = (event, index, field, check) => {
        if (check === 'old') {
            const updatedRows = [...rows];
            updatedRows[index][field] = event.target.value;
            if (updatedRows[index].dongia !== '' && updatedRows[index].sogiothue !== '') {
                updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].sogiothue);
            }
            setRows(updatedRows);

        } else {
            const updatedRows = [...new_row];
            updatedRows[index][field] = event.target.value;
            if (updatedRows[index].dongia !== '' && updatedRows[index].sogiothue !== '') {
                updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].sogiothue);
            }
            setNewRow(updatedRows);
        }
    };

    function handleImport(e) {
        setImport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const mutation = useMutation((combinedData) => putAPI(`/api/hireMachine/${id}`, combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('hire')

            toast.success("Cập nhật phiếu thuê thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    const validateData = () => {

        let isValid = true;
        if(rows.length !== 0){
            rows.forEach((row, index) => {
                if (!row.mamaymoc || !row.loaimaymoc  || !row.dongia || !row.sogiothue || !row.nhathau_id) {
    
                    isValid = false;
                }
            });
        }
        if(new_row.length !== 0){
            new_row.forEach((row, index) => {
                if (!row.mamaymoc || !row.loaimaymoc || !row.dongia || !row.sogiothue || !row.nhathau_id) {
    
                    isValid = false;
                }
            });
        }

        return isValid;
    };
    const handleUpdate = () => {

        if (!hireMachine.duan_id) {
            Swal.fire({
                title: "Thông báo",
                text: "Vui lòng chọn dự án",
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
            old_hire: [...rows],
            new_hire: [...new_row],
            hireMachine: { ...hireMachine },
            method: '_PUT'
        };
        console.log(combinedData);
        mutation.mutate(combinedData)
    };
    const resetRows = () => {
        const initialRows = hireById.tenmaymoc.split(",").map((tenmaymoc, index) => ({
            idDetail: parseInt(hireById.idDetail.split(",")[index]),
            mamaymoc: hireById.mamaymoc.split(",")[index],
            loaimaymoc: hireById.loaimaymoc.split(",")[index],
            dongia: hireById.dongia.split(",")[index],
            sogiothue: hireById.sogiothue.split(",")[index],
            nhathau_id: hireById.nhathau_id.split(",")[index],
            tenmaymoc: tenmaymoc,
            thanhtien: hireById.thanhtien.split(",")[index]
        }));
        setRows(initialRows);
        setNewRow([]);
    };
    const handleCloseModal = () => {
        resetRows(); 
    };
    return (
        <div className="modal fade" id="modalUpdateHireReceipt">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content" style={{ overflow: 'auto' }}>
                    <div style={{ minWidth: '100vh', height: '100%', width: 'auto' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Cập nhật thông tin phiếu thuê</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">

                            <div className="container m-0">

                                <div className="row ">

                                    <div className='w-100 text-end mb-3'>
                                        <button className='btn btn-warning me-3' onClick={resetRows}>Reset</button>
                                        <button className='btn btn-success' onClick={addRow}>Thêm mới</button>

                                    </div>
                                    <div className=" w-25">
                                        <label htmlFor="duan_id" className='form-label'>Danh sách dự án đang có</label>
                                        <select value={hireMachine.duan_id} name="duan_id" onChange={handleImport} className='form-select text-center' id="">
                                            <option value="">---Chọn dự án---</option>
                                            {filteredProjects?.map((item, index) => (
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
                                                                    name="mamaymoc"
                                                                    className='form-select'
                                                                    value={row.mamaymoc}
                                                                    onChange={(e) => handleMaterialChange(e, index, 'old')}>
                                                                    <option value="">---Chọn máy móc---</option>
                                                                    {data && data.machines && data.machines.map((material, indexMatterial) => (
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
                                                                    {data && data.machines && data.machines.map(material => (
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
                                                            

                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia', 'old')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue', 'old')} /></td>
                                                            <td><input className='form-control' type="text" value={row.thanhtien} onChange={(e) => handleInputChange(e, index, 'thanhtien', 'old')} /></td>
                                                            <td>
                                                                <select
                                                                    name="nhathau_id"
                                                                    className='form-select'
                                                                    value={row.nhathau_id}
                                                                    onChange={(e) => handleContractorsChange(e, index, 'old')}>
                                                                    <option value="">---Chọn nhà thầu---</option>
                                                                    {data && data.contractor && data.contractor.map((contractor, indexContractor) => (
                                                                        <option key={indexContractor} value={contractor.nhathau_id}>{contractor.tennhathau}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
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
                                                                    {data && data.machines && data.machines.map((material, indexMatterial) => (
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
                                                                    {data && data.machines && data.machines.map(material => (
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
                                                            

                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia', 'new')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.sogiothue} onChange={(e) => handleInputChange(e, index, 'sogiothue', 'new')} /></td>
                                                            <td><input className='form-control' type="text" value={row.thanhtien} onChange={(e) => handleInputChange(e, index, 'thanhtien', 'new')} /></td>
                                                            <td>
                                                                <select
                                                                    name="nhathau_id"
                                                                    className='form-select'
                                                                    value={row.nhathau_id}
                                                                    onChange={(e) => handleContractorsChange(e, index, 'new')}>
                                                                    <option value="">---Chọn nhà thầu---</option>
                                                                    {data && data.contractor && data.contractor.map((contractor, indexContractor) => (
                                                                        <option key={indexContractor} value={contractor.nhathau_id}>{contractor.tennhathau}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td><button className='btn btn-danger' onClick={() => deleteRow(index, 'new')}><i className="fa-solid fa-trash"></i></button></td>
                                                        </tr>


                                                    </React.Fragment>

                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    
                                        <textarea value={hireMachine.ghichu} onChange={handleImport} name="ghichu" rows={5} className='form-control' style={{minWidth: '100vh'}} id="" placeholder='Nhập ghi chú...'></textarea>
                                    

                                </div>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleCloseModal} className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button disabled = {mutation.isLoading} type="button" className="btn btn-primary" onClick={handleUpdate}>{mutation.isLoading ? 'Đang cập nhật' : 'Cập nhật'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateHireMachine;

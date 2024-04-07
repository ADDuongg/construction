import React, { useState, useEffect } from 'react';
import { useQueryClient,useQuery, useMutation } from 'react-query';
import Cookies from 'js-cookie';
import { putAPI, getAPI } from '../../utility/api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const ModalUpdateImportMatterial = (props) => {
    const { id, AllImport, allContractors } = props.data
    const importById = AllImport.find((item) => item.id === id) || {};
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData('importMatterial')
    const { data:info, isLoading } = useQuery(['hireMatterial'], () => getAPI('/api/getInfomation'))
    const contractors = data ? data.contractor : []
    const [rows, setRows] = useState([])
    const [new_row, setNewRow] = useState([])
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [importMatterial, setImport] = useState({
        duan_id: '',
        ghichu: '',
        nguoinhap: user[0]?.hoten,
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
        const duan_id = importById.duan_id ? importById.duan_id : ''
        const ghichu = importById.ghichu ? importById.ghichu : ''
        setImport((prev) => ({ ...prev, duan_id, ghichu }))


        if (importById) {
            const tenvatlieuArray = importById.tenvatlieu ? importById.tenvatlieu.split(",") : [];
            const mavatlieuArray = importById.mavatlieu ? importById.mavatlieu.split(",") : [];
            const khoiluongdungArray = importById.khoiluongdung ? importById.khoiluongdung.split(",") : [];
            const loaivatlieuArray = importById.loaivatlieu ? importById.loaivatlieu.split(",") : [];
            const donvitinhArray = importById.donvitinh ? importById.donvitinh.split(",") : [];
            const dongiaArray = importById.dongia ? importById.dongia.split(",") : [];
            const thanhtienArray = importById.thanhtien ? importById.thanhtien.split(",") : [];
            const nhathauIdArray = importById.nhathau_id ? importById.nhathau_id.split(",") : [];
            const idDetail = importById.idDetail ? importById.idDetail.split(",") : [];
            const newRows = tenvatlieuArray.map((tenvatlieu, index) => ({
                idDetail: parseInt(idDetail[index]),
                mavatlieu: mavatlieuArray[index],
                loaivatlieu: loaivatlieuArray[index],
                dongia: dongiaArray[index],
                donvitinh: donvitinhArray[index],
                khoiluongdung: khoiluongdungArray[index],
                nhathau_id: nhathauIdArray[index],
                tenvatlieu: tenvatlieu,
                thanhtien: thanhtienArray[index]
            }));

            setRows(newRows);
        }

    }, [id]);
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
        setNewRow([...new_row, newRow]);
    };

    const handleMaterialChange = (event, index, check) => {
        if (check === 'old') {

            const selectedId = event.target.value;
            const materialName = getMaterialName(selectedId);
            const updatedRows = [...rows];
            updatedRows[index].mavatlieu = selectedId;
            updatedRows[index].tenvatlieu = materialName;
            updatedRows[index].loaivatlieu = '';
            setRows(updatedRows);
        } else {
            const selectedId = event.target.value;
            const materialName = getMaterialName(selectedId);
            const updatedRows = [...new_row];
            updatedRows[index].mavatlieu = selectedId;
            updatedRows[index].tenvatlieu = materialName;
            updatedRows[index].loaivatlieu = '';
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
        const material = data && data.matterials && data.matterials.find(material => material.id === parseInt(id));
        return material ? material.tenvatlieu : '';
    };
    const calculateTotal = (dongia, khoiluongdung) => {
        return parseFloat(dongia) * parseFloat(khoiluongdung);
    };
    const handleMaterialTypeChange = (event, index, check) => {
        if (check === 'old') {
            const selectedType = event.target.value;
            const updatedRows = [...rows];
            updatedRows[index].loaivatlieu = selectedType;
            setRows(updatedRows);

        } else {
            const selectedType = event.target.value;
            const updatedRows = [...new_row];
            updatedRows[index].loaivatlieu = selectedType;
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
            if (updatedRows[index].dongia !== '' && updatedRows[index].khoiluongdung !== '') {
                updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].khoiluongdung);
            }
            setRows(updatedRows);

        } else {
            const updatedRows = [...new_row];
            updatedRows[index][field] = event.target.value;
            if (updatedRows[index].dongia !== '' && updatedRows[index].khoiluongdung !== '') {
                updatedRows[index].thanhtien = calculateTotal(updatedRows[index].dongia, updatedRows[index].khoiluongdung);
            }
            setNewRow(updatedRows);
        }
    };

    function handleImport(e) {
        setImport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    function handleImport(e) {
        setImport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const mutation = useMutation((combinedData) => putAPI(`/api/importMatterial/${id}`, combinedData), {
        onSuccess: () => {
            queryClient.invalidateQueries('import')

            toast.success("Cập nhật phiếu nhập thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    const validateData = () => {

        let isValid = true;
        if(rows.length !== 0){
            rows.forEach((row, index) => {
                if (!row.mavatlieu || !row.loaivatlieu || !row.donvitinh || !row.dongia || !row.khoiluongdung || !row.nhathau_id) {
    
                    isValid = false;
                }
            });
        }
        if(new_row.length !== 0){
            new_row.forEach((row, index) => {
                if (!row.mavatlieu || !row.loaivatlieu || !row.donvitinh || !row.dongia || !row.khoiluongdung || !row.nhathau_id) {
    
                    isValid = false;
                }
            });
        }

        return isValid;
    };
    const handleUpdate = () => {

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
            old_import: [...rows],
            new_import: [...new_row],
            importMatterial: { ...importMatterial },
            method: '_PUT'
        };
        console.log(combinedData);
        mutation.mutate(combinedData)
    };
    const resetRows = () => {
        
        const initialRows = importById.tenvatlieu.split(",").map((tenvatlieu, index) => ({
            idDetail: parseInt(importById.idDetail.split(",")[index]),
            mavatlieu: importById.mavatlieu.split(",")[index],
            loaivatlieu: importById.loaivatlieu.split(",")[index],
            dongia: importById.dongia.split(",")[index],
            donvitinh: importById.donvitinh.split(",")[index],
            khoiluongdung: importById.khoiluongdung.split(",")[index],
            nhathau_id: importById.nhathau_id.split(",")[index],
            tenvatlieu: tenvatlieu,
            thanhtien: importById.thanhtien.split(",")[index]
        }));
       
        setRows(initialRows);
        setNewRow([]);
    };
    const handleCloseModal = () => {
        
        resetRows(); 
    };
    
    


    return (
        <div className="modal fade" id="modalUpdateImportReceipt">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content" style={{ overflow: 'auto'}}>
                    <div style={{ minWidth: '100vh', height: '100%', width: 'auto' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Sửa phiếu nhập</h1>
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
                                        <select value={importMatterial.duan_id} name="duan_id" onChange={handleImport} className='form-select text-center' id="">
                                            <option value="">---Chọn dự án---</option>
                                            {filteredProjects?.map((item, index) => (
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
                                                                    onChange={(e) => handleMaterialChange(e, index, 'old')}>
                                                                    <option value="">---Chọn vật liệu---</option>
                                                                    {data && data.matterials && data.matterials.map((material, indexMatterial) => (
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
                                                            <td><input className='form-control' type="text" value={row.donvitinh} onChange={(e) => handleInputChange(e, index, 'donvitinh', 'old')} /></td>

                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia', 'old')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung', 'old')} /></td>
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
                                                                    name="mavatlieu"
                                                                    className='form-select'
                                                                    value={row.mavatlieu}
                                                                    onChange={(e) => handleMaterialChange(e, index, 'new')}>
                                                                    <option value="">---Chọn vật liệu---</option>
                                                                    {data && data.matterials && data.matterials.map((material, indexMatterial) => (
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
                                                            <td><input className='form-control' type="text" value={row.donvitinh} onChange={(e) => handleInputChange(e, index, 'donvitinh', 'new')} /></td>

                                                            <td><input className='form-control' type="text" value={row.dongia} onChange={(e) => handleInputChange(e, index, 'dongia', 'new')} /></td>
                                                            <td><input className='form-control ' type="text" value={row.khoiluongdung} onChange={(e) => handleInputChange(e, index, 'khoiluongdung', 'new')} /></td>
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
                                    <div className="my-3 w-100"  style={{minWidth: '100vh'}}>
                                        <textarea value={importMatterial.ghichu} onChange={handleImport} name="ghichu" rows={5} className='form-control' id="" placeholder='Nhập ghi chú...'></textarea>
                                    </div>

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

export default ModalUpdateImportMatterial;

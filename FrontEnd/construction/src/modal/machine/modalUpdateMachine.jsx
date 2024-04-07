import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateMachine = (props) => {
    const { mamaymoc, allMachines } = props.data
    const machineById = allMachines.find((item) => item.id === mamaymoc) || {};
    const old_types = machineById?.loaimaymoc_name?.split(',') || [];
    const queryClient = useQueryClient();


    const [formData, setFormData] = useState({
        mamaymoc_cu: machineById.mamaymoc || '',
        mamaymoc: machineById.mamaymoc || '',
        tenmaymoc: machineById.tenmaymoc || '',
        mota: machineById.mota || '',
        loaimaymoc: '',
        new_types: [],
        old_typess: old_types,
        _method: 'PUT',
    });
    useEffect(() => {
        setFormData({
            mamaymoc_cu: machineById.mamaymoc || '',
            mamaymoc: machineById.mamaymoc || '',
            tenmaymoc: machineById.tenmaymoc || '',
            mota: machineById.mota || '',
            loaimaymoc: '',
            new_types: [],
            old_types: old_types,
            _method: 'PUT',
        })

    }, [mamaymoc])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleAddType = () => {
        const newType = formData.loaimaymoc;
        setFormData((prevData) => ({
            ...prevData,
            loaimaymoc: '',
            new_types: [...prevData.new_types, newType],
        }));
    };
    function handleRemoveType(index, check) {
        if (check === 'old') {
            const copy = [...formData.old_types];
            copy.splice(index, 1)
            setFormData((prev) => ({ ...prev, old_types: copy }))
        }
        else {
            const copy = [...formData.new_types];
            copy.splice(index, 1)
            setFormData((prev) => ({ ...prev, loaimaymoc: '', new_types: copy }))
        }
    }
    const mutation = useMutation(() => putAPI(`/api/machine/${mamaymoc}`,formData),{
        onSuccess: ()=>{
            queryClient.invalidateQueries('machine')
            toast.success("Cập nhật thông tin máy móc thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    function handleUpdate() {
        mutation.mutate();
        
        
    }
    return (
        <div className="modal fade" id="modalUpdateMachine">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Chỉnh sửa thông tin máy móc</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                           {/*  <div className="mb-3">
                                <label htmlFor="mamaymoc" className="form-label">Mã máy móc</label>
                                <input type="text" className="form-control" id="mamaymoc" name="mamaymoc" value={formData.mamaymoc} onChange={handleChange} />
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="tenmaymoc" className="form-label">Tên máy móc</label>
                                <input type="text" className="form-control" id="tenmaymoc" name="tenmaymoc" value={formData.tenmaymoc} onChange={handleChange} />
                            </div>
                            <div className="w-100 d-flex justify-content-between align-items-end mb-3">
                                <div className="w-50">
                                    <label htmlFor="loaimaymoc" className="form-label">Loại máy móc</label>
                                    <input type="text" className="form-control" id="loaimaymoc" name="loaimaymoc" onChange={handleChange} placeholder='Nhập loại máy móc muốn thêm..' />
                                </div>
                                <button onClick={handleAddType} className='btn btn-success h-auto '>Thêm loại máy móc</button>
                            </div>

                            <div className="allType w-100 d-flex flex-wrap">
                                {formData.old_types && formData.old_types.map((type, index) => (
                                    <div key={index} className="typeItem d-flex justify-content-between align-items-center mb-2 ">
                                        <div className='p-3 position-relative rounded me-3 w-auto' style={{ backgroundColor: '#0df04f', color: 'black', minWidth: '10rem' }}>
                                            {type}
                                            <button onClick={() => handleRemoveType(index, 'old')} type="button" className="btn-close position-absolute" style={{ top: '0', right: '5px' }} aria-label="Close"></button>
                                        </div>
                                    </div>
                                ))}
                                {formData.new_types && formData.new_types.map((type, index) => (
                                    <div key={index} className="typeItem d-flex justify-content-between align-items-center mb-2 ">
                                        <div className='p-3 position-relative rounded me-3 w-auto' style={{ backgroundColor: '#0df04f', color: 'black', minWidth: '10rem' }}>
                                            {type}
                                            <button onClick={() => handleRemoveType(index, 'new')} type="button" className="btn-close position-absolute" style={{ top: '0', right: '5px' }} aria-label="Close"></button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="mota" className="form-label">Mô tả</label>
                                <textarea type="text" className="form-control" id="mota" name="mota" value={formData.mota} onChange={handleChange} rows={8}></textarea>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" onClick={handleUpdate} className="btn btn-primary" >Sửa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateMachine;

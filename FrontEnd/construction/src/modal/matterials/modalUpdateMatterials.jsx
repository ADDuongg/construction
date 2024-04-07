import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';
const ModalUpdateMatterials = (props) => {
    const { mavatlieu, allMatterials } = props.data
    const matterialsById = allMatterials.find((item) => item.id === mavatlieu) || {};
    const old_types = matterialsById?.loaivatlieu_name?.split(',') || [];
    const queryClient = useQueryClient();


    const [formData, setFormData] = useState({
        mavatlieu_cu: matterialsById.mavatlieu || '',
        mavatlieu: matterialsById.mavatlieu || '',
        tenvatlieu: matterialsById.tenvatlieu || '',
        donvitinh: matterialsById.donvitinh || '',
        mota: matterialsById.mota || '',
        loaivatlieu: '',
        new_types: [],
        old_typess: old_types,
        _method: 'PUT',
    });
    useEffect(() => {
        setFormData({
            mavatlieu_cu: matterialsById.mavatlieu || '',
            mavatlieu: matterialsById.mavatlieu || '',
            tenvatlieu: matterialsById.tenvatlieu || '',
            donvitinh: matterialsById.donvitinh || '',
            mota: matterialsById.mota || '',
            loaivatlieu: '',
            new_types: [],
            old_types: old_types,
            _method: 'PUT',
        })

    }, [mavatlieu])
    console.log(formData);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleAddType = () => {
        const newType = formData.loaivatlieu;
        setFormData((prevData) => ({
            ...prevData,
            loaivatlieu: '',
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
            setFormData((prev) => ({ ...prev, loaivatlieu: '', new_types: copy }))
        }
    }
    const mutation = useMutation(() => putAPI(`/api/matterial/${mavatlieu}`,formData),{
        onSuccess: ()=>{
            queryClient.invalidateQueries('matterials')
            toast.success("Cập nhật thông tin vật liệu thành công", {
                position: "top-right",
                autoClose: 1000
            });
        }
    })
    function handleUpdate() {
        mutation.mutate();
        
        
    }
    return (
        <div className="modal fade" id="modalUpdateMatterials">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Chỉnh sửa thông tin vật liệu</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            {/* <div className="mb-3">
                                <label htmlFor="mavatlieu" className="form-label">Mã vật liệu</label>
                                <input type="text" className="form-control" id="mavatlieu" name="mavatlieu" value={formData.mavatlieu} onChange={handleChange} />
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="tenvatlieu" className="form-label">Tên vật liệu</label>
                                <input type="text" className="form-control" id="tenvatlieu" name="tenvatlieu" value={formData.tenvatlieu} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="donvitinh" className="form-label">Đơn vị tính</label>
                                <input type="text" className="form-control" id="donvitinh" name="donvitinh" value={formData.donvitinh} onChange={handleChange} />
                            </div>
                            <div className="w-100 d-flex justify-content-between align-items-end mb-3">
                                <div className="w-50">
                                    <label htmlFor="loaivatlieu" className="form-label">Loại vật liệu</label>
                                    <input type="text" className="form-control" id="loaivatlieu" name="loaivatlieu" onChange={handleChange} placeholder='Nhập loại vật liệu muốn thêm..' />
                                </div>
                                <button onClick={handleAddType} className='btn btn-success h-auto '>Thêm loại vật liệu</button>
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

export default ModalUpdateMatterials;

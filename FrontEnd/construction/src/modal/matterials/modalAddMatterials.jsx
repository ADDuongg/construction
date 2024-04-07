import React, { useState } from 'react';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import { postAPI } from '../../utility/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ModalAddMatterials = () => {
    const [types, setTypes] = useState([]);
    const [matterials, setFormData] = useState({
        mavatlieu: '',
        tenvatlieu: '',
        donvitinh: '',
        loaivatlieu: '',
        mota: '',
        types: []
    });
    const queryClient = useQueryClient();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const mutation = useMutation(
        (data) => postAPI('/api/matterial', data),
        {
            onSuccess: () => {
                toast.success("Thêm vật liệu thành công", {
                    position: "top-right",
                    autoClose: 1000
                });
                setFormData({
                    mavatlieu: '',
                    tenvatlieu: '',
                    donvitinh: '',
                    loaivatlieu: '',
                    mota: '',
                    types: []
                });
                setTypes([])
                queryClient.invalidateQueries('matterials')
            },
            onError: (error) => {
                if (error.message.includes('400')) {
                    toast.error("Mã vật liệu này đã có, vui lòng thử lại", {
                        position: "top-right",
                        autoClose: 3000
                    })
                }

            }

        }
    );



    const handleAddType = () => {
        const newType = matterials.loaivatlieu;
        setTypes((prevTypes) => [...prevTypes, newType]);
        setFormData((prevData) => ({
            ...prevData,
            loaivatlieu: '',
            types: [...prevData.types, newType],
        }));
    };

    const handleRemoveType = (index) => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };
    function handleSubmit() {
        if (matterials.loaivatlieu && types.length === 0) {
            Swal.fire({
                title: "Thông báo",
                text: "Bạn chưa thêm loại vật liệu",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            })
            return
        }
        mutation.mutate(matterials)
    }
    return (
        <div className="modal fade" id="modalMatterials">
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%', width: 'auto'}}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Thêm thông tin vật liệu</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body p-4">
                            {/* <div className="mb-3">
                                <label htmlFor="mavatlieu" className="form-label">Mã vật liệu</label>
                                <input type="text" className="form-control" id="mavatlieu" name="mavatlieu" value={matterials.mavatlieu} onChange={handleChange} />
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="tenvatlieu" className="form-label">Tên vật liệu</label>
                                <input type="text" className="form-control" id="tenvatlieu" name="tenvatlieu" value={matterials.tenvatlieu} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="donvitinh" className="form-label">Đơn vị tính</label>
                                <input type="text" className="form-control" id="donvitinh" name="donvitinh" value={matterials.donvitinh} onChange={handleChange} />
                            </div>
                            {/*  <div className="mb-3">
                                <label htmlFor="loaivatlieu" className="form-label">Loại vật liệu</label>
                                <input type="text" className="form-control" id="loaivatlieu" name="loaivatlieu" value={matterials.loaivatlieu} onChange={handleChange} />
                            </div> */}
                            <div className="w-100 d-flex justify-content-between align-items-end mb-3">
                                <div className="w-50">
                                    <label htmlFor="loaivatlieu" className="form-label">Loại vật liệu</label>
                                    <input type="text" className="form-control" id="loaivatlieu" value={matterials.loaivatlieu} name="loaivatlieu" onChange={handleChange} placeholder='Nhập loại vật liệu muốn thêm..' />
                                </div>
                                <button onClick={handleAddType} className='btn btn-success h-auto '>Thêm loại vật liệu</button>
                            </div>

                            <div className="allType w-100 d-flex flex-wrap">
                                {types.map((type, index) => (
                                    <div key={index} className="typeItem d-flex justify-content-between align-items-center mb-2 ">
                                        <div className='p-3 position-relative rounded me-3 w-auto' style={{ backgroundColor: '#0df04f', color: 'black', minWidth: '10rem' }}>
                                            {type}
                                            <button  onClick={() => handleRemoveType(index)} type="button" className="btn-close position-absolute" style={{ top: '0', right: '5px' }} aria-label="Close"></button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="mb-3">
                                <label htmlFor="mota" className="form-label">Mô tả</label>
                                <textarea rows={8} type="text" value={matterials.mota} className="form-control" id="mota" name="mota" onChange={handleChange} ></textarea>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAddMatterials;

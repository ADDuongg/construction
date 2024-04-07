import React, { useState } from 'react';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import { postAPI } from '../../utility/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ModalAddMachine = () => {
    const [types, setTypes] = useState([]);
    const [matterials, setFormData] = useState({
        mamaymoc: '',
        tenmaymoc: '',
        loaimaymoc: '',
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
        (data) => postAPI('/api/machine', data),
        {
            onSuccess: () => {
                toast.success("Thêm máy móc thành công", {
                    position: "top-right",
                    autoClose: 1000
                });
                setFormData({
                    mamaymoc: '',
                    tenmaymoc: '',
                    loaimaymoc: '',
                    mota: '',
                    types: []
                });
                setTypes([])
                queryClient.invalidateQueries('matterials')
            },
            onError: (error) => {
                if (error.message.includes('400')) {
                    toast.error("Mã máy móc này đã có, vui lòng thử lại", {
                        position: "top-right",
                        autoClose: 3000
                    })
                }

            }

        }
    );



    const handleAddType = () => {
        const newType = matterials.loaimaymoc;
        setTypes((prevTypes) => [...prevTypes, newType]);
        setFormData((prevData) => ({
            ...prevData,
            loaimaymoc: '',
            types: [...prevData.types, newType],
        }));
    };

    const handleRemoveType = (index) => {
        const updatedTypes = [...types];
        updatedTypes.splice(index, 1);
        setTypes(updatedTypes);
    };
    function handleSubmit() {
        if (matterials.loaimaymoc && types.length === 0) {
            Swal.fire({
                title: "Thông báo",
                text: "Bạn chưa thêm loại máy móc",
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
        <div className="modal fade" id="modalMachine" >
            <div className="modal-dialog modal-lg ">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thông tin máy móc</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">
                            {/* <div className="mb-3">
                                <label htmlFor="mamaymoc" className="form-label">Mã máy móc</label>
                                <input type="text" className="form-control" id="mamaymoc" name="mamaymoc" value={matterials.mamaymoc} onChange={handleChange} />
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="tenmaymoc" className="form-label">Tên máy móc</label>
                                <input type="text" className="form-control" id="tenmaymoc" name="tenmaymoc" value={matterials.tenmaymoc} onChange={handleChange} />
                            </div>

                            <div className="w-100 d-flex justify-content-between align-items-end mb-3">
                                <div className="w-50">
                                    <label htmlFor="loaimaymoc" className="form-label">Loại máy móc</label>
                                    <input type="text" className="form-control" id="loaimaymoc" value={matterials.loaimaymoc} name="loaimaymoc" onChange={handleChange} placeholder='Nhập loại máy móc muốn thêm..' />
                                </div>
                                <button onClick={handleAddType} className='btn btn-success h-auto '>Thêm loại máy móc</button>
                            </div>

                            <div className="allType w-100 d-flex flex-wrap">
                                {types.map((type, index) => (
                                    <div key={index} className="typeItem d-flex justify-content-between align-items-center mb-2 ">
                                        <div className='p-3 position-relative rounded me-3 w-auto' style={{ backgroundColor: '#0df04f', color: 'black', minWidth: '10rem' }}>
                                            {type}
                                            <button onClick={() => handleRemoveType(index)} type="button" className="btn-close position-absolute" style={{ top: '0', right: '5px' }} aria-label="Close"></button>
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled = {mutation.isLoading} type="button" onClick={handleSubmit} className="btn btn-primary" >{mutation.isLoading ? 'Đang thêm' : 'Thêm'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddMachine;

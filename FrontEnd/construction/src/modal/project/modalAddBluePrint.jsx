import React, { useState, useRef, useEffect } from 'react';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import { postAPI } from '../../utility/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import http from '../../axios';
const ModalAddBluePrint = (props) => {
    const { idProject, AllProject } = props.data
    const [fileProject, setFile] = useState(null);

    const projectById = AllProject?.find((item) => item.id === parseInt(idProject)) || {};

    const queryClient = useQueryClient();
    const [bluePrint, setBluePrint] = useState({
        file: '',
        mota: '',
        duan_id: '',

    });
    useEffect(() => {

        setBluePrint((prevBluePrint) => ({
            ...prevBluePrint,
            duan_id: projectById?.id || '',
        }));
    }, [idProject]);

    function handleSelectedFile(e) {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;


        setBluePrint((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };


    const mutation = useMutation(
        (formData) => http.post(`/api/blueprint`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the Content-Type to multipart/form-data
            }
        }),
        {
            onSuccess: () => {
                toast.success("Thêm máy móc thành công", {
                    position: "top-right",
                    autoClose: 1000
                });
            },
            onError: (error) => {
                if (error.response && error.response.status === 400) { // Check for specific error status
                    toast.error("Mã máy móc này đã có, vui lòng thử lại", {
                        position: "top-right",
                        autoClose: 3000
                    });
                }
            }
        }
    );

    function handleSubmit() {
        const formData = new FormData();
        if (fileProject) {
            formData.append('file_project', fileProject);
        }
        formData.append('mota', bluePrint.mota);
        formData.append('duan_id', bluePrint.duan_id);
        mutation.mutate(formData);
    }

    return (
        <div className="modal fade" id="modalAddBluePrint" >
            <div className="modal-dialog modal-lg ">
                <div className="modal-content" style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <div style={{ minWidth: '70vh', height: '100%' }}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thông tin máy móc</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body p-4">

                            <div className="mb-3">
                                <label htmlFor="tenduan" className="form-label">Tên dự án</label>
                                <input type="text" readOnly value={projectById?.tenduan || ''} className="form-control" id="tenduan" name="tenduan" />

                            </div>
                            {/* <input type="hidden" name='duan_id' ref={fileInputRef} value={project ? project.id : ''} /> */}

                            <div className="mb-3">
                                <div className="">
                                    <label htmlFor="file" className="form-label">File bản thiết kế (file dwg)</label>
                                    <input type="file" className="form-control" id="file" name="file" onChange={(e) => handleSelectedFile(e)} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="mota" className="form-label">Mô tả</label>
                                <textarea rows={8} type="text" className="form-control" id="mota" name="mota" onChange={handleChange} ></textarea>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={handleSubmit} className="btn btn-primary" >Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddBluePrint;

import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { putAPI } from '../../utility/api';
import { toast } from 'react-toastify';

const ModalUpdateBluePrint = (props) => {
    const { idProject, AllProject, AllBluePrint } = props.data;
    const [fileProject, setFile] = useState(null);
    const [oldFiles, setOldFiles] = useState([]);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);

    const projectById = AllProject?.find((item) => item.id === parseInt(idProject)) || {};

    const [bluePrint, setBluePrint] = useState({
        file: '',
        mota: '',
        duan_id: '',
    });

    useEffect(() => {
        if (AllBluePrint && projectById.id) {
            const oldFilesData = AllBluePrint.filter(item => item.duan_id === projectById.id);
            setOldFiles(oldFilesData);
        }
        setBluePrint((prevBluePrint) => ({
            ...prevBluePrint,
            duan_id: projectById?.id || '',
        }));
    }, [idProject]);

    function handleSelectedFile(e) {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setSelectedFileUrl(URL.createObjectURL(file)); // Hiển thị file mới
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBluePrint((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteOldFile = (index) => {
        const updatedOldFiles = [...oldFiles];
        updatedOldFiles.splice(index, 1);
        setOldFiles(updatedOldFiles);
    };

    const handleDeleteNewFile = () => {
        setFile(null);
        setSelectedFileUrl(null);
    };

    const mutation = useMutation(
        (formData) => putAPI(`/api/blueprint/`, formData),
        {
            onSuccess: () => {
                toast.success("Thêm máy móc thành công", {
                    position: "top-right",
                    autoClose: 1000
                });
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

    function handleSubmit() {
        const payload = {
            new_file: fileProject,
            old_files: oldFiles,
            mota: bluePrint.mota,
            duan_id: bluePrint.duan_id,
            _method: 'PUT'
        };
        console.log(payload);
        mutation.mutate(payload);
    }

    return (
        <div className="modal fade" id="modalUpdateBluePrint">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Thêm thông tin máy móc</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="tenduan" className="form-label">Tên dự án</label>
                            <input type="text" readOnly value={projectById?.tenduan || ''} className="form-control" id="tenduan" name="tenduan" />
                        </div>
                        <div className="mb-3">
                            <div className="">
                                <label htmlFor="file" className="form-label">File bản thiết kế (file dwg)</label>
                                <input type="file" className="form-control" id="file" name="file" onChange={(e) => handleSelectedFile(e)} />
                            </div>
                        </div>
                        <div className="d-flex flex-column oldFile">
                            {oldFiles.map((item, index) => (
                                <div key={index} className='d-flex justify-content-between align-items-center mb-3'>
                                    <a target='_blank' href={item.file_path}>{item.file}</a>
                                    <button onClick={() => handleDeleteOldFile(index)} className="btn btn-sm btn-danger">Xóa</button>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3 d-flex flex-column newFile">
                            {selectedFileUrl &&
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <a target='_blank' href={selectedFileUrl}>{fileProject.name}</a>
                                    <button onClick={handleDeleteNewFile} className="btn btn-sm btn-danger">Xóa</button>
                                </div>
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mota" className="form-label">Mô tả</label>
                            <textarea rows={8} type="text" className="form-control" id="mota" name="mota" onChange={handleChange} ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={handleSubmit} className="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalUpdateBluePrint;

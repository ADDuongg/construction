import React, { useState } from 'react';

const ModalSearchState = ({setSearch}) => {
    const [data, setData] = useState({})

    function handleSearch(e){
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="duan_id">Chọn dự án</label>
                            <input type="text" className='form-control' onChange={handleSearch} name='duan_id' />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="giaidoan_duan_id">Chọn giai đoạn dự án</label>
                            <input type="text" className='form-control' onChange={handleSearch} name='giaidoan_duan_id' />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Tìm kiếm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalSearchState;

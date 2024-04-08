import React, { useState, useEffect } from 'react';
import Layout from '../../layout';
import { Link } from 'react-router-dom';
import FormImportMatterial from '../matterials/formImportMatterial';
import FormHireMachine from '../machine/formHireMachine';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
const AddStatistic = () => {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [rowsMatterials, setRowsMatterials] = useState([]);
    const [rowsMachines, setRowsMachines] = useState([]);
    const [statistic, setStatistic] = useState({
        duan_id: '',
        ngaythongke: '',
        ghichu: '',
        giaidoan_duan_id: '',
        nhanvien_id: user[0]?.nhanvien_id
    });
    const [numberState, setNumberState] = useState([]);
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(['state_project'], () => getAPI('/api/schedule'))

    const duanIdsArray = user.map(item => item.duan_id);

   
    const filteredProjects= data?.project?.filter(project => {
        if (user[0]?.chucvu === 'construction manager') {
            return duanIdsArray.includes(project.id);
        }
        if (user[0].chucvu === 'project manager') {
            return true;
        }
        return false;
    });
   
    function handleInput(e) {
        const { name, value } = e.target;
        setStatistic((prev) => ({ ...prev, [name]: value }));
        const selectedProjectId = parseInt(value);
        if (name === 'duan_id') {
            const filteredStates = data?.state.filter(item => item.duan_id === selectedProjectId);
            setNumberState(filteredStates);
        }

    }


    const mutation = useMutation((combinedData) => postAPI('/api/statistic', combinedData), {
        onSuccess: () => {
            toast.success("Thêm phiếu thống kê ngày thành công", {
                position: "top-right",
                autoClose: 1000
            });

            queryClient.invalidateQueries('statistic')
        }
    })
    const handleSubmitStatistic = () => {

        const invalidMatterials = rowsMatterials.some(row => !row.mavatlieu);
        const invalidMachines = rowsMachines.some(row => !row.mamaymoc);
        const emptyMatterials = rowsMatterials.length === 0;
        const emptyMachines = rowsMachines.length === 0;
        const invalidNgayThongKe = !statistic.ngaythongke;
        const invalidDuanId = !statistic.duan_id;
        const invalidGiaiDoanDuanId = !statistic.giaidoan_duan_id;

        if (invalidMatterials || invalidMachines || emptyMatterials || emptyMachines) {

            if (emptyMatterials || emptyMachines) {
                toast.error("Vui lòng thêm ít nhất một hàng vật liệu và máy móc.");
            } else {
                toast.error("Vui lòng điền đầy đủ thông tin cho vật liệu và máy móc.");
            }
            return;
        }
        if (
            emptyMatterials ||
            emptyMachines ||
            invalidNgayThongKe ||
            invalidDuanId ||
            invalidGiaiDoanDuanId
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin cho ngày thống kê, dự án, giai đoạn, vật liệu và máy móc.");
        }
        const combinedData = {
            matterials: [...rowsMatterials],
            machines: [...rowsMachines],
            statistic
        };
        mutation.mutate(combinedData);
        console.log(combinedData);
    };



    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid p-5 rounded bg-white">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <Link to={'/statistics'} className="breadcrumb-item">Thống kê ngày</Link>
                            <li className="breadcrumb-item active" aria-current="page">Tạo thống theo ngày</li>
                        </ol>
                    </nav>
                    <div className="row" style={{overflow: 'auto'}}>
                        <h2>Tạo thống theo ngày</h2>
                        <div className="w-100">
                            <div className="mb-3 w-50">
                                <label htmlFor="ngaythongke" className='form-label'>Ngày thống kê</label>
                                <input
                                    onChange={handleInput}
                                    name='ngaythongke'
                                    type="date"
                                    className='form-control'
                                />
                            </div>
                            <div className=" w-50 mb-3">
                                <label htmlFor="duan_id" className='form-label'>Danh sách dự án đang có</label>
                                <select name="duan_id" onChange={handleInput} className='form-select text-center' id="">
                                    <option value="">---Chọn dự án---</option>
                                    {filteredProjects?.map(item => (
                                        <option key={item.id} value={item.id}>{item.tenduan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className=" w-50">
                                <label htmlFor="giaidoan_duan_id" className='form-label'>Danh sách giai đoạn dự án</label>
                                <select name="giaidoan_duan_id" onChange={handleInput} className='form-select text-center' id="">
                                    <option value="">---Chọn giai đoạn---</option>
                                    {numberState?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.giaidoan}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='my-3 ' style={{ overflowX: 'auto' }}>
                            <h4>Thống kê vật liệu</h4>
                            <FormImportMatterial setRowsMatterials={setRowsMatterials} />
                        </div>
                        <div className='mb-3 ' style={{ overflowX: 'auto' }}>
                            <h4>Thống kê máy móc</h4>
                            <FormHireMachine setRowsMachines={setRowsMachines} />
                        </div>
                        <div>
                            <label htmlFor="ghichu" className='form-label'>Ghi chú thống kê</label>
                            <textarea onChange={handleInput} name="ghichu" id="" cols="30" rows="5" className='form-control'></textarea>
                        </div>
                        <div className="w-100 text-end mt-3">
                            <button disabled={mutation.isLoading} className='btn btn-primary' onClick={handleSubmitStatistic}>{mutation.isLoading ? 'Đang tạo' : 'Tạo thống kê'}</button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AddStatistic;

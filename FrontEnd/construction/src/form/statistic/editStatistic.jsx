import React, { useState, useEffect } from 'react';
import Layout from '../../layout';
import { Link } from 'react-router-dom';
import FormUpdateHireMachine from '../machine/formUpdateHireMachine'
import FormUpdateImportMatterial from '../matterials/formUpdateImportMatterial'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAPI, postAPI, putAPI } from '../../utility/api';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const EditStatistic = () => {
    const params = useParams();
    const id_statistic = params.id
    const [rowsMatterials, setRowsMatterials] = useState([]);
    const [rowsMachines, setRowsMachines] = useState([]);

    const [newRowsMatterials, setNewRowsMatterials] = useState([]);
    const [newRowsMachines, setNewRowsMachines] = useState([]);

    const [numberState, setNumberState] = useState([]);
    const { data, isSuccess } = useQuery(['statistic'], () => getAPI('/api/statistic'))
    const { data: info, isSuccess: successLoading } = useQuery(['state_project'], () => getAPI('/api/schedule'))
    const statisticById = data && data.statistics && data.statistics.data.find((item) => item.thongkengay_id === parseInt(id_statistic)) || {}
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {}
    const [statistic, setStatistic] = useState({
        duan_id: '',
        ngaythongke: '',
        ghichu: '',
        giaidoan_duan_id: '',
        nguoithongke: ''
    });
    
    useEffect(() => {
        if (statisticById) {
            const initStatistic = {
                duan_id: statisticById && statisticById.duan_id || '',
                ngaythongke: statisticById && statisticById.ngaythongke || '',
                ghichu: statisticById && statisticById.ghichu || '',
                giaidoan_duan_id: statisticById && statisticById.giaidoan_duan_id || '',
                nguoithongke: statisticById && statisticById.nguoithongke || ''
            };
            setStatistic(initStatistic);
        }
        const filteredStates = info?.state?.filter(item => item.duan_id === parseInt(statisticById.duan_id));
        setNumberState(filteredStates || []);

    }, [id_statistic, isSuccess, successLoading])
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

    





    function handleInput(e) {
        const { name, value } = e.target;
        setStatistic((prev) => ({ ...prev, [name]: value }));
        const selectedProjectId = parseInt(value);
        if (name === 'duan_id') {
            const filteredStates = info?.state.filter(item => item.duan_id === selectedProjectId);
            setNumberState(filteredStates);
        }
    }
    const queryClient = useQueryClient();
    const mutation = useMutation((combinedData) => putAPI(`/api/statistic/${id_statistic}`, combinedData), {
        onSuccess: () => {
            alert('thành công')
            queryClient.invalidateQueries('statistic')
        }
    })
    const handleSubmitStatistic = () => {
        const combinedData = {
            old_matterials: [...rowsMatterials],
            old_machines: [...rowsMachines],
            new_matterials: [...newRowsMatterials],
            new_machines: [...newRowsMachines],
            statistic
        };
        mutation.mutate(combinedData)
        console.log(user.hoten);


    };

    return (
        <Layout>
            <section className='detailContent p-5'>
                <div className="container-fluid p-5 rounded bg-white">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">Home</Link>
                            <Link to={'/statistics'} className="breadcrumb-item">Thống kê ngày</Link>
                            <li className="breadcrumb-item active" aria-current="page">Chỉnh sửa thống kê ngày</li>
                        </ol>
                    </nav>
                    <div className="row" style={{overflow: 'auto'}}>
                        <h2>Chỉnh sửa thống theo ngày</h2>
                        <div className="w-100">
                            <div className="mb-3 w-50">
                                <label htmlFor="ngaythongke" className='form-label'>Ngày thống kê</label>
                                <input
                                    value={statistic.ngaythongke}
                                    onChange={handleInput}
                                    name='ngaythongke'
                                    type="date"
                                    className='form-control'
                                />
                            </div>
                            <div className=" w-50 mb-3">
                                <label htmlFor="duan_id" className='form-label'>Danh sách dự án đang có</label>
                                <select value={statistic.duan_id} name="duan_id" onChange={handleInput} className='form-select text-center' id="">
                                    <option value="">---Chọn dự án---</option>
                                    {filteredProjects?.map(item => (
                                        <option key={item.id} value={item.id}>{item.tenduan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className=" w-50">
                                <label htmlFor="giaidoan_duan_id" className='form-label'>Danh sách giai đoạn dự án</label>
                                <select value={statistic.giaidoan_duan_id} name="giaidoan_duan_id" onChange={handleInput} className='form-select text-center' id="">
                                    <option value="">---Chọn giai đoạn---</option>
                                    {numberState.map((item, index) => (
                                        <option key={index} value={item.id}>{item.giaidoan}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='my-3 ' style={{ overflowX: 'auto' }}>
                            <h4>Thống kê vật liệu</h4>
                            <FormUpdateImportMatterial data={{ id: id_statistic, setNewRowsMatterials, setRowsMatterials }} />
                        </div>
                        <div className='mb-3 ' style={{ overflowX: 'auto' }}>
                            <h4>Thống kê máy móc</h4>
                            <FormUpdateHireMachine data={{ id: id_statistic, setNewRowsMachines, setRowsMachines }} />
                        </div>
                        <div>
                            <label htmlFor="ghichu" className='form-label'>Ghi chú thống kê</label>
                            <textarea value={statistic.ghichu} onChange={handleInput} name="ghichu" id="" cols="30" rows="5" className='form-control'></textarea>
                        </div>
                        <div className="w-100 text-end mt-3">
                            <button disabled = {mutation.isLoading} className='btn btn-primary' onClick={handleSubmitStatistic}>{mutation.isLoading ? 'Đang lưu' : 'lưu'}</button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default EditStatistic;

import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAPI, postAPI } from '../../utility/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
const AddState = () => {
    const [phaseCount, setPhaseCount] = useState(1);
    const [phases, setPhases] = useState({});
    const [alertShown, setAlertShown] = useState(false);
    const startDateRefs = useRef([]);
    const endDateRefs = useRef([]);
    const motaRefs = useRef([]);
    const params = useParams();
    const id_project = params.id;
    const navigate = useNavigate();
    const { data, isLoading } = useQuery(['project'], () => getAPI('/api/project'));
    const { data: projectState, isLoading: loadingState } = useQuery(['project_state'], () =>
        getAPI('/api/projectState')
    );
    const queryClient = useQueryClient();
    const projectById = data?.all_project?.find((item) => item.id === parseInt(id_project));

    useEffect(() => {
        if (projectById && projectState) {
            const check = projectState?.all_state?.find((item) => item.duan_id === parseInt(id_project));
            if (check) {
                setAlertShown(true);
            }
        }
    }, [projectById, projectState]);

    useEffect(() => {
        if (alertShown) {
            Swal.fire({
                title: `Thông báo`,
                text: "Dự án này đã có giai đoạn, vui lòng vào danh mục tiến độ dự án để cập nhật ",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
                allowOutsideClick: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigate('/project')
                    queryClient.removeQueries(['project_state']);
                }
            });
        }
    }, [alertShown]);
    useEffect(() => {
        if (phases.length > 0) {
            const data = { phases: phases, duan_id: projectById?.id, soluonggiaidoan: phaseCount };
            console.log(data);
            mutation.mutate(data);
        }
    }, [phases]);

    console.log(alertShown);
    const mutation = useMutation((phases) => postAPI('/api/projectState', phases), {
        onSuccess: () => {
            toast.success('Thêm vật liệu thành công', {
                position: 'top-right',
                autoClose: 1000,
            });
            navigate('/project')
            queryClient.removeQueries(['project_state']);
        },
    });

    const createPhases = () => {
        const newPhases = [];
        let hasError = false;

        for (let i = 0; i < phaseCount; i++) {
            const startDate = startDateRefs.current[i].value;
            const endDate = endDateRefs.current[i].value;
            const mota = motaRefs.current[i].value;
            if (startDate === '' || endDate === '') {
                toast.error('Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc cho mỗi giai đoạn.');
                hasError = true;
                break;
            } else if (new Date(startDate) >= new Date(endDate)) {
                toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.');
                hasError = true;
                break;
            }

            newPhases.push({ giaidoan: `Giai đoạn ${i + 1}`, start_from: startDate, end_at: endDate, mota });
        }

        if (!hasError) {
            setPhases(newPhases);
            const data = { phases: phases, duan_id: projectById?.id, soluonggiaidoan: phaseCount };
            console.log(data);
            mutation.mutate(data);
        }
    };

    const handlePhaseCountChange = (e) => {
        setPhaseCount(parseInt(e.target.value));
    };

    return (
        <Layout>

            <section className="detailContent p-5">
                <div className="container-fluid p-5 bg-white rounded">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <Link to={'/'} className="breadcrumb-item">
                                Home
                            </Link>
                            <Link to={'/project'} className="breadcrumb-item">
                                Quản lý dự án
                            </Link>
                            <Link to={'/stateProject'} className="breadcrumb-item">
                                Tiến độ dự án
                            </Link>
                            <li className="breadcrumb-item active" aria-current="page">
                                Thêm lịch trình cụ thể
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="mb-3">
                            <label htmlFor="phaseCount">Nhập số lượng giai đoạn cho dự án</label>
                            <input
                                type="number"
                                id="phaseCount"
                                min="1"
                                disabled={alertShown}
                                value={phaseCount}
                                onChange={handlePhaseCountChange}
                                className="form-control w-25"
                            />
                        </div>
                        <div id="phasesContainer">
                            {Array.from({ length: phaseCount }).map((_, index) => (
                                <div key={index} className={`phase${index + 1}`}>
                                    <h3 data-phase={index + 1}>Giai đoạn {index + 1}</h3>
                                    <div className="mb-3">
                                        <label htmlFor={`startDate${index}`} className="form-label">
                                            Ngày bắt đầu:
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id={`startDate${index}`}
                                            ref={(el) => (startDateRefs.current[index] = el)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor={`endDate${index}`} className="form-label">
                                            Ngày kết thúc:
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id={`endDate${index}`}
                                            ref={(el) => (endDateRefs.current[index] = el)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor={`mota${index}`} className="form-label">
                                            Mô tả:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id={`mota${index}`}
                                            ref={(el) => (motaRefs.current[index] = el)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-100 mt-3 text-end">
                            <button className="btn btn-primary" disabled={alertShown} onClick={createPhases}>
                                Create Phases
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AddState;

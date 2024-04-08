<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceDetail;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\Project;
use App\Models\ProjectState;
use App\Models\StaffModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $attendance = DB::table('diemdanh_congnhan')
            ->leftJoin('du_an', 'du_an.id', '=', 'diemdanh_congnhan.duan_id')
            ->leftJoin('nhanvien', 'nhanvien.nhanvien_id', '=', 'diemdanh_congnhan.nguoitao')
            ->leftJoin('hopdong', 'hopdong.hopdong_id', '=', 'du_an.hopdong_id')
            ->leftJoin('giaidoan_duan', 'giaidoan_duan.id', '=', 'diemdanh_congnhan.giaidoan_duan_id')
            ->select('diemdanh_congnhan.*', 'du_an.tenduan', 'hopdong.hopdong_id', 'giaidoan_duan.giaidoan','nhanvien.nhanvien_id','nhanvien.hoten');
        $detail_attendance = DB::table('chitiet_diemdanh');


        if ($request->has('nguoitao')) {
            $nguoitao = $request->nguoitao;
            $attendance->where('nhanvien.hoten', 'like', '%' . $nguoitao . '%');
        }
        if ($request->has('ngaydiemdanh')) {
            $ngaydiemdanh = $request->ngaydiemdanh;
            $attendance->where('diemdanh_congnhan.ngaydiemdanh', 'like', '%' . $ngaydiemdanh . '%');
        }

        if ($request->has('duan_id')) {
            $duan_id = $request->duan_id;
            $attendance->where('diemdanh_congnhan.duan_id', 'like', '%' . $duan_id . '%');
        }
        #check hopdong
        if ($request->has('hopdong_id')) {
            $hopdong_id = $request->hopdong_id;
            $attendance->where('hopdong.hopdong_id', 'like', '%' . $hopdong_id . '%');
        }
        if ($request->has('giaidoan_duan_id')) {
            $giaidoan_duan_id = $request->giaidoan_duan_id;
            $attendance->where('diemdanh_congnhan.giaidoan_duan_id', 'like', '%' . $giaidoan_duan_id . '%');
        }

        $per_page = $request->input('limit', 3);
        $attendance = $attendance->paginate($per_page);

        $projects = Project::all();
        $state_projects = ProjectState::all();
        $contracts = Contract::all();
        $customers = Customer::all();
        $staff = StaffModel::all();
        return response()->json([
            200,
            'attendance' => $attendance,
            'detail_attendance' => $detail_attendance->get(),
            'projects' => $projects,
            'state_projects' => $state_projects,
            'contracts' => $contracts,
            'customers' => $customers,
            'staff' => $staff,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attendance_request = $request->attendance;
        $detail_attendance_request = $request->detailAttendance;
        $existingAttendance = Attendance::where('ngaydiemdanh', $request->attendance['ngaydiemdanh'])
            ->where('duan_id', $request->attendance['duan_id'])
            ->where('giaidoan_duan_id', $request->attendance['giaidoan_duan_id'])
            ->exists();


        if ($existingAttendance) {
            return response()->json(['message' => 'Bảng điểm danh cho ngày, dự án và giai đoạn dự án này đã tồn tại.'], 422);
        } else {

            $attendance = new Attendance();
            $attendance->duan_id = $attendance_request['duan_id'];
            $attendance->ngaydiemdanh = $attendance_request['ngaydiemdanh'];
            $attendance->giaidoan_duan_id = $attendance_request['giaidoan_duan_id'];
            $attendance->nguoitao = $attendance_request['nguoitao'];
            $attendance->save();

            $id_attendance = $attendance->getKey();
            if ($detail_attendance_request) {
                foreach ($detail_attendance_request as $item) {
                    $detail_attendance = new AttendanceDetail();
                    $detail_attendance->diemdanh_id = $id_attendance;
                    $detail_attendance->hotennhanvien = $item['hotennhanvien'];
                    $detail_attendance->thoigianvao = $item['thoigianvao'];
                    $detail_attendance->thoigianra = $item['thoigianra'];
                    $detail_attendance->ghichu = $item['ghichu'];

                    $detail_attendance->save();
                }
            }

            return response()->json(200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance_request = $request->attendance;
        $attendance = Attendance::findOrFail($id);
        $attendance->duan_id = $attendance_request['duan_id'];
        $attendance->ngaydiemdanh = $attendance_request['ngaydiemdanh'];
        $attendance->giaidoan_duan_id = $attendance_request['giaidoan_duan_id'];
        $attendance->nguoitao = $attendance_request['nguoitao'];
        $attendance->save();

        return response()->json(200);
    }
    public function updateDetail(Request $request, $id){
        $detail_attendance = AttendanceDetail::where('id', $id)->first();
        $name = $request->name;
        $value = $request->value;
        if($name === 'thoigianvao'){
            $detail_attendance->thoigianvao = $value;
            $detail_attendance->save();
            return response()->json([
                'data' => $detail_attendance
            ],200);
        }
        if($name === 'thoigianra'){
            $detail_attendance->thoigianra = $value;
            $detail_attendance->save();
            return response()->json(200);
        }
        if($name === 'ghichu'){
            $detail_attendance->ghichu = $value;
            $detail_attendance->save();
            return response()->json(200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $state_payment = Attendance::findOrFail($id);
        $state_payment->delete();

        $detail_payment = AttendanceDetail::where('diemdanh_id', $id)->get();

        foreach ($detail_payment as $item) {
            $item->delete();
        }
        return response()->json(200);
    }
}

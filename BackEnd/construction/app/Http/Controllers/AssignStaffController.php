<?php

namespace App\Http\Controllers;

use App\Models\AssignStaff;
use App\Models\Project;
use App\Models\StaffModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssignStaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $assign = DB::table('phancong_duan')
            ->leftJoin('du_an', 'du_an.id', '=', 'phancong_duan.duan_id')
            ->leftJoin('nhanvien', 'nhanvien.nhanvien_id', '=', 'phancong_duan.nhanvien_id')
            ->select('phancong_duan.*', 'du_an.tenduan', 'nhanvien.hoten', 'nhanvien.chucvu');

        if ($request->has('hoten')) {
            $hoten = $request->hoten;
            $assign->where('nhanvien.hoten', 'LIKE', '%' . $hoten . '%');
        }
        if ($request->has('duan_id')) {
            $duan_id = $request->duan_id;
            $assign->where('phancong_duan.duan_id', 'LIKE', '%' . $duan_id . '%');
        }
        if ($request->has('chucvu')) {
            $chucvu = $request->chucvu;
            $assign->where('nhanvien.chucvu', 'LIKE', '%' . $chucvu . '%');
        }
        if ($request->has('ghichu')) {
            $ghichu = $request->ghichu;
            $assign->where('phancong_duan.ghichu', 'LIKE', '%' . $ghichu . '%');
        }
        $per_page = $request->input('limit', 10);
        $assign = $assign->paginate($per_page);
        $projects = Project::all();
        $staffs = StaffModel::all();
        return response()->json([
            'assigns' => $assign,
            'projects' => $projects,
            'staffs' => $staffs
        ], 200);
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
        $nhanvien_id = $request->nhanvien_id;

        $nhanvien = StaffModel::findOrFail($nhanvien_id);

        if ($nhanvien->chucvu === 'worker') {
            $existingAssignment = AssignStaff::where('nhanvien_id',$nhanvien_id)
                ->where('duan_id', $request->duan_id)
                ->first();
            if ($existingAssignment) {
                return response()->json([
                    'message' => 'Nhân viên này đã được phân công cho dự án này trước đó.'
                ], 422);
            }
        }
        if ($nhanvien->chucvu === 'construction manager') {
            $existingAssignment = AssignStaff::where('nhanvien_id',$nhanvien_id)
                ->where('duan_id', $request->duan_id)
                ->first();
            if ($existingAssignment) {
                return response()->json([
                    'message' => 'Nhân viên này đã được phân công cho dự án này trước đó.'
                ], 422);
            }
        }




        $assign = new AssignStaff();
        $assign->nhanvien_id = $request->nhanvien_id;
        $assign->duan_id = $request->duan_id;
        $assign->ghichu = '';
        $assign->save();

        return response()->json([
            'message' => 'Phân công dự án cho nhân viên thành công.'
        ], 200);
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
        $assign = AssignStaff::findOrFail($id);
        $assign->nhanvien_id = $request->nhanvien_id;
        $assign->duan_id = $request->duan_id;
        $assign->ghichu = $request->ghichu;
        $assign->save();
        return response()->json([
            'message' => 'Cập nhật phân công dự án cho nhân viên thành công.'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $assign = AssignStaff::findOrFail($id);
        $assign->delete();
        return response()->json(200);
    }
}

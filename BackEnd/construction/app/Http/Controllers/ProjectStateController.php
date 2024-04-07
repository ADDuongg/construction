<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectStateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       

        $project = DB::table('du_an')
            ->leftJoin('hopdong', 'du_an.hopdong_id', '=', 'hopdong.hopdong_id')
            ->select('du_an.tenduan','du_an.id','du_an.soluonggiaidoan', 'hopdong.tenhopdong');

        $all_state = DB::table('giaidoan_duan')->select('giaidoan_duan.*');
        


        if ($request->has('tenduan')) {
            $tenduan = $request->tenduan;
            $project->where('du_an.tenduan', 'LIKE', '%' . $tenduan . '%');
        }

        if ($request->has('ngaybatdau')) {
            $ngaybatdau = $request->input('ngaybatdau');
            $all_state->where('giaidoan_duan.ngaybatdau', 'LIKE', '%' . $ngaybatdau . '%');
        }

        if ($request->has('ngayketthuc')) {
            $ngayketthuc = $request->ngayketthuc;
            $all_state->where('giaidoan_duan.ngayketthuc', 'LIKE', '%' . $ngayketthuc . '%');
        }

        if ($request->has('soluonggiaidoan')) {
            $soluonggiaidoan = $request->soluonggiaidoan;
            $project->where('du_an.soluonggiaidoan', 'LIKE', '%' . $soluonggiaidoan . '%');
        }

        $per_page = $request->input('limit', 3);
        $project = $project->paginate($per_page);
        

        return response()->json([
            'project' => $project,
            'all_state' => $all_state->get(),
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
        $duan_id = $request->duan_id;
        $soluonggiaidoan = $request->soluonggiaidoan;
        $phase = $request->phases;
        $project = Project::findOrFail($duan_id);

        $project->soluonggiaidoan = $soluonggiaidoan;
        $project->save();
        if (!$phase) {
            return response()->json(['message' => 'Có lỗi xảy ra, vui lòng thử lại'], 400);
        }

        foreach ($phase as $item) {
            $project_state = new ProjectState();
            $project_state->duan_id = $duan_id;
            $project_state->giaidoan = $item['giaidoan'];
            $project_state->ngaybatdau = $item['start_from'];
            $project_state->ngayketthuc = $item['end_at'];
            $project_state->mota = $item['mota'];
            $project_state->save();
        }
        return response()->json(['message' => 'Thêm giai đoạn dự án thành công'], 200);
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
        $state = ProjectState::findOrFail($id);
        $state->ngaybatdau = $request->ngaybatdau;
        $state->ngayketthuc = $request->ngayketthuc;
        $state->mota = $request->mota;

        $state->save();
        return response()->json(200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $state = ProjectState::findOrFail($id);
        $state->delete();
        return response()->json(200);
    }
}

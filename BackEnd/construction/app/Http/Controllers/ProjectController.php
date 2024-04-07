<?php

namespace App\Http\Controllers;

use App\Models\BluePrint;
use App\Models\Contract;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('du_an')
        /* ->leftJoin('thietke_duan','thietke_duan.duan_id','=','du_an.id')
        ->select('du_an.*','thietke_duan.file','thietke_duan.file_path') */
        ;

        if ($request->has('tenduan')) {
            $tenduan = $request->input('tenduan');
            $query->where('tenduan', 'like', '%' . $tenduan . '%');
        }

        if ($request->has('ngaybatdau')) {
            $ngaybatdau = $request->input('ngaybatdau');
            $query->where('ngaybatdau', 'like', '%' . $ngaybatdau . '%');
        }

        if ($request->has('ngayketthuc')) {
            $ngayketthuc = $request->input('ngayketthuc');
            $query->where('ngayketthuc', 'like', '%' . $ngayketthuc . '%');
        }

        if ($request->has('soluonggiaidoan')) {
            $soluonggiaidoan = $request->input('soluonggiaidoan');
            $query->where('soluonggiaidoan', 'like', '%' . $soluonggiaidoan . '%');
        }

        if ($request->has('hopdong_id')) {
            $hopdong_id = $request->input('hopdong_id');
            $query->where('hopdong_id', 'like', '%' . $hopdong_id . '%');
        }

        $perPage = $request->input('limit', 3);
        $projects = $query->paginate($perPage);

        $all_project = Project::All();
        $all_blueprint = BluePrint::All();
        return response()->json([
            'status' => 200,
            'projects' => $projects,
            'all_project' => $all_project,
            'all_blueprint' => $all_blueprint
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tenduan' => 'required',
            'mota' => 'required',
            'ngaybatdau' => 'required|date',
            'hopdong_id' => 'required',
            'ngayketthuc' => 'required|date',
            'diadiem' => 'required',
            'tencongtrinh' => 'required',
            'status' => 'required',
        ]);

        $project = Project::create($request->all());

        return response()->json(['message' => 'Project created successfully', 'project' => $project], 201);
    }

    public function addBluePrint(Request $request)
    {


        $blueprint = new BluePrint();
        $blueprint->duan_id = $request->duan_id;
        $blueprint->mota = $request->mota;

        $file_request = $request->file_project;
        if ($file_request) {
            $file = $file_request;
            $file_name = 'file' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/file', $file_name);
            $blueprint->file = $file_name;
            $blueprint->file_path = '/storage/file/' . $file_name;
        }

        $blueprint->save();


        return response()->json(200);
    }



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json(['project' => $project]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'tenduan' => 'required',
            'mota' => 'required',
            'soluonggiaidoan' => 'required|integer',
            'ngaybatdau' => 'required|date',
            'ngayketthuc' => 'required|date',
            'diadiem' => 'required',
            'tencongtrinh' => 'required',
            'status' => 'required',
        ]);

        $project = Project::findOrFail($id);
        $project->update($request->all());

        return response()->json(['message' => 'Project updated successfully', 'project' => $project]);
    }
    /* public function UpdateBluePrint(Request $request, $id)
    {
       $
    } */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}

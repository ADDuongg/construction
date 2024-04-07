<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\ExtendProject;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExtendProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('giahan_thicong')
        ->leftJoin('du_an','du_an.id','=','giahan_thicong.duan_id')
        ->leftJoin('hopdong','du_an.hopdong_id','=','hopdong.hopdong_id')
       /*  ->leftJoin('khachhang','khachhang.khachhang_id','=','hopdong.khachhang_id') */
        ->select('giahan_thicong.*','du_an.tenduan','du_an.ngayketthuc','du_an.ngaybatdau','hopdong.hopdong_id'/* ,'khachhang.hoten' */);

        if($request->has('tenduan')){
            $tenduan = $request->tenduan;
            $query->where('du_an.tenduan','LIKE','%'.$tenduan.'%');
        }
        if($request->has('ngaybatdau')){
            $ngaybatdau = $request->ngaybatdau;
            $query->where('du_an.ngaybatdau','LIKE','%'.$ngaybatdau.'%');
        }
        if($request->has('ngayketthuc')){
            $ngayketthuc = $request->ngayketthuc;
            $query->where('du_an.ngayketthuc','LIKE','%'.$ngayketthuc.'%');
        }
        if($request->has('hopdong_id')){
            $hopdong_id = $request->hopdong_id;
            $query->where('hopdong.hopdong_id','LIKE','%'.$hopdong_id.'%');
        }
        if($request->has('thoigiangiahan')){
            $thoigiangiahan = $request->thoigiangiahan;
            $query->where('giahan_thicong.thoigian_giahan','LIKE','%'.$thoigiangiahan.'%');
        }
        if($request->has('lydogiahan')){
            $lydogiahan = $request->lydogiahan;
            $query->where('giahan_thicong.lydogiahan','LIKE','%'.$lydogiahan.'%');
        }
        /* if($request->has('khachhang_id')){
            $khachhang_id = $request->khachhang_id;
            $query->where('giahan_thicong.khachhang_id','LIKE','%'.$khachhang_id.'%');
        } */
        $contracts = Contract::all();
        $projects = Project::all();
        /* $customers = Customer::all(); */
        $limit = $request->input('limit',3);
        $extend_project = $query->paginate($limit);
        return response()->json([
            'extend_project' => $extend_project,
            'projects' => $projects,
            'contracts' => $contracts,
            /* 'customers' => $customers    */ 
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
        $validatedData = $request->validate([
            'duan_id' => 'required',
            'thoigian_giahan' => 'required',
            'lydogiahan' => 'required',
            'nguoigiahan' => 'required',
            /* 'khachhang_id' => 'required', */
        ]);

        $extendProject = ExtendProject::create($validatedData);
        return response()->json($extendProject, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ExtendProject $extendProject)
    {
        return response()->json($extendProject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'duan_id' => 'required',
            'thoigian_giahan' => 'required',
            'lydogiahan' => 'required',
            'nguoigiahan' => 'required',
            /* 'khachhang_id' => 'required', */
        ]);
        $extendProject = ExtendProject::findOrFail($id);
        $extendProject->update($validatedData);
        return response()->json($extendProject, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $extend = ExtendProject::findOrFail($id);
        $extend->delete();
        return response()->json(200);
    }
}

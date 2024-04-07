<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\ExtendContract;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExtendContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('giahan_hopdong')
       
        ->leftJoin('hopdong','giahan_hopdong.hopdong_id','=','hopdong.hopdong_id')
        ->leftJoin('khachhang','khachhang.khachhang_id','=','giahan_hopdong.khachhang_id')
        ->select('giahan_hopdong.*','hopdong.*','khachhang.hoten');

        if($request->has('tenhopdong')){
            $tenhopdong = $request->tenhopdong;
            $query->where('hopdong.tenhopdong','LIKE','%'.$tenhopdong.'%');
        }
        if($request->has('ngaybatdau')){
            $ngaybatdau = $request->ngaybatdau;
            $query->where('hopdong.ngaybatdau','LIKE','%'.$ngaybatdau.'%');
        }
        if($request->has('ngayketthuc')){
            $ngayketthuc = $request->ngayketthuc;
            $query->where('hopdong.ngayketthuc','LIKE','%'.$ngayketthuc.'%');
        }
        /* if($request->has('hopdong_id')){
            $hopdong_id = $request->hopdong_id;
            $query->where('hopdong.hopdong_id','LIKE','%'.$hopdong_id.'%');
        } */
        if($request->has('thoigiangiahan')){
            $thoigiangiahan = $request->thoigiangiahan;
            $query->where('giahan_hopdong.thoigian_giahan','LIKE','%'.$thoigiangiahan.'%');
        }
        if($request->has('lydogiahan')){
            $lydogiahan = $request->lydogiahan;
            $query->where('du_an.lydogiahan','LIKE','%'.$lydogiahan.'%');
        }
        if($request->has('khachhang_id')){
            $khachhang_id = $request->khachhang_id;
            $query->where('giahan_hopdong.khachhang_id','LIKE','%'.$khachhang_id.'%');
        }
        $contracts = Contract::all();
        $projects = Project::all();
        $customers = Customer::all();
        $limit = $request->input('limit',3);
        $extend_contract = $query->paginate($limit);
        return response()->json([
            'extend_contract' => $extend_contract,
            'projects' => $projects,
            'contracts' => $contracts,
            'customers' => $customers    
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
            'hopdong_id' => 'required',
            'thoigian_giahan' => 'required',
            'lydogiahan' => 'required',
            'nguoigiahan' => 'required',
            'khachhang_id' => 'required',
        ]);

        $extendProject = ExtendContract::create($validatedData);
        return response()->json($extendProject, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ExtendContract $extendProject)
    {
        return response()->json($extendProject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'hopdong_id' => 'required',
            'thoigian_giahan' => 'required',
            'lydogiahan' => 'required',
            'nguoigiahan' => 'required',
            'khachhang_id' => 'required',
        ]);
        $extendProject = ExtendContract::findOrFail($id);
        $extendProject->update($validatedData);
        return response()->json($extendProject, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $extend = ExtendContract::findOrFail($id);
        $extend->delete();
        return response()->json(200);
    }
}

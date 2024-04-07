<?php

namespace App\Http\Controllers;

use App\Models\BuildingPermit;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuildingPermitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('giayphep_xaydung')
            ->leftJoin('khachhang', 'khachhang.khachhang_id', '=', 'giayphep_xaydung.khachhang_id')
            ->select('giayphep_xaydung.*', 'khachhang.khachhang_id','khachhang.hoten');

        if ($request->filled('khachhang_id')) {
            $khachhang_id = $request->input('khachhang_id');
            $query->where('khachhang.khachhang_id', 'like', '%' . $khachhang_id . '%');
        }

        if ($request->filled('congtrinh_xaydung')) {
            $congtrinh_xaydung = $request->input('congtrinh_xaydung');
            $query->where('congtrinh_xaydung', 'like', '%' . $congtrinh_xaydung . '%');
        }

        if ($request->filled('capngay')) {
            $capngay = $request->input('capngay');
            $query->where('capngay', 'like', '%' . $capngay . '%');
        }

        if ($request->filled('thoihan')) {
            $thoihan = $request->input('thoihan');
            $query->where('thoihan', 'like', '%' . $thoihan . '%');
        }

        if ($request->filled('noidung')) {
            $noidung = $request->input('noidung');
            $query->where('noidung', 'like', '%' . $noidung . '%');
        }

        if ($request->filled('thoigian_giahan')) {
            $thoigian_giahan = $request->input('thoigian_giahan');
            $query->where('thoigian_giahan', 'like', '%' . $thoigian_giahan . '%');
        }

        $perPage = $request->input('limit', 3);
        $buildingPermits = $query->paginate($perPage);
        $customers = Customer::all();
        return response()->json([
            'status' => 200,
            'building_permits' => $buildingPermits,
            'customers' => $customers,
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
        
        $request->validate([
            'khachhang_id' => 'required|integer',
            'congtrinh_xaydung' => 'required|string|max:255', 
            'noidung' => 'nullable|string',
            'capngay' => 'required|date',
            'thoihan' => 'required|date', 
            'thoigian_giahan' => 'nullable|date', 
            'lydo_giahan' => 'nullable|string', 
        ]);
        

        
        $buildingPermit = BuildingPermit::create($request->all());

       
        return response()->json($buildingPermit, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'khachhang_id' => 'required|integer',
            'congtrinh_xaydung' => 'required|string|max:255', 
            'noidung' => 'nullable|string',
            'capngay' => 'required|date',
            'thoihan' => 'required|date', 
            'thoigian_giahan' => 'nullable|date', 
            'lydo_giahan' => 'nullable|string', 
        ]);

       
        $buildingPermit = BuildingPermit::findOrFail($id);
        $buildingPermit->update($request->all());

       
        return response()->json($buildingPermit, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       
        $buildingPermit = BuildingPermit::findOrFail($id);
        $buildingPermit->delete();

       
        return response()->json(null, 204);
    }
}

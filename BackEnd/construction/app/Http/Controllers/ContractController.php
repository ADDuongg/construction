<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('hopdong')->join('khachhang', 'khachhang.khachhang_id', '=', 'hopdong.khachhang_id')->select('hopdong.*', 'khachhang.hoten');

        if ($request->has('tenhopdong')) {
            $tenhopdong = $request->input('tenhopdong');
            $query->where('tenhopdong', 'like', '%' . $tenhopdong . '%');
        }

        if ($request->has('ngaybatdau')) {
            $ngaybatdau = $request->input('ngaybatdau');
            $query->where('ngaybatdau', 'like', '%' . $ngaybatdau . '%');
        }

        if ($request->has('ngayketthuc')) {
            $ngayketthuc = $request->input('ngayketthuc');
            $query->where('ngayketthuc', 'like', '%' . $ngayketthuc . '%');
        }
        /* if ($request->has('email')) {
            $email = $request->input('email');
            $query->where('email', 'like', '%' . $email . '%');
        } */

        if ($request->has('khachhang_id')) {
            $khachhang_id = $request->input('khachhang_id');
            $query->where('hopdong.khachhang_id', 'like', '%' . $khachhang_id . '%');
        }

        if ($request->has('giatrihopdong')) {
            $giatrihopdong = $request->input('giatrihopdong');


            if (!empty($giatrihopdong)) {
                if ($giatrihopdong === '500') {
                    $query->where('hopdong.giatrihopdong', '<=', 500000000);
                }
                if ($giatrihopdong === '500-1500') {

                    $between = $this->exposeRentCost($giatrihopdong);

                    $query->whereBetween('hopdong.giatrihopdong', $between);
                }
                if ($giatrihopdong === '1500-3000') {

                    $between = $this->exposeRentCost($giatrihopdong);

                    $query->whereBetween('hopdong.giatrihopdong', $between);
                }
                if ($giatrihopdong === '3000') {

                    $query->where('hopdong.giatrihopdong', '>=', 3000000000);
                }
            }
        }

        $customers = Customer::all();
        $perPage = $request->input('limit', 3);
        $contracts = $query->paginate($perPage);

        return response()->json([
            'status' => 200,
            'contracts' => $contracts,
            'customers' => $customers,
        ]);
    }

    public function getAllContract(){
        $contracts = Contract::all();
        return response()->json([
            'status' => 200,
            'contracts' => $contracts,
        ]);
    }
    public function exposeRentCost($rent_cost)
    {
        $rent_range = explode('-', $rent_cost);
        $min_rent = (int) $rent_range[0] . '000000';
        $max_rent = (int) $rent_range[1] . '000000';
        return [$min_rent, $max_rent];
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tenhopdong' => 'required|string|max:255',
            'ngayky' => 'required|date',
            'giatrihopdong' => 'required|numeric',
            'tamung' => 'nullable|numeric',
            'phitrehan' => 'nullable|numeric',
            'conlai' => 'nullable|numeric',
            'khachhang_id' => 'required|exists:khachhang,khachhang_id',
            'noidung' => 'nullable|string|max:255',
            'ngaybatdau' => 'nullable|date',
            'ngaydaohan' => 'nullable|date',
            'ngayketthuc' => 'nullable|date|after:ngaybatdau',
            'loaihopdong' => 'nullable|string|max:50',
        ]);


        $contract = Contract::create($request->all());

        return response()->json(['contract' => $contract], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $contract = Contract::findOrFail($id);
        return response()->json(['contract' => $contract], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'tenhopdong' => 'required|string|max:255',
            'ngayky' => 'required|date',
            'giatrihopdong' => 'required|numeric',
            'tamung' => 'nullable|numeric',
            'phitrehan' => 'nullable|numeric',
            'conlai' => 'nullable|numeric',
            'khachhang_id' => 'required|exists:khachhang,khachhang_id',
            'noidung' => 'nullable|string|max:255',
            'ngaybatdau' => 'nullable|date',
            'ngayketthuc' => 'nullable|date|after:ngaybatdau',
            'ngaydaohan' => 'nullable|date',
            'loaihopdong' => 'nullable|string|max:50',
        ]);


        $contract = Contract::findOrFail($id);
        $contract->update($request->all());

        return response()->json(['contract' => $contract], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contract deleted successfully'], 200);
    }
}

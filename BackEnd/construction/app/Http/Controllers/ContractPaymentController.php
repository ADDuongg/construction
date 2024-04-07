<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\PaymentContract;
use Illuminate\Support\Facades\DB;

class ContractPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('thanhly_hopdong')
        ->leftJoin('hopdong','hopdong.hopdong_id','=','thanhly_hopdong.hopdong_id')
        ->leftJoin('khachhang','khachhang.khachhang_id','=','thanhly_hopdong.khachhang_id')
        ->select('thanhly_hopdong.*','khachhang.hoten','khachhang.khachhang_id','hopdong.tenhopdong','hopdong.hopdong_id')
        ;

        if ($request->has('hopdong_id')) {
            $hopdong_id = $request->input('hopdong_id');
            $query->where('hopdong.hopdong_id','LIKE','%'. $hopdong_id . '%');
        }

        if ($request->has('khachhang_id')) {
            $khachhang_id = $request->input('khachhang_id');
            $query->where('khachhang.khachhang_id', 'LIKE','%'. $khachhang_id . '%');
        }

        if ($request->has('giatri_truocthue')) {
            $giatri_truocthue = $request->input('giatri_truocthue');
            $query->where('giatri_truocthue', 'like', '%' . $giatri_truocthue . '%');
        }

        if ($request->has('vat')) {
            $vat = $request->input('vat');
            $query->where('vat','LIKE','%'. $vat . '%');
        }

        if ($request->has('giatri_sauthue')) {
            $giatri_sauthue = $request->input('giatri_sauthue');
            $query->where('giatri_sauthue', 'like', '%' . $giatri_sauthue . '%');
        }

        if ($request->has('ngaythanhtoan')) {
            $ngaythanhtoan = $request->input('ngaythanhtoan');
            $query->where('ngaythanhtoan','LIKE','%'. $ngaythanhtoan . '%');
        }

        if ($request->has('noidung')) {
            $noidung = $request->input('noidung');
            $query->where('thanhly_hopdong.noidung', 'like', '%' . $noidung . '%');
        }

        $perPage = $request->input('limit', 3);
        $paymentContracts = $query->paginate($perPage);
        $contracts = Contract::all();
        $customers = Customer::all();
        return response()->json([
            'status' => 200,
            'paymentContracts' => $paymentContracts,
            'contracts' => $contracts,
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $paymentContract = PaymentContract::create($request->all());
        return response()->json($paymentContract, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $paymentContract = PaymentContract::findOrFail($id);
        return response()->json($paymentContract);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $paymentContract = PaymentContract::findOrFail($id);
        $paymentContract->update($request->all());
        return response()->json($paymentContract, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $paymentContract = PaymentContract::findOrFail($id);
        $paymentContract->delete();
        return response()->json(null, 204);
    }
}

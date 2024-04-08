<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\DetailStatePayment;
use App\Models\Project;
use App\Models\ProjectState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\StatePayment;

class StatePaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $state_payment = DB::table('thanhtoan_tungdot')
            /* ->leftJoin('chitiet_thanhtoan_dot','chitiet_thanhtoan_dot.thanhtoan_tungdot_id','=','thanhtoan_tungdot.id') */
            ->leftJoin('du_an', 'du_an.id', '=', 'thanhtoan_tungdot.duan_id')
            ->leftJoin('hopdong', 'hopdong.hopdong_id', '=', 'thanhtoan_tungdot.hopdong_id')
            ->leftJoin('khachhang', 'khachhang.khachhang_id', '=', 'thanhtoan_tungdot.khachhang_id')
            ->leftJoin('giaidoan_duan', 'giaidoan_duan.id', '=', 'thanhtoan_tungdot.giaidoan_duan_id')

            ->select('thanhtoan_tungdot.*', 'du_an.tenduan', 'hopdong.tenhopdong', 'khachhang.hoten', 'giaidoan_duan.giaidoan');
        $detail_state_payment = DB::table('chitiet_thanhtoan_dot');
        if ($request->has('ghichu')) {
            $ghichu = $request->ghichu;
            $detail_state_payment->where('chitiet_thanhtoan_dot.ghichu', 'like', '%' . $ghichu . '%');
        }
        if ($request->has('giatri_sauthue')) {
            $giatri_sauthue = $request->giatri_sauthue;
            $detail_state_payment->where('chitiet_thanhtoan_dot.giatrisauthue', 'like', '%' . $giatri_sauthue . '%');
        }

        if ($request->has('duan_id')) {
            $duan_id = $request->duan_id;
            $state_payment->where('thanhtoan_tungdot.duan_id', 'like', '%' . $duan_id . '%');
        }
        if ($request->has('hopdong_id')) {
            $hopdong_id = $request->hopdong_id;
            $state_payment->where('thanhtoan_tungdot.hopdong_id', 'like', '%' . $hopdong_id . '%');
        }
        if ($request->has('giaidoan_duan_id')) {
            $giaidoan_duan_id = $request->giaidoan_duan_id;
            $state_payment->where('thanhtoan_tungdot.giaidoan_duan_id', 'like', '%' . $giaidoan_duan_id . '%');
        }
        if ($request->has('khachhang_id')) {
            $khachhang_id = $request->khachhang_id;
            $state_payment->where('thanhtoan_tungdot.khachhang_id', 'like', '%' . $khachhang_id . '%');
        }

        

        $per_page = $request->input('limit', 3);
        $state_payment = $state_payment->paginate($per_page);

        $projects = Project::all();
        $state_projects = ProjectState::all();
        $contracts = Contract::all();
        $customers = Customer::all();

        return response()->json([
            200,
            'state_payment' => $state_payment,
            'detail_state_payment' => $detail_state_payment->get(),
            'projects' => $projects,
            'state_projects' => $state_projects,
            'contracts' => $contracts,
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
        $data_state_payment = $request->statePayment;
        $data_detail_state_payment = $request->detailStatePayment;

        $state_payment = new StatePayment();
        $state_payment->duan_id = $data_state_payment['duan_id'];
        $state_payment->hopdong_id = $data_state_payment['hopdong_id'];
        $state_payment->giaidoan_duan_id = $data_state_payment['giaidoan_duan_id'];
        $state_payment->khachhang_id = $data_state_payment['khachhang_id'];
        $state_payment->dot_thanhtoan = $data_state_payment['dot_thanhtoan'];
        /* $state_payment->nguoitao = $data_state_payment['nguoitao']; */

        $state_payment->save();

        $id_state_payment = $state_payment->getKey();

        if ($data_detail_state_payment) {
            foreach ($data_detail_state_payment as $item) {
                $detail_state_payment = new DetailStatePayment();
                $detail_state_payment->thanhtoan_tungdot_id = $id_state_payment;
                $detail_state_payment->noidung = $item['noidung'];
                $detail_state_payment->STT = $item['STT'];
                $detail_state_payment->cachtinh = $item['cachtinh'];
                $detail_state_payment->donvi = $item['donvi'];
                $detail_state_payment->giatrisauthue = $item['giatrisauthue'];
                $detail_state_payment->ghichu = $item['ghichu'];

                $detail_state_payment->save();
            }
        }



        return response()->json([
            'message' => 'thêm hóa đơn thanh toán từng đợt thành công'
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
        $data_state_payment = $request->statePayment;
        $data_detail_state_payment = $request->detailStatePayment;
        $data_new_detail_state_payment = $request->new_detailStatePayment;

        $state_payment =  StatePayment::findOrFail($id);
        $state_payment->duan_id = $data_state_payment['duan_id'];
        $state_payment->hopdong_id = $data_state_payment['hopdong_id'];
        $state_payment->giaidoan_duan_id = $data_state_payment['giaidoan_duan_id'];
        $state_payment->khachhang_id = $data_state_payment['khachhang_id'];
        $state_payment->dot_thanhtoan = $data_state_payment['dot_thanhtoan'];
        /* $state_payment->nguoitao = $data_state_payment['nguoitao']; */

        $state_payment->save();

        $id_state_payment = $state_payment->getKey();
        $currenDetail = DetailStatePayment::where('thanhtoan_tungdot_id', $id)->get();

        #không có cả 2
        if (count($data_detail_state_payment) === 0 && count($data_new_detail_state_payment) === 0) {
            foreach ($currenDetail as $old) {
                $old->delete();
            }
            return response()->json(200);
        }

        #có cả 2
        if (count($data_detail_state_payment) !== 0 && count($data_new_detail_state_payment) !== 0) {
            foreach ($currenDetail as $item) {
                $found = false;
                foreach ($data_detail_state_payment as $old) {
                    if ($item->id === $old['id']) {
                        $found = true;
                        $item->STT = $old['STT'];
                        $item->noidung = $old['noidung'];
                        $item->cachtinh = $old['cachtinh'];
                        $item->donvi = $old['donvi'];
                        $item->ghichu = $old['ghichu'];
                        $item->giatrisauthue = $old['giatrisauthue'];
                        $item->save();
                        break;
                    }
                }
                if (!$found) {
                    $item->delete();
                }
            }
            foreach ($data_new_detail_state_payment as $new) {
                $detail = new DetailStatePayment();
                $detail->thanhtoan_tungdot_id = $id;
                $detail->STT = $new['STT'];
                $detail->noidung = $new['noidung'];
                $detail->cachtinh = $new['cachtinh'];
                $detail->donvi = $new['donvi'];
                $detail->ghichu = $new['ghichu'];
                $detail->giatrisauthue = $new['giatrisauthue'];
                $detail->save();
            }
            return response()->json(200);
        }

        #có cũ k có mới
        if (count($data_detail_state_payment) !== 0 && count($data_new_detail_state_payment) === 0) {
            foreach ($currenDetail as $item) {
                $found = false;
                foreach ($data_detail_state_payment as $old) {
                    if ($item->id === $old['id']) {
                        $found = true;
                        $item->STT = $old['STT'];
                        $item->noidung = $old['noidung'];
                        $item->cachtinh = $old['cachtinh'];
                        $item->donvi = $old['donvi'];
                        $item->ghichu = $old['ghichu'];
                        $item->giatrisauthue = $old['giatrisauthue'];
                        $item->save();
                        break;
                    }
                }
                if (!$found) {
                    $item->delete();
                }
            }
            return response()->json(200);
        }

        #có mới không có cũ
        if (count($data_detail_state_payment) === 0 && count($data_new_detail_state_payment) !== 0) {
            foreach ($data_new_detail_state_payment as $new) {
                $detail = new DetailStatePayment();
                $detail->thanhtoan_tungdot_id = $id;
                $detail->STT = $new['STT'];
                $detail->noidung = $new['noidung'];
                $detail->cachtinh = $new['cachtinh'];
                $detail->donvi = $new['donvi'];
                $detail->ghichu = $new['ghichu'];
                $detail->giatrisauthue = $new['giatrisauthue'];
                $detail->save();
            }
            foreach ($currenDetail as $old) {
                $old->delete();
            }
            return response()->json(200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $state_payment = StatePayment::findOrFail($id);
        $state_payment->delete();

        $detail_payment = DetailStatePayment::where('thanhtoan_tungdot_id', $id)->get();

        foreach ($detail_payment as $item) {
            $item->delete();
        }
        return response()->json(200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use App\Models\DetailHire;
use App\Models\HireReceipt;
use App\Models\MachineType;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HireReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('phieuthue_maymoc')
            ->select(
                'phieuthue_maymoc.id',
                'phieuthue_maymoc.nguoithue',
                'phieuthue_maymoc.ghichu',
                'phieuthue_maymoc.duan_id',
                'phieuthue_maymoc.created_at',
                'nhanvien.nhanvien_id',
                'nhanvien.hoten',
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.tenmaymoc) AS tenmaymoc'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.mamaymoc) AS mamaymoc'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.sogiothue) AS sogiothue'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.loaimaymoc) AS loaimaymoc'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.dongia) AS dongia'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.thanhtien) AS thanhtien'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.nhathau_id) AS nhathau_id'),
                DB::raw('GROUP_CONCAT(chitiet_phieuthue.id) AS idDetail'),
                DB::raw('GROUP_CONCAT(nhathau.tennhathau) AS tennhathau')
            )
            ->leftJoin('chitiet_phieuthue', 'chitiet_phieuthue.phieuthue_id', '=', 'phieuthue_maymoc.id')
            ->leftJoin('nhanvien', 'nhanvien.nhanvien_id', '=', 'phieuthue_maymoc.nguoithue')
            ->leftJoin('nhathau', 'chitiet_phieuthue.nhathau_id', '=', 'nhathau.nhathau_id')
            ->groupBy('phieuthue_maymoc.updated_at', 'phieuthue_maymoc.created_at', 'phieuthue_maymoc.id', 'phieuthue_maymoc.nguoithue', 'phieuthue_maymoc.ghichu', 'phieuthue_maymoc.duan_id','nhanvien.nhanvien_id','nhanvien.hoten');

        if ($request->has('query')) {
            $queryString = $request->input('query');
            $query->where(function ($query) use ($queryString) {
                $query->where('phieuthue_maymoc.nguoithue', 'LIKE', '%' . $queryString . '%')
                    ->orWhere('phieuthue_maymoc.ghichu', 'LIKE', '%' . $queryString . '%')
                    ->orWhere('tenmaymoc', 'LIKE', '%' . $queryString . '%');
            });
        }
        if ($request->has('ngaynhap')) {
            $ngaynhap = $request->input('ngaynhap');
            $query->where('phieuthue_maymoc.created_at', 'LIKE', '%' . $ngaynhap . '%');
        }

        if ($request->has('nhathau_id')) {
            $nhathau_id = $request->input('nhathau_id');
            $query->where('chitiet_phieuthue.nhathau_id', 'LIKE', '%' . $nhathau_id . '%');
        }
        if ($request->has('duan_id')) {
            $duan_id = $request->input('duan_id');
            $query->where('phieuthue_maymoc.duan_id', 'LIKE', '%' . $duan_id . '%');
        }
        if ($request->has('donvitinh')) {
            $donvitinh = $request->input('donvitinh');
            $query->where('chitiet_phieuthue.donvitinh', 'LIKE', '%' . $donvitinh . '%');
        }

        if ($request->has('sogiothue')) {
            $sogiothue = $request->input('sogiothue');
            $query->where('chitiet_phieuthue.sogiothue', 'LIKE', '%' . $sogiothue . '%');
        }

        if ($request->has('loaimaymoc')) {
            $loaimaymoc = $request->input('loaimaymoc');
            $query->where('chitiet_phieuthue.loaimaymoc', 'LIKE', '%' . $loaimaymoc . '%');
        }

        if ($request->has('thanhtien')) {
            $thanhtien = $request->input('thanhtien');

            if ($thanhtien === '500') {
                $query->where(function ($query) {
                    $query->whereRaw("chitiet_phieuthue.thanhtien < 500000");
                });
            }

            if ($thanhtien === '500-1000') {
                $query->where(function ($query) {
                    $query->whereBetween('chitiet_phieuthue.thanhtien', [500000, 1000000]);
                });
            }

            if ($thanhtien === '1000') {
                $query->where(function ($query) {
                    $query->whereRaw("FIND_IN_SET('1000', chitiet_phieuthue.thanhtien)");
                    $query->orWhereRaw("chitiet_phieuthue.thanhtien > 1000000");
                });
            }
        }


        $perPage = $request->input('limit', 3);
        $hireReceipt = $query->paginate($perPage);
        $project = Project::all();
        $machine_types = MachineType::all();
        $contractor = Contractor::all();
        return response()->json([
            'status' => 200,
            'hireReceipt' => $hireReceipt,
            'machine_types' => $machine_types,
            'contractor' => $contractor,
            'project' => $project
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getInfo()
    {
        $contractor = Contractor::all();
        $machines = DB::table('thongtin_maymoc')
            ->select('thongtin_maymoc.*', DB::raw('GROUP_CONCAT(loaimaymoc.ten_loaimaymoc) AS loaimaymoc_name'))
            ->leftJoin('loaimaymoc', 'thongtin_maymoc.id', '=', 'loaimaymoc.maymoc_id')
            ->groupBy('thongtin_maymoc.id', 'thongtin_maymoc.tenmaymoc', 'thongtin_maymoc.mota', 'thongtin_maymoc.created_at', 'thongtin_maymoc.updated_at')
            ->get();
        $project = Project::All();
        return response()->json([
            'status' => 200,
            'machines' => $machines,
            'contractor' => $contractor,
            'project' => $project,
        ]);
    }
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $detail_hire = $request->detailHire;
        $hire_machine = $request->hireMachine;
        $duan_id = $hire_machine['duan_id'];

        $new_hire_machine = HireReceipt::create([
            'duan_id' => $hire_machine['duan_id'],
            'ghichu' => $hire_machine['ghichu'],
            'nguoithue' => $hire_machine['nguoithue']

        ]);
        $new_hire_machine->save();

        $id = $new_hire_machine->id;
        foreach ($detail_hire as $item) {
            $new_detail_machine = new DetailHire();
            $new_detail_machine->phieuthue_id = $id;
            $new_detail_machine->mamaymoc = $item['mamaymoc'];
            $new_detail_machine->tenmaymoc = $item['tenmaymoc'];
            $new_detail_machine->loaimaymoc = $item['loaimaymoc'];
            $new_detail_machine->dongia = $item['dongia'];
            $new_detail_machine->sogiothue = $item['sogiothue'];
            $new_detail_machine->nhathau_id = $item['nhathau_id'];
            $new_detail_machine->thanhtien = $item['thanhtien'];
            $new_detail_machine->save();
        }


        return response()->json(['message' => 'Import successfully'], 200);
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
    { {
            $old_hire = $request->old_hire;
            $new_hire = $request->new_hire;
            $hire_machine = $request->hireMachine;

            $import = HireReceipt::findOrFail($id);
            $import->duan_id = $hire_machine['duan_id'];
            $import->ghichu = $hire_machine['ghichu'];
            $import->nguoithue = $hire_machine['nguoithue'];
            $import->save();

            $detail_import = DetailHire::where('phieuthue_id', $id)->get();
            #có mới và có cũ
            if (count($old_hire) !== 0 && count($new_hire) !== 0) {

                foreach ($detail_import as $item) {
                    $found = false;
                    foreach ($old_hire as $old) {
                        if ($item->id === $old['idDetail']) {
                            $found = true;
                            $item->mamaymoc = $old['mamaymoc'];
                            $item->tenmaymoc = $old['tenmaymoc'];
                            $item->loaimaymoc = $old['loaimaymoc'];
                            $item->dongia = $old['dongia'];

                            $item->sogiothue = $old['sogiothue'];
                            $item->nhathau_id = $old['nhathau_id'];
                            $item->thanhtien = $old['thanhtien'];
                            $item->save();
                            break;
                        }
                    }

                    if (!$found) {
                        $item->delete();
                    }
                }

                foreach ($new_hire as $item) {
                    $new_detail_machine = new DetailHire();
                    $new_detail_machine->phieuthue_id = $id;
                    $new_detail_machine->mamaymoc = $item['mamaymoc'];
                    $new_detail_machine->tenmaymoc = $item['tenmaymoc'];
                    $new_detail_machine->loaimaymoc = $item['loaimaymoc'];
                    $new_detail_machine->dongia = $item['dongia'];
                    $new_detail_machine->sogiothue = $item['sogiothue'];
                    $new_detail_machine->nhathau_id = $item['nhathau_id'];
                    $new_detail_machine->thanhtien = $item['thanhtien'];
                    $new_detail_machine->save();
                }

                return response()->json([
                    'status' => 200,
                    'message' => 'Matterial updated successfully',

                ]);
            }
            #không có cả 2 // loại vì phải có thông tin

            #có cũ không mới
            if (count($old_hire) !== 0 && count($new_hire) === 0) {

                foreach ($detail_import as $item) {
                    $found = false;
                    foreach ($old_hire as $old) {
                        if ($item->id === $old['idDetail']) {
                            $found = true;
                            $item->mamaymoc = $old['mamaymoc'];
                            $item->tenmaymoc = $old['tenmaymoc'];
                            $item->loaimaymoc = $old['loaimaymoc'];
                            $item->dongia = $old['dongia'];

                            $item->sogiothue = $old['sogiothue'];
                            $item->nhathau_id = $old['nhathau_id'];
                            $item->thanhtien = $old['thanhtien'];
                            $item->save();
                            break;
                        }
                    }

                    if (!$found) {
                        $item->delete();
                    }
                }

                return response()->json([
                    'status' => 200,
                    'message' => 'Matterial updated successfully',
                ]);
            }
            #không cũ có mới
            if (count($old_hire) === 0 && count($new_hire) !== 0) {
                foreach ($detail_import as $item) {
                    $item->delete();
                }
                foreach ($new_hire as $item) {
                    $new_detail_machine = new DetailHire();
                    $new_detail_machine->phieuthue_id = $id;
                    $new_detail_machine->mamaymoc = $item['mamaymoc'];
                    $new_detail_machine->tenmaymoc = $item['tenmaymoc'];
                    $new_detail_machine->loaimaymoc = $item['loaimaymoc'];
                    $new_detail_machine->dongia = $item['dongia'];
                    $new_detail_machine->sogiothue = $item['sogiothue'];
                    $new_detail_machine->nhathau_id = $item['nhathau_id'];
                    $new_detail_machine->thanhtien = $item['thanhtien'];
                    $new_detail_machine->save();
                }

                return response()->json([
                    'status' => 200,
                    'message' => 'Matterial updated successfully',
                ]);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $receipt = HireReceipt::findOrFail($id);
        $receipt->delete();

        $detail = DetailHire::where('phieuthue_id', $id)->get();
        foreach ($detail as $item) {
            $item->delete();
        }
    }
}

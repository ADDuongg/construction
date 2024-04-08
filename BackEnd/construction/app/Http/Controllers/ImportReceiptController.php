<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use App\Models\DetailImport;
use App\Models\ImportReceipt;
use App\Models\MatterialType;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImportReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('phieunhap_vatlieu')
            ->select(
                'phieunhap_vatlieu.id',
                'phieunhap_vatlieu.nguoinhap',
                'phieunhap_vatlieu.ghichu',
                'phieunhap_vatlieu.duan_id',
                'phieunhap_vatlieu.created_at',
                'nhanvien.nhanvien_id',
                'nhanvien.hoten',
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.tenvatlieu) AS tenvatlieu'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.mavatlieu) AS mavatlieu'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.khoiluongdung) AS khoiluongdung'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.loaivatlieu) AS loaivatlieu'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.donvitinh) AS donvitinh'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.dongia) AS dongia'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.thanhtien) AS thanhtien'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.nhathau_id) AS nhathau_id'),
                DB::raw('GROUP_CONCAT(chitiet_phieunhap.id) AS idDetail'),
                DB::raw('GROUP_CONCAT(nhathau.tennhathau) AS tennhathau')
            )
            ->leftJoin('chitiet_phieunhap', 'chitiet_phieunhap.phieunhap_id', '=', 'phieunhap_vatlieu.id')
            ->leftJoin('nhanvien', 'nhanvien.nhanvien_id', '=', 'phieunhap_vatlieu.nguoinhap')
            ->leftJoin('nhathau', 'chitiet_phieunhap.nhathau_id', '=', 'nhathau.nhathau_id')
            ->groupBy('phieunhap_vatlieu.updated_at', 'phieunhap_vatlieu.created_at', 'phieunhap_vatlieu.id', 'phieunhap_vatlieu.nguoinhap', 'phieunhap_vatlieu.ghichu', 'phieunhap_vatlieu.duan_id','nhanvien.nhanvien_id','nhanvien.hoten');

        if ($request->has('query')) {
            $queryString = $request->input('query');
            $query->where(function ($query) use ($queryString) {
                $query->where('phieunhap_vatlieu.nguoinhap', 'LIKE', '%' . $queryString . '%')
                    ->orWhere('phieunhap_vatlieu.ghichu', 'LIKE', '%' . $queryString . '%');
            });
        }
        if ($request->has('ngaynhap')) {
            $ngaynhap = $request->input('ngaynhap');
            $query->where('phieunhap_vatlieu.created_at', 'LIKE', '%' . $ngaynhap . '%');
        }
        if ($request->has('duan_id')) {
            $duan_id = $request->input('duan_id');
            $query->where('phieunhap_vatlieu.duan_id', 'LIKE', '%' . $duan_id . '%');
        }
        if ($request->has('nhathau')) {
            $nhathau = $request->input('nhathau');
            $query->where('phieunhap_vatlieu.nguoinhap', 'LIKE', '%' . $nhathau . '%');
        }

        if ($request->has('donvitinh')) {
            $donvitinh = $request->input('donvitinh');
            $query->where('chitiet_phieunhap.donvitinh', 'LIKE', '%' . $donvitinh . '%');
        }

        if ($request->has('khoiluongdung')) {
            $khoiluongdung = $request->input('khoiluongdung');
            $query->where('chitiet_phieunhap.khoiluongdung', 'LIKE', '%' . $khoiluongdung . '%');
        }

        if ($request->has('loaivatlieu')) {
            $loaivatlieu = $request->input('loaivatlieu');
            $query->where('chitiet_phieunhap.loaivatlieu', 'LIKE', '%' . $loaivatlieu . '%');
        }

        if ($request->has('thanhtien')) {
            $thanhtien = $request->input('thanhtien');

            if ($thanhtien === '500') {
                $query->where(function ($query) {
                    $query->whereRaw("chitiet_phieunhap.thanhtien < 500000");
                });
            }

            if ($thanhtien === '500-1000') {
                $query->where(function ($query) {
                    $query->whereBetween('chitiet_phieunhap.thanhtien', [500000, 1000000]);
                });
            }

            if ($thanhtien === '1000') {
                $query->where(function ($query) {
                    $query->whereRaw("FIND_IN_SET('1000', chitiet_phieunhap.thanhtien)");
                    $query->orWhereRaw("chitiet_phieunhap.thanhtien > 1000000");
                });
            }
        }


        $perPage = $request->input('limit', 3);
        $importReceipt = $query->paginate($perPage);
        $contractor = Contractor::all();
        $matterial_types = MatterialType::all();
        $project = Project::all();
        return response()->json([
            'status' => 200,
            'importReceipt' => $importReceipt,
            'matterial_types' => $matterial_types,
            'contractor' => $contractor,
            'project' => $project
        ]);
    }
    public function exposeRentCost($rent_cost)
    {
        $rent_range = explode('-', $rent_cost);
        $min_rent = (int) $rent_range[0] . '000';
        $max_rent = (int) $rent_range[1] . '000';
        return [$min_rent, $max_rent];
    }

    public function getInfo()
    {
        $contractor = Contractor::all();
        $project = Project::All();
        $matterials = DB::table('thongtin_vatlieu')
            ->select('thongtin_vatlieu.*', DB::raw('GROUP_CONCAT(loaivatlieu.ten_loaivatlieu) AS loaivatlieu_name'))
            ->leftJoin('loaivatlieu', 'thongtin_vatlieu.id', '=', 'loaivatlieu.vatlieu_id')
            ->groupBy('thongtin_vatlieu.id', 'thongtin_vatlieu.id', 'thongtin_vatlieu.tenvatlieu', 'thongtin_vatlieu.donvitinh', 'thongtin_vatlieu.mota', 'thongtin_vatlieu.created_at', 'thongtin_vatlieu.updated_at')
            ->get();
        return response()->json([
            'status' => 200,
            'matterials' => $matterials,
            'contractor' => $contractor,
            'project' => $project,
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

        $detail_import = $request->detailImport;
        $import_matterial = $request->importMatterial;
        $duan_id = $import_matterial['duan_id'];

        $new_import_matterial = ImportReceipt::create([
            'duan_id' => $import_matterial['duan_id'],
            'ghichu' => $import_matterial['ghichu'],
            'nguoinhap' => $import_matterial['nguoinhap']

        ]);
        $new_import_matterial->save();

        $id = $new_import_matterial->id;
        foreach ($detail_import as $item) {
            $new_detail_matterial = new DetailImport();
            $new_detail_matterial->phieunhap_id = $id;
            $new_detail_matterial->mavatlieu = $item['mavatlieu'];
            $new_detail_matterial->tenvatlieu = $item['tenvatlieu'];
            $new_detail_matterial->loaivatlieu = $item['loaivatlieu'];
            $new_detail_matterial->dongia = $item['dongia'];
            $new_detail_matterial->donvitinh = $item['donvitinh'];
            $new_detail_matterial->khoiluongdung = $item['khoiluongdung'];
            $new_detail_matterial->nhathau_id = $item['nhathau_id'];
            $new_detail_matterial->thanhtien = $item['thanhtien'];
            $new_detail_matterial->save();
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
    {
        $old_import = $request->old_import;
        $new_import = $request->new_import;
        $import_matterial = $request->importMatterial;

        $import = ImportReceipt::findOrFail($id);
        $import->duan_id = $import_matterial['duan_id'];
        $import->ghichu = $import_matterial['ghichu'];
        $import->nguoinhap = $import_matterial['nguoinhap'];
        $import->save();

        $detail_import = DetailImport::where('phieunhap_id', $id)->get();
        #có mới và có cũ
        if (count($old_import) !== 0 && count($new_import) !== 0) {

            foreach ($detail_import as $item) {
                $found = false;
                foreach ($old_import as $old) {
                    if ($item->id === $old['idDetail']) {
                        $found = true;
                        $item->mavatlieu = $old['mavatlieu'];
                        $item->tenvatlieu = $old['tenvatlieu'];
                        $item->loaivatlieu = $old['loaivatlieu'];
                        $item->dongia = $old['dongia'];
                        $item->donvitinh = $old['donvitinh'];
                        $item->khoiluongdung = $old['khoiluongdung'];
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

            foreach ($new_import as $item) {
                $new_detail_matterial = new DetailImport();
                $new_detail_matterial->phieunhap_id = $id;
                $new_detail_matterial->mavatlieu = $item['mavatlieu'];
                $new_detail_matterial->tenvatlieu = $item['tenvatlieu'];
                $new_detail_matterial->loaivatlieu = $item['loaivatlieu'];
                $new_detail_matterial->dongia = $item['dongia'];
                $new_detail_matterial->donvitinh = $item['donvitinh'];
                $new_detail_matterial->khoiluongdung = $item['khoiluongdung'];
                $new_detail_matterial->nhathau_id = $item['nhathau_id'];
                $new_detail_matterial->thanhtien = $item['thanhtien'];
                $new_detail_matterial->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Matterial updated successfully',

            ]);
        }
        #không có cả 2 // loại vì phải có thông tin

        #có cũ không mới
        if (count($old_import) !== 0 && count($new_import) === 0) {

            foreach ($detail_import as $item) {
                $found = false;
                foreach ($old_import as $old) {
                    if ($item->id === $old['idDetail']) {
                        $found = true;
                        $item->mavatlieu = $old['mavatlieu'];
                        $item->tenvatlieu = $old['tenvatlieu'];
                        $item->loaivatlieu = $old['loaivatlieu'];
                        $item->dongia = $old['dongia'];
                        $item->donvitinh = $old['donvitinh'];
                        $item->khoiluongdung = $old['khoiluongdung'];
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
        if (count($old_import) === 0 && count($new_import) !== 0) {
            foreach ($detail_import as $item) {
                $item->delete();
            }
            foreach ($new_import as $item) {
                $new_detail_matterial = new DetailImport();
                $new_detail_matterial->phieunhap_id = $id;
                $new_detail_matterial->mavatlieu = $item['mavatlieu'];
                $new_detail_matterial->tenvatlieu = $item['tenvatlieu'];
                $new_detail_matterial->loaivatlieu = $item['loaivatlieu'];
                $new_detail_matterial->dongia = $item['dongia'];
                $new_detail_matterial->donvitinh = $item['donvitinh'];
                $new_detail_matterial->khoiluongdung = $item['khoiluongdung'];
                $new_detail_matterial->nhathau_id = $item['nhathau_id'];
                $new_detail_matterial->thanhtien = $item['thanhtien'];
                $new_detail_matterial->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Matterial updated successfully',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $receipt = ImportReceipt::findOrFail($id);
        $receipt->delete();

        $detail = DetailImport::where('phieunhap_id', $id)->get();
        foreach ($detail as $item) {
            $item->delete();
        }
    }
}

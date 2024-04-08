<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineStatistic;
use App\Models\Matterials;
use App\Models\MatterialStatistic;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /* $query = DB::table('thongkengay')
            ->select(
                'thongkengay.*',
                'du_an.tenduan',
                DB::raw('GROUP_CONCAT(DISTINCT maymoc_ngay.tenmaymoc) AS tenmaymoc'),
                DB::raw('GROUP_CONCAT(DISTINCT maymoc_ngay.mamaymoc) AS mamaymoc'),
                DB::raw('GROUP_CONCAT(DISTINCT maymoc_ngay.sogiothue) AS sogiothue'),
                DB::raw('GROUP_CONCAT(DISTINCT maymoc_ngay.loaimaymoc) AS loaimaymoc'),
                DB::raw('GROUP_CONCAT(DISTINCT vatlieu_ngay.tenvatlieu) AS tenvatlieu'),
                DB::raw('GROUP_CONCAT(DISTINCT vatlieu_ngay.mavatlieu) AS mavatlieu'),
                DB::raw('GROUP_CONCAT(DISTINCT vatlieu_ngay.loaivatlieu) AS loaivatlieu'),
                DB::raw('GROUP_CONCAT( vatlieu_ngay.donvitinh) AS donvitinh'),
                DB::raw('GROUP_CONCAT(DISTINCT vatlieu_ngay.khoiluongdung) AS khoiluongdung')
            )
            ->leftJoin('maymoc_ngay', 'thongkengay.thongkengay_id', '=', 'maymoc_ngay.thongkengay_id')
            ->leftJoin('vatlieu_ngay', 'thongkengay.thongkengay_id', '=', 'vatlieu_ngay.thongkengay_id')
            ->leftJoin('du_an', 'thongkengay.duan_id', '=', 'du_an.id')
            ->groupBy('du_an.tenduan', 'thongkengay.thongkengay_id', 'thongkengay.duan_id', 'thongkengay.giaidoan_duan_id', 'thongkengay.ghichu', 'thongkengay.nhanvien_id', 'thongkengay.ngaythongke', 'thongkengay.created_at', 'thongkengay.updated_at');
 */

        $statistics = DB::table('thongkengay')
            ->leftJoin('du_an', 'thongkengay.duan_id', '=', 'du_an.id')
            ->leftJoin('nhanvien', 'nhanvien.nhanvien_id', '=', 'thongkengay.nhanvien_id')
            ->select(
                'thongkengay.*',
                'du_an.tenduan',
                'nhanvien.nhanvien_id',
                'nhanvien.hoten'
            );

        $machines_statistic = DB::table('maymoc_ngay')->select('maymoc_ngay.*');
        $matterials_statistic = DB::table('vatlieu_ngay')->select('vatlieu_ngay.*');
        if ($request->has('tenvatlieu')) {
            $tenvatlieu = $request->input('tenvatlieu');
            $matterials_statistic->where('vatlieu_ngay.tenvatlieu', 'LIKE', '%' . $tenvatlieu . '%');
        }
        if ($request->has('tenmaymoc')) {
            $tenmaymoc = $request->input('tenmaymoc');
            $machines_statistic->where('maymoc_ngay.tenmaymoc', 'LIKE', '%' . $tenmaymoc . '%');
        }
        if ($request->has('hoten')) {
            $hoten = $request->input('hoten');
            $statistics->where('nhanvien.hoten', 'LIKE', '%' . $hoten . '%');
        }
        if ($request->has('ngaythongke')) {
            $ngaythongke = $request->input('ngaythongke');
            $statistics->where('thongkengay.ngaythongke', 'LIKE', '%' . $ngaythongke . '%');
        }
        if ($request->has('tenduan')) {
            $tenduan = $request->input('tenduan');
            $statistics->where('du_an.tenduan', 'LIKE', '%' . $tenduan . '%');
        }
        $perPage = $request->input('limit', 3);
        $statistics = $statistics->paginate($perPage);

        $machines = Machine::all();
        $matterials = Matterials::all();
        return response()->json([
            'status' => 200,
            'statistics' => $statistics,
            'matterials' => $matterials,
            'machines' => $machines,
            'matterials_statistic' => $matterials_statistic->get(),
            'machines_statistic' => $machines_statistic->get(),
        ]);
    }

    function getMachine()
    {
        $machine_statistic = MachineStatistic::all();
        return response()->json([
            'status' => 200,
            'machine_statistic' => $machine_statistic,
        ]);
    }
    function getMatterial()
    {
        $matterial_statistic = matterialStatistic::all();
        return response()->json([
            'status' => 200,
            'matterial_statistic' => $matterial_statistic,
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
        $matterial_request = $request->matterials;
        $machine_request = $request->machines;
        $statistic_request = $request->statistic;

        $statistic = new Statistic();

        $statistic->duan_id = $statistic_request['duan_id'];
        $statistic->giaidoan_duan_id = $statistic_request['giaidoan_duan_id'];
        $statistic->ngaythongke = $statistic_request['ngaythongke'];
        $statistic->nhanvien_id = $statistic_request['nhanvien_id'];
        $statistic->ghichu = $statistic_request['ghichu'];
        $statistic->save();

        $statistic_id = $statistic->getKey(); // Lấy ID của bản ghi vừa tạo

        foreach ($matterial_request as $item) {
            $matterial_day = new MatterialStatistic();
            $matterial_day->thongkengay_id = $statistic_id; // Gán ID của bản ghi Statistic
            $matterial_day->mavatlieu = $item['mavatlieu'];
            $matterial_day->tenvatlieu = $item['tenvatlieu'];
            $matterial_day->loaivatlieu = $item['loaivatlieu'];
            $matterial_day->khoiluongdung = $item['khoiluongdung'];
            $matterial_day->donvitinh = $item['donvitinh'];
            $matterial_day->save();
        }

        foreach ($machine_request as $item) {
            $machine_day = new MachineStatistic();
            $machine_day->thongkengay_id = $statistic_id; // Gán ID của bản ghi Statistic
            $machine_day->mamaymoc = $item['mamaymoc'];
            $machine_day->tenmaymoc = $item['tenmaymoc'];
            $machine_day->loaimaymoc = $item['loaimaymoc'];
            $machine_day->sogiothue = $item['sogiothue'];
            $machine_day->save();
        }

        return response()->json(['message' => 'Thêm thống kê ngày thành công'], 200);
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
        $statistic_data = $request->statistic;
        $statistic = Statistic::where('thongkengay_id', $id)->first();

        if ($statistic) {
            $statistic->update($statistic_data);
        }
        $old_matterials = $request->old_matterials;
        $new_matterials = $request->new_matterials;
        $old_machines = $request->old_machines;
        $new_machines = $request->new_machines;
        if ($old_matterials || $new_matterials) {
            $this->updateMatterials($old_matterials, $new_matterials, $id);
        }
        if ($old_machines || $new_machines) {
            $this->updateMachines($old_machines, $new_machines, $id);
        }
    }


    public function updateMatterials($old_matterials, $new_matterials, $id)
    {
        /* Matterials */


        $detail_import = MatterialStatistic::where('thongkengay_id', $id)->get();
        #có mới và có cũ
        if (count($old_matterials) !== 0 && count($new_matterials) !== 0) {

            foreach ($detail_import as $item) {
                $found = false;
                foreach ($old_matterials as $old) {
                    if ($item->vatlieu_ngay_id === $old['vatlieu_ngay_id']) {
                        $found = true;
                        $item->mavatlieu = $old['mavatlieu'];
                        $item->tenvatlieu = $old['tenvatlieu'];
                        $item->loaivatlieu = $old['loaivatlieu'];
                        $item->donvitinh = $old['donvitinh'];
                        $item->khoiluongdung = $old['khoiluongdung'];
                        $item->save();
                        break;
                    }
                }

                if (!$found) {
                    $item->delete();
                }
            }
            foreach ($new_matterials as $item) {
                $new_detail_matterial = new MatterialStatistic();
                $new_detail_matterial->thongkengay_id = $id;
                $new_detail_matterial->mavatlieu = $item['mavatlieu'];
                $new_detail_matterial->tenvatlieu = $item['tenvatlieu'];
                $new_detail_matterial->loaivatlieu = $item['loaivatlieu'];
                $new_detail_matterial->donvitinh = $item['donvitinh'];
                $new_detail_matterial->khoiluongdung = $item['khoiluongdung'];
                $new_detail_matterial->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Matterial updated successfully',

            ]);
        }
        #không có cả 2 // loại vì phải có thông tin
        if (count($old_matterials) === 0 && count($new_matterials) === 0) {
            foreach ($detail_import as $item) {
                $item->delete();
            }
        }
        #có cũ không mới
        if (count($old_matterials) !== 0 && count($new_matterials) === 0) {

            foreach ($detail_import as $item) {
                $found = false;
                foreach ($old_matterials as $old) {
                    if ($item->vatlieu_ngay_id === $old['vatlieu_ngay_id']) {
                        $found = true;
                        $item->mavatlieu = $old['mavatlieu'];
                        $item->tenvatlieu = $old['tenvatlieu'];
                        $item->loaivatlieu = $old['loaivatlieu'];
                        $item->donvitinh = $old['donvitinh'];
                        $item->khoiluongdung = $old['khoiluongdung'];
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
        if (count($old_matterials) === 0 && count($new_matterials) !== 0) {
            foreach ($detail_import as $item) {
                $item->delete();
            }
            foreach ($new_matterials as $item) {
                $new_detail_matterial = new MatterialStatistic();
                $new_detail_matterial->thongkengay_id = $id;
                $new_detail_matterial->mavatlieu = $item['mavatlieu'];
                $new_detail_matterial->tenvatlieu = $item['tenvatlieu'];
                $new_detail_matterial->loaivatlieu = $item['loaivatlieu'];
                $new_detail_matterial->donvitinh = $item['donvitinh'];
                $new_detail_matterial->khoiluongdung = $item['khoiluongdung'];
                $new_detail_matterial->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Matterial updated successfully',
            ]);
        }
    }

    public function updateMachines($old_machines, $new_machines, $id)
    {
        /* Machines */
        $detail_hire = MachineStatistic::where('thongkengay_id', $id)->get();
        #có mới và có cũ
        if (count($old_machines) !== 0 && count($new_machines) !== 0) {

            foreach ($detail_hire as $item) {
                $found = false;
                foreach ($old_machines as $old) {
                    if ($item->maymoc_ngay_id === $old['maymoc_ngay_id']) {
                        $found = true;
                        $item->mamaymoc = $old['mamaymoc'];
                        $item->tenmaymoc = $old['tenmaymoc'];
                        $item->loaimaymoc = $old['loaimaymoc'];
                        $item->sogiothue = $old['sogiothue'];
                        $item->save();
                        break;
                    }
                }

                if (!$found) {
                    $item->delete();
                }
            }

            foreach ($new_machines as $item) {
                $new_detail_machine = new MachineStatistic();
                $new_detail_machine->phieuthue_id = $id;
                $new_detail_machine->mamaymoc = $item['mamaymoc'];
                $new_detail_machine->tenmaymoc = $item['tenmaymoc'];
                $new_detail_machine->loaimaymoc = $item['loaimaymoc'];
                $new_detail_machine->sogiothue = $item['sogiothue'];

                $new_detail_machine->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Matterial updated successfully',

            ]);
        }
        #không có cả 2 // loại vì phải có thông tin

        #có cũ không mới
        if (count($old_machines) !== 0 && count($new_machines) === 0) {

            foreach ($detail_hire as $item) {
                $found = false;
                foreach ($old_machines as $old) {
                    if ($item->maymoc_ngay_id === $old['maymoc_ngay_id']) {
                        $found = true;
                        $item->mamaymoc = $old['mamaymoc'];
                        $item->tenmaymoc = $old['tenmaymoc'];
                        $item->loaimaymoc = $old['loaimaymoc'];
                        $item->sogiothue = $old['sogiothue'];
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
        if (count($old_machines) === 0 && count($new_machines) !== 0) {
            foreach ($detail_hire as $item) {
                $item->delete();
            }
            foreach ($new_machines as $item) {
                $new_detail_machine = new MachineStatistic();
                $new_detail_machine->phieuthue_id = $id;
                $new_detail_machine->mamaymoc = $item['mamaymoc'];
                $new_detail_machine->tenmaymoc = $item['tenmaymoc'];
                $new_detail_machine->loaimaymoc = $item['loaimaymoc'];
                $new_detail_machine->sogiothue = $item['sogiothue'];

                $new_detail_machine->save();
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
        $statistic = Statistic::findOrFail($id);
        $statistic_matterial = MatterialStatistic::where('thongkengay_id', $id)->get();
        $statistic_machine = MachineStatistic::where('thongkengay_id', $id)->get();

        foreach ($statistic_matterial as $item) {
            $item->delete();
        }
        foreach ($statistic_machine as $item) {
            $item->delete();
        }
        $statistic->delete();
        return response()->json(200);
    }
}

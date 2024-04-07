<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $schedule = DB::table('lichtrinh_duan')
            ->leftJoin('du_an', 'du_an.id', '=', 'lichtrinh_duan.duan_id')
            ->leftJoin('giaidoan_duan', 'giaidoan_duan.id', '=', 'lichtrinh_duan.giaidoan_duan_id')
            ->select('lichtrinh_duan.*', 'du_an.tenduan', 'giaidoan_duan.giaidoan');

        if ($request->has('duan_id')) {
            $duan_id = $request->duan_id;
            $schedule->where('lichtrinh_duan.duan_id', 'LIKE', '%' . $duan_id . '%');
        }
        if ($request->has('giaidoan_duan_id')) {
            $giaidoan_duan_id = $request->giaidoan_duan_id;
            $schedule->where('lichtrinh_duan.giaidoan_duan_id', 'LIKE', '%' . $giaidoan_duan_id . '%');
        }
        if ($request->has('nhiemvu')) {
            $nhiemvu = $request->nhiemvu;
            $schedule->where(DB::raw("IFNULL(lichtrinh_duan.nhiemvu, '')"), 'LIKE', '%' . $nhiemvu . '%');
        }
        if ($request->has('thoigian')) {
            $thoigian = $request->thoigian;
            $schedule->where(DB::raw("SUBSTRING_INDEX(lichtrinh_duan.thoigian, '/', 1)"), 'LIKE', '%' . $thoigian . '%');
        }
        $project = DB::table('du_an')->get();
        $per_page = $request->input('limit', 10);
        $schedule = $schedule->paginate($per_page);
        $state = DB::table('giaidoan_duan')->get();
        return response()->json([
            'schedule' => $schedule,
            'project' => $project,
            'state' => $state
        ], 200);
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
        $duan_id = $request->duan_id;
        $giaidoan_duan_id = $request->giaidoan_duan_id;
        $tasks = $request->tasks;


        $existingSchedule = Schedule::where('duan_id', $duan_id)
            ->where('giaidoan_duan_id', $giaidoan_duan_id)
            ->first();

        if ($existingSchedule) {
            return response()->json([
                'message' => 'Lịch trình dự án đã tồn tại'
            ], 400);
        }

        foreach ($tasks as $item) {
            $schedule = new Schedule();
            $schedule->duan_id = $duan_id;
            $schedule->giaidoan_duan_id = $giaidoan_duan_id;
            $schedule->nhiemvu = $item['task'];
            $schedule->thoigian = date("Y-m-d", strtotime($item['time']));
            $schedule->save();
        }

        return response()->json([
            'message' => 'Thêm thành công lịch trình dự án'
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
        $schedule = Schedule::findOrFail($id);
        $name = $request->name;
        $value = $request->value;

        if ($name === 'nhiemvu') {
            $schedule->nhiemvu = $value;
            $schedule->save();
            return response()->json(200);
        }
        if ($name === 'thoigian') {
            $schedule->thoigian = $value;
            $schedule->save();
            return response()->json(200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(200);
    }
    public function deleteAll(Request $request)
    {
        $scheduleCheck = $request->checkAll;

        $checkedItems = array_filter($scheduleCheck, function ($item) {
            return $item['isChecked'] === true;
        });
        $checkedIds = array_column($checkedItems, 'id');
        Schedule::whereIn('id', $checkedIds)->delete();

        return response()->json(200);
    }
}

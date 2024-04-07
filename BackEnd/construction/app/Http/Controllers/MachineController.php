<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DB::table('thongtin_maymoc')
            ->select('thongtin_maymoc.*', DB::raw('GROUP_CONCAT(loaimaymoc.ten_loaimaymoc) AS loaimaymoc_name'))
            ->leftJoin('loaimaymoc', 'thongtin_maymoc.id', '=', 'loaimaymoc.maymoc_id')
            ->groupBy('thongtin_maymoc.id', 'thongtin_maymoc.id', 'thongtin_maymoc.tenmaymoc', 'thongtin_maymoc.mota', 'thongtin_maymoc.created_at', 'thongtin_maymoc.updated_at'); // Thêm 'thongtin_maymoc.mamaymoc' vào phần GROUP BY


        if ($request->has('tenmaymoc')) {
            $tenmaymoc = $request->input('tenmaymoc');
            $query->where('tenmaymoc', 'like', '%' . $tenmaymoc . '%');
        }
        if ($request->has('mota')) {
            $mota = $request->input('mota');
            $query->where('mota', 'like', '%' . $mota . '%');
        }

        if ($request->has('loaimaymoc')) {
            $loaimaymoc = $request->input('loaimaymoc');
            if ($loaimaymoc !== '') {
                $query->havingRaw("IFNULL(loaimaymoc_name, '') LIKE ?", ['%' . $loaimaymoc . '%']);
            }
        }


        $perPage = $request->input('limit', 3);
        $machines = $query->paginate($perPage);

        $machines_type = MachineType::all();

        return response()->json([
            'status' => 200,
            'machines' => $machines,
            'machines_type' => $machines_type
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
        // Validate request data
        $validatedData = $request->validate([
            'tenmaymoc' => 'required|string',
            'mota' => 'required|string',
        ]);
        do {
            $id = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            $existingMaterial = Machine::where('id', $id)->first();
        } while ($existingMaterial);

        $machine = Machine::create([
            'tenmaymoc' => $validatedData['tenmaymoc'],
            'id' => $id,
            'mota' => $validatedData['mota'],
        ]);
        if (!$machine) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create material'
            ], 500);
        }

        
        $types = $request->types;
        foreach ($types as $type) {
            $machine_types = new MachineType();
            $machine_types->maymoc_id = $id;
            $machine_types->ten_loaimaymoc = $type;
            $machine_types->save();
        }

        
        return response()->json([
            'status' => 200,
            'message' => 'Material created successfully'
        ]);
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
        $validatedData = $request->validate([
            'tenmaymoc' => 'string',
            'mota' => 'string'
        ]);
        $old_type = $request->old_types;
        $new_types = $request->new_types;

       /*  $mamaymoc = $request->mamaymoc;
        $mamaymoc_cu = $request->mamaymoc_cu;
        $existing_machine = Machine::where('mamaymoc', $mamaymoc)->first();
        
        
        if ($existing_machine && $existing_machine->mamaymoc !== $mamaymoc_cu) {
            return response()->json(['message' => 'Mã vật liệu không được trùng nhau'], 400);
        } */
        
        
        $machine_types = MachineType::where('maymoc_id', $id)->get();
        $machine = Machine::where('id', $id)->first();
        
        $machine->update($validatedData);


       /*  $machine->mamaymoc = $mamaymoc;
        $machine->save();
        foreach ($machine_types as $item) {
            $item->maymoc_id = $mamaymoc;
            $item->save();
        } */
        # có loại mới và không có cũ
        if (count($old_type) === 0 && count($new_types) !== 0) {

            foreach ($machine_types as $item) {
                $item->delete();
            }

            foreach ($new_types as $newType) {
                MachineType::create([
                    'maymoc_id' => $id,
                    'ten_loaimaymoc' => $newType,
                ]);
            }
        }

        # không có cả hai
        if (count($old_type) === 0 && count($new_types) === 0) {
            foreach ($machine_types as $item) {
                $item->delete();
            }
        }

        # có cũ và không có mới
        if (count($old_type) !== 0 && count($new_types) === 0) {
           
        }

        # có cũ và có mới
        if (count($old_type) !== 0 && count($new_types) !== 0) {
            foreach ($machine_types as $machine) {
                $machine->maymoc_id = $id;
                if (!in_array($machine->ten_loaimaymoc, $old_type)) {
                    $machine->delete();
                }
            }
            foreach ($new_types as $newType) {
                MachineType::create([
                    'maymoc_id' => $id,
                    'ten_loaimaymoc' => $newType,
                ]);
            }
        }


        return response()->json([
            'status' => 200,
            'message' => 'Matterial updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $matterials = Machine::where('id', $id);
        $matterials->delete();

        $matterials_type = MachineType::where('maymoc_id', $id);
        $matterials_type->delete();

        return response()->json([
            'status' => 200,
        ]);
    }
}

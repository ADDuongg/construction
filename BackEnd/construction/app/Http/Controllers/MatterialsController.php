<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use App\Models\Matterials;
use App\Models\MatterialType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatterialsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = DB::table('thongtin_vatlieu')
            ->select('thongtin_vatlieu.*', DB::raw('GROUP_CONCAT(loaivatlieu.ten_loaivatlieu) AS loaivatlieu_name'))
            ->leftJoin('loaivatlieu', 'thongtin_vatlieu.id', '=', 'loaivatlieu.vatlieu_id')
            ->groupBy('thongtin_vatlieu.id', 'thongtin_vatlieu.id', 'thongtin_vatlieu.tenvatlieu', 'thongtin_vatlieu.donvitinh', 'thongtin_vatlieu.mota', 'thongtin_vatlieu.created_at', 'thongtin_vatlieu.updated_at');


        if ($request->has('tenvatlieu')) {
            $tenvatlieu = $request->input('tenvatlieu');
            $query->where('tenvatlieu', 'like', '%' . $tenvatlieu . '%');
        }
        if ($request->has('mota')) {
            $mota = $request->input('mota');
            $query->where('mota', 'like', '%' . $mota . '%');
        }
        if ($request->has('donvitinh')) {
            $donvitinh = $request->input('donvitinh');
            $query->where('donvitinh', 'like', '%' . $donvitinh . '%');
        }
        if ($request->has('loaivatlieu')) {
            $loaivatlieu = $request->input('loaivatlieu');
            if ($loaivatlieu !== '') {
                $query->havingRaw("IFNULL(loaivatlieu_name, '') LIKE ?", ['%' . $loaivatlieu . '%']);
            }
        }



        $perPage = $request->input('limit', 3);
        $matterials = $query->paginate($perPage);

        $matterials_type = MatterialType::all();

        return response()->json([
            'status' => 200,
            'matterials' => $matterials,
            'matterials_type' => $matterials_type
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
            'tenvatlieu' => 'required|string',
            'mota' => 'required|string',
            'donvitinh' => 'required|string',
        ]);

        // Generate unique mavatlieu
        do {
            $mavatlieu = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            $existingMaterial = Matterials::where('id', $mavatlieu)->first();
        } while ($existingMaterial);

        // Save the new material
        $material = Matterials::create([
            'tenvatlieu' => $validatedData['tenvatlieu'],
            'id' => $mavatlieu,
            'mota' => $validatedData['mota'],
            'donvitinh' => $validatedData['donvitinh'],
        ]);

        if (!$material) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create material'
            ], 500);
        }

        // If you want to handle types as well, add your logic here
        $types = $request->types;
        foreach ($types as $type) {
            $matterials_type = new MatterialType();
            $matterials_type->vatlieu_id = $mavatlieu;
            $matterials_type->ten_loaivatlieu = $type;
            $matterials_type->save();
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
            'tenvatlieu' => 'string',
            'mota' => 'string',
            'donvitinh' => 'string',
        ]);
        $matterial = Matterials::where('id', $id)->first();
        $matterial->update($validatedData);


        $mavatlieu = $request->mavatlieu;
        $mavatlieu_cu = $request->mavatlieu_cu;
        $old_type = $request->old_types;
        $new_types = $request->new_types;
        $matterial_type = MatterialType::where('vatlieu_id', $id)->get();

        $matterial->save();

        # có loại mới và không có cũ
        if (count($old_type) === 0 && count($new_types) !== 0) {
            foreach ($matterial_type as $item) {
                $item->delete();
            }
            foreach ($new_types as $newType) {
                MatterialType::create([
                    'vatlieu_id' => $id,
                    'ten_loaivatlieu' => $newType,
                ]);
            }
        }

        # không có cả hai
        if (count($old_type) === 0 && count($new_types) === 0) {
            foreach ($matterial_type as $item) {
                $item->delete();
            }
        }

        # có cũ và không có mới
        if (count($old_type) !== 0 && count($new_types) === 0) {
        }

        # có cũ và có mới
        if (count($old_type) !== 0 && count($new_types) !== 0) {
            foreach ($matterial_type as $matterial) {
                $matterial->vatlieu_id = $mavatlieu;
                if (!in_array($matterial->ten_loaivatlieu, $old_type)) {
                    $matterial->delete();
                }
            }
            foreach ($new_types as $newType) {
                MatterialType::create([
                    'vatlieu_id' => $id,
                    'ten_loaivatlieu' => $newType,
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
        $matterials = Matterials::where('id', $id);
        $matterials->delete();

        $matterials_type = MatterialType::where('vatlieu_id', $id);
        $matterials_type->delete();

        return response()->json([
            'status' => 200,
        ]);
    }
}

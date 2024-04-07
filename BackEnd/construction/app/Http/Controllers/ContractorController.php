<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contractor;

class ContractorController extends Controller
{
    /**
     * Hiển thị danh sách các nhà thầu dưới dạng JSON.
     */
    public function index(Request $request)
    {
        $query = Contractor::query();

        if ($request->has('tennhathau')) {
            $tennhathau = $request->input('tennhathau');
            $query->where('tennhathau', 'like', '%' . $tennhathau . '%');
        }

        if ($request->has('diachi')) {
            $diachi = $request->input('diachi');
            $query->where('diachi', 'like', '%' . $diachi . '%');
        }

        if ($request->has('loaihinhhoatdong')) {
            $loaihinhhoatdong = $request->input('loaihinhhoatdong');
            $query->where('loaihinhhoatdong', 'like', '%' . $loaihinhhoatdong . '%');
        }
        if ($request->has('email')) {
            $email = $request->input('email');
            $query->where('email', 'like', '%' . $email . '%');
        }

        $perPage = $request->input('limit', 3);
        $contractors = $query->paginate($perPage);



        return response()->json([
            'status' => 200,
            'contractors' => $contractors,

        ]);
    }

    /**
     * Lưu nhà thầu mới vào cơ sở dữ liệu.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tennhathau' => 'required',
            'diachi' => 'required',
            'sdt' => 'required',
            'email' => 'required|email',
            'loaihinhhoatdong' => 'required',
        ]);

        $contractor = Contractor::create($validatedData);

        return response()->json(['message' => 'Nhà thầu đã được tạo thành công.', 'data' => $contractor], 201);
    }

    /**
     * Hiển thị thông tin chi tiết của một nhà thầu dưới dạng JSON.
     */
    public function show(string $id)
    {
        $contractor = Contractor::findOrFail($id);
        return response()->json(['data' => $contractor]);
    }

    /**
     * Cập nhật thông tin của một nhà thầu trong cơ sở dữ liệu.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'tennhathau' => 'required',
            'diachi' => 'required',
            'sdt' => 'required',
            'email' => 'required|email',
            'loaihinhhoatdong' => 'required',
        ]);

        Contractor::where('nhathau_id',$id)->update($validatedData);
        $contractor = Contractor::findOrFail($id);

        return response()->json(['message' => 'Thông tin nhà thầu đã được cập nhật thành công.', 'data' => $contractor]);
    }

    /**
     * Xóa một nhà thầu khỏi cơ sở dữ liệu.
     */
    public function destroy(string $id)
    {
        $contractor = Contractor::where('nhathau_id',$id)->first();
        $contractor->delete();

        return response()->json(['message' => 'Nhà thầu đã được xóa thành công.']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\StaffModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StaffModel::query();

        if ($request->has('query')) {
            $searchTerm = $request->input('query');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('hoten', 'like', '%' . $searchTerm . '%')
                    ->orWhere('diachi', 'like', '%' . $searchTerm . '%')
                    ->orWhere('sdt', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->has('gioitinh')) {
            $gioitinh = $request->gioitinh;
            $query->where('gioitinh', 'like', '%' . $gioitinh . '%');
        }

        if ($request->has('ngaysinh')) {
            $ngaysinh = $request->ngaysinh;
            $query->where('ngaysinh', 'like', '%' . $ngaysinh . '%');
        }

        if ($request->has('chucvu')) {
            $chucvu = $request->chucvu;
            $query->where('chucvu', 'like', '%' . $chucvu . '%');
        }

        $perPage = $request->input('limit', 3);
        $staffs = $query->paginate($perPage);
        $allStaff = StaffModel::all();
        return response()->json([
            'status' => 200,
            'staffs' => $staffs,
            'all_staff' => $allStaff
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
        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'hoten' => 'required|max:255',
            'email' => 'required|email|unique:nhanvien,email',
            'sdt' => 'required|max:15',
            'diachi' => 'required|max:255',
            'ngaysinh' => 'required|date',
            'gioitinh' => 'required',
            'chucvu' => 'required|string|max:255',
        ]);

        // Nếu validation thất bại, trả về thông báo lỗi
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        // Tạo mới nhân viên
        $staff = StaffModel::create([
            'hoten' => $request->hoten,
            'email' => $request->email,
            'sdt' => $request->sdt,
            'diachi' => $request->diachi,
            'ngaysinh' => $request->ngaysinh,
            'gioitinh' => $request->gioitinh,
            'chucvu' => $request->chucvu,
            'account_id' => null
        ]);

        // Trả về thông báo thành công
        return response()->json([
            'status' => 200,
            'message' => 'Nhân viên đã được tạo thành công',
            'staff' => $staff,
        ], 201);
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
            'hoten' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'sdt' => 'required|string|max:20',
            'diachi' => 'required|string|max:255',
            'ngaysinh' => 'required|date',
            'gioitinh' => 'required|in:0,1',
            'chucvu' => 'required|string|max:255',
        ]);


        $staff = StaffModel::findOrFail($id);


        $staff->update($validatedData);


        return response()->json(['message' => 'Staff updated successfully', 'status' => 200]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $staff = StaffModel::findOrFail($id);
        $staff->delete();

        return response()->json([
            'status' => 200,
        ]);
    }
}

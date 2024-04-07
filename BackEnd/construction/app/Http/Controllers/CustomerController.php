<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * Hiển thị danh sách các khách hàng.
     */
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('hoten')) {
            $hoten = $request->input('hoten');
            $query->where('hoten', 'like', '%' . $hoten . '%');
        }

        if ($request->has('ngaysinh')) {
            $ngaysinh = $request->input('ngaysinh');
            $query->where('ngaysinh', 'like', '%' . $ngaysinh . '%');
        }
        if ($request->has('gioitinh')) {
            $gioitinh = $request->input('gioitinh');
            $query->where('gioitinh', 'like', '%' . $gioitinh . '%');
        }
        if ($request->has('email')) {
            $email = $request->input('email');
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($request->has('loaikhachhang')) {
            $loaikhachhang = $request->input('loaikhachhang');
            $query->where('loaikhachhang', 'like', '%' . $loaikhachhang . '%');
        }

        $perPage = $request->input('limit', 3);
        $customers = $query->paginate($perPage);

        return response()->json([
            'status' => 200,
            'customers' => $customers,
        ]);
    }

    /**
     * Hiển thị form để tạo mới khách hàng.
     */
    public function create()
    {
        //
    }

    /**
     * Lưu khách hàng mới vào cơ sở dữ liệu.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'hoten' => 'required',
            'diachi' => 'required',
            'sdt' => 'required',
            'email' => 'required|email',
            'ngaysinh' => 'required|date',
            'gioitinh' => 'required',
            'loaikhachhang' => 'required',
        ]);

        $customer = Customer::create($validatedData);

        return response()->json(['message' => 'Khách hàng đã được tạo thành công.', 'data' => $customer], 201);
    }

    /**
     * Hiển thị thông tin chi tiết của một khách hàng.
     */
    public function show(string $id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json(['data' => $customer]);
    }

    /**
     * Hiển thị form để chỉnh sửa thông tin của một khách hàng.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Cập nhật thông tin của một khách hàng trong cơ sở dữ liệu.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'hoten' => 'required',
            'diachi' => 'required',
            'sdt' => 'required',
            'email' => 'required|email',
            'ngaysinh' => 'required|date',
            'gioitinh' => 'required',
            'loaikhachhang' => 'required',
        ]);

        Customer::where('khachhang_id', $id)->update($validatedData);
        $customer = Customer::findOrFail($id);

        return response()->json(['message' => 'Thông tin khách hàng đã được cập nhật thành công.', 'data' => $customer]);
    }

    /**
     * Xóa một khách hàng khỏi cơ sở dữ liệu.
     */
    public function destroy(string $id)
    {
        $customer = Customer::where('khachhang_id',$id);
        $customer->delete();

        return response()->json(['message' => 'Khách hàng đã được xóa thành công.']);
    }
}

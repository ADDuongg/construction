<?php

namespace App\Http\Controllers;

use App\Models\StaffModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::where('email', $request->email)->first();
            $staff = DB::table('nhanvien')
            ->leftJoin('phancong_duan','nhanvien.nhanvien_id','=','phancong_duan.nhanvien_id')
            ->select('phancong_duan.duan_id','nhanvien.*')
            ->where('account_id','=',$user->id)->get();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials',
                ]);
            } else {
                if ($user->role === 'project manager') {
                    $token = $user->createToken('_project')->plainTextToken;
                } 
                else if($user->role === 'construction manager'){
                    $token = $user->createToken('_construction')->plainTextToken;
                }
                else {
                    $token = $user->createToken('_AdminToken')->plainTextToken;
                }
                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'message' => 'Logged In Successfully',
                    'user' => $staff
                ]);
            }
        }
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
            'email' => 'required|email:191|unique:users,email',
            'password' => 'required',
        ]);
        $data_user = User::where('email', $request->email)->first();
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        if ($data_user && $data_user->email === $request->email) {
            return response()->json([
                'message' => 'Email này đã được đăng kí'
            ]);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                /* 'role' => 'user', */
            ]);
            return response()->json([
                'status' => 200,
                'username' => $user->name,
                'message' => 'Registered Successfully',
            ]);
        }
    }

    public function logout(Request $request)
    {
        if (auth()->check()) {
            /*  auth()->user()->tokens()->where('tokenable_type', auth()->user()->getMorphClass())->delete(); */
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully', 'status' => 200]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
}

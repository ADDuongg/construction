<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class StaffModel extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'nhanvien';
    protected $primaryKey = 'nhanvien_id'; 
    protected $fillable = [
        'hoten',
        'diachi',
        'sdt',
        'email',
        'gioitinh',
        'ngaysinh',
        'chucvu',
        'account_id'
    ];

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class AssignStaff extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'phancong_duan';
    protected $fillable = [
        'duan_id',
        'nhanvien_id',
        'ghichu'
    ];
}

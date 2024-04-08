<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class ExtendProject extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'giahan_duan';
    protected $fillable = [
        'duan_id',
        'thoigian_giahan',
        'lydogiahan',
        'nhanvien_id',
        /* 'khachhang_id' */
    ];
}

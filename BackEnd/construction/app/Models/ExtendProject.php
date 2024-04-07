<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class ExtendProject extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'giahan_thicong';
    protected $fillable = [
        'duan_id',
        'thoigian_giahan',
        'lydogiahan',
        'nguoigiahan',
        /* 'khachhang_id' */
    ];
}

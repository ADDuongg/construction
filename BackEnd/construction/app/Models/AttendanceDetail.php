<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class AttendanceDetail extends Model
{
    use HasFactory, HasApiTokens;



    protected $table = 'chitiet_diemdanh';
    protected $fillable = [
        'diemdanh_id',
        'hotennhanvien',
        'thoigianvao',
        'thoigianra'
    ];
}

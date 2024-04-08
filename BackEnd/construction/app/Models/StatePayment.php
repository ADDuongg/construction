<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class StatePayment extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'thanhtoan_tungdot';

    protected $fillable = [
        'duan_id',
        'hopdong_id',
        'giaidoan_duan_id',
        'khachhang_id',
        'dot_thanhtoan',
        /* 'nguoitao' */
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Attendance extends Model
{
    use HasFactory, HasApiTokens;



    protected $table = 'diemdanh_congnhan';
    protected $fillable = [
        'duan_id',
        'giaidoan_duan_id',
        'nguoitao',
        'ngaydiemdanh'
    ];
}

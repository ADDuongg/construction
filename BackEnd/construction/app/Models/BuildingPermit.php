<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class BuildingPermit extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'giayphep_xaydung';

    protected $fillable = [
        'khachhang_id',
        'congtrinh_xaydung',
        'noidung',
        'capngay',
        'thoihan',
        'thoigian_giahan',
        'lydo_giahan'
    ];
}

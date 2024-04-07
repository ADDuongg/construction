<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Project extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'du_an';
    
    protected $fillable = [
        'hopdong_id',
        'tenduan',
        'mota',
        'ngaybatdau',
        'ngayketthuc',
        'status',
        'soluonggiaidoan',
        'nguoitao',
        'diadiem',
        'tencongtrinh'
    ];
}

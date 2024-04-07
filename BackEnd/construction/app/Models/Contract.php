<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Contract extends Model
{
    use HasFactory, HasApiTokens;


    protected $table = 'hopdong';
    protected $primaryKey = 'hopdong_id';
    protected $fillable = [
        'tenhopdong',
        'ngayky',
        'giatrihopdong',
        'tamung',
        'conlai',
        'khachhang_id',
        'noidung',
        'ngaybatdau',
        'ngayketthuc',
        'loaihopdong',
        'ngaydaohan',
        'phitrehan'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class ProjectState extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'giaidoan_duan';

    protected $fillable = [
        'duan_id',
        'giaidoan',
        'mota',
        'ngaybatdau',
        'ngayketthuc'
    ];
}

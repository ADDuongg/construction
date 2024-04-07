<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class MatterialStatistic extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'vatlieu_ngay';
    protected $primaryKey = 'vatlieu_ngay_id';
    protected $fillable = [
        'mavatlieu',
        'tenvatlieu',
        'loaivatlieu',
        'donvitinh',
        'khoiluongdung',
        'thongkengay_id'
    ];
}

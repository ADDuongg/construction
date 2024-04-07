<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class DetailImport extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'chitiet_phieunhap';

    protected $fillable = [
        'phieunhap_id',
        
        'tenvatlieu',
        'mavatlieu',
        'khoiluongdung',
        'loaivatlieu',
        'donvitinh',
        'dongia',
        'thanhtien',
        'nhathau_id'
    ];
}

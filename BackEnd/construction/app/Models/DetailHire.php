<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class DetailHire extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'chitiet_phieuthue';

    protected $fillable = [
        'phieuthue_id', 
        'tenmaymoc',
        'mamaymoc',
        'sogiothue',
        'loaimaymoc',
        'dongia',
        'thanhtien',
        'nhathau_id'
    ];
}

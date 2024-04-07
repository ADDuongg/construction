<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class PaymentContract extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'thanhly_hopdong';
    protected $fillable = [
        'hopdong_id',
        'khachhang_id',
        'giatri_truocthue',
        'vat',
        'giatri_sauthue',
        'ngaythanhtoan',
        'noidung'
    ];

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class ImportReceipt extends Model
{
    use HasFactory, HasApiTokens;
    protected $table = 'phieunhap_vatlieu';

    protected $fillable = [
        'nguoinhap',
        'ghichu',
        'duan_id',
    ];
}

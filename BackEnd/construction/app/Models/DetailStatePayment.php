<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class DetailStatePayment extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'chitiet_thanhtoan_dot';

    protected $fillable = [
        'thanhtoan_tungdot_id',
        'STT',
        'noidung',
        'cachtinh',
        'donvi',
        'giatrisauthue',
        'ghichu',
    ];
}

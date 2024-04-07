<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Schedule extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'lichtrinh_duan';

    protected $fillable = [
        'giaidoan_duan_id',
        'duan_id',
        'nhiemvu',
        'thoigian',
    ];
}

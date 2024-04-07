<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Machine extends Model
{
    use HasFactory, HasApiTokens;
    public $incrementing = false;

    protected $table = 'thongtin_maymoc';
    protected $fillable = [
        'tenmaymoc',
        'mota',
        'id'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class MachineStatistic extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'maymoc_ngay';
    protected $primaryKey = 'maymoc_ngay_id';
    protected $fillable = [
        'mamaymoc',
        'tenmaymoc',
        'loaimaymoc',
        'sogiothue',
        'thongkengay_id'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class BluePrint extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'thietke_duan';

    protected $fillable = [
        'duan_id',
        'file',
        'mota',
        'file_path'
    ];
}

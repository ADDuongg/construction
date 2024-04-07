<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Matterials extends Model
{
    use HasFactory, HasApiTokens;
    public $incrementing = false;
    protected $table = 'thongtin_vatlieu';
    protected $fillable = [
        'id',
        'tenvatlieu',
        'donvitinh',
        'mota',
        /* 'loaivatlieu' */
    ];
}

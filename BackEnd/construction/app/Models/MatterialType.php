<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class MatterialType extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'loaivatlieu';
    protected $fillable = [
        'vatlieu_id',
        'ten_loaivatlieu',
    ];
}
